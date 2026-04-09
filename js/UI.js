class UI{
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
				let map_at = juego.map.queries.at(x, y);
				let rat = juego.fetch_rat(juego.player.state.location_type, juego.player.state.location_id, x, y);
				if (map_at != null){
					cell_class = Config.cell_class[map_at];
				} else if (map_at != null && map_at == Config.cell_class.indexOf('human') && human != null && human.homeless){
					cell_class = ' human homeless ';
				} else if (map_at != null && map_at == Config.cell_class.indexOf('human') && human != null && !human.homeless){
					cell_class = ' human citizen ';
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
				} else if (map_at == 5){
					cell_txt = Config.cell_txt['trash'];
				} else if (map_at == 6){
					cell_txt = Config.cell_txt['rat'];
				} else if (map_at == 7){
					cell_txt = Config.cell_txt['human'];
				} else if (map_at == 8){
					cell_txt = Config.cell_txt['crate'];
				} else if (map_at != null && map_at > 1 && map_at < 5){
					cell_txt = Config.cell_txt['unused_exit'];
				}
				
				if (juego.player.movement.at(x, y) && !juego.player.state.fighting){
					cell_class += " player ";
				} else if (juego.player.movement.at(x, y) && juego.player.state.fighting){
					cell_class += " player_fighting";
				} 
				
				
				txt += `<div id='cell-${x}-${y}' class='cell ${cell_class}'>${cell_txt}</div>`
			}
			txt += "</div>"
		}
		document.getElementById('map').innerHTML = txt;		
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
			//console.log(interaction, juego.player.state.inventory);
			if ((interaction == 'buy' && juego.player.money < human.conversion[id])
				|| (interaction == 'sell' && !juego.player.inventory.do_they_have(human.resources[id], human.conversion[id]))
				|| (interaction == 'beg' && human.last_begged != null)){
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
				resource = `${conversion[0]} ${first} [${juego.player.inventory.fetch_quantity(first)} / ${human.fetch_quantity(first)}] for ${conversion[1]} ${second} [${juego.player.inventory.fetch_quantity(second)} / ${human.fetch_quantity(second)}]or vice versa`;
				if (!juego.player.inventory.do_they_have(first, conversion[0])){
					first_disabled = ' disabled ';
				}
				if (!juego.player.inventory.do_they_have(second, conversion[1])){
					second_disabled = ' disabled ';
				}
				button = `<button id='trade-${id}-0-${human.x}-${human.y}' class='trade interact' ${first_disabled}>${interaction} ${conversion[0]} ${first} </button><button id='trade-${id}-1-${human.x}-${human.y}' class='trade interact' ${second_disabled}>${interaction} ${conversion[1]} ${second} </button>`;
			} else if (human.resources[id] != null && (interaction == 'buy' || interaction == 'sell')){
				
				resource = `${human.resources[id]} [${juego.player.inventory.fetch_quantity(human.resources[id])} / ${human.fetch_quantity(human.resources[id])}] for $${human.conversion[id]} `;
			} 
			
			
			context_txt += `<div>${interaction}  ${resource} </div>`;
			menu_txt += button;
			
		}
		$("#social_context").html(context_txt);
		$("#social_menu").html(menu_txt);
	}
	log(msg){
		this.status_msg = msg;
	}
	refresh(){
		this.display_map();
		this.display_loot();
		
		this.display_social();
		
		let health_cent = (juego.player.state.health / juego.player.state.max_health * 100);
		let stamina_cent = (juego.player.state.stamina / juego.player.state.max_stamina * 100);

		let stigma_cent = (juego.player.state.stigma / juego.player.state.max_stigma * 100);

		$("#health_bar").css('width', health_cent.toFixed(1) + '%');
		$("#stamina_bar").css('width', stamina_cent.toFixed(1) + '%');
		$("#stigma_bar").css('width', stigma_cent.toFixed(1) + '%');
		$("#health").html(`${health_cent}%`);
		$('#stamina').html(`${stamina_cent}%`);
		$('#stigma').html(`${stigma_cent}%`);
		$("#status").html(this.status_msg);

		$(".screen").addClass('hidden');
		$("#" + this.screen_focused).removeClass('hidden');

		$("#sickness").html(juego.player.state.sickness);
		$("#sickness_container").addClass('hidden');
		if (juego.player.state.sickness > 0){
			$("#sickness_container").removeClass('hidden');
		}
		$("#equipped").html("");
		if (juego.player.state.equipped != null){
			let equipped = juego.player.inventory.fetch(juego.player.state.equipped);
			$("#equipped").html(`${equipped.name} (${equipped.durability}%)`)
		}
		$("#money").html(`$${juego.player.state.money}`);
	}
}
