juego = new Game()
ui = new UI()
ui.refresh()



function rand_num(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}
