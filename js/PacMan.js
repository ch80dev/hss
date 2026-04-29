class PacMan {
    guards = [];
    max_x = 15;
    max_y = 15;
    player_at = { x: null, y: null };
    enemies = [
        { x: 0, y: 0, delta: null, },
        //{ x: 0, y: this.max_y - 1, delta: null, },
        //{ x: this.max_x - 1, y: 0, delta: null, },
        { x: this.max_x - 1, y: this.max_y - 1, delta: null, },
    ];
    game_loop = null;
    grid = [];
    num_of_walls = 17;
    num_of_power_ups = 0;
    power_ups = [];
    targeting_player = 0;
    tick = 0;


    constructor(map, player, loop){
        this.map = map; 
        this.player = player;
        this.reset();
        
    }
    at(x, y){
        return this.grid[x][y];
    }


    end_jail(){
        this.player.state.in_pacman_jail = false;
        clearTimeout(this.game_loop);
        this.player.actions.serve_sentence();
    }

    enemies_move(){
        let deltas = [
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: -1, y: 0},
            {x: 0, y: -1},
        ]
        for (let id in  this.enemies){
            let enemy = this.enemies[id];
            let distance_to_player = this.map.get.geometry.fetch_distance(enemy.x, enemy.y, this.player_at.x, this.player_at.y);

            let rand = deltas[rand_num(0, deltas.length - 1)];
            let pos = null;
            let change_targeting = rand_num(1, 16);
            if (change_targeting){
                this.targeting_player = rand_num(0, this.enemies.length - 1);
            }
            if (enemy.delta != null){
                pos = { x: enemy.x + enemy.delta.x, y: enemy.y + enemy.delta.y };
            }
            if (pos != null && this.player_at.x == pos.x && this.player_at.y == pos.y){
                this.lose();
                return;
            }
            if (enemy.delta == null || (enemy.delta != null && (!this.is_valid(pos.x, pos.y) || !this.is_open(pos.x, pos.y)))){
                enemy.delta = rand;
            }

            pos = { x: enemy.x + enemy.delta.x, y: enemy.y + enemy.delta.y };
            let closest = this.fetch_closest_to_player(enemy.x, enemy.y);
            if (distance_to_player == 1 && this.map.get.geometry.is_orthogonal(enemy.x, enemy.y, this.player_at.x, this.player_at.y)){
                this.lose();
                return;
            } else if (closest != null){
                pos = closest;
            } 
            if (this.is_valid(pos.x, pos.y) && this.is_open(pos.x, pos.y)){
                this.grid[enemy.x][enemy.y] = null;

                enemy.x = pos.x;
                enemy.y = pos.y;
                this.grid[enemy.x][enemy.y] = 3;
            }
    
        }
    }



    fetch_open(clear, on_border){
        let n = 0;
        while (n < 500){
            let rand_x = rand_num(0, this.max_x - 1);
            let rand_y = rand_num(0, this.max_y - 1);
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
                    || !this.map.get.geometry.is_orthogonal(x, y, pos_x, pos_y)){
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
            let distance = this.map.get.geometry.fetch_distance(open.x, open.y, this.player_at.x, this.player_at.y);
            if (closest == null || (closest != null && distance < closest)){
                closest = distance;
                spot = open;
            }
        }
        return spot;
    }

    generate_power_ups(){
        for (let x = 0; x < this.max_x - 1; x ++){
            for (let y = 0; y < this.max_y - 1; y ++){
                if (x % 2 == 0 && y % 2 == 0 && this.is_open(x, y)){
                    this.power_ups[x][y] = true;
                    this.num_of_power_ups ++;
                }
            }       
        }
    }

    generate_wall(){
        let size = [4, 13];
        let rand_size = rand_num(size[0], size[1]);
        let start = this.fetch_open(true, false);
        if (start == null){
            return;
        }
        let wall = [start];
        let n = 0;        
        while (wall.length < rand_size && n < 100){
            let rand = wall[rand_num(0, wall.length - 1)];
            let orthogonal_open = this.fetch_orthogonal(rand.x, rand.y);
            let rand_open = orthogonal_open[rand_num(0, orthogonal_open.length - 1)];
            let touching = this.is_touching(rand_open.x, rand_open.y);
            if ((rand_num(1, 2) == 1 && this.is_on_border(rand_open.x, rand_open.y)) || (touching.length >0 && !this.is_pos_in_arr(rand_open, touching) )){
                n ++;
                continue;
            }
            wall.push(rand_open);

        }
        if (wall.length >= rand_size){
            for (let spot of wall){
                this.grid[spot.x][spot.y] = 1;
            }
        }
        
        if (n < 100){
            
            this.generate_wall();
        }
    }

    generate_walls(){

        for (let i = 0; i < this.num_of_walls; i ++){
            this.generate_wall();
        }
    }

    go(pos){
    
        this.grid[this.player_at.x][this.player_at.y] = null;
        this.player_at.x = pos.x;
        this.player_at.y = pos.y
        this.grid[pos.x][pos.y] = 2;

    }

    guard_sees(pos_x, pos_y){
        for (let guard of this.guards){
            if (this.has_line_of_sight(pos_x, pos_y, guard.x, guard.y)){
                return true;
            }
        }
        return false;
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
        return (x == 0 || y == 0 || x == this.max_x -1 || y == this.max_y - 1);
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
        return x >= 0 && x <= this.max_x - 1 
            && y >= 0 && y <= this.max_y - 1;
    }

    lose(){
        this.player.status.change_health(-25);
        this.end_jail();
    }

    move(where){
        let directions = {
            up: { x: 0, y: -1 },
            right: { x: 1, y: 0 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
        };
        let pos = {x : this.player_at.x + directions[where].x, y: this.player_at.y + directions[where].y};
        if (this.is_valid(pos.x, pos.y) && this.at(pos.x, pos.y) == 3){
            this.lose();
            return;
        }
        if (this.is_valid(pos.x, pos.y) && this.is_open(pos.x, pos.y)){
            this.go(pos);
        }
        if (this.power_ups[this.player_at.x][this.player_at.y]){
            

            this.power_ups[this.player_at.x][this.player_at.y] --;
            this.num_of_power_ups --;

            if (this.num_of_power_ups < 1){
                this.win();
            }
        }
    }

    place_entities(){
        for (let enemy of this.enemies){
            this.grid[enemy.x][enemy.y] = 3;
        }
        this.guards = [];
        for (let i = 0; i < 2; i ++){
            let spot = this.fetch_open(false);
            this.guards.push(spot);
            this.grid[spot.x][spot.y] = 4;    
        }
        this.grid[this.player_at.x][this.player_at.y] = 2;
    }


    start(){
        this.game_loop = setInterval(loop.go, Config.loop_interval_timing);
    }

    reset(){
        for (let x = 0; x < this.max_x; x ++){
            if (this.grid[x] == undefined){
                this.grid.push([]);
            }
            if (this.power_ups[x] == undefined){
                this.power_ups.push([]);
            }
            for (let y = 0; y < this.max_y; y ++){
                this.grid[x][y] = null;
                this.power_ups[x][y] = false;
            }       
        }
        this.player_at.x = Math.round(this.max_x / 2);
        this.player_at.y = Math.round(this.max_y / 2);
        this.place_entities();        
        this.generate_wall();
        this.generate_power_ups();
    }

    win(){
       this.end_jail();
    }
}