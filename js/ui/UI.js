class UI{
	loot = new UILoot();
	map = new UIMap();
	refresh = new UIRefresh(this);
	shop = new UIShop();
	social = new UISocial();
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
	
}
