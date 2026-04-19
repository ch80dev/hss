class ItemConfig {
	static audit(){
		const config_class = new this();
		const mistakes = Object.getOwnPropertyNames(config_class).filter(p => p !== 'constructor');
		if (mistakes.length > 0){
			console.log(mistakes);
		}		
	}
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
		tool: [94, 97],
		flashlight: [98, 98],
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
}