class PlayerActions {
    constructor(player){
        this.player = player
    }
     open_trash(x, y){
        ui.change_screen('loot');
        this.player.state.looting = true;
    }

    

    search_trash(x, y, map){
        let trash = map.loot[this.fetch_from()];
        if (trash == undefined){
            console.log('trash');
            return;
        }
        this.player.status.change_stamina_delta(-.4);
        if (trash.length == 0){
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
}