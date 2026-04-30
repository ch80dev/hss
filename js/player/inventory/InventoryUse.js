class InventoryUse{
    constructor(player){
        this.player = player;
    }
    bag(){
        if (this.player.state.equipped.bag == null){
            return;
        }
        let item = this.player.inventory.fetch.by_id(this.player.state.equipped.bag);
        if (item == null){
            return;
        }
        let usage = ItemConfig.bags_durability_uses[item.name];
        item.durability -= usage;
        if (item.durability < 1){
            this.unequip('bag');
            ui.log(`Your bag broke!`);
            this.player.inventory.move.delete(null, item.id);
        }
    }
    equip(id){
        let item = this.player.inventory.fetch.by_id(id);
        if (ItemConfig.lights.includes(item.name)){            
            this.player.state.equipped.light = id;
            return;

        } else if (ItemConfig.bags.includes(item.name)){
            this.player.state.equipped.bag = id;
            this.player.state.inventory_slots += ItemConfig.bags_slots[item.name];
            return;
        }
        this.player.state.equipped.hand= id;
    }

    
    
    equipment(usage_cost){
        if (this.player.state.equipped.hand== null){
            return;
        }
        let item = this.player.inventory.fetch.by_id(this.player.state.equipped.hand);
        item.durability -= usage_cost;
        if (item.durability <= 0){
            this.player.inventory.move.delete(null, this.player.state.equipped.hand);            
            this.player.state.equipped.hand= null;
        }

    }

    item(id, map){
        let item = this.player.inventory.fetch.by_id(id);
        let loot = map.loot[this.player.fetch_from()];
        let medicine_works = rand_num(1, 4) == 1;
        if (!this.player.inventory.get.can_they_use(item.name, map)){
            console.log('cant use');
            return;
        }
        if (item.name == 'crate'){           
            this.player.inventory.move.drop_item(id, map, 'crate (placed)');
            map.is(this.player.state.x, this.player.state.y, MapConfig.cell_class.indexOf('crate'));
            return;
        } else if (item.name == 'tent'){
            this.player.inventory.move.drop_item(id, map, 'tent (placed)');
            map.is(this.player.state.x, this.player.state.y, MapConfig.cell_class.indexOf('tent'));
            return;
        } else if (item.name == 'sleeping bag' && this.player.status.can_they_sleep() && loot == null || (loot != null && loot.type == null)){
            this.player.status.add_crime('sleep');
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
                this.player.status.change_health(-Number((rand_num(0, 2) * .1).toFixed(1)));
                gain = Math.round(ItemConfig.medicine_gain[1] / 2);
            }
            this.player.status.change_sickness(-rand_num(ItemConfig.medicine_gain[0], gain));
        }
 
        if (Object.keys(ItemConfig.food_gain).includes(item.name) && item.durability == 0){
            this.player.status.change_stigma(Number((rand_num(5, 2) * .1).toFixed(1)));
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
        if (this.player.state.equipped.light== null){
            console.log('error');
            return;
        }
        let light = this.player.inventory.fetch.by_id(this.player.state.equipped.light);
        light.durability -= ItemConfig.light_durability_uses[light.name];
        if (light.durability < 1){
            ui.log (`You broke your ${light.name}.`);
            this.player.inventory.move.delete(null, this.player.state.equipped.light);
            this.player.state.equipped.light= null;
        }
    }

    weapon(){

        if (this.player.state.equipped.hand== null 
            || (this.player.state.equipped.hand!= null 
            && (this.player.inventory.fetch.by_id(this.player.state.equipped.hand) == undefined 
                || (this.player.inventory.fetch.by_id(this.player.state.equipped.hand) != undefined 
                && !Object.keys(ItemConfig.weapon_dmgs).includes(this.player.inventory.fetch.by_id(this.player.state.equipped.hand).name))) )){
            console.log('error')
            return;            
        }
        let item = this.player.inventory.fetch.by_id(this.player.state.equipped.hand);
        let durability_hit_per_use = ItemConfig.weapon_durability_uses[this.player.inventory.fetch.by_id(this.player.state.equipped.hand).name];
        item.durability -= durability_hit_per_use;
        if (item.durability < 1){
            ui.log(`You broke your ${item.name}.`);
            this.player.inventory.move.delete(null, this.player.state.equipped.hand);
            this.player.state.equipped.hand= null;
        }
    }

    unequip(what){
        if (!Object.keys(this.player.state.equipped).includes(what)){
            console.log('error');
            return;
        }
        let item = this.player.inventory.fetch.by_id(this.player.state.equipped[what]);
        if (item != null && ItemConfig.bags.includes(item.name)){
            this.player.state.inventory_slots -= ItemConfig.bags_slots[item.name];
        }
        this.player.state.equipped[what] = null;
        
    }
}