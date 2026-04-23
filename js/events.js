document.addEventListener('keydown', (event) => {
   let key_pressed = event.key;
   juego.input.press_key(key_pressed);
   ui.refresh.go();

});
document.addEventListener('keyup', (event) => {
   let key_pressed = event.key;
   juego.input.release_key(key_pressed);
});

$(document).on('click', '.cell:not(.empty)', function() {
    juego.player.actions.look(Number(this.id.split('-')[1]), Number(this.id.split('-')[2]), juego.map);
    ui.refresh.go();
});


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



$(document).on('click', '#auto_loot', function() {
    juego.player.state.auto_loot = $("#auto_loot").prop('checked');
    ui.refresh.go();
});

$(document).on('change', '.auto_loot_item', function() {
    juego.player.status.toggle_auto_loot(this.id.split('-')[1], this.id.split('-')[2], juego.map);
    ui.refresh.go();
});

$(document).on('click', '#bet', function(e) {
    let human = juego.get.human(juego.player.state.socializing);
    if (human == null){
        return;
    }
    juego.player.actions.human.gamble(human, juego.time, ui);
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

$(document).on('click', '#cancel_quest', function(e) {
    let human = juego.get.human(juego.player.state.socializing);
    if (human == null){
        return;
    }
    juego.player.actions.human.cancel_quest(human, juego.quests);
    ui.refresh.go();
});

$(document).on('click', '#complete_quest', function(e) {
    let human = juego.get.human(juego.player.state.socializing);
    if (human == null){
        return;
    }
    juego.player.actions.human.complete_quest(human, ui);
    ui.refresh.go();
});

$(document).on('click', '#cash_out', function(e) {
    let human = juego.get.human(juego.player.state.socializing);
    if (human == null){
        return;
    }
    juego.player.actions.human.cash_out(human, juego.time, ui);
    ui.refresh.go();
});

$(document).on('click', '.close', function() {
    juego.player.state.looting = false;
    juego.player.state.socializing = null;
    ui.change_screen('map');
    ui.refresh.go();
});

$(document).on('change', '#directions_to', function() {
    let selected_value = $(this).val();    
    juego.input.selecting_directions(selected_value);
    ui.refresh.go();
});

$(document).on('click', '.equip', function(e) {
    juego.player.inventory.use.equip(Number(this.id.split('-')[1]));
    ui.refresh.go();
});


$(document).on('click', '.favorite', function() {
    juego.favorites.add_by_type(this.id.split('-')[1], Number(this.id.split('-')[2]), juego);
    ui.refresh.go();
});

$(document).on('click', '.interact:not(.trade)', function(e) {
    let human = juego.get.human(juego.player.state.socializing);
    if (human == null){
        return;
    }
    juego.player.actions.human.interact(Number(this.id.split('-')[1]), human, juego.time, ui, juego.quests);
    ui.refresh.go();
});

$(document).on('click', '.item', function(e) {
    // If a nested button (e.g. .use) was clicked, let its handler run only.
    console.log('item');
    if (e.target && e.target.closest('button')){
        console.log('bang');
        return;
    }
    
    juego.player.inventory.move.item(this.id.split('-')[0], this.id.split('-')[1], juego.map);
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

$(document).on('click', '.sell_all_to_human', function(e) {
    let human = juego.get.human(juego.player.state.socializing);
    if (human == null){
        return;
    }
    juego.player.actions.human.sell_all_to_human(Number(this.id.split('-')[1]), human, ui);
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


$(document).on('click', '.sell_unique_to_human', function() {
    let human = juego.get.human(juego.player.state.socializing);
    if (human == null){
        return;
    }
    juego.player.actions.human.sell_unique_to_human(Number(this.id.split('-')[1]), human, ui);
    ui.refresh.go();
});

$(document).on('click', '.sleep_in_tent', function(e) {    
    juego.player.actions.sleep_in_tent(juego.map);
    ui.refresh.go();
});

$(document).on('click', '#sleep_at_homeless_shelter', function() {
    if (juego.player.state.shopping == null){
        return;
    }
    let shop = juego.get.shop(juego.player.state.shopping);
    if (shop == null){
        return;
    }
    shop.sleep_at_homeless_shelter(juego.player, juego.time);
    juego.next();
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
    shop.sleep(juego.player);
    juego.next();
    ui.refresh.go();
});

$(document).on('click', '#take_all_loot', function() {
    juego.player.inventory.take.all(juego.map, false);
    ui.refresh.go();
});




$(document).on('click', '.trade', function(e) {
    let human = juego.get.human(juego.player.state.socializing);
    if (human == null){
        return;
    }
    juego.player.actions.human.trade(Number(this.id.split('-')[1]), Number(this.id.split('-')[2]), human);
    ui.refresh.go();
});

$(document).on('click', '#unequip', function(e) {
    juego.player.state.equipped = null;
    ui.refresh.go();
});

$(document).on('click', '.use', function(e) {
    e.preventDefault();
    e.stopPropagation();
    juego.player.inventory.use.item(this.id.split('-')[1], juego.map);
    ui.refresh.go();
});

for (let button of document.querySelectorAll('button')){
	button.addEventListener('click', function(e){
		ui.refresh.go();
	});
}
