class InventoryUse{
    constructor(player){
        this.player = player;
    }
    equip(id){
        let item = this.player.inventory.fetch.by_id(id);
        if (ItemConfig.lights.includes(item.name)){
            this.player.state.light_equipped = id;
        }
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
        let medicine_works = rand_num(1, 3) == 1;
        //console.log(id, item);
        if (!this.player.inventory.get.can_they_use(item.name, map)){
            console.log('cant use');
            return;
        }
        if (item.name == 'crate'){           
            item.name = 'crate (placed)';
            this.player.inventory.move.drop_item(id, map);
            map.is(this.player.state.x, this.player.state.y, MapConfig.cell_class.indexOf('crate'));
            return;
        } else if (item.name == 'tent'){
            item.name = 'tent (placed)';
            this.player.inventory.move.drop_item(id, map);
            map.is(this.player.state.x, this.player.state.y, MapConfig.cell_class.indexOf('tent'));
            return;
        } else if (item.name == 'sleeping bag' && this.player.status.can_they_sleep()){
            this.player.status.add_time(8, 0);
            let caption = "";
            let penalty = this.player.status.sleep(false, false);
            item.durability -= 1;
            if (item.durability < 1){ 
                this.player.inventory.move.delete(null, id);
                caption = " Your sleeping bag broke!";
            }
            ui.sleeping = true;
            ui.log(`You sleep in a sleeping bag and take a small health penalty for sleeping outside. [${penalty}] ${caption}`)
            ui.change_screen('map');
            this.player.state.looting = false;
            return;
        } else if (Object.keys(ItemConfig.food_gain).includes(item.name)){
            this.player.status.change_stamina(ItemConfig.food_gain[item.name]);
        } else if (item.name == 'medicine' || (medicine_works && item.name == 'medicine (expired)')){
            let gain = ItemConfig.medicine_gain[1];
            if (item.name == 'medicine (expired)'){
                gain = Math.round(ItemConfig.medicine_gain[1] / 2);
            }
            this.player.status.change_sickness(-rand_num(ItemConfig.medicine_gain[0], gain));
            
        }

        if (Object.keys(ItemConfig.food_gain).includes(item.name) && item.durability == 0){
            this.player.status.change_sickness(rand_num(ItemConfig.spoiled_sick_gain[0], ItemConfig.spoiled_sick_gain[1]));
        }

        if (ItemConfig.stackable.includes(item.name)){
            item.quantity --;
            if (item.quantity > 0){
                return;
            }
        }
        this.player.inventory.move.delete(null, id);
        
    }

    light(){
        if (this.player.state.light_equipped == null){
            console.log('error');
            return;
        }
        let light = this.player.inventory.fetch.by_id(this.player.state.light_equipped);

        light.durability -= ItemConfig.light_durability_uses[light.name];
        if (light.durability < 1){
            ui.log (`You broke your ${light.name}.`);
            this.player.inventory.move.delete(null, this.player.state.light_equipped);
            this.player.state.light_equipped = null;
        }
    }
    weapon(){

        if (this.player.state.equipped == null 
            || (this.player.state.equipped != null 
            && (this.player.inventory.fetch.by_id(this.player.state.equipped) == undefined 
                || (this.player.inventory.fetch.by_id(this.player.state.equipped) != undefined 
                && !Object.keys(ItemConfig.weapon_dmgs).includes(this.player.inventory.fetch.by_id(this.player.state.equipped).name))) )){
            console.log('error')
            return;            
        }
        let item = this.player.inventory.fetch.by_id(this.player.state.equipped);
        let durability_hit_per_use = ItemConfig.weapon_durability_uses[this.player.inventory.fetch.by_id(this.player.state.equipped).name];
        item.durability -= durability_hit_per_use;
        if (item.durability < 1){
            ui.log(`You broke your ${item.name}.`);
            this.player.inventory.move.delete(null, this.player.state.equipped);
            this.player.state.equipped = null;
            
        }
    }
}