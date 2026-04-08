class PlayerInventory {
    constructor(player){
        this.player = player;
    }

    can_they_take(name, quantity){
        let weight = this.fetch_weight(name, quantity);
        if (weight + this.player.state.inventory_weight >= this.player.state.max_inventory_weight){
            return false;
        } else if (Config.stackable.includes(name) && this.is_in_inventory(name)){
            return true;
        } else if (this.player.state.inventory.length >= this.player.state.slots_in_inventory ){
            return false;
        }
        return true;
    }

    can_they_use(name, map){
        if ((name == 'lighter' && !this.is_in_inventory('fuel')) 
            || (name == 'crate' && map.is_item_here('crate (placed)', this.player.fetch_from()))
            || (name == 'crate' && map.queries.at(this.player.state.x, this.player.state.y) != 1)){
            return false;

        }
        return Config.usable.includes(name);
    }
    
    drop_item(id, map){
        let at = this.player.fetch_from();
        let item = this.player.state.inventory[id];
        
        if (Config.stackable.includes(item.name) && map.queries.is_item_here(item.name, at)){
            map.stack_items(item.name, item.quantity, at);
            this.player.state.inventory.splice(id, 1)
            return;
        } 
        console.log(map.loot, at);
        if (map.loot[at] == undefined){
            map.loot[at] = { locked: false, searched: false, stuff: []};
        } 
        map.loot[at].stuff.push(this.player.state.inventory.splice(id, 1)[0]);        
                
    }

    equip(id){
        this.player.state.equipped = id;
    }

    fetch(id){
        if (this.player.state.inventory[id] == undefined){
            return null;
        }
        return this.player.state.inventory[id];
    }

    fetch_weight(name, quantity){
        
        return Config.weights[name] * quantity;
    }

    is_equipped_with(what){
        if (this.player.state.equipped == null){
            return false;
        }
        let item = this.fetch(this.player.state.equipped);
        if (item.name == what){
            return true;
        }
        return false;
    }

    is_in_inventory(what){
        for (let item of this.player.state.inventory){
            if (item.name == what){
                return true;
            }
        }
        return false;
    }

    move_item(from, id, map){
        //console.log(from, id);
        if (from == 'loot'){
            this.take_item(id, map);   
            return;     
        }
        this.drop_item(id, map);
    }

    stack_item_in_inventory(what, n){
        for (let item of this.player.state.inventory){
            if (item.name == what){
                item.quantity += n;
                return;
            }
        }
    }

    take_all(map){
        let at = this.player.fetch_from();
        if (map.loot[at] == undefined){
            return;
        }
        console.log(map.loot[at].stuff.length, map.loot[at], at);
        while (map.loot[at] && map.loot[at].stuff.length > 0){
            let status = this.take_item(0, map);
            if (status === false){
                return;
            }
        }
    }

    take_item(id, map){
        //you should be able to take stuff when adjacent but not now
        let at = this.player.fetch_from();
        if (map.loot[at] == undefined 
            || (map.loot[at] != undefined && !this.can_they_take(map.loot[at].stuff[id].name, map.loot[at].stuff[id].quantity))){
            return false;
        }
        let weight = this.fetch_weight(map.loot[at].stuff[id].name, map.loot[at].stuff[id].quantity);
        let what = map.loot[at].stuff[id].name;
        this.player.state.inventory_weight += weight;

        if (Config.stackable.includes(what) && this.is_in_inventory(what)){
            this.stack_item_in_inventory(what, map.loot[at].stuff[id].quantity);
            map.loot[at].stuff.splice(id, 1)
        } else {
            this.player.state.inventory.push(map.loot[at].stuff.splice(id, 1)[0]);        
        }
        
        if (map.loot[at].stuff.length == 0 && map.queries.at(this.player.state.x, this.player.state.y) == 5){
            map.is(this.player.state.x, this.player.state.y, 1);
        }
        if (map.loot[at].stuff.length == 0){
            delete map.loot[at];
            this.player.state.looting = false;
            ui.change_screen('map');
        }
    }

    use_equipment(usage_cost){
        console.log('use', this.player.state.equipped);
        if (this.player.state.equipped == null){
            return;
        }
        console.log(usage_cost);
        let item = this.fetch(this.player.state.equipped);
        item.durability -= usage_cost;
        if (item.durability <= 0){
            this.player.state.equipped = null;
            this.player.state.inventory.splice(id, 1);
        }

    }

}
