class Game{
	input = new Input();
	loop = new Loop();
	map = new GameMap (Config.max_x, Config.max_y);
	player = new Player(this);
	constructor(){
		setInterval(this.loop.go(), Config.loop_interval_timing);
	}
}
