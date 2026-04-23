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
	static night_time = 20;
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
	static rat_movement_cost = .1;
	
	
	

	//PLAYER
	static can_sleep_every = 12; //hours
	static low_stamina_threshold = 25;
	static max_sickness = 100;
	static stamina_cost = {
		attack: -1,
	}
	static stigma_effects = {
		trash: .2,
		sewer: .5,
	}
	static sickness_effects = {
		sewer: .05,
	}
	



	
	



	//STREET
	static street_names = [
		// Trees
		"Ash", "Birch", "Cedar", "Dogwood", "Elm", "Fir", "Gum", "Hazel", "Ivy", "Juniper", "Koa", "Larch", "Maple", "Nutmeg", "Oak", "Pine", "Quince", "Redwood", "Spruce", "Teak", "Umbrella", "Vine", "Walnut", "Xylosma", "Yew", "Zelkova",
		// States/Regions
		"Alabama", "Brunswick", "Colorado", "Delaware", "East Dakota", "Florida", "Georgia", "Hawaii", "Idaho", "Jersey", "Kansas", "Louisiana", "Montana", "Nebraska", "Oregon", "Pennsylvania", "Quincy", "Rhode", "Savannah", "Texas", "Utah", "Virginia", "Wyoming", "Xavier", "York", "Zion",
		// Historical/Professional
		"Adams", "Benton", "Clark", "Douglass", "Edison", "Franklin", "Grant", "Hancock", "Irving", "Jefferson", "Kennedy", "Lincoln", "Marshall", "Newton", "Otis", "Parker", "Quantico", "Reeds", "Sherman", "Tatcher", "Ulysses", "Victor", "Wright", "Xerxes", "Yancy", "Zimmer",
		// Two-Syllable
		"Archer", "Baker", "Chapel", "Driver", "Eagle", "Foster", "Grover", "Hunter", "Island", "Jacket", "Kettle", "Logan", "Miller", "Nelson", "Owen", "Porter", "Quarry", "River", "Silver", "Tucker", "Under", "Valley", "Weaver", "Xylon", "Yarrow", "Zenith",
		// Three-Syllable
		"Allison", "Bannister", "Covington", "Delaney", "Emerson", "Finnegan", "Galloway", "Harrison", "Indigo", "Jeffries", "Killinger", "Liberty", "Madrigal", "Novinger", "Overton", "Patterson", "Quinnifer", "Rafferty", "Sullivan", "Tennyson", "Unity", "Valencia", "Whittaker", "Xenophon", "Yosemite", "Zimmerman"
	];
	
}