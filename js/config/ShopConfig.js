class ShopConfig {
    static audit(){
		const config_class = new this();
		const mistakes = Object.getOwnPropertyNames(config_class).filter(p => p !== 'constructor');
		if (mistakes.length > 0){
			console.log(mistakes);
		}		
	}
	static homeless_out = 6;
	static homeless_check_in = [12, 18];
	static just_buying = ['food', 'grocery', 'hardware', 'sports'];
    	///SHOP
	static max_stigma = {
		food: 50,
		grocery: 25,
		hardware: 75,
		homeless: 101,
		motel: 50,
		pawn: 75,
		recycling: 90,
		sports: 40,
	}	
	static motel_room_cost = 50;
	static num_of_items_in_pawn_shop = 4;

	static names = {
		food: "Demici's!",
		grocery: 'Hughes Market',
		hardware: 'Hootie & The Hardware Store',
		homeless: 'Blessed Beds',
		motel: 'Motel Hex',
		pawn: "Polly's Pawn Shop",
		recycling: "Michael's Recycles",
		sports: 'Sports, Sports, Sports!',
	}
	static resources = {
		food: ["burger", "burrito", "fries", "pizza", "taco",],
		grocery: ["candy", "chips", "cookie", "sandwich"],
		hardware: ['flashlight', 'screw driver', 'wrench','crow bar','bolt cutters',  'knife', 'lantern', 'hatchet', 'machete', 'pipe'],
		homeless: null,
		motel: null, 
		pawn: ['bat', 'knife', 'hatchet', 'machete', 'screw driver', 'wrench', 'crow bar', 'bolt cutters'],
		recycling: ['glass bottle', 'aluminum can', 'plastic bottle'],
		sports: ['bat', 'knife', 'machete', 'lantern', 'flashlight', 'tent', 'sleeping bag']
	}
}