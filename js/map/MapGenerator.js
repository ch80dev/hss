class MapGenerator {
    first_location_being_generated = true;
    constructor(map){
        this.map = map;
    }
    draw(from, to, thickness){
        let delta = this.map.queries.fetch_delta(to.x, to.y, from.x, from.y);        
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

    generate (location_type, entered_from){
        let divisor = {alley: 4, sewer: 8, street:4}
        let thickness = { alley: 2, sewer: 1, street: 7};
        let num_of_exits = rand_num(Config.num_of_exits[location_type][0], Config.num_of_exits[location_type][1]);
        if (this.first_location_being_generated){
            num_of_exits = Config.num_of_exits[location_type][1];
            this.first_location_being_generated = false;
        }
        let exits = this.generate_exits(num_of_exits, Math.round(Config.max_x / 
            divisor[location_type]), Math.round(Config.max_y / divisor[location_type]));
        let starting_here = null;

        for (let exit of exits){
            let farthest = this.map.queries.fetch_farthest(exit, exits);
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
            let exit_id = rand_num(Config.exits_to[location_type][0], Config.exits_to[location_type][1]);
            if (location_type == 'sewer' &&  num_of_exit_types.sewer > 0){
                exit_id = Config.cell_class.indexOf('alley_exit');
            }
            let exit_type = Config.exit_types[exit_id];            
            if (exit_type == entered_from){
                starting_here = exit;
            } 
            this.map.is(exit.x, exit.y, exit_id);
            num_of_exit_types[exit_type] ++;
        }

        if (starting_here == null && entered_from != null){
            let last_exit = exits[exits.length - 1];
            starting_here = last_exit;
            let desired_id = Config.exit_types.indexOf(entered_from);
            if (desired_id >= 2){
                this.map.is(last_exit.x, last_exit.y, desired_id);
            }
        }
        if (location_type == 'alley'){
            this.map.populator.populate_with_trash_cans(this.map.locations.alley.length);
        }
        let shop_being_generated = rand_num(1, 2) == 1;
        let shop_pos = this.generate_shop();
        if (location_type == 'street' && (shop_being_generated && shop_pos != null)){            
            this.map.shops.push(shop_pos);
            this.map.is(shop_pos.x, shop_pos.y, Config.cell_class.indexOf('shop'));
            //this.map.first_shop = false;
            //console.log(shop_pos, this.map.queries.at(shop_pos.x, shop_pos.y));
        } 
        return starting_here;
    }

    generate_exits(num, min_x, min_y){        
        let exits = [];
        while (exits.length < num){
            let bad = false;
            // rand_num is inclusive; cap at max-1 to stay in-bounds
            let rand_x = rand_num(0, Config.max_x - 1);
            let rand_y = rand_num(0, Config.max_y - 1);
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

    generate_shop(){
        let shop_type = this.generate_shop_type();
        if (shop_type == null){
            return null;
        }
        while(true){
            let rand_x = rand_num(0, Config.max_x - 1);
            let rand_y = rand_num(0, Config.max_y - 1);
            let num_of_open = this.map.queries.fetch_adjacent(rand_x, rand_y, 1, false).length;
            let num_of_null = this.map.queries.fetch_adjacent(rand_x, rand_y, null, false).length;
            if (num_of_open == 3 && num_of_null == 5){
                return { id: this.map.locations.street.length, type: shop_type, x: rand_x, y: rand_y };
            }            
        }
    }

    generate_shop_type(){        
        if (this.map.shops_generated.length >= Config.shop_types.length){
            return null;
        }
        return 'pawn';
        while (true){
            let rand_type = Config.shop_types[rand_num(0, Config.shop_types.length - 1)];
            if (!this.map.shops_generated.includes(rand_type)){
                this.map.shops_generated.push(rand_type);
                return rand_type;    
            }
        }
    }

    generate_street_name(){
        return Config.street_names[rand_num(0, Config.street_names.length - 1)];
    }

}