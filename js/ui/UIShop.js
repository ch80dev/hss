class UIShop{
    display(player){
        let shop = juego.get.shop(player.state.shopping);
        //console.log(shop);
        if (shop == null){
            return;
        }
        let favorite = juego.favorites.fetch_by_id('shop', shop.id);
        let favorite_symbol = `&#x2606;`;
        if (favorite != undefined){
            favorite_symbol = `&#x2605;`;
        }
        let txt = `<div id='shop_title'><button id='favorite-shop-${shop.id}' class='favorite'>${favorite_symbol}</button>${ShopConfig.names[shop.type]}</div>`
        if (ShopConfig.just_buying.includes(shop.type)){
            txt += this.display_buy_generic(player, shop);
        } else if (shop.type == 'recycling'){
            txt += this.display_recycling(player, shop);
            txt += this.display_sell_generic(player, shop);
        } else if (shop.type == 'pawn'){
            for (let resource of ShopConfig.resources[shop.type]){
                txt += `<div>${resource}: $${ItemConfig.prices[resource]}</div>`;
            }
            txt += this.display_buy_unique(player, shop);
            txt += this.display_sell_unique(player, shop);
        } else if (shop.type == 'motel'){
            txt += this.display_motel(player, shop);
        } else if (shop.type =='homeless'){
            txt += this.display_homeless(player, juego.time);
        }           
        $("#shop").html(txt);
    }

    display_homeless(player, time){
        let can_they_sleep = player.status.can_they_sleep();
        let disabled = '';
        if (time.hours < ShopConfig.homeless_check_in[0] || time.hours >= ShopConfig.homeless_check_in[1] 
            || !can_they_sleep){
            disabled = ' disabled ';
        }
        let timer = '';
        console.log(can_they_sleep, player.status.fetch_time_til_they_can_sleep());
        if (!can_they_sleep){
            timer = ` (available in ${player.status.fetch_time_til_they_can_sleep()}h)`;
        }
        let txt = `<div>You must be here between ${ShopConfig.homeless_check_in[0]}:00 and ${ShopConfig.homeless_check_in[1]}:00 in order to sleep here and you have to stay until 6am.</div><div><button id='sleep_at_shop' ${disabled}>sleep ${timer}</button>`;
        return txt;
    }

    display_motel(player, shop){
        let can_they_sleep = player.status.can_they_sleep();
        let disabled = '';
        let timer = '';
        let txt = "<div>Sleeping inside (like at a motel or a homeless shelter) brings your stigma to 0. (in addition to avoiding the healthy penalty for sleeping outside) </div>";
        if (shop.room_rented_at == null){
            
            if (player.state.money < ShopConfig.motel_room_cost){
                disabled = ' disabled ';
            }
            return `${txt} <div><button id='rent_a_room' class='rent_a_room' ${disabled}>rent a room for $${ShopConfig.motel_room_cost}</button></div>`
        }
        if (!can_they_sleep){
            disabled = ' disabled ';
            timer = `(available in ${player.status.fetch_time_til_they_can_sleep()}h)`;
        }
        return `${txt} <div><button id='sleep_at_shop' ${disabled}>sleep ${timer}</button> </div>`
    }

    display_recycling(player, shop){
        let disabled = '';
        let item_in_inventory = false;
        for (let item of ItemConfig.recyclables){
            if (player.inventory.get.is_in_inventory(item)){
                item_in_inventory = true;
            }
        }
        if (!item_in_inventory){
            disabled = " disabled ";
        }
        let txt = `<div><button id='sell_all_recycling' ${disabled}>sell all</button></div>`;
        
        
        for (let item of ShopConfig.resources.recycling){
            txt += `<div>${item} $${ItemConfig.prices[item]}</div>`;
        }
        return txt;
    }
    display_buy_generic(player, shop){
        let txt = "";
        for (let id in ShopConfig.resources[shop.type]){
            let disabled = '';

            let resource = ShopConfig.resources[shop.type][id];
            if (player.state.money < ItemConfig.prices[resource] 
                || !player.inventory.get.can_they_take(resource, 1)){
                disabled = ' disabled ';
            }
            txt += `<button id='buy_from_shop-${id}' class='buy_from_shop' ${disabled}> buy ${resource} [$${ItemConfig.prices[resource]}]</button>`
        }
        return txt;
    }


    display_sell_generic(player, shop){
        let txt = "";
        for (let id in ShopConfig.resources[shop.type]){
            let disabled = '';
            let min_quantity = shop.selling;
            if (min_quantity == 'all'){
                min_quantity = 1;
            }
            let resource = ShopConfig.resources[shop.type][id];
            if (!player.inventory.get.do_they_have(resource, min_quantity)){
                disabled = ' disabled ';
            }
            txt += `<button id='sell_to_shop-${id}' class='sell_to_shop' ${disabled}> sell ${shop.selling} ${resource}</button>`
        }
        return txt;
    }
    display_buy_unique(player, shop){
        let txt = "";
        for (let id in shop.inventory){
            let item = shop.inventory[id];
            let disabled = "";
            let price = ItemConfig.prices[item.name];
            if (player.state.money < ItemConfig.prices[item.name] || player.inventory.get.are_they_full()){
                disabled = ' disabled ';
            }
            txt += `<button id='buy_unique-${id}' class='buy_unique' ${disabled}>buy ${item.name} (${item.durability}%)</button>`
        }
        return txt;
    }

    display_sell_unique(player, shop){
        let txt = "";
        let all_sellable_items_in_inventory = player.inventory.fetch.all_items(ShopConfig.resources[shop.type]);
        
        
        if (all_sellable_items_in_inventory.length > 0){
            txt = "<div>From Your Inventory</div>";
        }
        for (let id of all_sellable_items_in_inventory){
            let item = player.inventory.fetch.by_id(id);
            let equipped = '';
            let price = Math.round(item.durability * ItemConfig.prices[item.name] * .005);
            if (price < 1){
                continue;
            }
            if (player.state.equipped.hand!= null && player.state.equipped.hand== id){
                equipped = ' [ EQUIPPED ]';
            }
            txt += `<div><button id='sell_unique-${id}' class='sell_unique'>sell ${item.name} (${item.durability}%) ${equipped} for $ ${price}</button></div>`;        }
        return txt;
    }
}