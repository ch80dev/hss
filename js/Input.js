class Input {

    
    press_key(pressed){
        //console.log(pressed);
        
        let directions = ['right', 'left', 'down', 'up'];
        if (pressed == 'i'){
            juego.player.state.looting = true;
            ui.change_screen('loot');
        } else if (pressed == "Escape" && juego.player.state.looting){
            juego.player.state.looting = false;
            ui.change_screen('map');
        } else if (pressed == " " && juego.player.state.looting){
            juego.player.inventory.take_all(juego.map);
        } else if (!juego.player.state.looting && directions.includes(pressed.substring(5).toLowerCase())){
            juego.player.movement.move(pressed.substring(5).toLowerCase(), juego.map);
            juego.next_turn();
        }
    }

}

