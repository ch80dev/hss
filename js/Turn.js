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
		if (this.time.hours + hours_delta > 23){
			this.time.hours = (this.time.hours + hours_delta) - 24;
			this.time.days ++; 			
		} 
		if (this.time.hours > 23) {
			this.time.hours = 0;
			this.time.days ++;
		}
		if (this.time.days > Config.days_of_the_week.length){
			this.time.days = 1;
			this.time.weeks ++;
		}
	}

	next(humans, map, rats, cops){
		this.player.status.change_stamina();
		this.lifeforms_move(humans, map, rats, cops);		
		if (this.player.state.hours_delta != 0 || this.player.state.minutes_delta != 0){
			this.forward_time(this.player.state.hours_delta, this.player.state.minutes_delta);
			this.player.state.minutes_delta = 0;
			this.player.state.hours_delta = 0;	
		} else {
			this.forward_time(0, 1);	
		}
		this.player.state.crimes_this_turn = [];
	}

	lifeforms_move(humans, map, rats, cops){		
		let cop_on_scene = false;
		for (let cop of cops){
			let distance = map.get.geometry.fetch_distance(cop.x, cop.y, this.player.state.x, this.player.state.y);
			let give_warning = rand_num(1, 3 + cop.severity)   == 1;
			if (!cop.keeping_the_peace){
				continue;
			}
			cop_on_scene = true;
			if (distance <= cop.sense_range){
				give_warning = cop.spot_player(this.player.state.x, this.player.state.y, give_warning);
			}
			if (give_warning){
				ui.log(" <span class='cop_warn'>'POLICE! FREEZE!'</span>");
				continue;
			}
			if (this.player.state.detained_by == null && this.player.state.unconscious_for < 1 && cop.num_of_tazes > 0 && cop.severity == 2 && cop.player_fleeing && distance <= CopConfig.tazer_max_distance){
				ui.log("A cop is tazing you.")
				cop.taze_player(distance);
				continue;
			} else if (distance >= 2){
				cop.move();
				continue;
			} 
			this.player.actions.detained_interview(cop.id);

			
			
		}
		for (let id in  rats){					
			let rat = rats[id];
			let distance = map.get.geometry.fetch_distance(this.player.state.x, this.player.state.y, rat.x, rat.y);
			if (rat.dead || rat.location.type != this.player.state.location.type || rat.location.id != this.player.state.location.id){
				continue;
			} else if (rat.unconscious_for != 0){
				rat.unconscious_for --;
				if (rat.unconscious_for == 0){
					ui.log(`A rat regained consciousness!`);
				}
				continue;
			}

			if (rat.attacking_player && distance < 2 && map.get.geometry.is_orthogonal(rat.x, rat.y, this.player.state.x, this.player.state.y)){
				rat.attack_player(juego.player);
			} else {
				rat.move(id);
			}

			if (rat.attacking_player && (rand_num(1, rat.max_stamina) > rat.stamina) && rand_num(1, rat.max_health) > rat.health){
				rat.attacking = false;
				ui.log("A rat calmed down.");
			}
			if (rat.bleeding > 0){
				rat.bleed();
			}
		}
		for (let id in  humans){
			let human = humans[id];					
			let distance = map.get.geometry.fetch_distance(this.player.state.x, this.player.state.y, human.x, human.y);
			if (human.just_went_unconscious){
				juego.quests.process('beating', 1, human.id)		
				human.just_went_unconscious = false;
			}
			if (human.dead){
				continue;
			} else if (human.unconscious_for != 0){
				
				human.unconscious_for --;
				if (human.unconscious_for == 0){
					ui.log(`${human.name} ${human.surname} regained consciousness!`);
				}
				continue;
			}
			if (human.attacking_player && distance < 2 
				&& map.get.geometry.is_orthogonal(human.x, human.y, this.player.state.x, this.player.state.y)){
				human.attack_player(juego.player);
			} else if (human.attacking_player){
				human.move();
			}
			if (human.gambled != null && human.gambled.days > this.time.days && human.gambled.hours >= this.time.hours){
				human.gambled = null;
				human.ante = HumanConfig.starting_gamble_ante;
			}
			if (human.begging_unlocked.days < this.time.days && human.begging_unlocked.hours < this.time.hours){
				human.begging_unlocked = true;
			}
			if (human.attacking_player 
				&& ((rand_num(1, human.max_stamina) > human.stamina 
				&& rand_num(1, human.max_health) > human.health)
				|| cop_on_scene)){
				human.attacking_player = false;
				ui.log(`${human.name} ${human.surname} calmed down.`);
			}
			if (human.bleeding > 0){
				human.bleed();
			}
			if(this.player.state.crimes_this_turn.length > 0 && distance <= human.sense_range && map.get.inspector.has_line_of_sight(human.x, human.y, this.player.state.x, this.player.state.y)){
				human.watch();
			}
		}
	}
}