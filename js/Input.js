class Input {

    move_item(from, id){
        console.log(from, id);
        if (from == 'loot'){
            juego.player.take_item(id, juego);
        }
    }
    press_key(pressed){
        
        
        let directions = ['right', 'left', 'down', 'up'];
        if (pressed == " " && juego.player.looting){
            juego.player.take_all(juego);
        } else if (!juego.player.looting && directions.includes(pressed.substring(5).toLowerCase())){
            juego.player.move(pressed.substring(5).toLowerCase(), juego);
        }
    }
}

