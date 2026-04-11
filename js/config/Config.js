class Config {
	static audit(){
		const config_class = new this();
		const mistakes = Object.getOwnPropertyNames(config_class).filter(p => p !== 'constructor');
		if (mistakes.length > 0){
			console.log(mistakes);
		}		
	}
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
	
	

	//HUMAN
	static human_chance_to_be_cop = 1;
	static interactions = ['buy', 'sell', 'trade', 'beg']; //, 'directions', 'escort', 'favor', 'work'];
	static interactions_for_money = ['sell', 'beg', 'work'];
	static interactions_for_resources = ['trade', 'buy', 'sell'];
	static homeless_money = 50;
	static num_of_interactions_per_human = 3;
	



	//ITEM
	static degradable = ['lighter', 'weapon', 'tool'];
	static equipable = ['tool', 'weapon'];
	static food_gain = [10, 30];
	static human_items = ['crate', 'drugs',  'food', 'food (spoiled)',  'medicine', 'medicine (expired)', 'aluminum can', 'glass bottle', 'plastic bottle', 'tool', 'weapon'];
	static medicine_gain = [10, 100];	
	static prices = {
		'aluminum can': .05,
		crate: 8,
		drugs: 50,
		food: 4, 
		'food (spoiled)': .5,
		fuel: 4,
		'glass bottle': .05,
		lighter: 2, 
		medicine: 15,
		'plastic bottle': .05,
		'medicine (expired)': 2, 
		 
		tool: 25, 
		weapon: 40,
		
	}	
	static recyclables = ['aluminum can', 'glass bottle', 'plastic bottle'];
	static spoiled_sick_gain = [1, 50];
	static stackable = ['aluminum can', 'glass bottle', 'plastic bottle', 'food', 'food (spoiled)', 'fuel', 'medicine', 'medicine (expired)', 'drugs'];
	static trash_item_odds = {		
		'plastic bottle': [1, 20],
		'glass bottle': [21, 40],
		'aluminum can': [41, 60],
		'food (spoiled)': [61, 78],
		food: [79, 80],
		
		crate: [81, 85],
		medicine: [86, 86],
		'medicine (expired)': [87, 93],
		
		tool: [94, 98],
		weapon: [99, 99],
		drugs: [100, 100],		
		//lighter: [71, 80],
	}	
	static usable = ['crate', 'food', 'food (spoiled)', 'medicine', 'medicine (expired)'];		
	static weights = {
		'aluminum can': .03,
		'glass bottle': .5,
		'plastic bottle': .05,
		food: 1,
		'food (spoiled)': 1,
		fuel: 2,
		lighter: .1,
		crate: 10,
		medicine: 1,
		'medicine (expired)': 1,
		weapon: 5,
		tool: 5,
		drugs: 2,
	}

	
	
	//MAP
	static attackable = [6, 7];
	static cell_class = [
		'empty', 
		'filled', 'sewer_exit', 
		'alley_exit', 'street_exit', 
		'trash', 'rat', 
		'human', 'crate',
		'shop'];
	static cell_txt = {
		crate: '&#9644;',
		human: 'h',
		player: '@',
		rat: 'r',
		shop: '$',
		trash: '&#9646;',
		unused_exit: '&#9673;',
		used_exit: '&#9678',		
	};
	static default_loot = { locked: null, searched: false, stuff: [], durability: null  };
	static exit_types = [null, null, 'sewer', 'alley', 'street'];
	static exits_to = {
		alley: [2, 4], sewer: [2, 3], street: [3, 4],
	}	
	static homeless_cent = {
		alley: 60,
		sewer: 90,
		street: 10,		
	}
	static max_num_of_humans = {
		alley: 2, 
		street: 5,
		sewer: 1,
	}
	static max_num_of_items_in_trash = 3;
	static max_num_of_rats = {
		alley: 1, 
		street: 0, 
		sewer: 10,
	}	
	static max_x = 25;
	static max_y = 20;
	static num_of_exits = {
		alley: [2, 4],
		sewer: [4, 8],
		street: [2, 2],
	}
	static sociable = [7]; // you should be able to tame rats later

	

	//PLAYER
	static low_stamina_threshold = 25;
	static max_sickness = 100;
	static stamina_cost = {
		attack: -1,
	}
	static stigma_effects = {
		trash: .2,
		sewer: .1,
	}
	static sickness_effects = {
		sewer: .05,
	}
	


	///SHOP
	static shop_interactions = {
		recycling: ['sell'],
	}
	static shop_names = {
		recycling: "Michael's Recycles",
	}
	static shop_resources = {
		recycling: ['glass bottle', 'aluminum can', 'plastic bottle']
	}
	static max_stigma_for_shop = {
		recycling: 90,
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