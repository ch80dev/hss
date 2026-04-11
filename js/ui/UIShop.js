class UIShop{
    display(player){
        let shop = juego.fetch_shop(player.state.shopping);
        console.log(shop);
        if (shop == null){
            return;
        }
        let txt = `<div>${Config.shop_names[shop.type]}</div>`;
    
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
            txt += `<button id='sell_to_shop-${id}' class='sell_to_shop' ${disabled}> sell ${shop.selling} ${resource}</div>`
        }
        $("#shop").html(txt);
    }
}