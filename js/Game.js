class Game{
	facing = 'up';
	night = false;
	favorites = new Favorite();
	humans = [];
	input = new Input();
	loop = new Loop();
	player = null; // needs to before map;
	map = new GameMap (Config.max_x, Config.max_y);
	rats = [];

	shops = [];
	time = {
		days: 1,
		hours: 8,
		minutes: 0,
		weeks: 1,
	}
	
	constructor(){
		setInterval(this.loop.go(), Config.loop_interval_timing);
		let open = this.map.queries.fetch_open();
		this.player = new Player(open.x, open.y);
		this.populate_with_rats('alley', 0);
		this.populate_with_humans('alley', 0);
		this.populate_shops();
	}
	
	fetch_human_by_loc(location_type, location_id, x, y){
		for (let human of this.humans){			
            if (human.location.type == location_type && human.location.id == location_id 
				&& human.x == x && human.y == y){
                return human;
            }
        }
        return null;
	}

	fetch_human(id){
		//console.log(id);
		for (let human of this.humans){			
            if (human.id == id){
				//console.log(human.id, id);
                return human;
            }
        }
        return null;
	}

	fetch_rat(location_type, location_id, x, y){
		//console.log(location_type, location_id, x, y);
        for (let rat of this.rats){
			//console.log(rat.location, rat.x, rat.y);
            if (rat.location.type == location_type && rat.location.id == location_id 
				&& rat.x == x && rat.y == y){
                return rat;
            }
        }
        return null;
    }

	

	fetch_target(location_type, location_id, x, y){
		let target = this.fetch_human_by_loc(location_type, location_id, x, y);
		if (target != null){
			return target;
		}
		target = this.fetch_rat(location_type, location_id, x, y);
		return target;

	}

	fetch_shop(id){
		
		for (let shop of this.shops){
			if (shop.id == id){
				return shop;
			}
		}		
		return null;
	}
	forward_time(hours_delta, minutes_delta){
		//console.log(hours_delta, minutes_delta);
		this.time.minutes += minutes_delta;
		if (this.time.minutes > 59){
			this.time.minutes = 0;
			this.time.hours ++;
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

	

	next_turn(){
	
		this.player.status.change_stamina();
		this.rats_move();		
		if (this.player.state.hours_delta != 0 || this.player.state.minutes_delta != 0){
			this.forward_time(this.player.state.hours_delta, this.player.state.minutes_delta);
			this.player.state.minutes_delta = 0;
			this.player.state.hours_delta = 0;	
		} else {
			this.forward_time(0, 5);	
		}
	}

	populate(location_type, location_id){
		this.populate_with_humans(location_type, location_id);
		this.populate_with_rats(location_type, location_id);
		this.populate_shops();
	}

	populate_shops(){
		//console.log(this.shops.length, this.map.shops.length);
		for (let shop of this.map.shops){
			//console.log(shop, this.map.shops);
			if (this.shops[shop.id] != undefined){
				continue;
				
			}
			this.shops.push(new Shop(shop.id, shop.type))
		}
		//console.log(this.shops.length, this.map.shops.length);
	}

	populate_with_humans(location_type, location_id){
        let num_of_humans = rand_num(Config.min_num_of_humans[location_type], Config.max_num_of_humans[location_type]);
		let id = this.humans.length;		
        for (let i = 0; i < num_of_humans; i ++){
            let open = this.map.queries.fetch_open();
            this.map.is(open.x, open.y, 7);
			let are_they_homeless = rand_num(1, 100) <= Config.homeless_cent[location_type];
			this.humans.push(new Human(id + i, open.x, open.y, are_they_homeless, location_type, location_id, this.map, this.player))
        }
    }

	populate_with_rats(location_type, location_id){        
        let num_of_rats = rand_num(1, Config.max_num_of_rats[location_type]);        
		let id = this.rats.length;		
        for (let i = 0; i < num_of_rats; i ++){
            let open = this.map.queries.fetch_open();
            this.map.is(open.x, open.y, 6);			
            this.rats.push(new Rat(id, open.x, open.y, location_type, location_id, this.map, this.player))			
        }
    }

	

	rats_move(){		
		
		for (let id in  this.rats){					
			let rat = this.rats[id];
			let distance = this.map.queries.fetch_distance(this.player.state.x, this.player.state.y, rat.x, rat.y);
			if (rat.dead){
				continue;
			}

			if (rat.attacking_player && distance < 2 ){
				rat.attack_player();
			}
			rat.move(id);
		}
		for (let id in  this.humans){
			let human = this.humans[id];					
			let distance = this.map.queries.fetch_distance(this.player.state.x, this.player.state.y, human.x, human.y);
			if (human.dead){
				continue;
			}
		
			//console.log(human.attacking_player, distance < 2);
			if (human.attacking_player && distance < 2 ){
				//console.log("go");
				human.attack_player(juego.player);
			}
			if (human.begging_unlocked.days >= this.time.days && human.begging_unlocked.hours >= this.time.hours){
				human.begging_unlocked = true;
			}
		}
	}

	
}
