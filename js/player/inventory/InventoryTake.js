class InventoryTake {
    constructor(player){
        this.player = player;
    }
    from_human(name, quantity, human){
        
        //console.log(name, quantity, human);
        if (!human.do_they_have(name, quantity)){
            console.log("error: they don't got this.");
            return;
        } else if (!this.player.inventory.queries.can_they_take(name, quantity)){
            console.log('error');
            return;
        }
        this.player.inventory.move.change_weight(this.player.inventory.queries.fetch_weight(name, quantity));
        let npc_item = human.fetch_item(name);
        if (npc_item.quantity == quantity){
            human.delete_item(name);
        } else {
            npc_item.quantity -= quantity;
        }

        if (Config.stackable.includes(name) && this.player.inventory.queries.is_in_inventory(name)){
            this.player.inventory.move.stack_item_in_inventory(name, quantity);
            return;
        } else if (Config.stackable.includes(name)){
            this.player.state.inventory.push({ name: name, quantity: quantity, durability: 100, id: this.player.inventory.next_id()});
            this.player.inventory.move.sort();
            return;
        }
        while(this.player.state.inventory.length < this.player.state.slots_in_inventory){
            this.player.state.inventory.push({ name: name, quantity: 1, durability: 100, id: this.player.inventory.next_id()});
        }
        this.player.inventory.move.sort();
    }

    all(map){
        let at = this.player.fetch_from();
        if (map.loot[at] == undefined){
            return null;
        }
        let id = 0;
        let taken = [];
        console.log(at, map.loot[at].stuff);
        while (map.loot[at].stuff.length > 0){            
            let item = map.loot[at].stuff[id];
            console.log(item.id, at, map.loot[at], id);
            let status = this.item( structuredClone(item.id), map, id);            
            if (status != false){
                taken.push(status);
            }
            if (status === false){
                id ++;
            }
            //console.log(id, map.loot[at]);
            if (map.loot[at] == undefined || id >= map.loot[at].stuff.length){
                break;
            }
            //console.log(map.loot[at].stuff);
            
        }
        return taken;
        
    }

    item(id, map, take_all_id){
        //you should be able to take stuff when adjacent but not now
        let at = this.player.fetch_from();
        console.log(id, map.loot[at].stuff)

        
        if (map.loot[at] == undefined 
            || (map.loot[at] != undefined 
            && !this.player.inventory.queries.can_they_take(map.queries.fetch_loot(at, id).name, map.queries.fetch_loot(at, id).quantity))){
            return false;
        }
        let loot = map.queries.fetch_loot(at, id);
        console.log(loot.id);
        let txt = `${loot.quantity} ${loot.name}`;
        let weight = this.player.inventory.queries.fetch_weight(loot.name, loot.quantity);
        let what = loot.name;
        //console.log(weight);
        this.player.inventory.move.change_weight(weight);
        
        console.log(what, Config.stackable.includes(what), this.player.inventory.queries.is_in_inventory(what));
        if (Config.stackable.includes(what) && this.player.inventory.queries.is_in_inventory(what)){
            this.player.inventory.move.stack_item_in_inventory(what, loot.quantity);
            if (take_all_id == null){
                map.loot[at].stuff.splice(id, 1);
            } else {
                map.loot[at].stuff.splice(take_all_id, 1);
            }
        } else {
            console.log('unstackable??', what);
            let item = map.loot[at].stuff.splice(id, 1)[0];
            item.id = this.player.inventory.next_id();
            this.player.state.inventory.push(item);        
        }
        this.player.inventory.move.sort();
        let map_at = map.queries.at(this.player.state.x, this.player.state.y);
        if (map.loot[at].stuff.length == 0 && (map_at == 5 || Config.attackable.includes(map_at)) ){
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