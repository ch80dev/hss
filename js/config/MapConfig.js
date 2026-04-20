class MapConfig {
	static audit(){
		const config_class = new this();
		const mistakes = Object.getOwnPropertyNames(config_class).filter(p => p !== 'constructor');
		if (mistakes.length > 0){
			console.log(mistakes);
		}		
	}
    static attackable = [6, 7];
	static cell_class = [
		'empty', 
		'filled', 'sewer_exit', 
		'alley_exit', 'street_exit', 
		'trash', 'rat', 
		'human', 'crate',
		'shop', 'tent'];
	static cell_txt = {
		crate: '&#9644;',
		dumpster: '&#9644;',
		human: 'h',
		player: '@',
		rat: 'r',
		recycling: '&#9646;',
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
	
}