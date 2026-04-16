class UISocial{
    display(){
		if (juego.player.state.socializing == null){
			return;
		}
		let human = juego.fetch_human(juego.player.state.socializing);
		//console.log(human);
		let favorite_symbol = `&#x2606;`;
        if (juego.favorites.set.human[human.id] != undefined){
            favorite_symbol = `&#x2605;`;
        }
		let txt = `<div id='human_title'><button id='favorite-human-${human.id}' class='favorite'>${favorite_symbol}</button> ${human.name} ${human.surname}</div>`;
		for (let id in human.interactions){			
			let disabled = '';
			let interaction = human.interactions[id];
			//console.log(interaction, juego.player.state.money,  human.resources[id], human.conversion[id]);
			
			if ((interaction == 'buy' && juego.player.inventory.query.are_they_full() 
					&& ((Config.stackable.includes(human.resources[id]) 
					&& !juego.player.inventory.query.is_in_inventory(human.resources[id])) 
					|| !Config.stackable.includes(human.resources[id]) ))
				|| (interaction == 'buy' && juego.player.state.money < human.conversion[id])
				|| (interaction == 'sell' && !juego.player.inventory.query.do_they_have(human.resources[id], 1))
				|| (interaction == 'beg' && human.last_begged != null)
				|| (interaction == 'beg' && human.min_stigma_beg > juego.player.state.stigma)){
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
				resource = `${conversion[0]} ${first} [${juego.player.inventory.query.fetch_quantity(first)} / ${human.fetch_quantity(first)}] for ${conversion[1]} ${second} [${juego.player.inventory.query.fetch_quantity(second)} / ${human.fetch_quantity(second)}] or vice versa`;
				if (!juego.player.inventory.query.do_they_have(first, conversion[0]) || !human.do_they_have(second, conversion[1])){
					first_disabled = ' disabled ';
				}
				if (!juego.player.inventory.query.do_they_have(second, conversion[1]) || !human.do_they_have(first, conversion[0])){
					second_disabled = ' disabled ';
				}
				button = `<button id='trade-${id}-0' class='trade interact' ${first_disabled}>${interaction} ${conversion[0]} ${first} </button><button id='trade-${id}-1' class='trade interact' ${second_disabled}>${interaction} ${conversion[1]} ${second} </button>`;
			} else if (human.resources[id] != null && (interaction == 'buy' || interaction == 'sell')){
				resource = `${human.resources[id]} [${juego.player.inventory.query.fetch_quantity(human.resources[id])} / ${human.fetch_quantity(human.resources[id])}] for $${human.conversion[id]} `;
				button = `<button id='interact-${id}' class='interact' ${disabled}>${interaction} ${human.resources[id]}</button>`;
			} else if (interaction == 'beg'){
				resource = ` (min. stigma: ${human.min_stigma_beg})`;
			} 
			
			
			txt += `<div class='interaction_caption'>${interaction}  ${resource} </div><div>${button}</div>`;
			
			
		}
		$("#social_context").html(txt);
	}
}