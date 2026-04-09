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
        console.log(human);
        if (human == null || human.interactions[id] == undefined){
            console.log('error');
            return;
        }
        let interaction = human.interactions[id];
        let giving_when_begged = rand_num(1, 5);
        if (interaction == 'beg' && human.last_begged == null && human.do_they_have('money', giving_when_begged)){
            human.last_begged = true;
            this.player.inventory.take_from_human('money', giving_when_begged, human);
            return;
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
