juego = new Game()
ui = new UI()
ui.refresh.go()

Config.audit();
HumanConfig.audit();
ItemConfig.audit();
MapConfig.audit();
ShopConfig.audit();
DefaultConfig.audit();
function rand_num(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
