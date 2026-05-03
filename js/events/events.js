let mobile_press_interval = null;


document.addEventListener('keydown', (event) => {
   let key_pressed = event.key;
   juego.input.press_key(key_pressed);
   ui.refresh.go();

});

document.addEventListener('keyup', (event) => {
   let key_pressed = event.key;
   juego.input.release_key(key_pressed);
});




$(document).on('click', '.cell', function() {
    let x = Number(this.id.split('-')[1]);
    let y = Number(this.id.split('-')[2]);
    if (juego.player.state.x == x && juego.player.state.y == y){
        juego.player.state.looting = true;
        ui.change_screen('loot');
        ui.refresh.go();
        return;
    }
    juego.player.actions.look(x, y, juego.map);
    ui.refresh.go();
});

$(document).on('click', '#combat_toggle', function() {
    juego.player.state.fighting = !juego.player.state.fighting;
    ui.refresh.go();
});

$(document).on('mousedown touchstart', '.mobile_dir', function() {
    if (this.type === 'touchstart') {
        
        this.preventDefault(); 
        this.stopPropagation();
    }   
    if (mobile_press_interval) {
        clearInterval(mobile_press_interval);
    }
    let direction = this.id.split('-')[1];
    juego.input.move(direction);
    mobile_press_interval = setInterval(function() {
        juego.input.move(direction);
    }, 300);
    
});

$(document).on('mouseup mouseleave touchend', '.mobile_dir', function() {
    clearInterval(mobile_press_interval);
    mobile_press_interval = null;
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
