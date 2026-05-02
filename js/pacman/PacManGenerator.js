class PacManGenerator {
    constructor(pacman){
        this.pacman = pacman;
    }
    generate_power_ups(){
        for (let x = 0; x < this.pacman.max_x - 1; x ++){
            for (let y = 0; y < this.pacman.max_y - 1; y ++){
                if (x % 2 == 0 && y % 2 == 0 && this.pacman.map.is_open(x, y)){
                    this.pacman.power_ups[x][y] = true;
                    this.pacman.num_of_power_ups ++;
                }
            }       
        }
    }

    generate_wall(){
        let size = [4, 13];
        let rand_size = rand_num(size[0], size[1]);
        let start = this.pacman.map.fetch_open(true, false);
        if (start == null){
            return;
        }
        let wall = [start];
        let n = 0;        
        while (wall.length < rand_size && n < 100){
            let rand = wall[rand_num(0, wall.length - 1)];
            let orthogonal_open = this.pacman.map.fetch_orthogonal(rand.x, rand.y);
            let rand_open = orthogonal_open[rand_num(0, orthogonal_open.length - 1)];
            let touching = this.pacman.map.is_touching(rand_open.x, rand_open.y);
            if ((rand_num(1, 2) == 1 && this.pacman.map.is_on_border(rand_open.x, rand_open.y)) || (touching.length >0 && !this.pacman.map.is_pos_in_arr(rand_open, touching) )){
                n ++;
                continue;
            }
            wall.push(rand_open);

        }
        if (wall.length >= rand_size){
            for (let spot of wall){
                this.pacman.grid[spot.x][spot.y] = 1;
            }
        }
        
        if (n < 100){
            
            this.generate_wall();
        }
    }

    place_entities(){
        for (let enemy of this.pacman.enemies){
            this.pacman.grid[enemy.x][enemy.y] = 3;
        }
        this.pacman.guards = [];
        for (let i = 0; i < 2; i ++){
            let spot = this.pacman.map.fetch_open(false);
            this.pacman.guards.push(spot);
            this.pacman.grid[spot.x][spot.y] = 4;    
        }
        this.pacman.grid[this.pacman.player_at.x][this.pacman.player_at.y] = 2;
    }

    reset(){
        this.pacman.enemies[0].x = 0;
        this.pacman.enemies[0].y = 0;
        this.pacman.enemies[1].x = this.pacman.max_x - 1;
        this.pacman.enemies[1].y = this.pacman.max_y - 1;
        for (let x = 0; x < this.pacman.max_x; x ++){
            if (this.pacman.grid[x] == undefined){
                this.pacman.grid.push([]);
            }
            if (this.pacman.power_ups[x] == undefined){
                this.pacman.power_ups.push([]);
            }
            for (let y = 0; y < this.pacman.max_y; y ++){
                this.pacman.grid[x][y] = null;
                this.pacman.power_ups[x][y] = false;
            }       
        }
        this.pacman.player_at.x = Math.round(this.pacman.max_x / 2);
        this.pacman.player_at.y = Math.round(this.pacman.max_y / 2);

        this.place_entities();        
        this.generate_wall();
        this.generate_power_ups();
    }
}