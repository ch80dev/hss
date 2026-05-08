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
		this.player = new Player(open.x, open.y, this.time, this.map, this.get);
		this.populate = new Populator(this.map, this.player, this.get);
		this.turn = new Turn(this.player, this.time);
		this.jail = new PacMan(this.map.get.geometry, this.player, this.loop);
		this.populate.with_rats('alley', 0, this.rats);
		this.populate.with_humans('alley', 0, this.humans);
		this.populate.with_shops(this.favorites, this.shops);
		//this.cops.push(new Cop(this.cops.length, 1, 1, 0, this.player.state.location.type, this.player.state.location.id, this.map, this.player, this.get));
	}
	call_police(){
		//this doesn't take into account that the player could not be there (location.type, location.id) anymore - maybe?
		let response = this.police_responding_in[`${this.player.state.location.type}-${this.player.state.location.id}`];
		console.log('response', response);
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
		let num_of_exits = this.map.get.inspector.exit.fetch_count();
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
		response.x = this.player.state.x;
		response.y = this.player.state.y;
		ui.log(`Police were called! Arriving in ${response.time} turns....`);
		this.police_responding_in[`${this.player.state.location.type}-${this.player.state.location.id}`] = response;
		console.log(this.police_responding_in);
	}
	
	next(){
		for (let loc_str in this.police_responding_in){
			let report = this.police_responding_in[loc_str];
			if (!report.responded){
				report.time --;

			}
		}
		this.turn.next(this.humans, this.map, this.rats, this.cops);
		console.log(this.player.state.reported_crimes, );
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
			let location_type = location.split('-')[0]
			let location_id = Number(location.split('-')[1]);
			let cop_here = this.get.cop_at_location(location_type, location_id);
			if (!report.responded && report.time < 1){	
				report.responded = true;
				if (cop_here != null){
					cop_here.heading_towards.x = report.x;
					cop_here.heading_towards.y = report.y;
					cop_here.severity = report.severity;
					continue;
				}
				let exits = this.map.get.inspector.exit.fetch_all_of_type(report.from);
				if (report.type != null && exits.length == 0){
					console.log('error');
					return;
				}
				if (report.type == null){
					exits = this.map.get.inspector.exit.fetch_all();
				}
				let rand = exits[rand_num(0, exits.length - 1)];
				ui.log("POLICE! FREEZE!");

				if (this.cops.length == 0 || rand_num(1, this.cops.length + 1) != 1){
					this.cops.push(new Cop(this.cops.length, rand.x, rand.y, report.severity, location_type, location_id, this.map, this.player, this.get, report.x, report.y));
					continue;
				}

				let rand_id = rand_num(0, this.cops.length);
				let cop = this.get.cop(rand);
				cop.heading_towards.x = report.x;
				cop.heading_towards.y = report.y;
				cop.heading_towards.severity = report.severity;
				cop.location.type = location_type;
				cop.location.id = location_id;

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
