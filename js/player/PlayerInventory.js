class PlayerInventory {
    constructor(player){
        this.player = player;
    }

    are_they_full(){
        return this.player.state.inventory.length >= this.player.state.slots_in_inventory  
            || this.player.state.inventory_weight >= this.player.state.max_inventory_weight        
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
            || (name == 'crate' && map.queries.is_item_here('crate (placed)', this.player.fetch_from()))
            || (name == 'crate' && map.queries.at(this.player.state.x, this.player.state.y) != 1)){
            return false;

        }
        return Config.usable.includes(name);
    }

    delete(name, item_id){
        let equipped = { name: null, durability: null };
        if (this.player.state.equipped != null){
            let equipment = this.fetch(this.player.state.equipped);
            equipped.name = equipment.name;
            equipped.durability = equipment.durability;
        }
        for (let id in this.player.state.inventory){
            let item = this.player.state.inventory[id];
            if ((name != null && item.name == name) || (item_id != null && id == item_id)){
                this.player.state.inventory.splice(id, 1);
                break;
            }
        }
        if (this.player.state.equipped == null ){
            return;
        }
        for (let id in this.player.state.inventory){
            let item = this.player.state.inventory[id];
            if (item.name == equipped.name && item.durability == equipped.durability && this.player.state.equipped != id){
                this.player.state.equipped = id;
                return;
            }
        }
    }



    do_they_have(what, quantity){
        //console.log(what, quantity);
        if (!this.is_in_inventory(what)){
            //console.log("not_in_inventory");
            return false;
        }
        //console.log(this.player.state.inventory);
        for (let item of this.player.state.inventory){
            //console.log(item, what, quantity);
            if (item.name == what && item.quantity >= quantity){
                return true;
            }
        }
        return false;
    }
    
    drop_item(id, map){
        let at = this.player.fetch_from();
        let item = this.player.state.inventory[id];
        
        if (Config.stackable.includes(item.name) && map.queries.is_item_here(item.name, at)){
            map.stack_items(item.name, item.quantity, at);
            this.player.state.inventory.splice(id, 1)
            return;
        } 
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

    fetch_all_items(arr){
        let id_arr = [];
        for (let id in this.player.state.inventory){
            let item = this.player.state.inventory[id];
            if (arr.includes(item.name)){
                id_arr.push(id);
            }
        }
        return id_arr;
    }

    fetch_by_name(name){
        for (let item of this.player.state.inventory){
            if (item.name == name){
                return item;
            }
        }
        //console.log('error');
        return null;
    }

    fetch_quantity(name){
        let item = this.fetch_by_name(name);
        if (item == null){
            return 0;
        }
        return item.quantity;
    }

    fetch_weight(name, quantity){
        
        return Config.weights[name] * quantity;
    }

    give_to_human(name, quantity, human){
        if (!this.do_they_have(name, quantity)){
            console.log('error');
            return;
        }
        let item = this.fetch_by_name(name);
        if (!Config.stackable.includes(name) 
            || (Config.stackable.includes(name) && !this.do_they_have(name, quantity))){
            this.delete(name);                        
        } else if (Config.stackable.includes(name)){            
            item.quantity -= quantity;        
        }


        human.give(name, quantity);
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

    move_item(from, id, map){ //from world
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
    take_from_human(name, quantity, human){
        
        //console.log(name, quantity, human);
        if (!human.do_they_have(name, quantity)){
            console.log("error: they don't got this.");
            return;
        }
        let npc_item = human.fetch_item(name);
        if (npc_item.quantity == quantity){
            human.delete_item(name);
        } else {
            npc_item.quantity -= quantity;
        }

        if (Config.stackable.includes(name) && this.is_in_inventory(name)){
            this.stack_item_in_inventory(name, quantity);
            return;
        } else if (Config.stackable.includes(name)){
            this.player.state.inventory.push({ name: name, quantity: quantity, durability: 100 });
            return;
        }
        while(this.player.state.inventory.length < this.player.state.slots_in_inventory){
            this.player.state.inventory.push({ name: name, quantity: 1, durability: 100});
        }
    }

    take_all(map){
        let at = this.player.fetch_from();
        if (map.loot[at] == undefined){
            return;
        }
        let id = 0;
        while (map.loot[at].stuff.length > 0){            
            let status = this.take_item(id, map);            
            if (status === false){
                id ++;
                continue;
            }
            if (map.loot[at] == undefined || id > map.loot[at].length){
                return;
            }
            
        }
    }

    take_item(id, map){
        //you should be able to take stuff when adjacent but not now
        let at = this.player.fetch_from();
        console.log(id, map.loot[at].stuff)
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
        //console.log('use', this.player.state.equipped);
        if (this.player.state.equipped == null){
            return;
        }
        let item = this.fetch(this.player.state.equipped);
        item.durability -= usage_cost;
        if (item.durability <= 0){
            this.player.state.inventory.splice(this.player.state.equipped , 1);
            this.player.state.equipped = null;
            
        }

    }

    use_item(id, map){
        let item = this.player.state.inventory[id];
        let medicine_works = rand_num(1, 10) == 1;
        //console.log(id, item);
        if (!this.player.inventory.can_they_use(item.name, map)){
            console.log('cant use');
            return;
        }
        if (item.name == 'crate'){
           
            item.name = 'crate (placed)';
            this.player.inventory.drop_item(id, map);
            map.is(this.player.state.x, this.player.state.y, 8);
            return;
        } else if (item.name == 'food' || item.name == 'food (spoiled)'){
            console.log("food");            
            this.player.status.change_stamina(rand_num(Config.food_gain[0], Config.food_gain[1]));
        } else if (item.name == 'medicine' || (medicine_works && item.name == 'medicine(expired)')){
            this.player.status.change_sickness(-rand_num(Config.medicine_gain[0], Config.medicine_gain[1]));
        
        }

        if (item.name == 'food (spoiled)'){
            this.player.status.change_sickness(rand_num(Config.spoiled_sick_gain[0], Config.spoiled_sick_gain[1]));
        }

        if (Config.stackable.includes(item.name)){
            item.quantity --;
            if (item.quantity > 0){
                return;
            }
        }
        
        this.player.state.inventory.splice(id, 1);
    }

}
