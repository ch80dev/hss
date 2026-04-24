class PlayerShop{
    constructor(player){
        this.player = player;
    }

    buy_from_shop(resource_id, shop){
        
        let item = shop.resources[resource_id];
        let cost = ItemConfig.prices[item];
        if (item == undefined || this.player.state.money < ItemConfig.prices[item] 
            || !this.player.inventory.get.can_they_take(item, 1)){
            return null;
        }
        this.player.status.change_money(-cost);
        this.player.state.inventory.push({id: this.player.inventory.next_id(), name: item, quantity: 1, durability: 100 });
        ui.log(`You spent $${cost} [${this.player.state.money}] to buy a ${item}.`);
    }
    buy_unique(inventory_id, shop){
        let item = shop.inventory[inventory_id];
        if (item == undefined || (item != undefined && this.player.state.money < ItemConfig.prices[item.name]) || this.player.inventory.get.are_they_full()){
            console.log('error');
            return;
        }   
        let new_item = shop.inventory.splice(inventory_id, 1)[0];
        new_item.id = this.player.inventory.next_id();
        this.player.state.inventory.push(new_item);
        this.player.inventory.move.sort();
        this.player.status.change_money(-ItemConfig.prices[item.name]);
        
    }


    sell_all_recycling(shop){
        if (shop == null){
            return;
        }
        let n = 0;
        for (let resource_id in shop.resources){
            n += this.sell_to_shop(resource_id, shop);
        }
        ui.log(`You made $${n.toFixed(2)} selling all your recyclables.`);
    }

    enter(x, y, map){
        
        let shop_on_map = map.get.inspector.entity.fetch_shop(this.player.state.location.type, this.player.state.location.id, x, y);
        if (shop_on_map == null){
            console.log('error');
            return;
        }
        this.player.state.shopping = shop_on_map.id;
        ui.change_screen('shop');
    }

    sell_to_shop(resource_id, shop){
        
        let resource = shop.resources[resource_id];
        if (resource == undefined || (resource != undefined && !this.player.inventory.get.is_in_inventory(resource))){
            console.log('error: this is okay if you did sell_all_recycling');
            return;
        }
        let item = this.player.inventory.fetch.by_name(resource);
        let quantity = shop.selling;
        if (quantity == 'all' || quantity > item.quantity){
            quantity = item.quantity;
        }
        this.player.status.change_money(quantity * ItemConfig.prices[resource]);
        item.quantity -= quantity;
        if (item.quantity < 1){
            this.player.inventory.move.delete(resource, null);
        }
        return quantity * ItemConfig.prices[resource];
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
        this.player.status.change_money(Math.round(ItemConfig.prices[item.name] * item.durability * .005));

    }

    
}