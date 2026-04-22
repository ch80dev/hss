class MapPopulator{
    constructor(map){
        this.map = map;
    }

    fill_trash(id, x, y){
        let already_found = [];
        let type = 'trash';
        let rand_for_type = rand_num(1, 10);
        let rand_for_locked = rand_num(1, 10);
        let num_of_items = rand_num(1, MapConfig.max_num_of_items_in_trash);            
        let is_it_locked = rand_for_locked < 4;
        if (rand_for_type <= 2){
            is_it_locked <= 1;
            type = 'recycling';
        } else if (rand_for_type >= 9){
            num_of_items *= 2;
            is_it_locked <= 7;
            type = 'dumpster';
        }
        
        
        let found = [];    
        
        for (let i = 0; i < num_of_items; i ++){            
            let durability = rand_num(10, 100);
            let item = this.generate_item_from_trash(type == 'recycling');
            if (item == undefined){
                console.log('BUG', item);
            }
            if (item == 'food'){
                item = ItemConfig.food_in_trash[rand_num(0, ItemConfig.food_in_trash.length - 1)];
                durability = rand_num(5, ItemConfig.food_spoilage[item]);
            }else if (item == 'food-spoiled'){
                durability = 0;
                item = Object.keys(ItemConfig.food_gain)[rand_num(0, Object.keys(ItemConfig.food_gain).length - 1)];
            }
            if (item == undefined){
                console.log('BUG', item);
            }
            let n = 1;
            if(already_found.includes(item)){
                continue;
            }
            already_found.push(item);
            if (ItemConfig.recyclables.includes(item)){
                n = rand_num(1, 10);
            }
            if (type == 'dumpster' && ItemConfig.stackable.includes(item)){
                n *= rand_num(1, 2);
            } else if (type == 'recycling' && ItemConfig.stackable.includes(item)){
                n *= rand_num(2, 3);
            }
            found.push({ name: item, quantity: n, durability: durability, id: this.map.next_id() });
            
        }
        const key = `alley-${id}-${x}-${y}`;
        // Create a fresh loot object per trash can to avoid shared state.
        this.map.loot[key] = {
            durability: null,
            locked: null,
            searched: false,
            stuff: [],            
            type: type,
            
        };
        this.map.loot[key].locked = is_it_locked;
        this.map.loot[key].stuff = found;
        this.map.loot[key].durability = rand_num(50, 100);     
        
    }

    generate_item_from_trash(recycling_only){
        if (recycling_only){
            let rand = rand_num(0, ItemConfig.recyclables.length - 1);
            let rand_recycling = ItemConfig.recyclables[rand];
            if (rand_recycling == undefined){
                console.log('BUG', rand, rand_recycling);
            }
            return rand_recycling;
        }
		let gen_odds = rand_num(1, 100);
		for (let item_name in ItemConfig.trash_item_odds){
			let item_odd= ItemConfig.trash_item_odds[item_name];
            if (item_name == undefined){
                console.log("BUG", item_name);
            }
			if (gen_odds >= item_odd[0] && gen_odds <= item_odd[1] ){
				return item_name;
			}
		}
	}

     
    populate_with_marks(location_type, location_id, x, y){
        let behind = this.map.get.inspector.fetch_behind_shop(x, y);
        let shop = this.map.get.inspector.fetch_shop(x, y);
        this.map.mark(this.map.format_at(location_type, location_id, behind.x, behind.y ), shop.type.substring(0, 1));
    }

    populate_with_trash_cans(id){
        let size = this.map.get.geometry.fetch_size();
        let num_of_trash_cans = rand_num(Math.round(size * .005), Math.round(size * .05));
        for (let i = 0; i < num_of_trash_cans; i ++){
            let border = this.map.get.inspector.fetch_border_spot(true);
            this.map.is(border.x, border.y, 5);
            this.fill_trash(id, border.x, border.y);
        }
        
    }
}
