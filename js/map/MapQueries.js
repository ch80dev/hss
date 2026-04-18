class MapQueries{
    constructor(map){
        this.map = map;
    }
    at (x, y){
        return this.map.grid[x][y];
    }
    fetch_adjacent(pos_x, pos_y, what, orthogonal){
        let adjacent = [];
        for (let x = pos_x - 1; x <= pos_x + 1; x ++){
            for (let y = pos_y - 1; y <= pos_y + 1; y ++){
                if (!this.is_valid(x, y) || (x == pos_x && y == pos_y)){
                    continue;
                }
                if (orthogonal && !this.is_orthogonal(x, y, pos_x, pos_y)){
                    continue;
                }
                if ((what != null && this.at(x, y) == null) || this.at(x, y) != what){
                    continue;
                }
                adjacent.push({ x: x, y: y });
            }
        }
        return adjacent;
    }

    fetch_all_exits_here(location){
        let exits = [];
        for (let exit in this.map.exits){
            let location_type = exit.split("-")[0];
            let location_id = Number(exit.split("-")[1]);
            if (exits.includes(exit)){
                console.log('how?');
            } else if (location_type == location.type && location_id == location.id){
                exits.push(exit);
            }
        }
        return exits;
    }

    fetch_all_locations_leading_here(location){
        //console.log(location);
        let locations = [location];
        for (let exit in this.map.exits){
            let to_exit = this.map.exits[exit];
            let location_type = exit.split("-")[0];
            let location_id = exit.split("-")[1];
            if (location_type == location.type && location_id == location.id){
                locations.push({ type: to_exit.split('-')[0], id: Number(to_exit.split('-')[1]) });
            }
        }
        return locations;
    }

    fetch_border_spot(orthogonal){
        while(true){
            let open = this.fetch_open();            
            if (this.is_on_the_border(open.x, open.y, orthogonal)){
                return open;
            }
        }
    }

    fetch_delta(x1, y1, x2, y2){
        let delta = {x: x1 - x2, y: y1 - y2 };
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
        return delta;
    }

    fetch_distance(from_x, from_y, to_x, to_y){
	    return Math.sqrt(Math.pow(from_x - to_x, 2) + Math.pow(from_y - to_y, 2))
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

    fetch_mark(location_type, location_id, x, y){
        let at = this.map.format_at(location_type, location_id, x, y);
        
        if (this.map.marks[at] == undefined){
            return null;
        }
        return this.map.marks[at];
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

    fetch_open(){
        while(true){
            let rand_x = rand_num (0, Config.max_x - 1);
            let rand_y = rand_num (0, Config.max_x - 1);
            if (this.at(rand_x, rand_y) == 1){
                return {x: rand_x, y: rand_y };
            }
        }
    }
    
    fetch_open_with_distance(x, y, target_distance){
        
        while(true){
            let open = this.fetch_open()
            let distance = this.fetch_distance(x, y, open.x, open.y );
            if (distance == target_distance ){
                return open;
            }
        }
        
    }



    fetch_shop(x, y){
        for (let id in this.map.shops){
            let shop = this.map.shops[id];
            if (shop.x == x && shop.y == y){
                return shop;
            }
        }
        return null;
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


    find_midway(location1, location2, searching){
        //console.log('find midway', location1, location2, searching);
        let available_locations1 = this.fetch_all_locations_leading_here(location1)
        let available_locations2 = this.fetch_all_locations_leading_here(location2)
        let found = false;
        //console.log(available_locations1, available_locations2);
        for (let here of available_locations1){
            for (let there of available_locations2){
                if (here.type == there.type && here.id == there.id){
                    found = here;
                }
            }
        }
        
        if (found !== false){
            return found;
        }
        
        let this_search = [...available_locations1, ...available_locations2];
        //console.log('no midway found', searching, this_search, available_locations1.length, available_locations2.length);
        if (searching != null){
            for (let here of searching){
                for (let there of this_search){
                    if (here.type == there.type && here.id == there.id){
                        found = here;
                    }
                }
            }
        }
        if (found !== false){
            return found;
        }

        if (searching != null){
            searching = [...searching, ...this_search];
        } else {
            searching = this_search;
        }
        
        return this.find_midway(location1, location2, searching);


        

    }
    extend_path(path){
        let adding = [];
        let adding_from = {};
        console.log('PATH:', path);
        for (let id in path){
            let first = {type: path[id].split('-')[0], id: path[id].split('-')[1] };
            if (Number(id) + 1 >= path.length){
                break;
            }
            let second = { type: path[Number(id) + 1].split('-')[0], id: path[Number(id) + 1].split('-')[1] };

            //console.log(first, second);
            let midway = this.find_midway(first, second, null);            
            let midway_grep = `${midway.type}-${midway.id}`;
            //console.log(midway_grep, path, adding);
            if (!path.includes(midway_grep) && !adding.includes(midway_grep)){
                console.log(path[id], midway_grep, path, path.includes(midway_grep), adding, adding.includes(midway_grep));
                adding.push(midway_grep);
                adding_from[path[id]] = midway_grep;
            }

        }
        console.log("ADDING", adding_from, "TO", path);
        //console.log('BREAK?', adding, adding_from, path);
        if (adding.length == 0){
            return path;
        }
        let processed = [];
        let new_path = path;
        for (let id in  path){
            new_path.push(path[id]);
            for (let after_this_item in adding_from){
                console.log('splice', path[id] == after_this_item, id, path[id], after_this_item,  adding_from[after_this_item], processed);
                if (path[id] == after_this_item && !processed.includes(after_this_item)){
                    new_path.push(adding_from[after_this_item]);
                    processed.push(after_this_item);
                }
            }

        }
        //console.log('rETURN?', adding, path);
        //path = [...path, ...adding];
        return this.extend_path(new_path);
    }

    fetch_loot(at, id){
        console.log(at, id);
        console.log(this.map.loot[at]);
        for (let item of this.map.loot[at].stuff){
            console.log(item, id);
            if (item.id == id){
                return item;
            }
        }
        console.log('error');
        return null;
    }

    find_path_old(start, end){
        let available_exits1 = this.fetch_all_exits_here(start);
        let available_exits2 = this.fetch_all_exits_here(end);
        let midway = this.find_midway(start, end, null);
        if (midway === false ){
            console.log('error');
            return;
        }
        //console.log(start, midway, end);
        let path = [
            `${start.type}-${start.id}`, 
            `${midway.type}-${midway.id}`, 
            `${end.type}-${end.id}`];
        console.log(this.extend_path(path));
    }

    find_path(start, end) {
        const startStr = `${start.type}-${start.id}`;
        const endStr = `${end.type}-${end.id}`;

        let queue = [start];
        let came_from = {};
        came_from[startStr] = null;

        while (queue.length > 0) {
            let current = queue.shift();
            let currentStr = `${current.type}-${current.id}`;

            // Did we find the destination?
            if (currentStr === endStr) {
                return this.reconstruct_path(came_from, endStr);
            }

            // Get all neighbors (locations leading from here)
            let neighbors = this.fetch_all_locations_leading_here(current);

            for (let next of neighbors) {
                let nextStr = `${next.type}-${next.id}`;

                // If we haven't visited this spot yet, log it and add to queue
                if (!(nextStr in came_from)) {
                    queue.push(next);
                    came_from[nextStr] = currentStr;
                }
            }
        }

        return null; // No path found
    }

    reconstruct_path(came_from, endStr) {
        let current = endStr;
        let path = [];
        
        while (current !== null) {
            path.push(current);
            current = came_from[current];
        }
        
        return path.reverse(); // Flip it so it goes Start -> End
    }
    
    have_they_used_this_exit(location_type, location_id, x, y, map){
        let from = this.map.format_at(location_type, location_id, x, y, map);
        return (map.exits[from] != undefined);
    }

    

    invert_delta(delta){
        delta.x *= -1;
        delta.y *= -1;
        return delta;
    }

    is_in_the_light(location_type, location_id, x, y){
        //console.log(location_type, location_id, x, y);
        if (location_type == 'sewer'){
            return false;
        }
        for (let light of this.map.lights[location_type][location_id]){
            let distance = this.fetch_distance(x, y, light.x, light.y );
            if (distance >= 2 ){
                continue;
            }
            return true;
        }
        return false;
    }

    is_item_here(name, from){
        if (this.map.loot[from] == undefined){
            return false;
        }
        for (let item of this.map.loot[from].stuff){
            if (item.name == name){
                return true;
            }
        }
        return false;

    }

    is_on_the_border(pos_x, pos_y, orthogonal){
        for (let x = pos_x -1; x <= pos_x + 1; x ++){
            for (let y = pos_y -1; y <= pos_y + 1; y ++){
                if (!this.is_valid(x, y) || (x == pos_x && y == pos_y) ){
                    continue;
                }
                if (this.at(x, y) == null && (!orthogonal || (orthogonal && this.is_orthogonal(x, y, pos_x, pos_y)))){
                    return true;
                }
            }    
        }
        return false;

    }

       is_orthogonal(x1, y1, x2, y2){
        return (x1 == x2 && y1 != y2) || (x1 != x2 && y1 == y2);
    }

    is_valid(x, y){
        return x >= 0 && x < Config.max_x && y >=0 && y < Config.max_y;
    }

    search_for_food(pos_x, pos_y, range){
        for (let x = pos_x - range; x <= pos_x + range; x ++){
            for (let y = pos_y - range; y <= pos_y + range; y ++){                
                if (this.map.loot[`${this.map.location.type}-${this.map.location.id}-${x}-${y}`] == undefined){
                    continue;
                }                
                for (let item of this.map.loot[`${this.map.location.type}-${this.map.location.id}-${x}-${y}`].stuff){
                    if (item.name == 'food' || item.name == 'food (spoiled)'){
                        return this.fetch_delta(x, y, pos_x, pos_y);
                    }
                }

            }    
        }
        return {x: 0, y: 0}; 
    }
}