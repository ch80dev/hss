class Rat{
    dead = false;
    delta= {x: 0, y: 0};
    health = Config.default_rat_max_health;
    hungry = false;
    sense_range = Config.default_rat_sense_range;
    stamina = Config.default_rat_max_stamina;
    max_health = Config.default_rat_max_health;
    max_stamina =Config.default_rat_max_stamina;
    x = null;
    y = null;

    constructor(map, player, x, y){
        this.map = map;
        this.player = player;
        this.x = x;
        this.y = y;
        let open = map.queries.fetch_adjacent(x, y, 1, true)[0];
        this.delta = map.queries.fetch_delta(open.x, open.y, x, y);
    }

    get_hit(dmg){
        this.health -= dmg;
        if (this.health < 0){
            this.health = 0;
        }
        this.dead = true;

    }
    is_blocked(x, y){
        if (!this.map.queries.is_valid(x, y)){
            return true;
        }
        if (this.map.queries.at(x, y) == 1 || this.map.queries.at(x, y) == 5){
            return false;
        }
        return true;
    }

    move (id){
        //rats should avoid all humans in general
        if (this.dead){
            return;
        }
        this.hungry = this.max_stamina - this.stamina >= Config.food_gain[1];
        console.log(id, this.stamina)
        let do_they_move = rand_num(1, 2) == 1;
        let distance_to_player = this.map.queries.fetch_distance(this.x, this.y, this.player.state.x, this.player.state.y);
        let ignore_player = rand_num(1, 3) == 1;
        
        if (!do_they_move && !this.hungry 
            && ((distance_to_player > this.sense_range) || (distance_to_player <= this.sense_range && ignore_player)) ){
            return;
        }
        let adjacent_open = this.map.queries.fetch_adjacent(this.x, this.y, 1, true);
        let away_from_player = this.map.queries.fetch_delta(this.x, this.y, this.player.state.x, this.player.state.y);
        let searching_for_food = this.map.queries.search_for_food(this.x, this.y, this.sense_range);
        if (!this.hungry && distance_to_player <= this.sense_range){
            console.log('away');
            this.delta = this.run_away(this.player.state.x, this.player.state.y);
            
            
        //} else if (){ //if no stamina attack humans
        //} else if (this.hungry && rand_num(1, this.max_stamina) > this.stamina){ //if no stamina and really hungry attack other rats
        } else if (this.hungry && searching_for_food.x != 0 && this.searching_for_food.y != 0){
            //console.log('food');
            this.delta = searching_for_food;
        } 
        console.log(this.delta, this.x, this.y, this.map.queries.at(this.x + this.delta.x, this.y + this.delta.y));
        if ((this.delta.x != 0 || this.delta.y != 0) && this.is_blocked(this.x + this.delta.x, this.y + this.delta.y) && adjacent_open.length > 0){            
            console.log('blocked_search');
            let rand_open = adjacent_open[rand_num(0, adjacent_open.length - 1)];
            this.delta = this.map.queries.fetch_delta(rand_open.x, rand_open.y, this.x, this.y)
        }
        //console.log(this.delta);
        let pos_x = this.x + this.delta.x;
        let pos_y = this.y + this.delta.y;
        if (this.stamina > 0){
            this.stamina -= Config.rat_movement_cost;
        } else if(this.health > 0){
            this.health -= Config.rat_movement_cost;
        }
        if (this.map.queries.at(this.x, this.y) != 5){
            this.map.is(this.x, this.y, 1);
        }
        if (this.map.queries.at(pos_x, pos_y) == 1){
            this.map.is(pos_x, pos_y, 6);
        }
        
        this.x = pos_x;
        this.y = pos_y;
        if (this.health < 1){
            this.dead = true;
        }
    }

    run_away(running_from_x, running_from_y){
        let delta = this.map.queries.fetch_delta(this.x, this.y, running_from_x, running_from_y);
        console.log('run_awway', this.x, this.y, delta, running_from_x, running_from_y);
        if ((delta.x != 0 && delta.y == 0 && !this.is_blocked(this.x + delta.x, this.y))
            || (delta.x == 0 && delta.y != 0 && !this.is_blocked(this.x, this.y + delta.y))){
            return delta;
        } else if (delta.x != 0 && delta.y != 0 && !this.is_blocked(this.x + delta.x, this.y)){
            return { x: delta.x, y: 0 };
        } else if (delta.x != 0 && delta.y != 0 && !this.is_blocked(this.x, this.y + delta.y)){
            return { x: 0, y: delta.y };

        }
        let adjacent_open_arr = this.map.queries.fetch_adjacent(this.x, this.y, 1, false);
        //console.log(this.x, this.y, adjacent_open_arr);
        let distance_to_target = 0;
        let where = null;
        for (let adjacent_open of adjacent_open_arr){
            let distance = this.map.queries.fetch_distance(running_from_x, running_from_y, adjacent_open.x, adjacent_open.y);
            console.log(adjacent_open, distance);
            if (distance > distance_to_target){
                distance_to_target = distance;
                where = adjacent_open;
            }

        }
        console.log('chose', where);
        if (where != null){
            return this.map.queries.fetch_delta(where.x, where.y, this.x, this.y, );
        }
        return { x: 0, y: 0 };
    }
}