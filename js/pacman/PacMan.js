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

    constructor(geometry, player, loop){
        this.loop = loop;
        this.geometry = geometry; 
        this.player = player;
        this.generator = new PacManGenerator(this);
        this.map = new PacManMap(geometry, this);
        this.generator.reset();
        
    }

    end_jail(){
        this.player.state.in_pacman_jail = false;
        clearTimeout(this.game_loop);
        this.player.actions.cop.serve_sentence();
        this.generator.reset();
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
            let distance_to_player = this.geometry.fetch_distance(enemy.x, enemy.y, this.player_at.x, this.player_at.y);

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
            if (enemy.delta == null || (enemy.delta != null && (!this.map.is_valid(pos.x, pos.y) || !this.map.is_open(pos.x, pos.y)))){
                enemy.delta = rand;
            }

            pos = { x: enemy.x + enemy.delta.x, y: enemy.y + enemy.delta.y };
            let closest = this.map.fetch_closest_to_player(enemy.x, enemy.y);
            if (distance_to_player == 1 && this.geometry.is_orthogonal(enemy.x, enemy.y, this.player_at.x, this.player_at.y)){
                this.lose();
                return;
            } else if (closest != null){
                pos = closest;
            } 
            if (this.map.is_valid(pos.x, pos.y) && this.map.is_open(pos.x, pos.y)){
                this.grid[enemy.x][enemy.y] = null;

                enemy.x = pos.x;
                enemy.y = pos.y;
                this.grid[enemy.x][enemy.y] = 3;
            }
    
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
            if (this.map.has_line_of_sight(pos_x, pos_y, guard.x, guard.y)){
                return true;
            }
        }
        return false;
    }

    lose(){
        this.player.status.stats.change_health(-25);
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
        if (this.map.is_valid(pos.x, pos.y) && this.map.at(pos.x, pos.y) == 3){
            this.lose();
            return;
        }
        if (this.map.is_valid(pos.x, pos.y) && this.map.is_open(pos.x, pos.y)){
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

    start(){
        this.game_loop = setInterval(this.loop.go, Config.loop_interval_timing);
    }

    win(){
       this.end_jail();
    }
}