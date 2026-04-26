class Config {


	static audit(){
		const config_class = new this();
		const mistakes = Object.getOwnPropertyNames(config_class).filter(p => p !== 'constructor');
		if (mistakes.length > 0){
			console.log(mistakes);
		}		
	}
	
	static days_of_the_week = ["Monday", "Tuesday", "Wednesday", "Thursday", 'Friday', "saturday", "Sunday"];
	static day_time = 6;
	static init_unconscious = 15;
	static lifeforms = {
		human: {
			sense_range: 10,
			max_health: 100,
			max_stamina: 100,
		},
		rat: {
			sense_range: 5,
			max_health: 10,
			max_stamina: 30,
		}
	}
	static loop_interval_timing = 1000;
	static night_time = 20;

	static rat_movement_cost = .1;

	
	

	//PLAYER
	static can_sleep_every = 12; //hours
	static low_stamina_threshold = 25;
	static max_sickness = 100;
	static stamina_cost = {
		attack: -1,
		move: .1,
	}
	static stigma_effects = {
		trash: .2,
		sewer: .5,
	}
	static sickness_effects = {
		sewer: .05,
	}
	/*
		0 - respond but don't call out to you, won't chase you, just walk towards you 
		1 - won't try to taze but will pursue you through exits
		2 - taze you
		3 - shooting
	*/

	static crime_severity = {
		'attack-cop': 3,
		'attack-human': 2,
		'attack-rat': 1,
		beg: 1,
		hit_trash: 2,
		'kill-human': 3,
		'kill-rat': 1,
		'knock_out-rat': 1,
		'knock_out-human': 2,
		loot_unconscious: 2,
		open_trash: 0,
		sleep: 1,
		talk: 0,
		unlock_trash: 1,
		
	}
	
}