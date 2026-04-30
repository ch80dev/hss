class Cop extends Lifeform{
    denied = false;
    escaping = false;
    flashing = false;
    heading_towards = {};
    heading_to_exit = {
        exit: null, distance: null
    }
    keeping_the_peace = true;
    max_stigma_tolerance = null;
    name = null;
    num_of_tazes = 5;
    patrolling = null;
    player_gone = false;
    player_fleeing = false;
    severity = null;
    surname = null;

    constructor(id, x, y, severity, location_type, location_id, map, player, get){
        
        super('human', x, y, location_type, location_id, map);
        this.id = id;
        this.severity = severity;
        this.map = map;
        this.player = player;
        this.heading_towards.x = this.player.state.x;
        this.heading_towards.y = this.player.state.y;
        this.get = get;
        this.max_stigma_tolerance = rand_num(1, 50);
        this.name = HumanConfig.names[rand_num(0, HumanConfig.names.length - 1)];
        this.surname = HumanConfig.names[rand_num(0, HumanConfig.surnames.length - 1)];
        
    }
    go_through_exit(){
        console.log('go through exit');
        if (this.heading_to_exit.exit == null){
            console.log('exit');
            return;
        }
        let to = this.map.exits[this.heading_to_exit.exit];
        if(this.map.locations[this.location.type ][this.location.id][this.x][this.y] != 1){
            console.log(this.map.locations[this.location.type ][this.location.id][this.x][this.y]);
        }
        this.map.locations[this.location.type ][this.location.id][this.x][this.y] = 1;;
        this.location.type = to.split('-')[0];
        this.location.id = to.split('-')[1];
        this.x = Number(to.split('-')[2]);
        this.y = Number(to.split('-')[3]);
        this.player_gone = false;
        this.heading_to_exit.exit = null;
        this.heading_to_exit.distance = null;

    }

    move(){
        //cop appears to be moving away
        let toward_player = this.map.get.geometry.fetch_delta(this.heading_towards.x, this.heading_towards.y, this.x, this.y);
        let pos = {x: this.x, y: this.y};
        if (toward_player.x != 0 && this.map.get.at(pos.x + toward_player.x, pos.y) == 1 
            && this.map.get.geometry.is_valid(pos.x + toward_player.x, pos.y)){
            pos.x += toward_player.x;
        } else if (toward_player.y != 0 && this.map.get.at(pos.x, pos.y + toward_player.y) == 1 
            && this.map.get.geometry.is_valid(pos.x, pos.y + toward_player.y)){
            pos.y += toward_player.y;
            
        }
        

        let adjacent_to_human = this.map.get.inspector.fetch_adjacent(this.x, this.y, 1, true);
        let adjacent_to_player = this.map.get.inspector.fetch_adjacent(this.heading_towards.x, this.heading_towards.y, 1, true);
        let common = this.map.get.fetch_common(adjacent_to_human, adjacent_to_player);
        /*
        if (common.length > 0){
            let rand = common[rand_num(0, common.length - 1)];
            pos.x = rand.x;
            pos.y = rand.y;
        }
        */
        let best = this.map.get.navigator.fetch_best_spots_for_delta(this.x, this.y, adjacent_to_human, toward_player);
        
        if (pos.x == this.x && pos.y == this.y && best.length > 0){
            let rand = best[rand_num(0, best.length - 1)];
            pos.x = rand.x;
            pos.y = rand.y;
        }
        this.go(pos.x, pos.y, MapConfig.cell_class.indexOf('cop'), Config.stamina_cost.move);
    }

    player_disappeared(){
        let last_exit = this.player.state.last_exit.from;
        let exit_location_type = last_exit.split('-')[0];
        let exit_location_id = last_exit.split('-')[1];
        let exit_x = last_exit.split('-')[2];
        let exit_y = last_exit.split('-')[3];
        if (this.severity == 0 || exit_location_type != this.location.type || exit_location_id != this.location.id){
            console.log('player not here - patrolling');
            this.wait_for_player();
            return;
        } else if (exit_location_type == 'sewer' 
            && (this.severity < 3 || (this.severity == 3 && rand_num(1, 3) != 1))){
            console.log('player went in sewer - patrolling');
            this.wait_for_player();
            return;

        }        
        
        let player_distance_to_exit = this.map.get.geometry.fetch_distance(this.heading_towards.x, this.heading_towards.y, exit_x, exit_y);
        if (player_distance_to_exit >= 2){
            console.log("player too far from exit - don't know where they went ");
            this.wait_for_player();
            return;
        }
        let distance_to_exit = this.map.get.geometry.fetch_distance(this.x, this.y, exit_x, exit_y);
        let bonus = (1 + Number(CopConfig.escape_bonus));
        this.heading_to_exit.exit = last_exit;
        this.heading_to_exit.distance = Math.ceil(distance_to_exit * bonus);
    }

    player_is_not_here(){
        if (!this.player_gone){
            this.player_gone = true;
            this.player_disappeared();
            return;
        }
        if (this.patrolling != null && this.patrolling > 0 
            && this.heading_to_exit.distance != null && this.heading_to_exit.distance > 0){
            console.log("this shouldn't happen");
            return;
        }
        if (this.patrolling != null && this.patrolling > 0){
            this.patrolling --;
            if (this.patrolling < 1){
                console.log("DELETE");
            }
            return;
        }

        if (this.heading_to_exit.distance != null && this.heading_to_exit.distance > 0 ){
            this.heading_to_exit.distance --;
            if (this.heading_to_exit.distance < 1){
                this.go_through_exit();
            }
        }
    }

    spot_player(x, y, warning){
        let can_they_see = this.map.get.inspector.has_line_of_sight(this.x, this.y, this.player.state.x, this.player.state.y);
        if (!can_they_see){
            return;
        }
        if (x != this.heading_towards.x || y != this.heading_towards.y){
            this.player_fleeing = true;
            this.warn();
            warning = false;
        }
        this.heading_towards = { x: x, y: y };
        return warning;
    }

    taze_player(distance){
        if (this.num_of_tazes < 1){
            return;
        }
        let do_they_hit = rand_num(1, distance) == 1;
        this.num_of_tazes --;
        if (!do_they_hit ){
            ui.log (" They missed!");
            return;
        }

        let dmg = rand_num(1, CopConfig.tazer_damage);
        this.player.status.change_health(-dmg);
        this.player_fleeing = false;
        ui.log(`They tazed you unconscious and caused ${dmg} damage. [${this.player.state.health}]`);
        this.player.status.go_unconscious();
        
    }

    wait_for_player(){
        this.patrolling = CopConfig.severity_wait[this.severity];
    }

    warn(){
        let warnings = [
            "Police. You're not in trouble. I just need to talk to you.",
            "Police! Don't make me chase you!",
            "Police! You will be tazed if you don't stop!",
            "Don't move, you piece of shit! Or I'll shoot you in your fucking head!",
        ]
        ui.log(`<span class='cop_warning'>${warnings[this.severity]}</span>`);
    }
}