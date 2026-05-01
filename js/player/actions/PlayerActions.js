class PlayerActions {
    
    constructor(player, get){
        this.player = player;
        this.attack = new PlayerAttack(this);
        this.cop = new PlayerCop(this, get);
        this.human = new PlayerHuman(player);        
        this.shop = new PlayerShop(player);
        this.trash = new PlayerTrash(player);
    }

    look (x, y, map){
        let simple = ["rat", 'human'];
        if (this.player.state.looking_at != null && this.player.state.looking_at.x == x && this.player.state.looking_at.y == y){
            this.player.looking_at = null;
            return;
        }
        this.player.state.looking_at = { x: x, y: y };
        let map_at = map.get.at(x, y);
        let msg = `(${x}, ${y}) There is nothing here.`;
        let shop = juego.get.shop_by_loc(this.player.state.location.type, this.player.state.location.id, x, y);
        if (map_at == null && shop == null){
            return;
        }
        let at = map.format_at(this.player.state.location.type, this.player.state.location.id, x, y);
        let cell_class = MapConfig.cell_class[map_at];
        let trash = map.loot[at];
        let human = juego.get.human_by_loc(this.player.state.location.type, this.player.state.location.id, x, y);
        if (shop != null){
            msg = `(${x}, ${y}) There is a '${ShopConfig.names[shop.type]}' here.`;
        } else if (cell_class.split('_').length > 0 && cell_class.split("_")[1] == 'exit'){
            msg = `(${x}, ${y}) There is a ${cell_class.split("_")[0]} ${cell_class.split("_")[1]} here.`;
        } else if (cell_class == 'rat'){
            msg = `(${x}, ${y}) There is a rat here.`; 
        } else if (cell_class == 'crate'){
            msg = `(${x}, ${y}) You placed a crate here for your stuff.`;
        } else if (cell_class == 'trash' && trash != null && trash.locked){
            msg = `(${x}, ${y}) There is a locked trash can here. (need a tool to open)`;
        } else if (cell_class == 'trash' && trash != null && !trash.locked){
            msg = `(${x}, ${y}) There is a trash can here.`;
        } else if (human != null){
            msg = this.look_at_human(human);
        }
        
        ui.log(msg);
    }

    look_at_human(human){
        let msg = `(${human.x}, ${human.y}) There is a person here.`;
        if (human.homeless){
            msg += " They are homeless.";
        }
        if (!human.met){
            return msg;
        }
        msg = `(${human.x}, ${human.y}) ${human.name} ${human.surname} is here.`;
        if (human.homeless){
            msg += " They are homeless.";
        }
        for (let id in human.interactions){
            let interaction = human.interactions[id];
            msg += " " + interaction;
            if (human.resources[id] != null){
                msg += " " + human.resources[id] + ' ' + human.conversion[id];
            }
        } // this  is shitty but there's too much detail and I gotta rip it out of uisocial narrate
        return msg;
    }

    loot_body(map, juego){
        ui.change_screen('loot');
        this.player.state.looting = true;
    }

    loot_corpse(map, juego){
        this.loot_body(map, juego);
    }

    loot_unconscious(map, juego){
        let target = juego.get.target(this.player.state.location.type, this.player.state.location.id, this.player.state.x, this.player.state.y);
        if (target == null){
            return;
        }
        if (target.type == 'human'){
            this.player.status.add_crime('loot_unconscious');
        }
        if (target.inventory != null){
            juego.map.loot[this.player.fetch_from()] = { stuff: null };
            juego.map.loot[this.player.fetch_from()].stuff = target.inventory;
            target.inventory = null;
        }
        this.loot_body(map, juego);
    }

    sleep_in_tent(map){
        let caption = "";
        let loot = map.loot[this.player.fetch_from()];
        let tent = map.get.inspector.entity.fetch_tent(this.player.fetch_from());
        this.player.status.add_crime('sleep');
        console.log(tent);
        if(tent == null || !this.player.status.sleep.can_they()){
            return;
        }
        this.player.status.add_time(8, 0);
        let penalty = this.player.status.sleep.start(true, false);
        tent.durability -= 1;
        if (tent.durability < 1){
            caption = " Your tent broke!";
            map.delete_loot(this.player.fetch_from(), tent.id);
            let map_is = 1;
            if (loot != undefined && loot.stuff.length > 0){
                map_is = MapConfig.cell_class.indexOf('debris');
            }
            map.is(this.player.state.x, this.player.state.y, map_is);
            
        }
        ui.sleeping = true;
        let txt = "You sleep in a tent."
        if (penalty > 0){
            txt += `And you regain a little health. [${penalty}] `;
        }
        ui.log(`${txt} ${caption}`)
        ui.change_screen('map');
        this.player.state.looting = false;
    }

}
