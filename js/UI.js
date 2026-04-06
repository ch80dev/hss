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
		if (!is_loot && juego.player.inventory_weight >= juego.player.max_inventory_weight){
			max_weight = ' max ';
		}
		if (!is_loot && juego.player.inventory.length >= juego.player.slots_in_inventory){
			max_slots = ' max ';
		}
		if (!is_loot){
			txt = `<span class='heading'>Slots</span>: <span class='${max_slots}'>${juego.player.inventory.length}/${juego.player.slots_in_inventory}</span> <span class='heading'>Weight</span>: <span class='${max_weight}'>${juego.player.inventory_weight.toFixed(1)}/${juego.player.max_inventory_weight}</span>`;
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
			let can_they_take = juego.player.can_they_take(item, n);
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
		$(".inventory").html(this.display_loot_items(juego.player.inventory, false));
		if (juego.player.looting){
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
				if (juego.map.at(x, y) == 1){
					cell_class = " filled ";
				} else if (juego.map.at(x, y) == 2){
					cell_class = " sewer_exit ";
				} else if (juego.map.at(x, y) == 3){
					cell_class = ' alley_exit ';
				} else if (juego.map.at(x, y) == 4){
					cell_class = ' street_exit ';
				} else if (juego.map.at(x, y) == 5){
					cell_class = ' trash ';
				} else if (juego.map.at(x, y) == 6){
					cell_class = ' rat ';
				} else if (juego.map.at(x, y) == 7){
					cell_class = ' human ';
				} else if (juego.map.at(x, y) == 8){
					cell_class = ' crate ';
				}

				if (juego.map.at(x, y) == 6 && juego.map.fetch_rat(juego.player.location_type, juego.player.location_id, x, y).hungry){
					cell_class = ' rat hungry';
				} 

				if (juego.player.at(x, y)){
					cell_txt = "@";
					cell_class += " player ";
				} else if (juego.map.at(x, y) != null && juego.map.at(x,y) != 1  
					&& juego.player.have_they_used_this_exit(juego, juego.player.location_type, 
					juego.player.location_id, x, y)){
					cell_txt = '&#9678;';
				} else if (juego.map.at(x,y) == 5){
					cell_txt = '&#9646;';
				} else if (juego.map.at(x,y) == 6){
					cell_txt = 'r';
				} else if (juego.map.at(x,y) == 7){
					cell_txt = 'h';
				} else if (juego.map.at(x,y) == 8){
					cell_txt = "&#9644;"
				} else if (juego.map.at(x, y) != null && juego.map.at(x, y) > 1 && juego.map.at(x, y) < 5){
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
		$("#health").html(`${juego.player.health}/${juego.player.max_health}`);
		$('#stamina').html(`${juego.player.stamina}/${juego.player.max_stamina}`);
		$("#status").html(this.status_msg);
		if (this.status_msg != ""){
			
			this.status_msg = "";
		}
		$(".screen").addClass('hidden');
		$("#" + this.screen_focused).removeClass('hidden');

		$("#sickness").html(juego.player.sickness);
		$("#sickness_container").addClass('hidden');
		if (juego.player.sickness > 0){
			$("#sickness_container").removeClass('hidden');
		}

	}
}
