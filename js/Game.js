class Game{
	input = new Input();
	loop = new Loop();
	map = new GameMap (Config.max_x, Config.max_y, this);
	player = new Player(this);
	constructor(){
		setInterval(this.loop.go(), Config.loop_interval_timing);
	}

	generate_item_from_trash(){
		let gen_odds = rand_num(1, 100);
		for (let item_name in Config.trash_item_odds){
			let item_odd= Config.trash_item_odds[item_name];
			if (gen_odds >= item_odd[0] && gen_odds <= item_odd[1] ){
				return item_name;
			}
		}
	}
	next_turn(){
		let are_they_sick = rand_num(1, 100) <= this.player.sickness;
		
		this.player.change_stamina();
		this.rats_move();
		this.player.is_sick = are_they_sick
	}

	rats_move(){		
		if (this.player.location_type != 'alley'){
			return;
		}
		for (let rat of this.map.rats[this.player.location_type][this.player.location_id]){					
			if (rat.dead){
				continue;
			}
			console.log(rat.delta);
			
			let do_they_move = rand_num(1,2) == 1;
			rat.hungry = rand_num(1, rat.max_stamina) > rat.stamina;
			let adjacent_open = this.map.fetch_adjacent(rat.x, rat.y, 1, true);
			let moving = {x: 0, y: 0 };
			let pos_x = rat.x;
			let pos_y = rat.y;
			let searching_for_food = this.map.search_for_food(rat.x, rat.y, rat.sense_range, this.player.location_type, this.player.location_id);
			if(rat.hungry && (this.map
				.is_item_here('food', `${this.player.location_type}-${this.player.location_id}-${rat.x}-${rat.y}`) 
				|| this.map.is_item_here(
				'food (spoiled)', `${this.player.location_type}-${this.player.location_id}-${rat.x}-${rat.y}`))){
				console.log("EAT FOOD");
			}  else if (rat.hungry && (searching_for_food.x != 0 || searching_for_food != 0)){
				rat.delta = searching_for_food;
			}
			
			
			pos_x += rat.delta.x;
			pos_y += rat.delta.y;
			if (adjacent_open.length > 0 && (!this.map.is_valid(pos_x, pos_y) || this.map.at(pos_x, pos_y) != 1)){
				let rand = adjacent_open[rand_num(0, adjacent_open.length - 1)];
				rat.delta = this.map.fetch_delta(rand.x, rand.y, rat.x, rat.y);
				pos_x = rat.x + rat.delta.x;
				pos_y = rat.y + rat.delta.y;
			}

			if ((rat.x == pos_x && rat.y == pos_y) || (do_they_move) || (!do_they_move && rat.hungry)){
				continue;
			}
			if (rat.stamina > 0){
				rat.stamina --;
			} else if(rat.health > 0){
				rat.health --;
			}

			this.map.is(rat.x, rat.y, 1);
			this.map.is(pos_x, pos_y, 6);
			rat.x = pos_x;
			rat.y = pos_y;
			if (rat.health < 1){
				rat.dead = true;
			}
		}
	}
}
