class ShopGenerator {
    queue_used = false;
    queue = [];
    constructor(map){
        this.map = map;
    }
     generate(location_type){
        let shop_type = this.generate_shop_type();
        if (shop_type == null){
            return null;
        }
        let n = 0;
        while(n < 100){
            let rand_x = rand_num(0, MapConfig.max_x - 1);
            let rand_y = rand_num(0, MapConfig.max_y - 1);
            let num_of_open = this.map.get.inspector.fetch_adjacent(rand_x, rand_y, 1, false).length;
            let num_of_null = this.map.get.inspector.fetch_adjacent(rand_x, rand_y, null, false).length;
            if (num_of_open == 3 && num_of_null == 5){
                return { id: this.map.locations.street.length , location: {type: location_type, id: this.map.locations[location_type].length }, type: shop_type, x: rand_x, y: rand_y };
            }            
            n ++;
        }
        return null;
    }

    generate_shop_type(){     
        if (this.map.shops_generated.length >= ShopConfig.types.length){
            return null;
        }
        return 'sports';
        if (this.queue.length > 0){
            this.queue_used = true;
            return this.queue.shift();

        }
        while (true){
            let rand_type = ShopConfig.types[rand_num(0, ShopConfig.types.length - 1)];
            if (!this.map.shops_generated.includes(rand_type)){
                this.map.shops_generated.push(rand_type);
                return rand_type;    
            }
        }
    }

    reset_queue(){
        this.queue_used =  false;
		this.queue =  [];
    }
}