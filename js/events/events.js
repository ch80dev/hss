document.addEventListener('keydown', (event) => {
   let key_pressed = event.key;
   juego.input.press_key(key_pressed);
   ui.refresh.go();

});

document.addEventListener('keyup', (event) => {
   let key_pressed = event.key;
   juego.input.release_key(key_pressed);
});
let touchTimer;
const LONG_PRESS_DURATION = 500; // Half a second

$(document).on('touchstart', '.cell', function(e) {
    const cell = this;
    const x = Number(cell.id.split('-')[1]);
    const y = Number(cell.id.split('-')[2]);

    // Start the timer
    touchTimer = setTimeout(function() {
        console.log("Long press detected - Looking!");
        juego.player.actions.look(x, y, juego.map);
        ui.refresh.go();
        
        // Vibrate is a nice touch for mobile feedback
        if (navigator.vibrate) navigator.vibrate(50); 
    }, LONG_PRESS_DURATION);
});

$(document).on('touchend touchmove', '.cell', function() {
    // If they let go or move their finger before the timer hits, cancel it
    clearTimeout(touchTimer);
});

$(document).on('contextmenu', '.cell', function(e) {
    e.preventDefault(); // Stops the menu from appearing
});


$(document).on('click', '.cell', function() {
    //juego.player.actions.look(Number(this.id.split('-')[1]), Number(this.id.split('-')[2]), juego.map);
    if (this.originalEvent instanceof PointerEvent 
        && this.originalEvent.pointerType === 'touch') {
        return;
    }
    juego.input.click(Number(this.id.split('-')[1]), Number(this.id.split('-')[2]), false);
    ui.refresh.go();
});

$(document).on('mousedown', '.jail_cell', function() {
    juego.input.click(Number(this.id.split('-')[1]), Number(this.id.split('-')[2]), true);
    ui.refresh.go();
});


$(document).on('click', '.cop_interview', function() {
    juego.cop_interview.choose(Number(this.id.split('-')[1]));
    if (juego.cop_interview.result == 'win'){
        juego.player.actions.cop.lets_them_go(juego.get);
    } else if (juego.cop_interview.result == 'lose'){
        juego.player.actions.cop.crime_sentencing();
    }
    ui.refresh.go();
});



$(document).on('click', '.detained', function() {
    juego.player.actions.cop.detained(this.id.split('-')[1], juego.get);
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
    juego.player.actions.cop.go_to_the_yard();
    ui.refresh.go();
});


$(document).on('click', '#start_sentence', function() {
    juego.player.actions.cop.start_sentence();
    ui.refresh.go();
});

for (let button of document.querySelectorAll('button')){
	button.addEventListener('click', function(e){
		ui.refresh.go();
	});
}
