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

    

    

    invert_delta(delta){
        delta.x *= -1;
        delta.y *= -1;
        return delta;
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
                if (this.map.loot[`${this.map.location_type}-${this.map.location_id}-${x}-${y}`] == undefined){
                    continue;
                }                
                for (let item of this.map.loot[`${this.map.location_type}-${this.map.location_id}-${x}-${y}`].stuff){
                    if (item.name == 'food' || item.name == 'food (spoiled)'){
                        return this.fetch_delta(x, y, pos_x, pos_y);
                    }
                }

            }    
        }
        return {x: 0, y: 0}; 
    }
}