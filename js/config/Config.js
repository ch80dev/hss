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
	
	
}