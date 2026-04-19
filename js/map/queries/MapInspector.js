class MapInspector{
    //handles looking at specific coordinates and telling you what is physically there (loot, light, shops, neighbors)
    constructor(map){
        this.map = map;
    }
    fetch_adjacent(pos_x, pos_y, what, orthogonal){
        let adjacent = [];
        for (let x = pos_x - 1; x <= pos_x + 1; x ++){
            for (let y = pos_y - 1; y <= pos_y + 1; y ++){
                if (!this.map.get.geometry.is_valid(x, y) || (x == pos_x && y == pos_y)){
                    continue;
                }
                if (orthogonal && !this.map.get.geometry.is_orthogonal(x, y, pos_x, pos_y)){
                    continue;
                }
                if ((what != null && this.map.get.at(x, y) == null) || this.map.get.at(x, y) != what){
                    continue;
                }
                adjacent.push({ x: x, y: y });
            }
        }
        return adjacent;
    }

    fetch_behind_shop(pos_x, pos_y){
        let open = this.fetch_adjacent(pos_x, pos_y, 1, true)[0];
        let delta = this.map.get.geometry.fetch_delta( pos_x, pos_y, open.x, open.y,);
        let center_delta = this.map.get.geometry.fetch_delta( Math.round(MapConfig.max_x / 2), Math.round(MapConfig.max_y / 2), pos_x, pos_y);
        let spot = { x: pos_x + delta.x, y: pos_y + delta.y };
        return spot;        
    }

    fetch_border_spot(orthogonal){
        while(true){
            let open = this.fetch_open();            
            if (this.is_on_the_border(open.x, open.y, orthogonal)){
                return open;
            }
        }
    }

    fetch_exit(from, to){
        
        for (let enter in this.map.exits){
            let exit = this.map.exits[enter];
            if (from == `${enter.split("-")[0]}-${enter.split('-')[1]}` 
                && to == `${exit.split("-")[0]}-${exit.split('-')[1]}`){
                return enter;
            }

        }
        return null;
    }
    fetch_farthest(point, arr){
        let closest = null;
        let closest_id = null;
        for (let id in arr){           
            let target = arr[id];
            if (point.x == target.x && point.y == target.y){
                continue;
            }
            let distance = this.map.get.geometry.fetch_distance(point.x, point.y, target.x, target.y);
            if (closest == null || distance > closest){
                closest = distance;
                closest_id = id;
            }
        }
        return arr[closest_id];
    }


    
    fetch_loot(at, id){
        for (let item of this.map.loot[at].stuff){
            if (item.id == id){
                return item;
            }
        }
        console.log('error');
        return null;
    }



    fetch_mark(location_type, location_id, x, y){
        let at = this.map.format_at(location_type, location_id, x, y);
        
        if (this.map.marks[at] == undefined){
            return null;
        }
        return this.map.marks[at];
    }

    fetch_open(){
        while(true){
            let rand_x = rand_num (0, MapConfig.max_x - 1);
            let rand_y = rand_num (0, MapConfig.max_x - 1);
            if (this.map.get.at(rand_x, rand_y) == 1){
                return {x: rand_x, y: rand_y };
            }
        }
    }
    
    fetch_open_with_distance(x, y, target_distance){
        
        while(true){
            let open = this.fetch_open()
            let distance = this.map.get.geometry.fetch_distance(x, y, open.x, open.y );
            if (distance == target_distance ){
                return open;
            }
        }
        
    }

    fetch_shop(x, y){
        //this needs location data
        for (let id in this.map.shops){
            let shop = this.map.shops[id];
            if (shop.x == x && shop.y == y){
                return shop;
            }
        }
        return null;
    }

    fetch_unused_exit(target_location_type, location){
        let exits = [];
        for (let x = 0; x < MapConfig.max_x; x ++){
            for (let y = 0; y < MapConfig.max_y; y ++){
                let at = this.map.locations[location.type][location.id][x][y];
                if (at != null){
                   // console.log(location_type, location_id, this.map.get.at(x, y), MapConfig.cell_class.indexOf(location_type + "_exit"), this.have_they_used_this_exit(location_type, location_id, x, y));
                }
                
                if (at == MapConfig.cell_class.indexOf(target_location_type + "_exit")                    
                    && !this.have_they_used_this_exit(location.type, location.id, x, y)){
                    
                    exits.push({ x: x, y: y});
                }
            }
        }
        if (exits.length < 1){
            return null;
        }
        return exits[rand_num(0, exits.length - 1)];
        
    }


    have_they_used_this_exit(location_type, location_id, x, y){        
        let from = this.map.format_at(location_type, location_id, x, y);
        return (this.map.exits[from] != undefined);
    }

     is_in_the_light(location_type, location_id, x, y){
        //console.log(location_type, location_id, x, y);
        if (location_type == 'sewer'){
            return false;
        }
        for (let light of this.map.lights[location_type][location_id]){
            let distance = this.map.get.geometry.fetch_distance(x, y, light.x, light.y );
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

        //local
    is_on_the_border(pos_x, pos_y, orthogonal){
        for (let x = pos_x -1; x <= pos_x + 1; x ++){
            for (let y = pos_y -1; y <= pos_y + 1; y ++){
                if (!this.map.get.geometry.is_valid(x, y) || (x == pos_x && y == pos_y) ){
                    continue;
                }
                if (this.map.get.at(x, y) == null && (!orthogonal || (orthogonal && this.map.get.geometry.is_orthogonal(x, y, pos_x, pos_y)))){
                    return true;
                }
            }    
        }
        return false;

    }


    search_for_food(pos_x, pos_y, range){
        for (let x = pos_x - range; x <= pos_x + range; x ++){
            for (let y = pos_y - range; y <= pos_y + range; y ++){                
                if (this.map.loot[`${this.map.location.type}-${this.map.location.id}-${x}-${y}`] == undefined){
                    continue;
                }                
                for (let item of this.map.loot[`${this.map.location.type}-${this.map.location.id}-${x}-${y}`].stuff){
                    if (item.name == 'food' || item.name == 'food (spoiled)'){
                        return this.map.get.geometry.fetch_delta(x, y, pos_x, pos_y);
                    }
                }

            }    
        }
        return {x: 0, y: 0}; 
    }
}