class InventoryUse{
    constructor(player){
        this.player = player;
    }
    equip(id){
        this.player.state.equipped = id;
    }

    
    
    equipment(usage_cost){
        //console.log('use', this.player.state.equipped);
        if (this.player.state.equipped == null){
            return;
        }
        let item = this.player.inventory.fetch.by_id(this.player.state.equipped);
        item.durability -= usage_cost;
        if (item.durability <= 0){
            this.player.inventory.delete(null, this.player.state.equipped);            
            this.player.state.equipped = null;
            
        }

    }

    item(id, map){
        let item = this.player.inventory.fetch.by_id(id);
        let medicine_works = rand_num(1, 10) == 1;
        //console.log(id, item);
        if (!this.player.inventory.queries.can_they_use(item.name, map)){
            console.log('cant use');
            return;
        }
        if (item.name == 'crate'){           
            item.name = 'crate (placed)';
            this.player.inventory.move.drop_item(id, map);
            map.is(this.player.state.x, this.player.state.y, 8);
            return;
        } else if (item.name == 'food' || item.name == 'food (spoiled)'){
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
        this.player.inventory.move.delete(null, id);
        
    }
    weapon(){

        if (this.player.state.equipped == null 
            || (this.player.state.equipped != null 
            && (this.player.inventory.fetch.by_id(this.player.state.equipped) == undefined 
                || (this.player.inventory.fetch.by_id(this.player.state.equipped) != undefined 
                && !Object.keys(Config.weapon_dmgs).includes(this.player.inventory.fetch.by_id(this.player.state.equipped).name))) )){
            console.log('error')
            return;            
        }
        let item = this.player.inventory.fetch.by_id(this.player.state.equipped);
        let durability_hit_per_use = Config.weapon_durability_uses[this.player.inventory.fetch.by_id(this.player.state.equipped).name];
        item.durability -= durability_hit_per_use;
        if (item.durability < 1){
            ui.log(`You broke your ${item.name}.`);
            this.player.inventory.move.delete(null, this.player.state.equipped);
            this.player.state.equipped = null;
            
        }
    }
}