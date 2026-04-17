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

	display_favorites(){
		let txt = "";
		for (let entity in juego.favorites.set){
			
			for (let id in juego.favorites.set[entity]){
				let favorite = juego.favorites.set[entity][id];
				let context = ''; 
				let target = juego.fetch_shop(id);
				if (entity == 'human'){
					context = this.display_favorites_for_human(id);
					target = juego.fetch_human(id);
				} 
				let favorite_symbol = `&#x2606;`;
				let name = target.name;
				if (entity == 'human'){
					name += " " + target.surname;
				} else {

				}					
        		if (juego.favorites.set[entity][id] != undefined){
            		favorite_symbol = `&#x2605;`;
        		}
				txt += `<div class='favorite_entry'><button id='favorite-${entity}-${id}' class='favorite'>${favorite_symbol}</button>${name} (${favorite.x}, ${favorite.y}) ${favorite.past_locations.length} locations away</div>`;
				txt += `<div class='favorite_context'>${context}</div>`;
			}
		}
		$("#favorites").html(txt);
	}

	display_favorites_for_human(id){
		let human = juego.fetch_human(id);
		let txt = "";
		if (human == null){
			return;
		}
		for (let id in human.interactions){
			if (human.interactions[id] == 'trade'){
				let trade_this = Object.keys(human.resources[id]);
				let get_that = human.resources[id][trade_this];
				txt += `<div>${human.interactions[id]} ${human.conversion[id][0]} ${trade_this} for ${human.conversion[id][1]} ${get_that}</div>`;
				continue;
			} else if (human.interactions[id] == 'beg'){
				txt += `<div>${human.interactions[id]}</div>`;	
				continue;
			}
			txt += `<div>${human.interactions[id]} ${human.resources[id]} for $${human.conversion[id]}</div>`;
		}
		return txt;
	}


	display_location_name(){
		let name = juego.map.names[juego.player.state.location.type][juego.player.state.location.id];
		let txt = "";
		//console.log("BUG", name, juego.player.state.location.type, juego.player.state.location.id);
		if (juego.player.state.location.type == 'street'){			
			$("#location_name").html(name + " Street");
			return;
		} 
		txt =  "alley behind ";
		if (juego.player.state.location.type == 'sewer'){
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
