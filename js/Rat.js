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
    }
    move (){
        if (this.dead){
            return;
        }
        console.log(this.player, this.x, this.y);
        let away_from_player = this.map.fetch_delta(this.x, this.y, this.player.x, this.player.y);
        let distance_from_player = this.map.fetch_distance(this.x, this.y, this.player.x, this.player.y);
        let do_they_move = rand_num(1,2) == 1;
        this.hungry = rand_num(1, this.max_stamina) > this.stamina;
        let adjacent_open = this.map.fetch_adjacent(this.x, this.y, 1, true);
        let pos_x = this.x;
        let pos_y = this.y;
        let searching_for_food = this.map.search_for_food(this.x, this.y, this.sense_range, this.player.location_type, this.player.location_id);
        if(this.hungry && (this.map
            .is_item_here('food', `${this.player.location_type}-${this.player.location_id}-${this.x}-${this.y}`) 
            || this.map.is_item_here(
            'food (spoiled)', `${this.player.location_type}-${this.player.location_id}-${this.x}-${this.y}`))){
            console.log("EAT FOOD");
        } else if (!this.hungry && distance_from_player <= this.sense_range) {
            console.log('away');
            this.delta = away_from_player;
        }  else if (this.hungry && (searching_for_food.x != 0 || searching_for_food.y != 0)){
            console.log('found food in trash')
            this.delta = searching_for_food;
        } else if (this.hungry && distance_from_player <= this.sense_Range){
            console.log('towards')
            this.delta = this.map.invert_delta(away_from_player);
        }
        
        
        pos_x += this.delta.x;
        pos_y += this.delta.y;
        if (adjacent_open.length > 0 && (!this.map.is_valid(pos_x, pos_y) || (this.map.queries.at(pos_x, pos_y) != 1 &&  this.map.queries.at(pos_x, pos_y) != 5))){
            let rand = adjacent_open[rand_num(0, adjacent_open.length - 1)];
            this.delta = this.map.fetch_delta(rand.x, rand.y, this.x, this.y);
            pos_x = this.x + this.delta.x;
            pos_y = this.y + this.delta.y;
        }

        if ((this.x == pos_x && this.y == pos_y) || (!do_they_move && distance_from_player <= this.sense_Range)){
            return;
        }
        if (this.stamina > 0){
            this.stamina --;
        } else if(this.health > 0){
            this.health --;
        }

        this.map.is(this.x, this.y, 1);
        this.map.is(pos_x, pos_y, 6);
        this.x = pos_x;
        this.y = pos_y;
        if (this.health < 1){
            this.dead = true;
        }
    }
}