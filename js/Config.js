class Config {
	static exit_types = [null, null, 'sewer', 'alley', 'street'];
	static food_gain = [10, 30];
	static loop_interval_timing = 1000;
	static max_num_of_items_in_trash = 3;
	static max_sickness = 100;
	static max_x = 45;
	static max_y = 25;
	static medicine_gain = [10, 100];
	static degradable = ['weapon', 'tool'];
	static stackable = ['recyclables', 'food', 'food (spoiled)', 'fuel', 'medicine', 'medicine (expired)', 'drugs', 'money'];
	static usable = ['crate', 'food', 'food (spoiled)', 'medicine', 'medicine (expired)'];

	static spoiled_sick_gain = [1, 50];
	static max_num_of_humans = {
		alley: 3, 
		street: 10,
		sewer: 1,
	}
	static max_num_of_rats = {
		alley: 3, 
		street: 0, 
		sewer: 10,
	}

	
	static trash_item_odds = {		
		recyclables: [1, 40],
		'food (spoiled)': [41, 58],
		food: [59, 60],
		fuel: [61, 70],
		lighter: [71, 80],
		crate: [81, 90],
		medicine: [91, 92],
		'medicine (expired)': [93, 93],
		weapon: [94, 96],
		tool: [97, 99],
		drugs: [100, 100],		
	}

	static weights = {
		money: 0,
		recyclables: .1,
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

}