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

    use_item(id, map){
        let item = this.player.state.inventory[id];
        let medicine_works = rand_num(1, 10) == 1;
        if (!this.player.inventory.can_they_use(item.name, map)){
            return;
        }
        if (item.name == 'crate'){
           
            item.name = 'crate (placed)';
            this.player.inventory.drop_item(id);
            map.is(this.x, this.y, 8);
            return;
        } else if (item.name == 'food' || item.name == 'food (spoiled)'){
            this.player.status.change_stamina(rand_num(Config.food_gain[0], Config.food_gain[1]));
        } else if (item.name == 'medicine' || (medicine_works && item.name == 'medicine(expired)')){
            this.player.status.change_sickness(-rand_num(Config.medicine_gain[0], Config.medicine_gain[1]));
        
        }

        if (item.name == 'food (spoiled)'){
            this.player.status.change_sickness(rand_num(Config.spoiled_sick_gain[0], Config.spoiled_sick_gain[1]));
        }

        this.player.state.inventory.splice(id, 1);
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
