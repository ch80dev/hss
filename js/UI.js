class UI{
	constructor(){

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
				}

				if (juego.player.at(x, y)){
					cell_txt = "O";
					cell_class += " player ";
				}
				
				txt += `<div id='cell-${x}-${y}' class='cell ${cell_class}'>${cell_txt}</div>`
			}
			txt += "</div>"
		}
		document.getElementById('map').innerHTML = txt;		
	}
	refresh(){
		this.display_map();
		$("#health").html(`${juego.player.health}/${juego.player.max_health}`);
		$('#stamina').html(`${juego.player.stamina}/${juego.player.max_stamina}`);
	}
}
