class Game{
	cop_interview = new CopInterview();
	cops = [];
	facing = 'up';
	get = null;
	night = false;
	favorites = new Favorite();
	humans = [];
	input = new Input();
	jail = null;
	loop = new Loop();
	map = new GameMap (MapConfig.max_x, MapConfig.max_y);

	police_responding_in = {};
	player = null; // needs to before map;
	police_dispatched = [];
	populate = null;
	quests = new Quest();
	rats = [];	
	shops = [];
	time = {
		days: 1,
		hours: 12, //8
		minutes: 0,
		weeks: 1,
	}
	turn = null;
	waiting = 0;
	
	constructor(){
		this.get = new Queries(this.humans, this.rats, this.shops, this.cops);
		let open = this.map.get.inspector.fetch_open(false);
		this.player = new Player(open.x, open.y, this.time, this.map);
		this.populate = new Populator(this.map, this.player, this.get);
		this.turn = new Turn(this.player, this.time);
		this.jail = new PacMan(this.map, this.player, this.loop);
		this.populate.with_rats('alley', 0, this.rats);
		this.populate.with_humans('alley', 0, this.humans);
		this.populate.with_shops(this.favorites, this.shops);
	}
	call_police(){
		//this doesn't take into account that the player could not be there (location.type, location.id) anymore - maybe?
		let response = this.police_responding_in[`${this.player.state.location.type}-${this.player.state.location.id}`];
		if (response != undefined && response.time <= 0){
			return;

		}
		if (response != undefined){
			ui.log(` [Police: ${response.time}]`);
			return;

		}
		let severity = -1;
		for (let crime of this.player.state.reported_crimes){
			if (severity < CopConfig.crime_severity[crime]){
				severity = CopConfig.crime_severity[crime];
			}
		}
		response = {};
		let num_of_exits = this.map.get.inspector.entity.fetch_num_of_exits();
		if (this.player.state.location.type == 'street'){
			response.from = null;
			response.time = 0;
		} else if (num_of_exits.street > 0){
			response.from = 'street';
			response.time = 10;
		} else if (num_of_exits.alley > 0){
			response.from = 'alley';
			response.time = 25;
		} else if (num_of_exits.sewer > 0){
			response.from = 'sewer';
			response.time = 50;
		}
		if (severity < 0){
			console.log('error!!!'. severity);
		}
		response.severity = severity;
		response.responded = false;
		ui.log(`Police were called! [${response.time}]`);
		this.police_responding_in[`${this.player.state.location.type}-${this.player.state.location.id}`] = response;
	}
	
	next(){
		for (let loc_str in this.police_responding_in){
			let report = this.police_responding_in[loc_str];
			report.time --;
		}
		this.turn.next(this.humans, this.map, this.rats, this.cops);
		if (this.player.state.reported_crimes.length > 0 
			&& this.player.state.location.type != 'sewer'){
			this.call_police();
		}
		for (let i = 0; i < this.player.state.unconscious_for; i ++){
			this.turn.next(this.humans, this.map, this.rats, this.cops);
			if (i == this.player.state.unconscious_for - 1){
				this.player.state.unconscious_for = 0;
			}
		}
		if (this.waiting > 0){
			this.wait();
		}
		if (!this.night && this.time.hours >= Config.night_time){
			ui.log("It's night time now.")
			this.night = true;
		}else if (this.night && this.time.hours >= Config.day_time && this.time.hours < Config.night_time){
			ui.log("It's day time now.")
			this.night = false;
		}
		for (let location in this.police_responding_in){
			let report = this.police_responding_in[location];
			if (!report.responded && report.time < 1 && !this.police_dispatched.includes(this.player.fetch_loc_str())){
				report.responded = true;
				this.police_dispatched.push(this.player.fetch_loc_str());
				let exits = this.map.get.inspector.entity.fetch_exits_of_type(report.from);
				if (report.type != null && exits.length == 0){
					console.log('error');
					return;
				}
				if (report.type == null){
					exits = this.map.get.inspector.entity.fetch_exits();
				}
				let rand = exits[rand_num(0, exits.length - 1)];
				ui.log("POLICE! FREEZE!");
				this.cops.push(new Cop(this.cops.length, rand.x, rand.y, report.severity, location.split('-')[0], location.split('-')[1], this.map, this.player, this.get));
			}
		}
	}
	

	do_populate(location_type, location_id){
		this.populate.with_humans(location_type, location_id, this.humans);
		this.populate.with_rats(location_type, location_id, this.rats);
		this.populate.with_shops(this.favorites, this.shops);
	}
	wait(){
		juego.waiting --;
		ui.refresh.go();
		if (juego.waiting > 0){
			setTimeout(juego.wait, 1000);
		}
	}
}
