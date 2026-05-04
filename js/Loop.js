class Loop{
    go(){
        if (juego.jail.tick % 10 == 0){
            juego.jail.enemies_move();
        }
        if (juego.jail.tick % 2 == 0 && juego.player.state.sentence_served < juego.player.state.sentenced_to){
            juego.player.state.sentence_served ++;
        }
        juego.jail.tick ++;
        ui.refresh.go();
    }
}