class Config {
	static audit(){
		const config_class = new this();
		const mistakes = Object.getOwnPropertyNames(config_class).filter(p => p !== 'constructor');
		if (mistakes.length > 0){
			console.log(mistakes);
		}		
	}

	static days_of_the_week = ["Monday", "Tuesday", "Wednesday", "Thursday", 'Friday', "saturday", "Sunday"];
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
	
	


	



	//ITEM
	static degradable = ['pipe', 'bat', 'flashlight', 'knife', 'hatchet', 'lantern', 'machete','lighter',  'tool'];
	static equipable = ['pipe', 'bat', 'flashlight', 'knife', 'hatchet', 'lantern', 'machete', 'tool'];
	static food_gain = [10, 30];
	static human_items = ['crate', 'drugs',  'food', 'food (spoiled)',  'medicine', 'medicine (expired)', 'aluminum can', 'flashlight', 'glass bottle', 'plastic bottle', 'tool', 'bat', 'knife', 'lantern', 'hatchet', 'machete'];
	static meat = {
		human: 100,
		rat: 1,
	}
	static medicine_gain = [10, 100];	
	static prices = {
		'aluminum can': .05,
		crate: 8,
		drugs: 50,
		food: 4, 
		flashlight: 5,
		'food (spoiled)': .5,
		fuel: 4,
		'glass bottle': .05,
		lantern: 15,
		lighter: 2, 
		medicine: 15,		
		'medicine (expired)': 2, 
		'plastic bottle': .05,
		pipe: 2, //not sold
		tool: 25, 
		bat: 10, 
		knife: 15, 
		hatchet: 25, 
		machete: 40,
		
	}	
	static recyclables = ['aluminum can', 'glass bottle', 'plastic bottle'];
	static spoiled_sick_gain = [1, 50];
	static stackable = ['aluminum can', 'glass bottle', 'plastic bottle', 'food', 'food (spoiled)', 'fuel', 'medicine', 'medicine (expired)', 'drugs', 'raw meat (human)', 'raw meat (rat)'];
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
		pipe: [99, 99],
		drugs: [100, 100],		
		//lighter: [71, 80],
	}	
	static usable = ['crate', 'food', 'food (spoiled)', 'medicine', 'medicine (expired)'];		
	static weapon_dmgs = {
		bat: 4, 
		knife: 10, 
		hatchet: 12, 
		machete: 16,
		pipe: 6,
	};
	static weapon_durability_uses = {
		bat: 1, 
		knife: 2, 
		hatchet: 1.5, 
		machete: 1,
		pipe: .5,
	}
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
		tool: 5,
		drugs: 2,
		bat: 2.5, 
		knife: .5, 
		hatchet: 3, 
		machete: 2,
		pipe: 3,
		'raw meat (human)': .5,
		'raw meat (rat)': .5,
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
	static min_num_of_humans = {
		alley: 0,
		street: 1,
		sewer: 0,
	}
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
		sewer: .5,
	}
	static sickness_effects = {
		sewer: .05,
	}
	


	///SHOP
	static max_stigma_for_shop = {
		motel: 50,
		pawn: 75,
		recycling: 90,
	}
	static motel_room_cost = 75;
	static num_of_items_in_pawn_shop = 4;
	static shop_interactions = {
		motel: ['rent room', 'sleep'],
		pawn: ['buy', 'sell'],
		recycling: ['sell'],
	}
	static shop_names = {
		motel: 'Motel Hex',
		pawn: "Polly's Pawn Shop",
		recycling: "Michael's Recycles",
		
	}
	static shop_resources = {
		motel: null, 
		pawn: ['bat', 'knife', 'hatchet', 'machete', 'tool'],
		recycling: ['glass bottle', 'aluminum can', 'plastic bottle']
	}
	static shop_types = ['pawn', 'recycling', 'motel'];
	
	



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