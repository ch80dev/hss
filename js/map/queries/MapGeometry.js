class MapGeometry{

    constructor(map){
        this.map = map;
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

    fetch_size(){
        let n = 0;
        for (let x = 0; x < MapConfig.max_x; x ++){
            for (let y = 0; y < MapConfig.max_y; y ++){
                if (this.map.get.at(x, y) != null){
                    n ++;
                }
            }
        }
        return n;
    }

        is_orthogonal(x1, y1, x2, y2){
        return (x1 == x2 && y1 != y2) || (x1 != x2 && y1 == y2);
    }

    invert_delta(delta){
        delta.x *= -1;
        delta.y *= -1;
        return delta;
    }

    is_valid(x, y){
        return x >= 0 && x < MapConfig.max_x && y >=0 && y < MapConfig.max_y;
    }
}