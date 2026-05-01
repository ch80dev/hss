class ItemConfig {
	static audit(){
		const config_class = new this();
		const mistakes = Object.getOwnPropertyNames(config_class).filter(p => p !== 'constructor');
		if (mistakes.length > 0){
			console.log(mistakes);
		}		
		for (let item of Object.keys(this.prices)){
			if (this.weights[item] == undefined){
				console.log('NaN weight', item);
			}
		}
		

	}
	static bags = ['plastic bag'];
	static bags_durability_uses = {
		'plastic bag': 1,
	}
	static bags_slots = {
		'plastic bag': 10,
	}
    static degradable = ['plastic bag', 'pipe', 'bat', 'flashlight', 'knife', 'hatchet', 'lantern', 'machete','lighter',  
		'screw driver', 'wrench','crow bar','bolt cutters', 'tent', 'sleeping bag', 'food', 'food-spoiled'];
	static equipable = ['plastic bag', 'pipe', 'bat', 'flashlight', 'knife', 'hatchet', 'lantern', 'machete', 'screw driver', 'wrench','crow bar','bolt cutters'];
	static food_in_trash = ['chips', 'sandwich', 'cookie', 'candy'];
	static food_gain = {
		burger: 21,
		burrito: 30,
		candy: 6,
		chips: 11,
		cookie: 6,
		fries: 15,
		pizza: 13,
		sandwich: 17,
		taco: 9,
	}
	static food_spoilage = {
		burger: 25,
		burrito: 25,
		candy: 100,
		chips: 100,
		cookie: 100,
		fries: 25,
		pizza: 45,
		sandwich: 50,
		taco: 40,
		
	}
	static human_items = ['crate', 'drugs', 'medicine', 'medicine (expired)', 'aluminum can', 'flashlight', 'glass bottle', 'plastic bottle', 'screw driver', 'wrench','crow bar','bolt cutters', 'bat', 'knife', 'lantern', 'hatchet', 'machete'];
	static light_durability_uses = {
		flashlight: .5,
		lantern: .25,
	}
	static lights = ['flashlight', 'lantern'];
	static meat = {
		human: 100,
		rat: 1,
	}
	static medicine_gain = [10, 100];	
	static prices = {
		'aluminum can': .05,
		bat: 10, 
		'bolt cutters': 120,
		burger: 5,
		burrito: 6,
		candy: 2,
		chips: 1,
		cookie: 1,
		crate: 8,
		'crow bar': 60,
		drugs: 50,		
		flashlight: 5,		
		fries: 3,
		fuel: 4,
		'glass bottle': .05,
		hatchet: 25, 
		knife: 15, 
		lantern: 15,
		lighter: 2, 
		machete: 40,
		medicine: 15,		
		'medicine (expired)': 2, 
		pizza: 4,
		'plastic bottle': .05,
		'plastic bag': .05, 
		pipe: 2, //cant sell only buy
		sandwich: 4,
		'screw driver': 5,
		taco: 2,
		wrench: 12,
		tent: 20,
		'sleeping bag': 10,
	}	
	static recyclables = ['aluminum can', 'glass bottle', 'plastic bottle'];
	static spoiled_sick_gain = [1, 50];
	static stackable = ['aluminum can', 'glass bottle', 'plastic bottle', 'medicine', 'medicine (expired)', 'drugs'];
	static tool_durability_uses = {
		'screw driver': 10,
		wrench: 5,
		'crow bar': .5,
		'bolt cutters': .25,
	}
	static trash_items = {
		'plastic bottle': 40,	
		'glass bottle': 40,
		'aluminum can': 40,
		'food-spoiled': 18,
		'plastic bag': 10,
		'medicine (expired)': 10,		
		crate: 5,
		'screw driver': 5,
		'sleeping bag': 2,
		flashlight: 2,
		food: 2,		
		medicine: 2,
		tent: 1,
		lantern: 1,
		pipe: 1,
		drugs: 1,		
	}
	
	static usable = ['crate',  'medicine', 'medicine (expired)', "burger", "burrito", "candy", "chips", "cookie", "fries", "pizza",	"sandwich", "taco", 'tent', 'sleeping bag', 'tent (placed)'];	
	static weapon_bleed = {
		knife: 2,
		hatchet: 3,
		machete: 4,
	}	
	static weapon_dmgs = {
		bat: 4, 
		knife: 10, 
		hatchet: 12, 
		machete: 16,
		pipe: 6,
		'screw driver': 2,
		wrench: 3,
		'crow bar': 5,
		'bolt cutters': 4,
	};
	static weapon_durability_uses = {
		bat: 1, 
		knife: 2, 
		hatchet: 1.5, 
		machete: 1,
		pipe: .5,
		'screw driver': 5,
		wrench: 4,
		'crow bar': 3,
		'bolt cutters': 2,
	}
	static weights = {
		'aluminum can': .03,
		'glass bottle': .5,
		'plastic bottle': .05,		
		fuel: 2,
		lighter: .1,
		crate: 10,
		medicine: 1,
		'medicine (expired)': 1,		
		drugs: 2,
		bat: 2.5, 
		flashlight: 2,
		knife: .5, 
		hatchet: 3, 
		machete: 2,
		pipe: 3,
		'raw meat (human)': .5,
		'raw meat (rat)': .5,
		lantern: 3,
		'screw driver': .5,
		wrench: 1.5,
		'crow bar': 5,
		'bolt cutters': 7,
		burger: 1,
		burrito: 1,
		candy: .25,
		chips: .25,
		cookie: .25,
		fries: .25,
		pizza: .5,
		'plastic bag': .25, 
		sandwich: .5,
		taco: .5,
		'sleeping bag': 5,
		tent: 10,
		
	}    
}