class LocationGenerator {
    first_location_being_generated = true;
    exit_queue = [];
    

    constructor(map){
        this.map = map;
    }
    draw(from, to, thickness){
        let delta = this.map.get.geometry.fetch_delta(to.x, to.y, from.x, from.y);        
        let start_x = from.x;
        let start_y = from.y;
        while(start_x != to.x){
            start_x += delta.x;
            this.map.is(start_x, from.y, 1);
            for (let i = 1; i <= thickness; i ++){
                this.map.is(start_x, from.y + i, 1);
                this.map.is(start_x, from.y - i, 1);
            }
        }
        while(start_y != to.y){
            start_y += delta.y;                        
            this.map.is(start_x, start_y, 1);
            for (let i = 1; i <= thickness; i ++){
                this.map.is(start_x + i, start_y, 1);
                this.map.is(start_x - i, start_y, 1);
            }
        }
    }

    draw_around(pos_x, pos_y){
        for (let x = pos_x - 1; x <= pos_x + 1; x ++ ){
            for (let y = pos_y - 1; y <= pos_y + 1; y ++ ){
                
                this.map.is(x, y, 1);
            }
        }
    }

    

    generate_exits(num, min_x, min_y){        
        let exits = [];
        while (exits.length < num){
            let bad = false;
            // rand_num is inclusive; cap at max-1 to stay in-bounds
            let rand_x = rand_num(0, MapConfig.max_x - 1);
            let rand_y = rand_num(0, MapConfig.max_y - 1);
            for (let exit of exits){
                let x_dist = Math.abs(exit.x - rand_x);
                let y_dist = Math.abs(exit.y - rand_y);
                if (x_dist < min_x && y_dist < min_y){
                    bad = true;
                }                
            }
            if (!bad){
                exits.push({ x: rand_x, y: rand_y });
            }
        }
        return exits;
    }

    generate (location_type, entered_from){
        
        let divisor = {alley: 4, sewer: 8, street:4}
        let thickness = { alley: 2, sewer: 1, street: 7};
        let num_of_exits = rand_num(MapConfig.num_of_exits[location_type][0], MapConfig.num_of_exits[location_type][1]);
        if (this.first_location_being_generated){
            num_of_exits = MapConfig.num_of_exits[location_type][1];
            this.first_location_being_generated = false;
        }
        let exits = this.generate_exits(num_of_exits, Math.round(MapConfig.max_x / 
            divisor[location_type]), Math.round(MapConfig.max_y / divisor[location_type]));
        
        let starting_here = null;

        for (let exit of exits){
            let farthest = this.map.get.inspector.fetch_farthest(exit, exits);
            this.draw(exit, farthest, thickness[location_type]);
        }

        if (location_type == 'street' && rand_num(1, 2) == 1){
            exits.pop();
        }

        for (let exit of exits){
            this.draw_around(exit.x, exit.y);
        }
        let num_of_exit_types = { alley: 0, sewer: 0, street: 0 };
        for (let exit of exits){
            let exit_id = rand_num(MapConfig.exits_to[location_type][0], MapConfig.exits_to[location_type][1]);
            if (this.exit_queue.length > 0){
                exit_id = MapConfig.cell_class.indexOf(this.exit_queue.shift() + '_exit');
            }
            if (location_type == 'sewer' &&  num_of_exit_types.sewer >= 2){
                exit_id = MapConfig.cell_class.indexOf('alley_exit');
            } else if (location_type == 'alley' && num_of_exit_types.street > 0){
                exit_id = rand_num(2, 3);
            }
            let exit_type = MapConfig.exit_types[exit_id];            
            if (exit_type == entered_from){
                starting_here = exit;
            } 
            this.map.is(exit.x, exit.y, exit_id);
            num_of_exit_types[exit_type] ++;
        }
        if (starting_here == null && entered_from != null){
            let last_exit = exits[exits.length - 1];
            starting_here = last_exit;
            let desired_id = MapConfig.exit_types.indexOf(entered_from);
            if (desired_id >= 2){      
                num_of_exit_types[MapConfig.exit_types[this.map.get.at(last_exit.x, last_exit.y)]]--;       
                if (entered_from != null){
                    num_of_exit_types[entered_from] ++;
                }         
                
                this.map.is(last_exit.x, last_exit.y, desired_id);
            }
        }
        if (entered_from != null){
            num_of_exit_types[entered_from] --;
        }
        
        for (let type in num_of_exit_types){
            this.map.unused_exits[type] 
                += num_of_exit_types[type];
        }
        if (location_type == 'alley'){
            this.map.populator.populate_with_trash_cans(this.map.locations.alley.length);
        }
        let shop_being_generated = this.map.generator.shop.queue.length > 0 || rand_num(1, 2) == 1;
        let shop_pos = null;
        if (location_type == 'street'){
            shop_pos = this.map.generator.shop.generate(location_type);
        }
        if (location_type == 'street' && (shop_being_generated && shop_pos != null)){

            this.map.shops.push(shop_pos);
            this.map.is(shop_pos.x, shop_pos.y, MapConfig.cell_class.indexOf('shop'));
            this.map.populator.populate_with_marks('street', this.map.locations.street.length, shop_pos.x, shop_pos.y);           

        } 
        return starting_here;
    }
}
