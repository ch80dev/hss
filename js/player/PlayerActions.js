class PlayerActions {
    constructor(player){
        this.player = player
    }
     open_trash(x, y){
        ui.change_screen('loot');
        this.player.state.looting = true;
    }


    attack(x, y, juego){
        let map_at = juego.map.queries.at(x, y);
        let target = null;
        if (map_at == Config.cell_class.indexOf('rat')){
            target = juego.fetch_rat(this.player.state.location_type, this.player.state.location_id, x, y);
        }
        this.player.status.change_stamina_delta(Config.stamina_cost['attack']);
        let did_they_hit = rand_num(1, 100) <= this.player.state.stamina;
        if (did_they_hit){
            target.get_hit(1);
            ui.log(`You hit them for 1 dmg. They're now at ${target.health}/${target.max_health}`);
            return;
        }
        ui.log(`You missed them! ${target.health}/${target.max_health}`);
    }

    interact(id, x, y, juego){
        console.log(id, x, y);
        let human = juego.fetch_human(juego.player.state.location_type, juego.player.state.location_id, x, y);
        //console.log(human);
        if (human == null || human.interactions[id] == undefined){
            console.log('error');
            return;
        }
        let interaction = human.interactions[id];        
        if (interaction == 'beg' && human.last_begged == null){            
            this.player.state.money += human.give_when_begged;                      
            ui.log(`They gave you $${human.give_when_begged}.`)
            human.begged();
        } else if (interaction == 'buy' && this.player.state.money >= human.conversion[id]){ 
            this.player.state.money -= human.conversion[id];
            this.player.inventory.take_from_human(human.resources[id], 1, human);
            ui.log(`You bought ${human.resources[id]} for $${human.conversion[id]}.`)
        } else if (interaction == 'sell' && this.player.inventory.do_they_have(human.resources[id], 1)){ 
            this.player.inventory.give_to_human(human.resources[id], 1, human);
            this.player.money += human.conversion[id];
            ui.log(`You sell ${human.resources[id]} for $${human.conversion[id]}.`)
        } 

    }
    

    search_trash(x, y, map){
        let trash = map.loot[this.player.fetch_from()];
        this.player.status.change_stigma(Config.stigma_effects['trash']);
        if (trash == undefined){
            console.log('trash');
            return;
        }
        this.player.status.change_stamina_delta(-.4);
        if (trash.stuff.length == 0){
            ui.log("Nothing usable in trash");
            delete map.loot[this.player.fetch_from()];
            map.is(x, y, 1);
            return;
        }
        this.open_trash(x, y);
        
    }

    social(x, y, juego){
        //console.log('social', x, y, juego);
        let human = juego.fetch_human(this.player.state.location_type, this.player.state.location_id, x, y);
        if (human == null){
            return;
        }
        this.player.state.socializing = {x: x, y: y};
        ui.change_screen('social');

    }

    trade(interaction_id, conversion_id, x, y, juego){
         let human = juego.fetch_human(juego.player.state.location_type, juego.player.state.location_id, x, y);
        console.log(human);
        if (human == null || human.interactions[interaction_id] == undefined){
            console.log('error');
            return;
        }
        let interaction = human.interactions[interaction_id];        
        let player_quantity = human.conversion[conversion_id];
        let player_resource = human.resources[conversion_id];
        let other_id = 0;
        if (conversion_id == 0){
            other_id = 1;
        }
        let human_quantity = human.conversion[other_id];
        let human_resource = human.resources[other_id];
        if (!this.player.inventory.do_they_have(player_resource, player_quantity) 
            || human.do_they_have(human_resource, human_quantity)){
            return;
        }
        this.player.inventory.give_to_human(player_resource, player_quantity, human);
        this.player.inventory.take_from_human(human_resource, human_quantity, human);
        ui.log(`You give ${player_quantity} ${player_resource} and receive ${human_quantity} ${human_resource}.`)
    }

    unlock_trash(x, y, map){
        let at = map.format_at(this.player.state.location_type, this.player.state.location_id, x, y);
        let durability_cost = rand_num(1, 5);
        this.player.inventory.use_equipment(durability_cost);
        console.log(map.loot[at], at, durability_cost);
        if (map.loot[at] == undefined){
            return;
        }
        map.loot[at].locked = false;
        this.player.state.x = x;
        this.player.state.y = y;
        this.search_trash(x, y, map);

    }

    
}
