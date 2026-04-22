class UISocial{
	directions_selected = null;
    display(){
		if (juego.player.state.socializing == null){
			return;
		}
		let human = juego.get.human(juego.player.state.socializing);
		//console.log(human);
		let favorite = juego.favorites.fetch_by_id('human', human.id);
		let favorite_symbol = `&#x2606;`;
        if (favorite != undefined){
            favorite_symbol = `&#x2605;`;
        }
		let txt = `<div id='human_title'><button id='favorite-human-${human.id}' class='favorite'>${favorite_symbol}</button> ${human.name} ${human.surname}</div>`;
		for (let id in human.interactions){			
			let disabled = '';
			let interaction = human.interactions[id];
			
			if ((interaction == 'buy' && juego.player.inventory.get.are_they_full() 
					&& ((ItemConfig.stackable.includes(human.resources[id]) 
					&& !juego.player.inventory.get.is_in_inventory(human.resources[id])) 
					|| !ItemConfig.stackable.includes(human.resources[id]) ))
				|| (interaction == 'buy' && juego.player.state.money < human.conversion[id])
				|| (interaction == 'sell' && !juego.player.inventory.get.do_they_have(human.resources[id], 1))
				|| (interaction == 'beg' && human.begging_unlocked !== true)
				|| (interaction == 'beg' && human.min_stigma_beg > juego.player.state.stigma)
				|| (interaction == 'directions' && this.directions_selected == null)
				|| (interaction == 'directions' && juego.favorites.set.directions.length > 0)
				|| (interaction == 'gamble' && (human.ante == null || juego.player.state.money < human.ante))
				){
				disabled = ' disabled ';			
			}
			let button = `<button id='interact-${id}' class='interact' ${disabled}>${interaction}</button>`;
			
			let resource = "";
			if (typeof human.resources[id]  == 'object' && interaction == 'trade'){
				let conversion = human.conversion[id];
				let first = Object.keys(human.resources[id]);
				let first_disabled = '';
				let second = human.resources[id][first];
				let second_disabled = '';
				resource = `${conversion[0]} ${first} [${juego.player.inventory.get.fetch_quantity(first)} / ${human.fetch_quantity(first)}] for ${conversion[1]} ${second} [${juego.player.inventory.get.fetch_quantity(second)} / ${human.fetch_quantity(second)}] or vice versa`;
				if (!juego.player.inventory.get.do_they_have(first, conversion[0]) || !human.do_they_have(second, conversion[1]) || !juego.player.inventory.get.can_they_take(second, conversion[1])){
					first_disabled = ' disabled ';
				}
				if (!juego.player.inventory.get.do_they_have(second, conversion[1]) || !human.do_they_have(first, conversion[0]) || !juego.player.inventory.get.can_they_take(first, conversion[0])){
					second_disabled = ' disabled ';
				}
				button = `<button id='trade-${id}-0' class='trade interact' ${first_disabled}>${interaction} ${conversion[0]} ${first} </button><button id='trade-${id}-1' class='trade interact' ${second_disabled}>${interaction} ${conversion[1]} ${second} </button>`;
			} else if (human.resources[id] != null && (interaction == 'buy' || interaction == 'sell')){
				resource = `${human.resources[id]} [${juego.player.inventory.get.fetch_quantity(human.resources[id])} / ${human.fetch_quantity(human.resources[id])}] for $${human.conversion[id]} `;
				button = `<button id='interact-${id}' class='interact' ${disabled}>${interaction} 1 ${human.resources[id]}</button>`;

				if (interaction == 'sell'){
				button += `<button id='sell_all_to_human-${id}' class='sell_all_to_human' ${disabled}>${interaction} all ${human.resources[id]}</button>`
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
			} else if (interaction == 'work'){
				let mission = human.missions[id];
				resource = `kill ${mission.quantity} rats for $${mission.paying}`;
			} else if (interaction == 'gamble' && human.gambled != null && human.ante != null){
				resource = "Keep going?";
				button = `<button id='cash_out'>cash out $${human.gambled_and_won}</button><button id='bet' ${disabled}>gamble ${human.ante}</button>`;
			} 
			
			
			txt += `<div class='interaction_caption'>${interaction}  ${resource} </div><div>${button}</div>`;
			
			
		}
		$("#social_context").html(txt);
	}
}