class Input {
    press_key(pressed){
        let directions = ['right', 'left', 'down', 'up'];
        if (directions.includes(pressed.substring(5).toLowerCase())){
            juego.player.move(pressed.substring(5).toLowerCase(), juego);
        }
    }
}

