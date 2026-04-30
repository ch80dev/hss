class Human extends Lifeform{
    ante = 10;
    begging_unlocked = true;

    conversion = [];
    directions_to = [];
    gambled = null;
    gambled_and_won = 0;
    give_when_begged = null;
    homeless = false;
    interaction = null;
    interactions = {};
    items = new HumanInventory(this);
    
    quest = null;
    resources = [];
    min_stigma_beg = null;
    max_stigma_tolerance = null;
    name = null;
    stigma = null; 
    surname = null;

    constructor(id, x, y, are_they_homeless, location_type, location_id, map, player, get){
        
        super('human', x, y, location_type, location_id, map);
         this.id = id;
        this.map = map;
        this.player = player;
        this.get = get;
        this.quest = new HumanQuest(this, this.map, this.get);
        this.interaction = new HumanInteraction(this, this.map);
        this.homeless = are_they_homeless;
        this.max_stigma_tolerance = rand_num(50, 100);
        this.min_stigma_beg = rand_num(0, 10);
        if (are_they_homeless){
            this.min_stigma_beg = rand_num(0, 25);
        }
        if (!are_they_homeless){
            this.max_stigma_tolerance = rand_num(1, 50);
        }
        this.interaction.generate();
        this.name = HumanConfig.names[rand_num(0, HumanConfig.names.length - 1)];
        this.surname = HumanConfig.names[rand_num(0, HumanConfig.surnames.length - 1)];
        this.directions_to = this.interaction.get_available_directions();
    }

    move(){
        let toward_player = this.map.get.geometry.fetch_delta(this.player.state.x, this.player.state.y, this.x, this.y);
        let pos = {x: this.x, y: this.y};
        let adjacent_to_human = this.map.get.inspector.fetch_adjacent(this.x, this.y, 1, true);
        let adjacent_to_player = this.map.get.inspector.fetch_adjacent(this.player.state.x, this.player.state.y, 1, true);
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

        this.go(pos.x, pos.y, MapConfig.cell_class.indexOf('human'), Config.stamina_cost.move);
    }

    report_crime(what){
        let distance = this.map.get.geometry.fetch_distance(this.x, this.y, this.player.state.x, this.player.state.y);
        console.log('delete after shown', distance);
        if (!this.map.get.inspector.entity.is_in_the_light(this.player.state.location.type, this.player.state.location.id, this.player.state.x, this.player.state.y) && rand_num(1, distance) != 1){
            console.log("NIGHT DELETE");
            return;
        }
        if (!this.player.state.reported_crimes.includes(what)){
            this.player.state.reported_crimes.push(what);
        }
    }

    watch(juego){
        
        for (let crime of this.player.state.crimes_this_turn){
            let severity = CopConfig.crime_severity[crime];
            let do_they_report = this.player.state.stigma > this.max_stigma_tolerance 
                && rand_num(1, 100) < this.player.state.stigma;
            if (severity == 1){
                do_they_report = rand_num(1, 100) < this.player.state.stigma;
            } else if (severity == 2){
                do_they_report = rand_num(1,2) == 1;
            } else if (severity == 3){
                do_they_report = true;
            }
            if (do_they_report){
                this.report_crime(crime);
            }
        }
    }
}