class UIShop{
    display(player){
        console.log(juego.fetch_shop(player.shopping));
        let type = shop.type;
        
        let txt = `<div>${Config.shop_names[type]}</div>`;
    
        for (let id in Config.shop_resources[type]){
            let disabled = '';
            let min_quantity = shop.selling;
            if (min_quantity == 'all'){
                min_quantity = 1;
            }
            let resource = Config.shop_resources[type][id];
            if (!player.inventory.do_they_have(resource, min_quantity)){
                disabled = ' disabled ';
            }
            txt += `<button id='sell_to_shop-${id}-${shop.selling}' class='sell_to_shop' ${disabled}> sell ${shop.selling} ${resource}</div>`
        }
        $("#shop").html(txt);
    }
}