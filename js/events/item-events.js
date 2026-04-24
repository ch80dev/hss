$(document).on('click', '#auto_loot', function() {
    juego.player.state.auto_loot = $("#auto_loot").prop('checked');
    ui.refresh.go();
});

$(document).on('change', '.auto_loot_item', function() {
    juego.player.status.toggle_auto_loot(this.id.split('-')[1], this.id.split('-')[2], juego.map);
    ui.refresh.go();
});

$(document).on('click', '.equip', function(e) {
    juego.player.inventory.use.equip(Number(this.id.split('-')[1]));
    ui.refresh.go();
});

$(document).on('click', '.item', function(e) {
    // If a nested button (e.g. .use) was clicked, let its handler run only.
    if (e.target && e.target.closest('button')){
        return;
    }
    juego.player.inventory.move.item(this.id.split('-')[0], this.id.split('-')[1], juego.map);
    ui.refresh.go();
});

$(document).on('click', '.sleep_in_tent', function(e) {    
    juego.player.actions.sleep_in_tent(juego.map);
    ui.refresh.go();
});

$(document).on('click', '#take_all_loot', function() {
    juego.player.inventory.take.all(juego.map, false);
    ui.refresh.go();
});

$(document).on('click', '.unequip', function(e) {
    juego.player.inventory.use.unequip(this.id.split('-')[1]);
    ui.refresh.go();
});

$(document).on('click', '.use', function(e) {
    e.preventDefault();
    e.stopPropagation();
    juego.player.inventory.use.item(this.id.split('-')[1], juego.map);
    ui.refresh.go();
});