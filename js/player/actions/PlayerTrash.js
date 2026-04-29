class PlayerTrash {
    constructor(player){
        this.player = player;
    }

    hit(x, y, map){
        let at = map.format_at(this.player.state.location.type, this.player.state.location.id, x, y);
        let loot = map.loot[at];
        console.log(loot, loot != undefined, !loot.locked, loot.durability < 1);
        if (loot == undefined || !loot.locked || loot.durability < 1){
            console.log('error');
            return;
        }
        let did_they_hit = this.player.status.did_they_hit();
        let dmg = this.player.status.fetch_dmg();
        let caption = 'You missed the trash can.';
        if (did_they_hit){
            this.player.status.add_crime('hit_trash');

            this.player.status.change_stamina_delta(-.9);
            this.player.inventory.use.weapon();
            loot.durability -= dmg;
            caption = `You hit the trash can for ${dmg} damage. [${loot.durability}%]`
            if (loot.durability < 1){
                caption += " You got it open!"
                loot.locked = false;
                this.player.state.x = x;
                this.player.state.y = y;
                this.open(map);
            }

        }
        ui.log(caption);
    }

    open(map){
        
        this.player.status.add_crime('open_trash');
        if (this.player.state.auto_loot){
            let taken_arr = this.player.inventory.take.all(map, true);        
            ui.update_auto_loot(taken_arr);
        }
        let at = this.player.fetch_from();
        if (!this.player.state.auto_loot || map.loot[at] != undefined && map.loot[at].stuff.length > 0){
            ui.change_screen('loot');
            this.player.state.looting = true;            
            return;
        }
       
        
    }

    search(x, y, map){
        let trash = map.loot[this.player.fetch_from()];
        this.player.status.change_stigma(Config.stigma_effects['trash']);
        if (trash == undefined){
            console.log('trash');
            return;
        }
        trash.searched = true;
        this.player.status.change_stamina_delta(-.4);
        this.player.status.add_time(0, 5);
        if (trash.stuff.length == 0){
            ui.log("Nothing usable in trash");
            delete map.loot[this.player.fetch_from()];
            map.is(x, y, 1);
            return;
        }
        this.open(map);
        
    }

    unlock(x, y, map){
        let at = map.format_at(this.player.state.location.type, this.player.state.location.id, x, y);
        let item = this.player.inventory.fetch.by_id(this.player.state.equipped.hand);
        let durability_cost = ItemConfig.tool_durability_uses[item.name];
        this.player.status.add_crime('unlock_trash');
        this.player.inventory.use.equipment(durability_cost);
        if (map.loot[at] == undefined){
            return;
        }
        map.loot[at].locked = false;
        this.player.state.x = x;
        this.player.state.y = y;
        this.search(x, y, map);

    }
}