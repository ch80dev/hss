class Cop extends Lifeform{
    denied = false;
    escaping = false;
    flashing = false;
    heading_towards = {};
    heading_to_exit = {
        exit: null, distance: null, 
    }
    leaving = false;
    max_stigma_tolerance = null;
    name = null;
    num_of_tazes = 5;
    patrolling = null;
    player_gone = false;
    player_fleeing = false;
    pursuit = null;
    severity = null;
    surname = null;
    target_distance = null;

    constructor(id, x, y, severity, location_type, location_id, map, player, get, heading_towards_x, heading_towards_y){
        
        super('human', x, y, location_type, location_id, map);
        this.id = id;
        this.severity = severity;
        this.map = map;
        this.player = player;
        this.pursuit = new CopPursuit(this, map, player)
        this.heading_towards.x = heading_towards_x;
        this.heading_towards.y = heading_towards_y;
        this.get = get;
        this.max_stigma_tolerance = rand_num(1, 50);
        this.name = HumanConfig.names[rand_num(0, HumanConfig.names.length - 1)];
        this.surname = HumanConfig.names[rand_num(0, HumanConfig.surnames.length - 1)];
        
    }

    disappear(){
        this.x = null;
        this.y = null;
        
        this.location.type = null;
        this.location.id = null;
    

    }

    get_delta(){
        let delta = {x: 0, y: 0 };
        let toward_player = this.map.get.geometry.fetch_delta(this.heading_towards.x, this.heading_towards.y, this.x, this.y);
        let n = 0;
        let pos = {x: this.x, y: this.y};
        while(delta.x == 0 && delta.y == 0){
            let horizontal = rand_num(1, 2) == 1;
            let moves = [-1, 1];
            if (n >= 100 && horizontal){
                toward_player.y = 0;
                toward_player.x = moves[rand_num(0, 1)];
            } else if (n >= 100 && !horizontal){
                toward_player.y = moves[rand_num(0, 1)];
                toward_player.x = 0;
            }
            if (horizontal && toward_player.x != 0 && this.map.get.at(pos.x + toward_player.x, pos.y) == 1 
                && this.map.get.geometry.is_valid(pos.x + toward_player.x, pos.y)){
                delta.x = toward_player.x;
            } else if (!horizontal && toward_player.y != 0 
                && this.map.get.at(pos.x, pos.y + toward_player.y) == 1 
                && this.map.get.geometry.is_valid(pos.x, pos.y + toward_player.y)){
                delta.y = toward_player.y;
            }
            n ++;
            //console.log(n);
        }
        return delta;
    }

    head_towards_exit(){
        if (this.heading_to_exit.exit == null){
            let nearest = this.map.get.inspector.exit.fetch_nearest(this.x, this.y);
            this.heading_to_exit.exit = nearest.exit;
            this.heading_to_exit.distance = nearest.distance;
        }
        let delta = this.map.get.geometry.fetch_delta(this.x, this.y, this.heading_to_exit.exit.x, this.heading_to_exit.exit.y);
        let spots = [{ x : this.x + delta.x, y: this.y }, { x: this.x, y: this.y + delta.y } ];
        let good = [];
        for (let spot of spots){
            if (!this.map.get.geometry.is_valid(spot.x, spot.y) || !this.map.get.at(spot.x, spot.y) != 1){
                continue;
            }
            good.push(spot);
        }

        if (good.length < 1){
            console.log("No where to go", this.x, this.y, spots);
            return;
        }
        let rand = rand_num(0, good.length - 1);
        this.x = good[rand].x;
        this.y = good[rand].y;
        if (this.x == this.heading_to_exit.exit.x && this.y == this.head_towards_exit.exit.y){
            this.disappear();
        }
    }

    move(){
        //cop appears to be moving away
        
       
        let delta = this.delta;
        let distance = this.map.get.geometry.fetch_distance(this.x + delta.x, this.y + delta.y, this.heading_towards.x, this.heading_towards.y);
        if (this.target_distance == null || distance >= this.target_distance){
            delta = this.get_delta();
            this.delta = delta;
        }
        let pos = {x: this.x + delta.x, y: this.y + delta.y};

        /*
        let adjacent_to_human = this.map.get.inspector.fetch_adjacent(this.x, this.y, 1, true);
        let adjacent_to_player = this.map.get.inspector.fetch_adjacent(this.heading_towards.x, this.heading_towards.y, 1, true);
        let common = this.map.get.fetch_common(adjacent_to_human, adjacent_to_player);
        let best = this.map.get.navigator.fetch_best_spots_for_delta(this.x, this.y, adjacent_to_human, toward_player);
        if (pos.x == this.x && pos.y == this.y && best.length > 0){
            let rand = best[rand_num(0, best.length - 1)];
            pos.x = rand.x;
            pos.y = rand.y;
        }
        */
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
        this.player.status.stats.change_health(-dmg);
        this.player_fleeing = false;
        this.player.status.sleep.go_unconscious();
        let msg = `They tazed you unconscious and caused ${dmg} damage. [${this.player.state.health}]`;
        if (this.player.state.unconscious_for < 1){
            msg = `<span class='cop_warning'>"They're not going down. They must be on something!"</span>`;
        }
        ui.log();

        
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