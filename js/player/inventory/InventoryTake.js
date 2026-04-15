class InventoryTake {
    constructor(player){
        this.player = player;
    }
    from_human(name, quantity, human){
        
        //console.log(name, quantity, human);
        if (!human.do_they_have(name, quantity)){
            console.log("error: they don't got this.");
            return;
        } else if (!this.player.inventory.query.can_they_take(name, quantity)){
            console.log('error');
            return;
        }
        this.player.inventory.move.change_weight(this.player.inventory.query.fetch_weight(name, quantity));
        let npc_item = human.fetch_item(name);
        if (npc_item.quantity == quantity){
            human.delete_item(name);
        } else {
            npc_item.quantity -= quantity;
        }

        if (Config.stackable.includes(name) && this.player.inventory.query.is_in_inventory(name)){
            this.player.inventory.move.stack_item_in_inventory(name, quantity);
            return;
        } else if (Config.stackable.includes(name)){
            this.player.state.inventory.push({ name: name, quantity: quantity, durability: 100 });
            return;
        }
        while(this.player.state.inventory.length < this.player.state.slots_in_inventory){
            this.player.state.inventory.push({ name: name, quantity: 1, durability: 100});
        }
    }

    all(map){
        let at = this.player.fetch_from();
        if (map.loot[at] == undefined){
            return null;
        }
        let id = 0;
        let taken = [];
        while (map.loot[at].stuff.length > 0){            
            let status = this.item(id, map);            
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

    item(id, map){
        //you should be able to take stuff when adjacent but not now
        let at = this.player.fetch_from();
        //console.log(id, map.loot[at].stuff)
        if (map.loot[at] == undefined 
            || (map.loot[at] != undefined && !this.player.inventory.query.can_they_take(map.loot[at].stuff[id].name, map.loot[at].stuff[id].quantity))){
            return false;
        }
        let txt = `${map.loot[at].stuff[id].quantity} ${map.loot[at].stuff[id].name}`;
        let weight = this.player.inventory.query.fetch_weight(map.loot[at].stuff[id].name, map.loot[at].stuff[id].quantity);
        let what = map.loot[at].stuff[id].name;
        this.player.inventory.move.change_weight(weight);
        

        if (Config.stackable.includes(what) && this.player.inventory.query.is_in_inventory(what)){
            this.player.inventory.move.stack_item_in_inventory(what, map.loot[at].stuff[id].quantity);
            map.loot[at].stuff.splice(id, 1)
        } else {
            this.player.state.inventory.push(map.loot[at].stuff.splice(id, 1)[0]);        
        }
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