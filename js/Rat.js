class Rat extends Lifeform{
    

    constructor(id, x, y, location_type, location_id, map, player){
        super('rat', x, y, location_type, location_id, map);
        this.id = id;
        this.map = map;
        this.player = player;
        let open = map.get.inspector.fetch_adjacent(x, y, 1, true)[0];
        this.delta = map.get.geometry.fetch_delta(open.x, open.y, x, y);
    }

    
    
    move (id){
        //rats should avoid all humans in general
        if (this.dead){
            return;
        }
        this.hungry = this.max_stamina - this.stamina >= ItemConfig.food_gain[1];
        let do_they_move = rand_num(1, 2) == 1;
        let distance_to_player = this.map.get.geometry.fetch_distance(this.x, this.y, this.player.state.x, this.player.state.y);
        let ignore_player = rand_num(1, 3) == 1;
        
        if (!do_they_move && !this.hungry 
            && ((distance_to_player > this.sense_range) || (distance_to_player <= this.sense_range && ignore_player)) ){
            return;
        }
        let adjacent_open = this.map.get.inspector.fetch_adjacent(this.x, this.y, 1, true);
        let away_from_player = this.map.get.geometry.fetch_delta(this.x, this.y, this.player.state.x, this.player.state.y);
        let searching_for_food = this.map.get.inspector.entity.search_for_food(this.x, this.y, this.sense_range);
        if (!this.hungry && distance_to_player <= this.sense_range){
            //console.log('away');
            this.delta = this.run_away(this.player.state.x, this.player.state.y);
            
            
        } else if (this.hungry && searching_for_food.x != 0 && this.searching_for_food.y != 0){
            this.delta = searching_for_food;
        } 
        if ((this.delta.x != 0 || this.delta.y != 0) && this.is_blocked(this.x + this.delta.x, this.y + this.delta.y) && adjacent_open.length > 0){            
            let rand_open = adjacent_open[rand_num(0, adjacent_open.length - 1)];
            this.delta = this.map.get.geometry.fetch_delta(rand_open.x, rand_open.y, this.x, this.y)
        }
        let pos_x = this.x + this.delta.x;
        let pos_y = this.y + this.delta.y;
        this.go(pos_x, pos_y, 6, Config.rat_movement_cost);
      
        
    }

    run_away(running_from_x, running_from_y){
        let delta = this.map.get.geometry.fetch_delta(this.x, this.y, running_from_x, running_from_y);
        //console.log('run_awway', this.x, this.y, delta, running_from_x, running_from_y);
        if ((delta.x != 0 && delta.y == 0 && !this.is_blocked(this.x + delta.x, this.y))
            || (delta.x == 0 && delta.y != 0 && !this.is_blocked(this.x, this.y + delta.y))){
            return delta;
        } else if (delta.x != 0 && delta.y != 0 && !this.is_blocked(this.x + delta.x, this.y)){
            return { x: delta.x, y: 0 };
        } else if (delta.x != 0 && delta.y != 0 && !this.is_blocked(this.x, this.y + delta.y)){
            return { x: 0, y: delta.y };

        }
        let adjacent_open_arr = this.map.get.inspector.fetch_adjacent(this.x, this.y, 1, false);        
        let distance_to_target = 0;
        let where = null;
        for (let adjacent_open of adjacent_open_arr){
            let distance = this.map.get.geometry.fetch_distance(running_from_x, running_from_y, adjacent_open.x, adjacent_open.y);            
            if (distance > distance_to_target){
                distance_to_target = distance;
                where = adjacent_open;
            }

        }
        if (where != null){
            return this.map.get.geometry.fetch_delta(where.x, where.y, this.x, this.y, );
        }
        return { x: 0, y: 0 };
    }
}