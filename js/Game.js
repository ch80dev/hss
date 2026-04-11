class Game{
	 humans = {
        alley: [],
        sewer: [],
        street: [],
    };
	input = new Input();
	loop = new Loop();
	player = null; // needs to before map;
	map = new GameMap (Config.max_x, Config.max_y);
	rats = {
        alley: [],
        sewer: [],
        street: [],
    };

	constructor(){
		setInterval(this.loop.go(), Config.loop_interval_timing);
		let open = this.map.queries.fetch_open();
		this.player = new Player(open.x, open.y);
		this.populate_with_rats('alley');
		this.populate_with_humans('alley');
	}
	fetch_human(location_type, location_id, x, y){
		for (let human of this.humans[location_type][location_id]){			
            if (human.x == x && human.y == y){
                return human;
            }
        }
        return null;
	}

	fetch_rat(location_type, location_id, x, y){
        for (let rat of this.rats[location_type][location_id]){			
            if (rat.x == x && rat.y == y){
                return rat;
            }
        }
        return null;
    }

	fetch_shop(id){
		let shop = juego.shops[id];
		if (shop != undefined){
			return null;
		}
		return shop;
	}

	
	next_turn(){
		let are_they_sick = rand_num(1, 100) <= this.player.state.sickness;
		this.player.status.change_stamina();
		this.rats_move();
		this.player.state.is_sick = are_they_sick
	}

	populate(location_type){
		this.populate_with_humans(location_type);
		this.populate_with_rats(location_type);
	}

	populate_with_humans(location_type){
        let num_of_humans = rand_num(0, Config.max_num_of_humans[location_type]);
		let id = this.humans[location_type].length;
		this.humans[location_type][id] = [];
        for (let i = 0; i < num_of_humans; i ++){
            let open = this.map.queries.fetch_open();
            this.map.is(open.x, open.y, 7);
			let are_they_homeless = rand_num(1, 100) <= Config.homeless_cent[location_type];
			this.humans[location_type][id].push(new Human(open.x, open.y, are_they_homeless, this.map, this.player))
        }
    }

	populate_with_rats(location_type){        
        let num_of_rats = rand_num(1, Config.max_num_of_rats[location_type]);        
		let id = this.rats[location_type].length;
		this.rats[location_type][id] = [];		
        for (let i = 0; i < num_of_rats; i ++){
            let open = this.map.queries.fetch_open();
            this.map.is(open.x, open.y, 6);			
            this.rats[location_type][id].push(new Rat(this.map, this.player, open.x, open.y))			
        }
    }

	rats_move(){		
		if (this.player.state.location_type != 'alley'){
			return;
		}
		for (let id in  this.rats[this.player.state.location_type][this.player.state.location_id]){					
			let rat = this.rats[this.player.state.location_type][this.player.state.location_id][id];
			rat.move(id);
		}
	}
}
