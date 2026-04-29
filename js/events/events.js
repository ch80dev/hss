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

$(document).on('click', '.cop_interview', function() {
    juego.cop_interview.choose(Number(this.id.split('-')[1]));
    if (juego.cop_interview.result == 'win'){
        juego.player.actions.cop_lets_them_go(juego.get);
    } else if (juego.cop_interview.result == 'lose'){
        juego.player.actions.crime_sentencing();
    }
    ui.refresh.go();
});



$(document).on('click', '.detained', function() {
    juego.player.actions.detained(this.id.split('-')[1], juego.get);
    ui.refresh.go();
});

$(document).on('click', '.close', function() {
    juego.player.state.looting = false;
    juego.player.state.socializing = null;
    ui.change_screen('map');
    ui.refresh.go();
});

$(document).on('click', '.favorite', function() {
    juego.favorites.add_by_type(this.id.split('-')[1], Number(this.id.split('-')[2]), juego);
    ui.refresh.go();
});


$(document).on('click', '#go_to_the_yard', function() {
    juego.player.actions.go_to_the_yard();
    ui.refresh.go();
});


$(document).on('click', '#start_sentence', function() {
    juego.player.actions.start_sentence();
    ui.refresh.go();
});

for (let button of document.querySelectorAll('button')){
	button.addEventListener('click', function(e){
        console.log('yass');
		ui.refresh.go();
	});
}
