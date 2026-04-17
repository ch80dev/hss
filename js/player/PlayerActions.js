class PlayerActions {
    constructor(player){
        this.player = player
    }
     


    attack(x, y, juego){
        let map_at = juego.map.queries.at(x, y);
        let target = null;
        if (map_at == Config.cell_class.indexOf('rat')){
            target = juego.fetch_rat(this.player.state.location.type, this.player.state.location.id, x, y);
        } else if (map_at == Config.cell_class.indexOf('human')){
            target = juego.fetch_human_by_loc(this.player.state.location.type, this.player.state.location.id, x, y);
        }
        this.player.status.change_stamina_delta(Config.stamina_cost['attack']);
        let did_they_hit = rand_num(1, 100) <= this.player.state.stamina;
        let max_dmg = 1;
        let weapon_equipped =  null;
        if (this.player.state.equipped != null){
            weapon_equipped = this.player.state.inventory[this.player.state.equipped].name;
            max_dmg = Config.weapon_dmgs[weapon_equipped];
            this.player.inventory.use.weapon();
        }
        let dmg = rand_num(1, max_dmg);
        if (did_they_hit){
            target.get_hit(dmg);
            let money_caption = '';
            if (target.money > 0 && target.health < 1){
                money_caption = ` You took $${target.money} from them. `;
            }
            if (target.health < 1){                                
                juego.map.loot[juego.map.format_at(this.player.state.location.type, this.player.state.location.id, x, y)] = { stuff: null };
                juego.map.loot[juego.map.format_at(this.player.state.location.type, this.player.state.location.id, x, y)].stuff = target.inventory;
                this.player.state.money += target.money;
                target.money = 0;
            }
            ui.log(`You hit them for ${dmg} dmg. [${target.health}] ${money_caption}`);
            return;
        }
        ui.log(`You missed them! ${target.health}/${target.max_health}`);
    }

    buy_unique(inventory_id, shop){
        let item = shop.inventory[inventory_id];
        if (item == undefined || (item != undefined && this.player.state.money < Config.prices[item.name]) || this.player.inventory.queries.are_they_full()){
            console.log('error');
            return;
        }   
        let new_item = shop.inventory.splice(inventory_id, 1)[0];
        new_item.id = this.player.inventory.next_id();
        this.player.state.inventory.push(new_item);
        this.player.inventory.move.sort();
        this.player.status.change_money(-Config.prices[item.name]);

    }

    enter_shop(x, y, map){
        
        let shop_on_map = map.queries.fetch_shop(x, y);
        if (shop_on_map == null){
            console.log('error');
            return;
        }
        this.player.state.shopping = shop_on_map.id;
        ui.change_screen('shop');
    }

    interact(id, human, time){
        //console.log(id, human, time);
        if (human.interactions[id] == undefined){
            console.log('error');
            return;
        }
        let interaction = human.interactions[id];       
        if (interaction == 'beg' && human.begging_unlocked == true 
            && this.player.state.stigma >= human.min_stigma_beg){            
            this.player.state.money += human.give_when_begged;                      
            ui.log(`They gave you $${human.give_when_begged}.`)
            human.begged(time);
        } else if (interaction == 'buy' 
            && this.player.state.money >= human.conversion[id] 
            && this.player.inventory.queries.can_they_take(human.resources[id], 1)){ 
            this.player.state.money -= human.conversion[id];
            this.player.inventory.take.from_human(human.resources[id], 1, human);
            ui.log(`You bought ${human.resources[id]} for $${human.conversion[id]}.`)
        } else if (interaction == 'sell' && this.player.inventory.queries.do_they_have(human.resources[id], 1)){ 
            this.player.inventory.move.give_to_human(human.resources[id], 1, human);
            this.player.money += human.conversion[id];
            ui.log(`You sell ${human.resources[id]} for $${human.conversion[id]}.`)
        } 

    }
    
    look (x, y, map){
        let simple = ["rat", 'human'];
        if (this.player.state.looking_at != null && this.player.state.looking_at.x == x && this.player.state.looking_at.y == y){
            this.player.looking_at = null;
            return;
        }
        this.player.state.looking_at = { x: x, y: y };
        let map_at = map.queries.at(x, y);
        let msg = `(${x}, ${y}) There is nothing here.`;
        if (map_at == null){
            return;
        }
        let at = map.format_at(this.player.state.location.type, this.player.state.location.id, x, y);
        let cell_class = Config.cell_class[map_at];
        let trash = map.loot[at];
        if (cell_class.split('_').length > 0 && cell_class.split("_")[1] == 'exit'){
            msg = `(${x}, ${y}) There is a ${cell_class.split("_")[0]} ${cell_class.split("_")[1]} here.`;
        } else if (simple.includes(cell_class)){
            msg = `(${x}, ${y}) There is a ${cell_class} here.`; // later show health and show if homeless
        } else if (cell_class == 'crate'){
            msg = `(${x}, ${y}) You placed a crate here for your stuff.`;
        } else if (cell_class == 'trash' && trash != null && trash.locked){
            msg = `(${x}, ${y}) There is a locked trash can here. (need a tool to open)`;
        } else if (cell_class == 'trash' && trash != null && !trash.locked){
            msg = `(${x}, ${y}) There is a trash can here.`;
        }
        
        ui.log(msg);
    }

    loot_corpse(map, juego){

        let target = juego.fetch_target(this.player.state.location.type, this.player.state.location.id, this.player.state.x, this.player.state.y);
        if (target == null){
            return;
        }
        ui.change_screen('loot');
        this.player.state.looting = true;

    }

    open_trash(map){
        
        let taken_arr = this.player.inventory.take.all(map);        
        let txt = `You looted:  ${taken_arr.join(", ")} [${this.player.state.inventory.length}/${this.player.state.slots_in_inventory}]`;
        if (this.player.state.auto_loot){
            ui.log(txt);
        }
        let at = this.player.fetch_from();
        if (!this.player.state.auto_loot || map.loot[at] != undefined && map.loot[at].stuff.length > 0){
            ui.change_screen('loot');
            this.player.state.looting = true;            
            return;
        }
       
        
    }

    search_trash(x, y, map){
        let trash = map.loot[this.player.fetch_from()];
        this.player.status.change_stigma(Config.stigma_effects['trash']);
        if (trash == undefined){
            console.log('trash');
            return;
        }
        this.player.status.change_stamina_delta(-.4);
        if (trash.stuff.length == 0){
            ui.log("Nothing usable in trash");
            delete map.loot[this.player.fetch_from()];
            map.is(x, y, 1);
            return;
        }
        this.open_trash(map);
        
    }

    sell_all_recycling(shop){
        if (shop == null){
            return;
        }
        for (let resource_id in shop.resources){
            this.sell_to_shop(resource_id, shop);
        }
    }

    sell_to_shop(resource_id, shop){
        
        let resource = shop.resources[resource_id];
        if (resource == undefined || (resource != undefined && !this.player.inventory.queries.is_in_inventory(resource))){
            console.log('error: this is okay if you did sell_all_recycling');
            return;
        }
        let item = this.player.inventory.fetch.by_name(resource);
        let quantity = shop.selling;
        if (quantity == 'all' || quantity > item.quantity){
            quantity = item.quantity;
        }
        //console.log(resource, quantity, quantity * Config.prices[resource])
        this.player.status.change_money(quantity * Config.prices[resource]);
        item.quantity -= quantity;
        if (item.quantity < 1){
            this.player.inventory.move.delete(resource, null);
        }
    }

    sell_unique(inventory_id, shop){
        console.log('bug: ', inventory_id, shop);
        let item = this.player.inventory.fetch.by_id(inventory_id);
        if (item == undefined){
            console.log('error');
            return;
        }   
        shop.inventory.push(item);
        this.player.inventory.move.delete(null, inventory_id);
        this.player.status.change_money(Math.round(Config.prices[item.name] * item.durability * .005));

    }

    social(x, y, juego){
        //console.log('social', x, y, juego);
        let human = juego.fetch_human_by_loc(this.player.state.location.type, this.player.state.location.id, x, y);
        if (human == null){
            return;
        }

        if (this.player.state.stigma > human.max_stigma_tolerance){
            ui.log("They don't want to talk to you. Your stigma is too high.");
            return;
        }
        this.player.state.socializing = human.id;
        ui.change_screen('social');

    }

    trade(interaction_id, conversion_id, human){
        //console.log(interaction_id, conversion_id, human);        
        if (human == null ){
            console.log('error');
            return;
        }                
        let player_resource = Object.keys(human.resources[interaction_id])[0];
        let player_quantity = human.conversion[interaction_id][0];
        let human_resource = human.resources[interaction_id][player_resource];
        let human_quantity = human.conversion[interaction_id][1];        
        if (conversion_id == 1){
            human_resource = Object.keys(human.resources[interaction_id])[0];
            human_quantity = human.conversion[interaction_id][0]
            player_resource = human.resources[interaction_id][human_resource];
            player_quantity = human.conversion[interaction_id][1];
            
        }
        
        
        
        if (!this.player.inventory.queries.do_they_have(player_resource, player_quantity) 
            || !human.do_they_have(human_resource, human_quantity)){
            console.log('not enough', player_resource, player_quantity, this.player.inventory.queries.do_they_have(player_resource, player_quantity), human_resource, human_quantity, human.do_they_have(human_resource, human_quantity));
            return;
        }
        this.player.inventory.move.give_to_human(player_resource, player_quantity, human);
        this.player.inventory.take.from_human(human_resource, human_quantity, human);
        ui.log(`You give ${player_quantity} ${player_resource} and receive ${human_quantity} ${human_resource}.`)
    }

    unlock_trash(x, y, map){
        let at = map.format_at(this.player.state.location.type, this.player.state.location.id, x, y);
        let durability_cost = rand_num(1, 5);
        this.player.inventory.use.equipment(durability_cost);
        if (map.loot[at] == undefined){
            return;
        }
        map.loot[at].locked = false;
        this.player.state.x = x;
        this.player.state.y = y;
        this.search_trash(x, y, map);

    }

    
}
