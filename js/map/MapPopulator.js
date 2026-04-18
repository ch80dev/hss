class MapPopulator{
    constructor(map){
        this.map = map;
    }

    fill_trash(id, x, y){
        let already_found = [];
        
        let empty_trash = rand_num(1, 2) == 1;
        let num_of_items = rand_num(1, Config.max_num_of_items_in_trash);
        
        if (empty_trash){
            num_of_items = 0;
        }
        let is_it_locked = rand_num(1, 3) == 1 && num_of_items > 0;
        let found = [];    
        for (let i = 0; i < num_of_items; i ++){            
            let item = this.generate_item_from_trash();
            let n = 1;
            if(already_found.includes(item)){
                continue;
            }
            already_found.push(item);
            if (Config.recyclables.includes(item)){
                n = rand_num(1, 10);
            }
            found.push({ name: item, quantity: n, durability: rand_num(10, 100), id: this.map.next_id() });
            
        }
        const key = `alley-${id}-${x}-${y}`;
        // Create a fresh loot object per trash can to avoid shared state.
        this.map.loot[key] = {
            locked: null,
            searched: false,
            stuff: [],
            durability: null,
            
        };
        this.map.loot[key].locked = is_it_locked;
        this.map.loot[key].stuff = found;
        this.map.loot[key].durability = rand_num(50, 100);     
        
    }

    generate_item_from_trash(){
		let gen_odds = rand_num(1, 100);
		for (let item_name in Config.trash_item_odds){
			let item_odd= Config.trash_item_odds[item_name];
			if (gen_odds >= item_odd[0] && gen_odds <= item_odd[1] ){
				return item_name;
			}
		}
	}

     
    

    populate_with_trash_cans(id){
        let size = this.map.queries.fetch_size();
        let num_of_trash_cans = Math.round(size * .05);
        for (let i = 0; i < num_of_trash_cans; i ++){
            let border = this.map.queries.fetch_border_spot(true);
            this.map.is(border.x, border.y, 5);
            this.fill_trash(id, border.x, border.y);
        }
        
    }
}
