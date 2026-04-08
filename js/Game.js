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
		this.populate_with_rats('alley', this.map.locations.alley.length - 1, this.player);
		
	}

	fetch_rat(location_type, location_id, x, y){
        for (let rat of this.rats[location_type][location_id]){

            if (rat.x == x && rat.y == y){
                return rat;
            }
        }
        return null;
    }

	
	next_turn(){
		let are_they_sick = rand_num(1, 100) <= this.player.state.sickness;
		this.player.status.change_stamina();
		this.rats_move();
		this.player.state.is_sick = are_they_sick
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
		for (let rat of this.rats[this.player.state.location_type][this.player.state.location_id]){					
			rat.move();
		}
	}
}
