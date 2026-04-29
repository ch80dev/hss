class UIMap {
    display(){
		let txt = "";
		for (let y = 0; y < MapConfig.max_y; y ++){
			txt += "<div class='row'>"
			for (let x = 0; x < MapConfig.max_x; x ++){								
				let cell_class = ' empty ';
				let cell_txt = '';
				let distance_from_player = juego.map.get.geometry.fetch_distance(x, y, juego.player.state.x, juego.player.state.y);
				let favorited = false;
				let human = juego.get.human_by_loc(juego.player.state.location.type, juego.player.state.location.id, x, y);
				let loot = juego.map.loot[`${juego.player.state.location.type}-${juego.player.state.location.id}-${x}-${y}`];
				let map_at = juego.map.get.at(x, y);
				let mark = juego.map.get.inspector.entity.fetch_mark(juego.player.state.location.type, juego.player.state.location.id, x, y);
				let rat = juego.get.rat(juego.player.state.location.type, juego.player.state.location.id, x, y);
				let is_lit = false;
				let has_flashlight = juego.player.inventory.get.is_equipped_with('flashlight');
				let has_lantern = juego.player.inventory.get.is_equipped_with('lantern');
				if (((map_at != null && map_at > 1 && map_at < 5) 
					|| (map_at == MapConfig.cell_class.indexOf('human') 
					|| map_at == MapConfig.cell_class.indexOf('shop')))
					&&   juego.favorites.is_here(juego.map.format_at(juego.player.state.location.type, juego.player.state.location.id, x, y))){					
								
					favorited = true;
                }
				// 1. Base Vision & Lantern (Circular)
				if (distance_from_player < 2 || (has_lantern && distance_from_player < 4)) {
					is_lit = true;
				}

				// 2. Flashlight (Cone)
				if (!is_lit && has_flashlight && distance_from_player < 6) {
					let dx = x - juego.player.state.x;
					let dy = y - juego.player.state.y;

					if (juego.facing == 'up'    && dy < 0 && Math.abs(dx) <= Math.abs(dy)) is_lit = true;
					if (juego.facing == 'down'  && dy > 0 && Math.abs(dx) <= Math.abs(dy)) is_lit = true;
					if (juego.facing == 'left'  && dx < 0 && Math.abs(dy) <= Math.abs(dx)) is_lit = true;
					if (juego.facing == 'right' && dx > 0 && Math.abs(dy) <= Math.abs(dx)) is_lit = true;
					if (!juego.map.get.inspector.has_line_of_sight(x, y, juego.player.state.x, juego.player.state.y)) is_lit = false;
				}
				if (favorited){
					cell_class = ' favorite ';
				}
				// 3. The "Darkness" Skip
				if ((juego.player.state.location.type ==  'sewer' || juego.night) && !is_lit && !juego.map.get.inspector.entity.is_in_the_light(juego.player.state.location.type, juego.player.state.location.id, x, y)) {
					// We draw the ID so the DOM stays consistent, but the content is blank
					txt += `<div id='cell-${x}-${y}' class='cell dark ${cell_class}'></div>`;
					continue;
				}


				
				if (map_at != null && map_at == MapConfig.cell_class.indexOf('cop')){
					cell_class = ' cop ';
				  
				} else if (map_at != null && map_at == MapConfig.cell_class.indexOf('human') && human != null && human.homeless){
					cell_class = ' human homeless ';
				} else if (map_at != null && map_at == MapConfig.cell_class.indexOf('human') && human != null && !human.homeless){
					cell_class = ' human citizen ';
				} else if (MapConfig.cell_class[map_at] == 'trash' && loot != null && loot.searched){
					cell_class = `${loot.type}_searched`;
				} else if (MapConfig.cell_class[map_at] == 'trash' && loot != null){					
					cell_class = loot.type;
				} else if (map_at == 1 && loot != null){
					cell_class = 'debris';
				} else if (map_at != null){
					cell_class = MapConfig.cell_class[map_at];
				}

				if (map_at == 6 && rat != null && rat.hungry){
					cell_class = ' rat hungry';
				} 



				if (juego.player.movement.at(x, y)){
					cell_txt = MapConfig.cell_txt['player'];
					
				} else if (map_at != null && map_at == MapConfig.cell_class.indexOf('cop')){
					cell_txt = MapConfig.cell_txt.cop; // need to put this up here to overwrite exit
					
				} else if (map_at != null && map_at != 1  
					&& juego.map.get.inspector.entity.have_they_used_this_exit(juego.player.state.location.type, 
					juego.player.state.location.id, x, y)){
					cell_txt = MapConfig.cell_txt['used_exit'];
				} else if (map_at != null && map_at > 1 && map_at < 5){
					cell_txt = MapConfig.cell_txt['unused_exit'];	

				}	else if (mark != null){
					cell_txt = mark;
				} else if (MapConfig.cell_class[map_at] == 'trash' && loot != null){
					cell_txt = MapConfig.cell_txt[loot.type];
				} else if (map_at == 1 && loot != null && loot.stuff.length > 0){
					
					cell_txt = MapConfig.cell_txt['debris'];
				} else if (MapConfig.cell_txt[MapConfig.cell_class[map_at]] != undefined){
					cell_txt = MapConfig.cell_txt[MapConfig.cell_class[map_at]];				
				} 
				
				if (juego.player.movement.at(x, y) && !juego.player.state.fighting){
					cell_class += " player ";
				} else if (juego.player.movement.at(x, y) && juego.player.state.fighting){
					cell_class += " player_fighting";
				} else if ((MapConfig.cell_class[map_at] == 'trash' && loot != undefined && loot.locked)
					|| (MapConfig.cell_class[map_at] == 'human' && human != undefined && juego.player.state.stigma > human.max_stigma_tolerance )
				){
					cell_class += ' blocked ';
				}

                if (juego.player.state.looking_at != null && juego.player.state.looking_at.x == x && juego.player.state.looking_at.y == y){
                    cell_class += " looking_at ";					
				} 
				if (favorited){
					cell_class += ' favorite ';
				}
				
				
				
				txt += `<div id='cell-${x}-${y}' class='cell ${cell_class}'>${cell_txt}</div>`
			}
			txt += "</div>"
		}
		document.getElementById('map_grid').innerHTML = txt;
			
	}
}