document.addEventListener('keydown', (event) => {
   let key_pressed = event.key;
   juego.input.press_key(key_pressed, juego);
   ui.refresh();
});

$(document).on('click', '.close', function() {
    juego.player.looting = false;
    ui.change_screen('map');
    ui.refresh();
});

$(document).on('click', '.item', function() {
    juego.input.move_item(this.id.split('-')[0], this.id.split('-')[1], juego);
    ui.refresh();
});

for (let button of document.querySelectorAll('button')){
	button.addEventListener('click', function(e){
		ui.refresh();
	});
}
