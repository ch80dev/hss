class UIMap {
    display(){
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

                if (juego.player.state.looking_at != null && juego.player.state.looking_at.x == x && juego.player.state.looking_at.y == y){
                    cell_class += " looking_at ";					
				} 
				if (((map_at != null && map_at > 1 && map_at < 5) 
					|| (map_at == Config.cell_class.indexOf('human') 
					|| map_at == Config.cell_class.indexOf('shop')))
					&&   juego.favorites.is_here(juego.map.format_at(juego.player.state.location_type, juego.player.state.location_id, x, y))){					
								
					cell_class += " favorite ";
                }
				
				
				txt += `<div id='cell-${x}-${y}' class='cell ${cell_class}'>${cell_txt}</div>`
			}
			txt += "</div>"
		}
		document.getElementById('map_grid').innerHTML = txt;
			
	}
}