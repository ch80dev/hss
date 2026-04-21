class Turn{
    constructor(player, time, ){
        this.player = player;
        this.time = time;
    }
    forward_time(hours_delta, minutes_delta){
		//console.log(hours_delta, minutes_delta);
		this.time.minutes += minutes_delta;
		if (this.time.minutes > 59){
			this.time.minutes = 0;
			this.time.hours ++;
			this.player.inventory.food_spoils();
			this.player.status.player_still_sick();
		}
		this.time.hours += hours_delta;
		if (this.time.hours > 23){
			this.time.hours = 0;
			this.time.days ++; 			
		}
		if (this.time.days > Config.days_of_the_week.length){
			this.time.days = 1;
			this.time.weeks ++;
		}
	}

	

	next(human, map, rats){
	
		this.player.status.change_stamina();
		this.lifeforms_move(human, map, rats);		
		if (this.player.state.hours_delta != 0 || this.player.state.minutes_delta != 0){
			this.forward_time(this.player.state.hours_delta, this.player.state.minutes_delta);
			this.player.state.minutes_delta = 0;
			this.player.state.hours_delta = 0;	
		} else {
			this.forward_time(0, 1);	
		}

	}



	

	lifeforms_move(humans, map, rats){		
		
		for (let id in  rats){					
			let rat = rats[id];
			let distance = map.get.geometry.fetch_distance(this.player.state.x, this.player.state.y, rat.x, rat.y);
			if (rat.dead || rat.location.type != this.player.state.location.type || rat.location.id != this.player.state.location.id){
				continue;
			}

			if (rat.attacking_player && distance < 2 ){
				rat.attack_player();
			}
			rat.move(id);
		}
		for (let id in  humans){
			let human = humans[id];					
			let distance = map.get.geometry.fetch_distance(this.player.state.x, this.player.state.y, human.x, human.y);
			if (human.dead){
				continue;
			}
		
			if (human.attacking_player && distance < 2 ){
				human.attack_player(juego.player);
			}
			if (human.begging_unlocked.days < this.time.days && human.begging_unlocked.hours < this.time.hours){
				console.log('beggining reset');
				human.begging_unlocked = true;
			}
		}
	}
}