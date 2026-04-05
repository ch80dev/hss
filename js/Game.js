class Game{
	input = new Input();
	loop = new Loop();
	map = new GameMap (Config.max_x, Config.max_y);
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
	do_turn(){
		
	}
}
