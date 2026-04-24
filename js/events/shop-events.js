$(document).on('click', '.buy_from_shop', function() {
    if (juego.player.state.shopping == null){
        return;
    }
    let shop = juego.get.shop(juego.player.state.shopping);
    if (shop == null){
        return;
    }
    juego.player.actions.shop.buy_from_shop(this.id.split('-')[1], shop);
    ui.refresh.go();
});

$(document).on('click', '.buy_unique', function() {
    if (juego.player.state.shopping == null){
        return;
    }
    let shop = juego.get.shop(juego.player.state.shopping);
    if (shop == null){
        return;
    }
    juego.player.actions.shop.buy_unique(this.id.split('-')[1], shop);
    ui.refresh.go();
});

$(document).on('click', '#rent_a_room', function() {
    if (juego.player.state.shopping == null){
        return;
    }
    let shop = juego.get.shop(juego.player.state.shopping);
    if (shop == null){
        return;
    }
    shop.rent_a_room(juego.player);
    ui.refresh.go();
});

$(document).on('click', '#sell_all_recycling', function() {
    if (juego.player.state.shopping == null){
        return;
    }
    let shop = juego.get.shop(juego.player.state.shopping);
    if (shop == null){
        return;
    }
    juego.player.actions.shop.sell_all_recycling(shop);
    ui.refresh.go();
});

$(document).on('click', '.sell_to_shop', function() {
    if (juego.player.state.shopping == null){
        return;
    }
    let shop = juego.get.shop(juego.player.state.shopping);
    if (shop == null){
        return;
    }
    juego.player.actions.shop.sell_to_shop(this.id.split('-')[1], shop);
    ui.refresh.go();
});

$(document).on('click', '.sell_unique', function() {
    if (juego.player.state.shopping == null){
        return;
    }
    let shop = juego.get.shop(juego.player.state.shopping);
    if (shop == null){
        return;
    }
    juego.player.actions.shop.sell_unique(this.id.split('-')[1], shop);
    ui.refresh.go();
});

$(document).on('click', '#sleep_at_shop', function() {
    if (juego.player.state.shopping == null){
        return;
    }
    let shop = juego.get.shop(juego.player.state.shopping);
    if (shop == null){
        return;
    }
    shop.sleep(juego.player, juego.time);
    juego.next();
    ui.refresh.go();
});
