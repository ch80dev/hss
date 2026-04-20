class UI{
	auto_loot_inv = {};
	fade_opacity_delta = .1;
	favorites = new UIFavorite();
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

	update_auto_loot(arr){
		if (arr.length > 0){
			this.refresh.show_ui_auto_loot = true;
		}
		for (let i of arr){
			let item_str_arr = i.split(' ');
			let quantity = Number(item_str_arr[0]);
			item_str_arr.shift();
			let name = item_str_arr.join(' ');
			if (this.auto_loot_inv[name] == undefined){
				this.auto_loot_inv[name] = quantity;
			} else {
				this.auto_loot_inv[name] += quantity;
			}
		}

	}


	display_location_name(){
		let name = juego.map.names[juego.player.state.location.type][juego.player.state.location.id];
		let txt = "";
		//console.log("BUG", name, juego.player.state.location.type, juego.player.state.location.id);
		if (juego.player.state.location.type == 'street'){			
			$("#location_name").html(`${name} Street  [${juego.player.state.location.type}-${juego.player.state.location.id}]`);
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
			
		$("#location_name").html(`${txt} [${juego.player.state.location.type}-${juego.player.state.location.id}]`);
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

	fade_status(){
		
		let opacity = Number($("#status").css("opacity"));
		if (opacity <= 0){
			return;	
		}
		opacity -= this.fade_opacity_delta;
		$("#status").css("opacity", opacity);
	}

	log(msg){	
		console.log(msg);
		this.status_msg += " " + msg;
	}
	
}
