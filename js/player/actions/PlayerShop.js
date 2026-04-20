class PlayerShop{
    constructor(player){
        this.player = player;
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
        for (let resource_id in shop.resources){
            this.sell_to_shop(resource_id, shop);
        }
    }

    enter(x, y, map){
        
        let shop_on_map = map.get.inspector.fetch_shop(x, y);
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
        //console.log(resource, quantity, quantity * ItemConfig.prices[resource])
        this.player.status.change_money(quantity * ItemConfig.prices[resource]);
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
        this.player.status.change_money(Math.round(ItemConfig.prices[item.name] * item.durability * .005));

    }

    
}