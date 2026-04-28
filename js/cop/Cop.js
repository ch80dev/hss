class Cop extends Lifeform{
    escaping = false;
    heading_towards = {};
    keeping_the_peace = true;
    max_stigma_tolerance = null;
    name = null;
    player_fleeing = false;
    severity = null;
    surname = null;

    constructor(id, x, y, severity, location_type, location_id, map, player, get){
        
        super('human', x, y, location_type, location_id, map);
        this.id = id;
        this.severity = severity;
        this.map = map;
        this.player = player;
        this.get = get;
        this.max_stigma_tolerance = rand_num(1, 50);
        this.name = HumanConfig.names[rand_num(0, HumanConfig.names.length - 1)];
        this.surname = HumanConfig.names[rand_num(0, HumanConfig.surnames.length - 1)];
        
    }

    move(){
        //cop appears to be moving away
        let toward_player = this.map.get.geometry.fetch_delta(this.x, this.y, this.heading_towards.x, this.heading_towards.y);
        let pos = {x: this.x, y: this.y};
        let adjacent_to_human = this.map.get.inspector.fetch_adjacent(this.x, this.y, 1, true);
        let adjacent_to_player = this.map.get.inspector.fetch_adjacent(this.heading_towards.x, this.heading_towards.y, 1, true);
        let common = this.map.get.fetch_common(adjacent_to_human, adjacent_to_player);
        if (common.length > 0){
            let rand = common[rand_num(0, common.length - 1)];
            pos.x = rand.x;
            pos.y = rand.y;
        }
        let best = this.map.get.navigator.fetch_best_spots_for_delta(this.x, this.y, adjacent_to_human, toward_player);
        if (common.length < 1 && best.length > 0){
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

    warn(){
        let warnings = [
            "Police. You're not in trouble. I just need to talk to you.",
            "Police! Don't make me chase you!",
            "Police! You will be tazed if you don't stop!",
            "Don't move, you piece of shit! Or I'll shoot you in your fucking head!",
        ]
        ui.log(warnings[this.severity]);
    }
}