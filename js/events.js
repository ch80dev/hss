document.addEventListener('keydown', (event) => {
   let key_pressed = event.key;
   juego.input.press_key(key_pressed, juego);
   ui.refresh();
});

$(document).on('click', '.close', function() {
    juego.player.state.looting = false;
    ui.change_screen('map');
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
    juego.player.use_item(this.id.split('-')[1], juego.map);
    ui.refresh();
});


for (let button of document.querySelectorAll('button')){
	button.addEventListener('click', function(e){
		ui.refresh();
	});
}
