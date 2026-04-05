class UI{
	status_msg = "";
	screen_focused = 'map';
	constructor(){

	}

	change_screen(what){
		this.screen_focused = what;
	}

	display_loot_items (items, is_loot){
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
		for (let id in items){			
			
			let item = items[id].name
			let n = items[id].quantity;
			let can_they_take = juego.player.can_they_take(item, n);
			let can_take = "";
			let usable = "";
			if (can_they_take){
				can_take = " can_take ";
			} 
			if (Config.usable.includes(item)){
				usable = `<button id='use-${id}' class='use'>use</button>`;
			}
			let line = `<div id='loot-${id}' class='item ${can_take}'>${item}${usable}</div>`;
			if (Config.stackable.includes(item)){
				line = `<div id='loot-${id}' class='item ${can_take}'>${item} (${n})${usable}</div>`;
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
		console.log(this.screen_focused);
		$("#" + this.screen_focused).removeClass('hidden');
	}
}
