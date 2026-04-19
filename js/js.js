juego = new Game()
ui = new UI()
ui.refresh.go()

Config.audit();
HumanConfig.audit();
ItemConfig.audit();
MapConfig.audit();
ShopConfig.audit();

function rand_num(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}
