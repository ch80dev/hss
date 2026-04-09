document.addEventListener('keydown', (event) => {
   let key_pressed = event.key;
   juego.input.press_key(key_pressed);
   ui.refresh();

});
document.addEventListener('keyup', (event) => {
   let key_pressed = event.key;
   juego.input.release_key(key_pressed);
});

$(document).on('click', '.close', function() {
    juego.player.state.looting = false;
    juego.player.state.socializing = null;
    ui.change_screen('map');
    ui.refresh();
});

$(document).on('click', '.equip', function(e) {
    juego.player.inventory.equip(Number(this.id.split('-')[1]));
    ui.refresh();
});
$(document).on('click', '.interact', function(e) {
    juego.player.actions.interact(Number(this.id.split('-')[1]), Number(this.id.split('-')[2]), Number(this.id.split('-')[3]), juego);
    ui.refresh();
});

$(document).on('click', '.item', function(e) {
    // If a nested button (e.g. .use) was clicked, let its handler run only.
    if (e.target && e.target.closest('button')){
        return;
    }
    juego.player.inventory.move_item(this.id.split('-')[0], this.id.split('-')[1], juego.map);
    ui.refresh();
});

$(document).on('click', '#take_all_loot', function() {
    juego.player.inventory.take_all(juego.map);
    ui.refresh();
});

$(document).on('click', '.use', function(e) {
    e.preventDefault();
    e.stopPropagation();
    juego.player.inventory.use_item(this.id.split('-')[1], juego.map);
    ui.refresh();
});


for (let button of document.querySelectorAll('button')){
	button.addEventListener('click', function(e){
		ui.refresh();
	});
}
