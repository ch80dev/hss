class InventoryQueries{
    constructor(player){
        this.player = player;
    }
    are_they_full(){
        return this.player.state.inventory.length >= this.player.state.slots_in_inventory  
            || this.player.state.inventory_weight >= this.player.state.max_inventory_weight        
    }
    
    calculate_total_weight(){
        let n = 0;
        for (let item of this.player.state.inventory){
            n += this.fetch_weight(item.name, item.quantity);
        }
        console.log(n);
        return n;
    }

    can_they_take(name, quantity){
        let weight = this.fetch_weight(name, quantity);
        if (weight + this.player.state.inventory_weight >= this.player.state.max_inventory_weight){
            console.log('a');
            return false;
        } else if (ItemConfig.stackable.includes(name) && this.is_in_inventory(name)){
            return true;
        } else if (this.player.state.inventory.length >= this.player.state.slots_in_inventory ){
            return false;
        }
        return true;
    }

    can_they_use(name, map){
        if ((name == 'lighter' && !this.is_in_inventory('fuel')) 
            || (name == 'crate' && map.get.inspector.is_item_here('crate (placed)', this.player.fetch_from()))
            || (name == 'crate' && map.get.at(this.player.state.x, this.player.state.y) != 1)){
            return false;

        }
        return ItemConfig.usable.includes(name);
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

    fetch_quantity(name){
        let item = this.player.inventory.fetch.by_name(name);
        if (item == null){
            return 0;
        }
        return item.quantity;
    }



    fetch_weight(name, quantity){
        //console.log(name, quantity, ItemConfig.weights[name]);
        return ItemConfig.weights[name] * quantity;
    }

    has_a_tool(){
        for (let tool of Object.keys(ItemConfig.tool_durability_uses)){
            if(this.is_equipped_with(tool)){
                return true;
            }
        }
        return false;
    }

    is_equipped_with(what){
        if (this.player.state.equipped == null){
            return false;
        }

        let item = this.player.inventory.fetch.by_id(this.player.state.equipped);
        if (item != null && item.name == what){
            return true;
        }
        return false;
    }

    is_in_inventory(what){
        for (let item of this.player.state.inventory){
            //console.log(what, item.name);
            if (item.name == what){
                return true;
            }
        }
        return false;
    }
}