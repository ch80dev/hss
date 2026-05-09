class UI{
	auto_loot_inv = {};
	cop = new UICop();
	fade_opacity_delta = .1;
	favorites = new UIFavorite();
	loot = new UILoot();
	map = new UIMap();
	percent_stats = {};
	refresh = new UIRefresh(this);
	shop = new UIShop();
	sleeping = false;
	human = new UIHuman();
	player_fade = 0;
	status_msg = "";
	screen_focused = 'map';
	unconscious = false;
	constructor(){
		let stats = ['health', 'stamina', 'stigma'];
		for (let stat of stats){
			this.percent_stats[stat] = true;
		}
	}

	change_screen(what){
		this.screen_focused = what;
	}
	fade_in_on_player(){
		if (ui.player_fade === null){
			return;
		}
		let all_clear = true;
		for (let x = 0; x < MapConfig.max_x; x ++){
			for (let y = 0; y < MapConfig.max_x; y ++){
				let distance = juego.map.get.geometry.fetch_distance(x, y, juego.player.state.x, juego.player.state.y);
				$(`#cell-${x}-${y}`).css('opacity', 1);
				if (distance > ui.player_fade){
					all_clear = false;
					$(`#cell-${x}-${y}`).css('opacity', 0);
				}
			}	
		}

		if (!all_clear && ui.player_fade !== null){
			ui.player_fade ++;
			setTimeout(ui.fade_in_on_player, 10);
			return;
		}
		
		ui.player_fade = null;
	}

	fade_for_sleep(){
		let opacity =  Number($("body").css('opacity'));
		opacity = opacity - .03;
		$('body').css('opacity', opacity);
		if (ui.sleeping && opacity > 0){
			setTimeout(ui.fade_for_sleep, 100);
		} else {
			$('body').css('opacity', 1);
			ui.sleeping = false;	
			ui.unconscious = false;		
			ui.refresh.go();
		}
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
		this.status_msg += " " + msg;
	}
	
}
