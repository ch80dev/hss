class ShopConfig {
    static audit(){
		const config_class = new this();
		const mistakes = Object.getOwnPropertyNames(config_class).filter(p => p !== 'constructor');
		if (mistakes.length > 0){
			console.log(mistakes);
		}		
	}
    	///SHOP
	static max_stigma = {
		motel: 50,
		pawn: 75,
		recycling: 90,
	}
	static motel_room_cost = 75;
	static num_of_items_in_pawn_shop = 4;
	static interactions = {
		motel: ['rent room', 'sleep'],
		pawn: ['buy', 'sell'],
		recycling: ['sell'],
	}
	static names = {
		motel: 'Motel Hex',
		pawn: "Polly's Pawn Shop",
		recycling: "Michael's Recycles",
		
	}
	static resources = {
		motel: null, 
		pawn: ['bat', 'knife', 'hatchet', 'machete', 'tool'],
		recycling: ['glass bottle', 'aluminum can', 'plastic bottle']
	}
	static types = ['pawn', 'recycling', 'motel'];
}