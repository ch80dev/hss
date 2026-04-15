class UI{
	loot = new UILoot();
	map = new UIMap();
	shop = new UIShop();
	status_msg = "";
	screen_focused = 'map';
	constructor(){

	}

	change_screen(what){
		this.screen_focused = what;
	}

	

	

	display_location_name(){
		let name = juego.map.names[juego.player.state.location_type][juego.player.state.location_id];
		let txt = "";
		//console.log(name);
		if (juego.player.state.location_type == 'street'){			
			$("#location_name").html(name + " Street");
			return;
		} 
		txt =  "alley behind ";
		if (juego.player.state.location_type == 'sewer'){
			txt = " sewer beneath ";
		}
		for (let connected_street of name.connecting){
			txt += `${connected_street}`;
			if (name.length[connected_street] != null ){
				txt +=  `[${name.length[connected_street]}]`;
			}
			if (name.connecting.length < 2){
				continue;
			}
			if (name.connecting.indexOf(connected_street) == name.connecting.length - 2){
				txt += " and ";
			} else {
				txt += ", ";
			}
		}
			
		
		$("#location_name").html(txt);
	}

	display_social(){
		if (juego.player.state.socializing == null){
			return;
		}
		let human = juego.fetch_human(juego.player.state.location_type, juego.player.state.location_id, juego.player.state.socializing.x, juego.player.state.socializing.y);
		let context_txt = "";
		let menu_txt = "";
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
			let button = `<button id='interact-${id}-${human.x}-${human.y}' class='interact' ${disabled}>${interaction}</button>`;
			
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
				button = `<button id='interact-${id}-${human.x}-${human.y}' class='interact' ${disabled}>${interaction} ${human.resources[id]}</button>`;
			} else if (interaction == 'beg'){
				resource = ` (min. stigma: ${human.min_stigma_beg})`;
			} 
			
			
			context_txt += `<div class='interaction_caption'>${interaction}  ${resource} </div><div>${button}</div>`;
			
			
		}
		$("#social_context").html(context_txt);
		//$("#social_menu").html(menu_txt);
	}

	display_time(){
		let minutes = juego.time.minutes;
		let hours = juego.time.hours;
		let days = Config.days_of_the_week[juego.time.days - 1];
		let weeks = juego.time.weeks;
		//later add years
		if (hours < 10){
			hours = "0" + hours;
		}
		if (minutes < 10){
			minutes = "0" + minutes;
		}

		$("#time").html(`Week #${weeks} ${days} ${hours}:${minutes}`)
	}

	log(msg){		
		this.status_msg += " " + msg;
	}
	refresh(){
		if (juego.player.state.shopping != null ){
			this.shop.display(juego.player);
		}
		this.display_location_name();
		
		
		this.map.display();
		this.loot.display();
		
		this.display_social();
		
		let health_cent = juego.player.state.health / juego.player.state.max_health * 100;
		let stamina_cent = juego.player.state.stamina / juego.player.state.max_stamina * 100;
		
		let stigma_cent = (juego.player.state.stigma / juego.player.state.max_stigma * 100);

		$("#health_bar").css('width', health_cent.toFixed(1) + '%');
		$("#stamina_bar").css('width', stamina_cent.toFixed(1) + '%');
		$("#stigma_bar").css('width', stigma_cent.toFixed(1) + '%');
		$("#health").html(`${health_cent.toFixed(1)}%`);
		$('#stamina').html(`${stamina_cent.toFixed(1)}%`);
		$("#stamina").removeClass('low_stamina');
		if (stamina_cent < Config.low_stamina_threshold){
			$("#stamina").addClass('low_stamina');
		}
		$('#stigma').html(`${stigma_cent.toFixed(1)}%`);
		if (this.status_msg != ''){
			$("#status").html(this.status_msg);
		}
		
		this.status_msg = '';

		$(".screen").addClass('hidden');
		$("#" + this.screen_focused).removeClass('hidden');

		$("#sickness").html(juego.player.state.sickness.toFixed(1));
		$("#sickness_container").addClass('hidden');
		if (juego.player.state.sickness > 0){
			$("#sickness_container").removeClass('hidden');
		}
		if (juego.player.state.sickness >= juego.player.state.max_sickness){
			$("#is_sick").removeClass('hidden');
			$("#sickness_caption").addClass('hidden');

		} else {
			$("#is_sick").addClass('hidden');
			$("#sickness_caption").removeClass('hidden');
		}

		$("#equipped").html("");
		if (juego.player.state.equipped != null){
			
			let equipped = juego.player.inventory.fetch.by_id(juego.player.state.equipped, null);
			//console.log(juego.player.state.equipped, equipped);
			$("#equipped").html(`${equipped.name} (${equipped.durability}%)`)
		}
		const formatter = new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
		$("#money").html(`$${formatter.format(juego.player.state.money)}`);
		this.display_time();
	}
}
