class GameMap {
    exits = {};
    grid = [];
    humans = {};
    locations = {
        alley: [],
        sewer: [],
        street: [],

    }
    loot = {};
    rats = {};
    

    constructor(max_x, max_y){
        this.max_x = max_x;
        this.max_y = max_y;
        this.wipe();        
        this.generate_alley();
        this.locations.alley.push(this.grid);
        this.populate_with_trash_cans();
        this.populate_with_rats('alley');
        this.populate_with_humans('alley');
    }

    at (x, y){
        return this.grid[x][y];
    }


    draw(from, to, thickness){
        let delta = {x: to.x - from.x, y: to.y - from.y };
        if (delta.x > 0 ){
            delta.x = 1;
        } else if (delta.x < 0){
            delta.x = -1;
        }
        if (delta.y > 0 ){
            delta.y = 1;
        } else if (delta.y < 0){
            delta.y = -1;
        }
        let start_x = from.x;
        let start_y = from.y;
        while(start_x != to.x){
            start_x += delta.x;
            this.is(start_x, from.y, 1);
            for (let i = 1; i <= thickness; i ++){
                this.is(start_x, from.y + i, 1);
                this.is(start_x, from.y - i, 1);
            }
        }
        while(start_y != to.y){
            start_y += delta.y;                        
            this.is(start_x, start_y, 1);
            for (let i = 1; i <= thickness; i ++){
                this.is(start_x + i, start_y, 1);
                this.is(start_x - i, start_y, 1);
            }
        }
    }

    draw_around(pos_x, pos_y){
        for (let x = pos_x - 1; x <= pos_x + 1; x ++ ){
            for (let y = pos_y - 1; y <= pos_y + 1; y ++ ){
                
                this.is(x, y, 1);
            }
        }
    }
    fetch_border_spot(){
        while(true){
            let open = this.fetch_open();
            if (this.is_on_the_border(open.x, open.y)){
                return open;
            }
        }
    }

    fetch_distance(from_x, from_y, to_x, to_y){
	    return Math.sqrt(Math.pow(from_x - to_x, 2) + Math.pow(from_y - to_y, 2))
    }

    fetch_open(){
        while(true){
            let rand_x = rand_num (0, Config.max_x - 1);
            let rand_y = rand_num (0, Config.max_x - 1);
            if (this.at(rand_x, rand_y) == 1){
                return {x: rand_x, y: rand_y };
            }
        }
    }

    fetch_size(){
        let n = 0;
        for (let x = 0; x < Config.max_x; x ++){
            for (let y = 0; y < Config.max_y; y ++){
                if (this.at(x, y) != null){
                    n ++;
                }
            }
        }
        return n;
    }

    fetch_farthest(point, arr){
        let closest = null;
        let closest_id = null;
        for (let id in arr){           
            let target = arr[id];
            if (point.x == target.x && point.y == target.y){
                continue;
            }
            let distance = this.fetch_distance(point.x, point.y, target.x, target.y);
            if (closest == null || distance > closest){
                closest = distance;
                closest_id = id;
            }
        }
        return arr[closest_id];
    }

    fetch_nearest(point, arr){
        let closest = null;
        let closest_id = null;
        for (let id in arr){           
            let target = arr[id];
            if (point.x == target.x && point.y == target.y){
                continue;
            }
            let distance = this.fetch_distance(point.x, point.y, target.x, target.y);
            if (closest == null || distance < closest){
                closest = distance;
                closest_id = id;
            }
        }
        return arr[closest_id];
    }

    generate_alley(location_type){
        
        let num_of_exits = rand_num (2, 4);
        let exits = this.generate_exits(num_of_exits, Math.round(Config.max_x / 4), Math.round(Config.max_y / 4));
        let starting_here = null;
        
        for (let exit of exits){
            let farthest = this.fetch_farthest(exit, exits);
            this.draw(exit, farthest, 2);
        }
        for (let exit of exits){
            this.draw_around(exit.x, exit.y);
        }
        for (let exit of exits){
            let exit_id = rand_num(2, 4);
            let exit_type = Config.exit_types[exit_id];
            if (exit_type == location_type){
                starting_here = exit;
            }
            this.is(exit.x, exit.y, exit_id);
        }
        if (starting_here == null){
            let last_exit = exits[exits.length - 1];
            starting_here = last_exit;
            let desired_id = Config.exit_types.indexOf(location_type);
            if (desired_id >= 2){
                this.is(last_exit.x, last_exit.y, desired_id);
            }
        }
        this.populate_with_trash_cans();
        return starting_here;
    }

