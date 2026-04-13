class UI{
	shop = new UIShop();
	status_msg = "";
	screen_focused = 'map';
	constructor(){

	}

	change_screen(what){
		this.screen_focused = what;
	}

	display_loot_items (items, is_loot){
		let crate_here = '';
		let max_slots = '';
		let max_weight = '';
		let txt = `<button id='take_all_loot'>take all</button>`;
		if (!is_loot && juego.player.state.inventory_weight >= juego.player.state.max_inventory_weight){
			max_weight = ' max ';
		}
		if (!is_loot && juego.player.state.inventory.length >= juego.player.state.slots_in_inventory){
			max_slots = ' max ';
		}
		if (!is_loot){
			txt = `<span class='heading'>Slots</span>: <span class='${max_slots}'>${juego.player.state.inventory.length}/${juego.player.state.slots_in_inventory}</span> <span class='heading'>Weight</span>: <span class='${max_weight}'>${juego.player.state.inventory_weight.toFixed(1)}/${juego.player.state.max_inventory_weight}</span>`;
		}
		if (is_loot && juego.map.queries.is_item_here('crate (placed)', juego.player.fetch_from())){
			crate_here = ' in_crate ';
			txt += "<div id='loot-crate' class=''>crate (placed)</div>";
		}
		for (let id in items){			
			
			let item = items[id].name
			let durability = '';
			if (Config.degradable.includes(item)){
				durability = `(${items[id].durability}%)`;
			}
			
			if (item == 'crate (placed)'){
				continue;
			}
			let n = items[id].quantity;
			let can_they_take = juego.player.inventory.can_they_take(item, n);
			let can_take = "";
			let equipable = "";
			let usable = "";
			let where = 'inventory';
			if (is_loot){
				where = 'loot';
			}
			if (can_they_take){
				can_take = " can_take ";
			} 
			if (!is_loot && Config.usable.includes(item)){
				usable = `<button id='use-${id}' class='use'>use</button>`;
			}
			if (!is_loot && Config.equipable.includes(item) && juego.player.state.equipped != id){
				equipable = `<button id='equip-${id}' class='equip'>equip</button>`;
			} else if (!is_loot && Config.equipable.includes(item) && juego.player.state.equipped == id){
				equipable = " [ equipped ]";
			}
			let line = `<div><span id='${where}-${id}' class='item ${crate_here} ${can_take}'>${item} ${durability} ${usable} ${equipable} </span></div>`;
			if (Config.stackable.includes(item)){
				line = `<div><span id='${where}-${id}' class='item ${crate_here} ${can_take}'>${item} (${n})</span>${usable}</div>`;
			}
			txt += line;
		}
		return txt;
	}

	display_loot(){
		$(".inventory").html(this.display_loot_items(juego.player.state.inventory, false));
		if (juego.map.loot[juego.player.fetch_from()] == undefined){
			juego.map.loot[juego.player.fetch_from()] = Config.default_loot;
		}
		if (juego.player.state.looting){
			$("#loot_container").html( this.display_loot_items(juego.map.loot[juego.player.fetch_from()].stuff, true));
		}
		
	}

	display_map(){
		let txt = "";
		for (let y = 0; y < Config.max_y; y ++){
			txt += "<div class='row'>"
			for (let x = 0; x < Config.max_x; x ++){								
				let cell_class = ' empty ';
				let cell_txt = '';
				let human = juego.fetch_human(juego.player.state.location_type, juego.player.state.location_id, x, y);
				let loot = juego.map.loot[`${juego.player.state.location_type}-${juego.player.state.location_id}-${x}-${y}`];
				let map_at = juego.map.queries.at(x, y);
				let mark = juego.map.queries.fetch_mark(juego.player.state.location_type, juego.player.state.location_id, x, y);
				let rat = juego.fetch_rat(juego.player.state.location_type, juego.player.state.location_id, x, y);
				  
				if (map_at != null && map_at == Config.cell_class.indexOf('human') && human != null && human.homeless){
					cell_class = ' human homeless ';
				} else if (map_at != null && map_at == Config.cell_class.indexOf('human') && human != null && !human.homeless){
					cell_class = ' human citizen ';
				} else if (map_at != null){
					cell_class = Config.cell_class[map_at];
				}

				if (map_at == 6 && juego.fetch_rat(juego.player.state.location_type, juego.player.state.location_id, x, y).hungry){
					cell_class = ' rat hungry';
				} 

				if (juego.player.movement.at(x, y)){
					cell_txt = Config.cell_txt['player'];
					
				} else if (map_at != null && map_at != 1  
					&& juego.player.movement.have_they_used_this_exit(juego.player.state.location_type, 
					juego.player.state.location_id, x, y, juego.map)){
					cell_txt = Config.cell_txt['used_exit'];
				} else if (map_at != null && map_at > 1 && map_at < 5){
					cell_txt = Config.cell_txt['unused_exit'];				
				} else if (Config.cell_txt[Config.cell_class[map_at]] != undefined){
					cell_txt = Config.cell_txt[Config.cell_class[map_at]];				
				} else if (mark != null){
					cell_txt = mark;
				}
				
				if (juego.player.movement.at(x, y) && !juego.player.state.fighting){
					cell_class += " player ";
				} else if (juego.player.movement.at(x, y) && juego.player.state.fighting){
					cell_class += " player_fighting";
				} else if ((Config.cell_class[map_at] == 'trash' && loot != undefined && loot.locked)
					|| (Config.cell_class[map_at] == 'human' && human != undefined && juego.player.state.stigma > human.max_stigma_tolerance )
				){
					cell_class += ' blocked ';
				}
				
				
				txt += `<div id='cell-${x}-${y}' class='cell ${cell_class}'>${cell_txt}</div>`
			}
			txt += "</div>"
		}
		document.getElementById('map_grid').innerHTML = txt;		
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
		console.log(juego.player.inventory.are_they_full());
		for (let id in human.interactions){			
			let disabled = '';
			let interaction = human.interactions[id];
			//console.log(interaction, juego.player.state.money,  human.resources[id], human.conversion[id]);
			
			if ((Config.interactions_for_resources.includes(interaction) && juego.player.inventory.are_they_full())
				|| (interaction == 'buy' && juego.player.state.money < human.conversion[id])
				|| (interaction == 'sell' && !juego.player.inventory.do_they_have(human.resources[id], 1))
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
				resource = `${conversion[0]} ${first} [${juego.player.inventory.fetch_quantity(first)} / ${human.fetch_quantity(first)}] for ${conversion[1]} ${second} [${juego.player.inventory.fetch_quantity(second)} / ${human.fetch_quantity(second)}] or vice versa`;
				if (!juego.player.inventory.do_they_have(first, conversion[0])){
					first_disabled = ' disabled ';
				}
				if (!juego.player.inventory.do_they_have(second, conversion[1])){
					second_disabled = ' disabled ';
				}
				button = `<button id='trade-${id}-0' class='trade interact' ${first_disabled}>${interaction} ${conversion[0]} ${first} </button><button id='trade-${id}-1' class='trade interact' ${second_disabled}>${interaction} ${conversion[1]} ${second} </button>`;
			} else if (human.resources[id] != null && (interaction == 'buy' || interaction == 'sell')){
				
				resource = `${human.resources[id]} [${juego.player.inventory.fetch_quantity(human.resources[id])} / ${human.fetch_quantity(human.resources[id])}] for $${human.conversion[id]} `;
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
		this.status_msg = msg;
	}
	refresh(){
		if (juego.player.state.shopping != null ){
			this.shop.display(juego.player);
		}
		this.display_location_name();
		
		
		this.display_map();
		this.display_loot();
		
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
		$("#status").html(this.status_msg);

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
			
			let equipped = juego.player.inventory.fetch(juego.player.state.equipped, null);
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
