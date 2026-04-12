class UIShop{
    display(player){
        let shop = juego.fetch_shop(player.state.shopping);
        console.log(shop);
        if (shop == null){
            return;
        }
        let txt = `<div>${Config.shop_names[shop.type]}</div>`;
        if (shop.type == 'recycling'){
            txt += this.display_sell_generic(player, shop);
        } else if (shop.type == 'pawn'){
            for (let resource of Config.shop_resources[shop.type]){
                txt += `<div>${resource}: $${Config.prices[resource]}</div>`;
            }
            txt += this.display_buy_unique(player, shop);
            txt += this.display_sell_unique(player, shop);
        }   
        
        $("#shop").html(txt);
    }

    display_sell_generic(player, shop){
        let txt = "";
        for (let id in Config.shop_resources[shop.type]){
            let disabled = '';
            let min_quantity = shop.selling;
            if (min_quantity == 'all'){
                min_quantity = 1;
            }
            let resource = Config.shop_resources[shop.type][id];
            if (!player.inventory.do_they_have(resource, min_quantity)){
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
            let price = Config.prices[item.name];
            if (player.state.money < Config.prices[item.name] || player.inventory.are_they_full()){
                disabled = ' disabled ';
            }
            txt += `<button id='buy_unique-${id}' class='buy_unique' ${disabled}>buy ${item.name} (${item.durability}%)</button>`
        }
        return txt;
    }

    display_sell_unique(player, shop){
        let txt = "";
        let all_sellable_items_in_inventory = player.inventory.fetch_all_items(Config.shop_resources[shop.type]);
        if (all_sellable_items_in_inventory.length > 0){
            txt = "<div>From Your Inventory</div>";
        }
        for (let id of all_sellable_items_in_inventory){
            let item = player.inventory.fetch(id);
            let equipped = '';
            if (player.state.equipped != null && player.state.equipped == id){
                equipped = ' [ EQUIPPED ]';
            }
            txt += `<div><button id='sell_unique-${id}' class='sell_unique'>sell ${item.name} (${item.durability}%) ${equipped} for $${Math.round(item.durability * Config.prices[item.name] * .005)}</button></div>`;        }
        return txt;
    }
}