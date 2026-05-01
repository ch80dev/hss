class EntityInspector {
    constructor(map){
        this.map = map;
    }

    fetch_behind_shop(pos_x, pos_y){
        let open = this.map.get.inspector.fetch_adjacent(pos_x, pos_y, 1, true)[0];
        let delta = this.map.get.geometry.fetch_delta( pos_x, pos_y, open.x, open.y,);
        let center_delta = this.map.get.geometry.fetch_delta( Math.round(MapConfig.max_x / 2), Math.round(MapConfig.max_y / 2), pos_x, pos_y);
        let spot = { x: pos_x + delta.x, y: pos_y + delta.y };
        return spot;        
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

    

    fetch_num_of_trash(){
        //this only works for the current location
        let n = 0;
        for (let x = 0; x < MapConfig.max_x; x ++){
            for (let y = 0; y < MapConfig.max_y; y ++){
                if (this.map.get.at(x, y) == MapConfig.cell_class.indexOf('trash')){
                    n ++;
                }
            }
        }
        return n;
    }

    fetch_shop(location_type, location_id, x, y){
        //this needs location data
        for (let id in this.map.shops){
            let shop = this.map.shops[id];
            if (shop.x == x && shop.y == y){
                return shop;
            }
        }
        return null;
    }

    fetch_tent(from){
        if (this.map.loot[from] == undefined){
            return null;
        }
        for (let item of this.map.loot[from].stuff){
            if (item.name == 'tent (placed)'){
                return item;
            }
        }
        return null;
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