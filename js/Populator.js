class Populator{
    constructor(map, player){
        this.map = map;
        this.player = player;
    }



	with_humans(location_type, location_id, humans){
        let num_of_humans = rand_num(MapConfig.min_num_of_humans[location_type], MapConfig.max_num_of_humans[location_type]);
		let id = humans.length;		
        for (let i = 0; i < num_of_humans; i ++){
            let open = this.map.get.inspector.fetch_open();
            this.map.is(open.x, open.y, 7);
			let are_they_homeless = rand_num(1, 100) <= MapConfig.homeless_cent[location_type];
			humans.push(new Human(id + i, open.x, open.y, are_they_homeless, location_type, location_id, this.map, this.player))
        }
    }

	with_rats(location_type, location_id, rats){        
        let num_of_rats = rand_num(1, MapConfig.max_num_of_rats[location_type]);        
		let id = rats.length;		
        for (let i = 0; i < num_of_rats; i ++){
            let open = this.map.get.inspector.fetch_open();
            this.map.is(open.x, open.y, 6);	
            rats.push(new Rat(id, open.x, open.y, location_type, location_id, this.map, this.player))			
        }
    }

    with_shops(favorites, shops,){
		for (let shop of this.map.shops){
			if (shops[shop.id] != undefined){
				continue;
				
			}
			let favorite = null;
			if (this.map.generator.shop.queue_used){
				let favorite = favorites.set.directions.splice(0, 1)[0]; // amke this into a buffer
				this.map.generator.shop.queue_used = false;		
				favorite.location = shop.location;		
				favorite.type = shop.type;
				favorite.x = shop.x;
				favorite.y = shop.y;
				favorites.set.shop[shop.id] = favorite;
			}
			
			
			shops.push(new Shop(shop.id, shop.type, shop.location, shop.x, shop.y))
		}
	}
}