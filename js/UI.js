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
		if (is_loot && juego.map.is_item_here('crate (placed)', juego.player.fetch_from())){
			crate_here = ' in_crate ';
			txt += "<div id='loot-crate' class=''>crate (placed)</div>";
		}
		for (let id in items){			
			
			let item = items[id].name
			if (item == 'crate (placed)'){
				continue;
			}
			let n = items[id].quantity;
			let can_they_take = juego.player.state.inventory.can_they_take(item, n);
			let can_take = "";
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
			let line = `<div><span id='${where}-${id}' class='item ${crate_here} ${can_take}'>${item}${usable}</span></div>`;
			if (Config.stackable.includes(item)){
				line = `<div><span id='${where}-${id}' class='item ${crate_here} ${can_take}'>${item} (${n})</span>${usable}</div>`;
			}
			txt += line;
		}
		return txt;
	}

	display_loot(){
		$(".inventory").html(this.display_loot_items(juego.player.state.inventory, false));
		if (juego.player.state.looting){
			$("#loot_container").html( this.display_loot_items(juego.map.loot[juego.player.fetch_from()], true));
		}
		
	}

	display_map(){
		let txt = "";
		for (let y = 0; y < Config.max_y; y ++){
			txt += "<div class='row'>"
			for (let x = 0; x < Config.max_x; x ++){
				let cell_class = ' empty ';
				let cell_txt = '';
				let map_at = juego.map.queries.at(x, y);
				if (map_at != null){
					cell_class = Config.cell_class[map_at];
				}

				if (map_at == 6 && juego.fetch_rat(juego.player.state.location_type, juego.player.state.location_id, x, y).hungry){
					cell_class = ' rat hungry';
				} 

				if (juego.player.movement.at(x, y)){
					cell_txt = "@";
					cell_class += " player ";
				} else if (map_at != null && map_at != 1  
					&& juego.player.movement.have_they_used_this_exit(juego.player.state.location_type, 
					juego.player.state.location_id, x, y, juego.map)){
					cell_txt = '&#9678;';
				} else if (map_at == 5){
					cell_txt = '&#9646;';
				} else if (map_at == 6){
					cell_txt = 'r';
				} else if (map_at == 7){
					cell_txt = 'h';
				} else if (map_at == 8){
					cell_txt = "&#9644;"
				} else if (map_at != null && map_at > 1 && map_at < 5){
					cell_txt = '&#9673;';
				}
					  
				
				
				txt += `<div id='cell-${x}-${y}' class='cell ${cell_class}'>${cell_txt}</div>`
			}
			txt += "</div>"
		}
		document.getElementById('map').innerHTML = txt;		
	}
	log(msg){
		this.status_msg = msg;
	}
	refresh(){
		this.display_map();
		this.display_loot();
		$("#health").html(`${juego.player.state.health}/${juego.player.state.max_health}`);
		$('#stamina').html(`${juego.player.state.stamina}/${juego.player.state.max_stamina}`);
		$("#status").html(this.status_msg);
		if (this.status_msg != ""){
			
			this.status_msg = "";
		}
		$(".screen").addClass('hidden');
		$("#" + this.screen_focused).removeClass('hidden');

		$("#sickness").html(juego.player.state.sickness);
		$("#sickness_container").addClass('hidden');
		if (juego.player.state.sickness > 0){
			$("#sickness_container").removeClass('hidden');
		}

	}
}
