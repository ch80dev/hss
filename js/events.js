document.addEventListener('keydown', (event) => {
   let key_pressed = event.key;
   juego.input.press_key(key_pressed, juego);
   ui.refresh();
});

$(document).on('click', '.your-dynamic-element-class', function() {
    // Your code here
    console.log("Dynamic element clicked!");
    
    // 'this' refers to the specific element that was clicked
    $(this).css('background-color', 'red');
});

for (let button of document.querySelectorAll('button')){
	button.addEventListener('click', function(e){
		ui.refresh();
	});
}
