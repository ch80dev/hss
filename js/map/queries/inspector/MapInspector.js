class MapInspector{
    //handles looking at specific coordinates and telling you what is physically there (loot, light, shops, neighbors)
    constructor(map){
        this.map = map;
        this.entity = new EntityInspector(map);
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



    fetch_border_spot(orthogonal){
        while(true){
            let open = this.fetch_open(false);            
            if (this.is_on_the_border(open.x, open.y, orthogonal)){
                return open;
            }
        }
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
    


    fetch_open(clear){
        while(true){
            let rand_x = rand_num (0, MapConfig.max_x - 1);
            let rand_y = rand_num (0, MapConfig.max_x - 1);
            if (clear && !this.is_clear(rand_x, rand_y))
            if (this.map.get.at(rand_x, rand_y) == 1){
                return {x: rand_x, y: rand_y };
            }
        }
    }
    
    fetch_open_with_distance(x, y, target_distance){
        
        while(true){
            let open = this.fetch_open(false)
            let distance = this.map.get.geometry.fetch_distance(x, y, open.x, open.y );
            if (distance == target_distance ){
                return open;
            }
        }
        
    }





    has_line_of_sight(x0, y0, x1, y1) { //AI
        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);

        let sx = (x0 < x1) ? 1 : -1;
        let sy = (y0 < y1) ? 1 : -1;

        let err = dx - dy;

        while (true) {
            // Skip the starting tile (player position)
            if (!(x0 === x1 && y0 === y1)) {
                if (this.is_wall(x0, y0)) return false;
            }

            if (x0 === x1 && y0 === y1) break;

            let e2 = 2 * err;

            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }

            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }

        return true;
    }

    is_clear(pos_x, pos_y){
        for (let x = pos_x - 1; x <= pos_x + 1; x ++ ){
            for (let y = pos_y - 1; y <= pos_y + 1; y ++ ){
                if (x == pos_x && y == pos_y){
                    continue;
                }
                if (!this.map.get.geometry.is_valid(x, y) || this.map.get.at(x, y) != 1){
                    return false;
                }
            }   
        }
        return true;
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

    is_wall(x, y){ //AI
        return this.map.get.at(x, y) == null;
    }

}