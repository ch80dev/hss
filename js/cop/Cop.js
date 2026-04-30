class Cop extends Lifeform{
    escaping = false;
    flashing = false;
    heading_towards = {};
    keeping_the_peace = true;
    max_stigma_tolerance = null;
    name = null;
    num_of_tazes = 5;
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