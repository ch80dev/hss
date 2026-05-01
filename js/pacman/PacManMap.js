class PacManMap {
    constructor(geometry, pacman){
        this.geometry = geometry;
        this.pacman = pacman;
    }
    at(x, y){
        return this.pacman.grid[x][y];
    }

    fetch_open(clear, on_border){
        let n = 0;
        while (n < 500){
            let rand_x = rand_num(0, this.pacman.max_x - 1);
            let rand_y = rand_num(0, this.pacman.max_y - 1);
            let is_open = this.is_open(rand_x, rand_y);
            /*
            if (!on_border ){
                continue;
            }
                */
            if ((is_open && !clear) || (is_open && clear && this.is_clear(rand_x, rand_y))){
                return { x: rand_x, y: rand_y };
            }
            n++;
        }
        return null;

    }
    fetch_orthogonal(pos_x, pos_y){
        let spots = [];
        for (let x = pos_x - 1; x <= pos_x + 1; x ++ ){
            for (let y = pos_y - 1; y <= pos_y + 1; y ++ ){
                if (!this.is_valid(x, y) || !this.is_open(x, y) || (x == pos_x && y == pos_y) 
                    || !this.geometry.is_orthogonal(x, y, pos_x, pos_y)){
                    continue;
                }
                spots.push({ x: x, y: y })
            }    
        }
        return spots;
    }

    fetch_closest_to_player(x, y){
        let orthogonal_open = this.fetch_orthogonal(x, y);
        let closest = null;
        let spot = null;
        for (let open of orthogonal_open){
            let distance = this.geometry.fetch_distance(open.x, open.y, this.pacman.player_at.x, this.pacman.player_at.y);
            if (closest == null || (closest != null && distance < closest)){
                closest = distance;
                spot = open;
            }
        }
        return spot;
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
                if (!this.is_open(x0, y0)) return false;
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
                if (!this.is_valid(x, y) || !this.is_open(x, y)){
                    return false;
                }
            }    
        }
        return true;
    }
 
    is_on_border(x, y){
        return (x == 0 || y == 0 || x == this.pacman.max_x -1 || y == this.pacman.max_y - 1);
    }
    
    is_open(x, y){
        return this.at(x, y) == null;
    }

    is_pos_in_arr(pos, arr){
        for (let spot of arr){
            if (pos.x == spot.x && pos.y == spot.y){
                return true;
            }
        }
        return false;
    }

    is_touching(pos_x, pos_y){
        let touching = [];
        for (let x = pos_x - 1; x <= pos_x + 1; x ++ ){
            for (let y = pos_y - 1; y <= pos_y + 1; y ++ ){
                if (x == pos_x && y == pos_y || !this.is_valid(x, y)){
                    continue;
                }
                if ( !this.is_open(x, y)){
                    touching.push({ x: x, y: y });
                }
            }    
        }
        return touching;
    }

    is_valid(x, y){
        return x >= 0 && x <= this.pacman.max_x - 1 
            && y >= 0 && y <= this.pacman.max_y - 1;
    }
}