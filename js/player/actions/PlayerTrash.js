class PlayerTrash {
    constructor(player){
        this.player = player;
    }
    open(map){
        
        let taken_arr = this.player.inventory.take.all(map);        
        let txt = `You looted:  ${taken_arr.join(", ")} [${this.player.state.inventory.length}/${this.player.state.slots_in_inventory}]`;
        if (this.player.state.auto_loot){
            ui.log(txt);
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
        let item = this.player.inventory.fetch.by_id(this.player.state.equipped);
        let durability_cost = ItemConfig.tool_durability_uses[item.name];
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