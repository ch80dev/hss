class InventoryTake {
    constructor(player){
        this.player = player;
    }
    from_human(name, quantity, human){
        
        //console.log(name, quantity, human);
        if (!human.items.do_they_have(name, quantity)){
            console.log("error: they don't got this.");
            return;
        } else if (!this.player.inventory.get.can_they_take(name, quantity)){
            console.log('error');
            return;
        }
        let npc_item = human.items.fetch(name);
        if (npc_item.quantity == quantity){
            human.items.delete(name);
        } else {
            npc_item.quantity -= quantity;
        }
        juego.quests.process('fetch', quantity, name);
        if (ItemConfig.stackable.includes(name) && this.player.inventory.get.is_in_inventory(name)){
            this.player.inventory.move.stack_item_in_inventory(name, quantity);
            return;
        } else if (ItemConfig.stackable.includes(name)){
            this.player.state.inventory.push({ name: name, quantity: quantity, durability: 100, id: this.player.inventory.next_id()});
            this.player.inventory.move.sort();
            return;
        }
        //while(this.player.state.inventory.length < this.player.state.inventory_slots){ //this is filling the player's inventory - not sure why I did this
        this.player.state.inventory.push({ name: name, quantity: 1, durability: 100, id: this.player.inventory.next_id()});
        //}
        this.player.inventory.move.sort();
    }

    all(map, autoloot){
        let at = this.player.fetch_from();
        if (map.loot[at] == undefined){
            
            return null;
        }
        let id = 0;
        let taken = [];
        while (map.loot[at] != undefined && map.loot[at].stuff.length > 0){            
            let item = map.loot[at].stuff[id];
            if (map.loot[at] == undefined || id >= map.loot[at].stuff.length){
                break;
            }
            if (autoloot && (!this.player.state.auto_loot_preferences[item.name] 
                || (Object.keys(ItemConfig.food_gain).includes(item.name) && item.durability <1 && !this.player.state.auto_loot_preferences[item.name + ' (spoiled)']))){
                console.log("BUG not autolooting a sandwich (because of spoiled preference presumably) 04-25-26, 04-28-25", item.name + ' (spoiled)', (Object.keys(ItemConfig.food_gain).includes(item.name), this.player.state.auto_loot_preferences[item.name + ' (spoiled)']));
                id ++;
                continue;
            }
            let status = this.item( item.id, map, id);   
            if (status != false){
                taken.push(status);
            }
            if (status === false){
                id ++;
            }
        }
        return taken;
    }

    item(id, map, take_all_id){
        let at = this.player.fetch_from();
        console.log('BUG', map.get.inspector.entity.fetch_loot(at, id)); //04/24/26 not sure when it got put in
        if (map.loot[at] == undefined 
            || (map.loot[at] != undefined 
            && !this.player.inventory.get.can_they_take(map.get.inspector.entity.fetch_loot(at, id).name, map.get.inspector.entity.fetch_loot(at, id).quantity))){
            return false;
        }
        let loot = map.get.inspector.entity.fetch_loot(at, id);
        let txt = `${loot.quantity} ${loot.name}`;
        if (Object.keys(ItemConfig.food_gain).includes(loot.name) && loot.durability < 1){
            txt += " (spoiled)";
        }
        let what = loot.name;
        juego.quests.process('fetch', loot.quantity, what);
        if (ItemConfig.stackable.includes(what) && this.player.inventory.get.is_in_inventory(what)){
            this.player.inventory.move.stack_item_in_inventory(what, loot.quantity);
            if (take_all_id == null){
                map.delete_loot(at, loot.id);
            } else {
                map.loot[at].stuff.splice(take_all_id, 1);
            }
        } else {                    
            loot.id = this.player.inventory.next_id();
            this.player.state.inventory.push(loot);
            map.delete_loot(at, loot.id);        
        }
        this.player.inventory.move.sort();
        let map_at = map.get.at(this.player.state.x, this.player.state.y);
        if (map.loot[at].stuff.length == 0 && (map_at == 5 || MapConfig.attackable.includes(map_at)) ){
            juego.quests.process('trash', 1, null);
            map.is(this.player.state.x, this.player.state.y, 1);
        }
        if (map.loot[at].stuff.length == 0){
            delete map.loot[at];
            this.player.state.looting = false;
            ui.change_screen('map');
        }
        return txt;
    }
}