class DefaultConfig{
    static audit(){
		const config_class = new this();
		const mistakes = Object.getOwnPropertyNames(config_class).filter(p => p !== 'constructor');
		if (mistakes.length > 0){
			console.log(mistakes);
		}		
	}
    static interactions = ['work'];
    static shop_type = 'homeless';
	//this needs to be null if not enabled
	static init_inventory = {name: 'sleeping bag', id: 0, quantity: 1, durability: 100 };
	static equip_init_inventory = true;
	
}