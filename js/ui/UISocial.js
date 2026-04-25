class UISocial{
	directions_selected = null;
	button_num = 1;
    display(){
		if (juego.player.state.socializing == null){
			return;
		}
		this.button_num = 1;
		let human = juego.get.human(juego.player.state.socializing);
		//console.log(human);
		let favorite = juego.favorites.fetch_by_id('human', human.id);
		let favorite_symbol = `&#x2606;`;
        if (favorite != undefined){
            favorite_symbol = `&#x2605;`;
        }
		let txt = `<div id='human_title'><button id='favorite-human-${human.id}' class='favorite'>${favorite_symbol}</button> ${human.name} ${human.surname} $${human.money}</div>`;
		for (let id in human.interactions){			
			let disabled = '';
			let interaction = human.interactions[id];

			if ((interaction != 'work' && juego.player.state.stigma > human.max_stigma_tolerance)
				
				|| (interaction == 'buy' && juego.player.inventory.get.are_they_full() 
					&& ((ItemConfig.stackable.includes(human.resources[id]) 
					&& !juego.player.inventory.get.is_in_inventory(human.resources[id])) 
					|| !ItemConfig.stackable.includes(human.resources[id]) ))
				|| (interaction == 'buy' && juego.player.state.money < human.conversion[id])
				|| (interaction == 'sell' && (!juego.player.inventory.get.do_they_have(human.resources[id], 1) || human.money < human.conversion[id]))
				|| (interaction == 'beg' 
					&& (human.begging_unlocked !== true || human.min_stigma_beg > juego.player.state.stigma || human.money < human.items.give_when_begged))
				|| (interaction == 'directions' && this.directions_selected == null)
				|| (interaction == 'directions' && juego.favorites.set.directions.length > 0)
				|| (interaction == 'gamble' && (human.ante == null || juego.player.state.money < human.ante || human.money < human.ante))
				|| (interaction == 'work' && (human.money < human.quest.paying ))
				){
				disabled = ' disabled ';			
			}
			let button = `<button id='interact-${id}' class='interact button_${this.button_num}' ${disabled}>${interaction}</button>`;
			
			let resource = "";
			if (typeof human.resources[id]  == 'object' && interaction == 'trade'){
				let conversion = human.conversion[id];
				let first = Object.keys(human.resources[id]);
				let first_disabled = '';
				let second = human.resources[id][first];
				let second_disabled = '';
				resource = `${conversion[0]} ${first} [${juego.player.inventory.get.fetch_quantity(first)} / ${human.items.fetch_quantity(first)}] for ${conversion[1]} ${second} [${juego.player.inventory.get.fetch_quantity(second)} / ${human.items.fetch_quantity(second)}] or vice versa`;
				if (!juego.player.inventory.get.do_they_have(first, conversion[0]) || !human.items.do_they_have(second, conversion[1]) || !juego.player.inventory.get.can_they_take(second, conversion[1])){
					first_disabled = ' disabled ';
				}
				if (!juego.player.inventory.get.do_they_have(second, conversion[1]) || !human.items.do_they_have(first, conversion[0]) || !juego.player.inventory.get.can_they_take(first, conversion[0])){
					second_disabled = ' disabled ';
				}
				button = `<button id='trade-${id}-0' class='trade interact button_${this.button_num}' ${first_disabled}>${interaction} ${conversion[0]} ${first} </button><button id='trade-${id}-1' class='trade interact button_${++this.button_num}' ${second_disabled}>${interaction} ${conversion[1]} ${second} </button>`;
			} else if (human.resources[id] != null && (interaction == 'buy' || interaction == 'sell')){
				resource = `${human.resources[id]} [${juego.player.inventory.get.fetch_quantity(human.resources[id])} / ${human.items.fetch_quantity(human.resources[id])}] for $${human.conversion[id]} `;
				button = `<button id='interact-${id}' class='interact button_${this.button_num}' ${disabled}>${interaction} 1 ${human.resources[id]}</button>`;
				if (interaction == 'sell' && !ItemConfig.stackable.includes(human.resources[id])){
					button = this.display_unique_items_to_sell(human.resources[id]);
				} else if (interaction == 'sell'){
					button += `<button id='sell_all_to_human-${id}' class='sell_all_to_human button_${++this.button_num}' ${disabled}>${interaction} all ${human.resources[id]}</button>`
				} 
			} else if (interaction == 'beg'){
				resource = ` (min. stigma: ${human.min_stigma_beg})`;
			} else if (interaction == 'directions'){
				let selected = '';
				if (this.directions_selected == null){
					selected = " selected ";
				}
				resource = `<select id='directions_to'><option ${selected}></option>`;
				for (let shop_type of human.directions_to ){					
					let id = Object.keys(ShopConfig.names).indexOf(shop_type);
					let shop_name = ShopConfig.names[shop_type];
					selected = '';
					if (this.directions_selected == id){
						selected = " selected ";
					}	
					resource += `<option value='${id}'  ${selected}>${shop_name}</option>`;
					

				}
				resource += "</select>";
			} else if (interaction == 'work' && human.quest.accepted == null){
				resource = " [ FAILED ]";
				button = '';
			} else if (interaction == 'work' && human.quest.accepted && human.quest.completed == null){
				resource = " [ COMPLETED ]";
				button = '';
			} else if (interaction == 'work' && human.quest.accepted && human.quest.completed){
				resource = " [ COMPLETED ]";
				button = `<button id='complete_quest' class='button_${this.button_num}'>complete</button>`;
			} else if (interaction == 'work' && !human.quest.accepted){				
				resource = human.quest.narrate;	
			} else if (interaction == 'work' && human.quest.accepted){
				let quest = juego.quests.fetch_by_id(human.id);
				if (quest == null){
					continue;
				}
				button = `<button id='cancel_quest' class='button_${this.button_num}'>cancel</button>`;
				resource = `${human.quest.narrate}  [${quest.current}/${human.quest.quantity}]`;				
			} else if (interaction == 'gamble' && human.gambled != null && human.ante != null){
				resource = "Keep going?";
				button = `<button id='cash_out' class='button_${this.button_num}'>cash out $${human.gambled_and_won}</button><button id='bet' class='button_${++this.button_num}' ${disabled}>gamble ${human.ante}</button>`;
			} 
			
			
			txt += `<div class='interaction_caption'>${interaction}  ${resource} </div><div>${button}</div>`;
			
			this.button_num++;
		}
		$("#social_context").html(txt);
	}
	display_unique_items_to_sell(name){
		let txt = '';
		let item_ids = juego.player.inventory.fetch.all_items([name]);
		if (item_ids.length > 0 ){
			txt = `<button class='sell_unique_to_human button_${this.button_num++}' disabled>none in inventory to sell</button>`;
		}
		for (let id of item_ids){
			if (juego.player.inventory.get.is_equipped_with_id(id)){
				continue;
			}
			let item = juego.player.inventory.fetch.by_id(id);
			
			txt += `<button id='sell_unique_to_human-${id}' class='sell_unique_to_human  button_${this.button_num}'>sell ${item.name} (${item.durability}%)</button>`;
			this.button_num ++;
		}
		return txt;
	}
}