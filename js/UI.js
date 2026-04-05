class UI{
	status_msg = "";
	screen_focused = 'map';
	constructor(){

	}

	change_screen(what){
		this.screen_focused = what;
	}
	display_items (items, is_loot){

		let txt = "";
		if (!is_loot){
			txt = `Slots: ${juego.player.inventory.length}/${juego.player.slots_in_inventory} Weight: ${juego.player.inventory_weight.toFixed(1)}/${juego.player.max_inventory_weight}`;
		}
		for (let id in items){			
			
			let item = items[id].name
			let n = items[id].quantity;
			let can_they_take = juego.player.can_they_take(item, n);
			let can_take = "";
			if (can_they_take){
				can_take = " can_take ";
			}
			let line = `<div id='loot-${id}' class='item ${can_take}'>${item}</div>`;
			if (Config.stackable.includes(item)){
				line = `<div id='loot-${id}' class='item ${can_take}'>${item} (${n})</div>`;
			}
			txt += line;
		}
		return txt;
	}

	display_loot(){
		$(".inventory").html(this.display_items(juego.player.inventory, false));
		if (juego.player.looting){
			$("#loot_container").html( this.display_items(juego.map.loot[juego.player.fetch_from()], true));
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

				}

				if (juego.player.at(x, y)){
					cell_txt = "O";
					cell_class += " player ";
				} else if (juego.map.at(x, y) != null && juego.map.at(x,y) != 1  
					&& juego.player.have_they_used_this_exit(juego, juego.player.location_type, juego.player.location_id, x, y)){
					cell_txt = 'x';
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
