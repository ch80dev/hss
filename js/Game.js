class Game{
	facing = 'up';
	get = null;
	night = false;
	favorites = new Favorite();
	humans = [];
	input = new Input();
	loop = new Loop();
	player = null; // needs to before map;
	populate = null;
	map = new GameMap (MapConfig.max_x, MapConfig.max_y);
	rats = [];

	shops = [];
	time = {
		days: 1,
		hours: 8,
		minutes: 0,
		weeks: 1,
	}
	turn = null;
	
	
	constructor(){
		setInterval(this.loop.go(), Config.loop_interval_timing);
		this.get = new Queries(this.humans, this.rats, this.shops);
		let open = this.map.get.inspector.fetch_open();
		this.player = new Player(open.x, open.y);
		this.populate = new Populator(this.map, this.player);
		this.turn = new Turn(this.player, this.time);
		this.populate.with_rats('alley', 0, this.rats);
		this.populate.with_humans('alley', 0, this.humans);
		this.populate.with_shops(this.favorites, this.shops);
	}
	next(){
		this.turn.next(this.humans, this.map, this.rats);
		if (!this.night && this.time.hours >= Config.night_time){
			ui.log("It's night time now.")
			this.night = true;
		}else if (this.night && this.time.hours >= Config.day_time && this.time.hours < Config.night_time){
			ui.log("It's day time now.")
			this.night = false;
		}

	}
	

	do_populate(location_type, location_id){
		this.populate.with_humans(location_type, location_id, this.humans);
		this.populate.with_rats(location_type, location_id, this.rats);
		this.populate.with_shops(this.favorites, this.shops);
	}
}
