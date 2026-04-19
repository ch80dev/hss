class InventoryMove{
    constructor(player){
        this.player = player;
    }

    change_weight(delta){
        //console.log('change_weight: bug', delta, this.player.state.inventory_weight);
        this.player.state.inventory_weight += Number(delta);
    }
    delete(name, item_id){
        let equipped = { name: null, durability: null };
        if (this.player.state.equipped != null){
            let equipment = this.player.inventory.fetch.by_id(this.player.state.equipped);
            equipped.name = equipment.name;
            equipped.durability = equipment.durability;
        }
        for (let id in this.player.state.inventory){
            let item = this.player.state.inventory[id]; // need this for 21
            if ((name != null && item.name == name) || (item_id != null && item.id == item_id)){
                this.player.state.inventory.splice(id, 1);
                break;
            }
        }
        if (this.player.state.equipped == null ){
            return;
        }
        for (let id in this.player.state.inventory){
            let item = this.player.state.inventory[id];
            console.log(id, item);
            if (item.name == equipped.name && item.durability == equipped.durability && this.player.state.equipped != item.id){
                this.player.state.equipped = item.id;
                return;
            }
        }
    }




    
    drop_item(id, map){
        let at = this.player.fetch_from();
        let item = this.player.inventory.fetch.by_id(id);
        this.change_weight(-this.player.inventory.get.fetch_weight(item.name, 1));
        if (ItemConfig.stackable.includes(item.name) && map.get.inspector.is_item_here(item.name, at)){
            map.stack_items(item.name, item.quantity, at);
            this.delete(null, item.id);
            return;
        } 
        if (map.loot[at] == undefined){
            map.loot[at] = { locked: false, searched: false, stuff: []};
        } 
        map.loot[at].stuff.push(item);        
        this.delete(null, id);
    }

     give_to_human(name, quantity, human){
        if (!this.player.inventory.get.do_they_have(name, quantity)){
            console.log('error');
            return;
        }
        let item = this.player.inventory.fetch.by_name(name);
        this.change_weight(-this.player.inventory.get.fetch_weight(name, quantity));
       if (ItemConfig.stackable.includes(name)){            
            item.quantity -= quantity;        
        }

         if (!ItemConfig.stackable.includes(name) 
            || (ItemConfig.stackable.includes(name) && item.quantity < 1)){
            this.delete(name, null);                        
        } 
        human.give(name, quantity);
    }

    

    item(from, id, map){ //from world
        //console.log(from, id);
        if (from == 'loot'){
            this.player.inventory.take.item(id, map, null);   
            return;     
        }
        this.drop_item(id, map);
    }

    sort(){
        this.player.state.inventory = this.player.state.inventory.sort((a, b) => {
            // localeCompare returns -1, 0, or 1 depending on the alphabetical order
            return a.name.localeCompare(b.name);
        });
    }

    stack_item_in_inventory(what, n){
        for (let item of this.player.state.inventory){
            if (item.name == what){
                item.quantity += n;
                return;
            }
        }
    }

}