    generate_sewer(location_type){
        
      
        let num_of_exits = rand_num (4, 8);
        let exits = this.generate_exits(num_of_exits, Math.round(Config.max_x / 
            8), Math.round(Config.max_y / 8));
        let starting_here = null;
        
        for (let exit of exits){
            let farthest = this.fetch_farthest(exit, exits);
            this.draw(exit, farthest, 1);
        }
        // Draw around all exits first so no exit gets overwritten by a later draw.
        for (let exit of exits){
            this.draw_around(exit.x, exit.y);
        }
        for (let exit of exits){
            let exit_id = rand_num(2, 3);
            let exit_type = Config.exit_types[exit_id];
            if (exit_type == location_type){
                starting_here = exit;
            }
            this.is(exit.x, exit.y, exit_id);
        }
        if (starting_here == null){
            console.log("solo");
            let last_exit = exits[exits.length - 1];
            starting_here = last_exit;
            let desired_id = Config.exit_types.indexOf(location_type);
            if (desired_id >= 2){
                this.is(last_exit.x, last_exit.y, desired_id);
            }
        }
        return starting_here;
    }

    generate_street(location_type){
        let num_of_exits = 2;
        let exits = this.generate_exits(num_of_exits, Math.round(Config.max_x / 4), Math.round(Config.max_y / 4));        
        let starting_here = null;
        for (let exit of exits){
            let farthest = this.fetch_farthest(exit, exits);
            this.draw(exit, farthest, 7);
        }
        if (rand_num(1, 2) == 1){
            exits.pop();
        }

        for (let exit of exits){
            this.draw_around(exit.x, exit.y);
        }
        for (let exit of exits){
            let exit_id = rand_num(3, 4);
            let exit_type = Config.exit_types[exit_id];
            if (exit_type == location_type){
                starting_here = exit;
            }
            this.is(exit.x, exit.y, exit_id);
        }
        if (starting_here == null){
            console.log("solo");
            let last_exit = exits[exits.length - 1];
            starting_here = last_exit;
            let desired_id = Config.exit_types.indexOf(location_type);
            if (desired_id >= 2){
                this.is(last_exit.x, last_exit.y, desired_id);
            }
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

    is_item_here(name, from){
        console.log(name, from);
        if (this.loot[from] == undefined){
            return false;
        }
        for (let item of this.loot[from]){
            if (item.name == name){
                return true;
            }
        }
        return false;

    }

    is_on_the_border(pos_x, pos_y){
        for (let x = pos_x -1; x <= pos_x + 1; x ++){
            for (let y = pos_y -1; y <= pos_y + 1; y ++){
                if (!this.is_valid(x, y) || (x == pos_x && y == pos_y)){
                    continue;
                }
                if (this.at(x, y) == null){
                    return true;
                }
            }    
        }
        return false;

    }

    is (x, y, what){
        if (!this.is_valid(x, y)){
            return;
        }
        this.grid[x][y] = what;
    }
    
      is_orthogonal(x1, y1, x2, y2){
        return (x1 == x2 && y1 != y2) || (x1 != x2 && y1 == y2);
    }

    is_valid(x, y){
        return x >= 0 && x < Config.max_x && y >=0 && y < Config.max_y;
    }

    load(location_type, id){
        this.grid = this.locations[location_type][id];
    }
    populate_with_humans(location_type){
        let num_of_humans = rand_num(0, Config.max_num_of_humans[location_type]);
        for (let i = 0; i < num_of_humans; i ++){
            let open = this.fetch_open();
            this.is(open.x, open.y, 7);
        }
    }
    populate_with_rats(location_type){
        let num_of_rats = rand_num(0, Config.max_num_of_rats[location_type]);
        for (let i = 0; i < num_of_rats; i ++){
            let open = this.fetch_open();
            this.is(open.x, open.y, 6);
        }
        
    }

    populate_with_trash_cans(){
        let size = this.fetch_size();
        let num_of_trash_cans = Math.round(size * .05);
        for (let i = 0; i < num_of_trash_cans; i ++){
            let border = this.fetch_border_spot();
            this.is(border.x, border.y, 5);
        }
    }

    stack_items(name, n, from){
        for (let item of this.loot[from]){
            if (item.name == name){
                item.quantity += n;
            }
        }
    }


    wipe(){
        this.grid = [];
        for (let x = 0; x < this.max_x; x ++){
            this.grid[x] = [];
            for (let y = 0; y < this.max_y; y ++){
                this.grid[x][y] = null;            
            }    
        }
    }
}
