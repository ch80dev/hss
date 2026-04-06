class Input {

    move_item(from, id){
        //console.log(from, id);
        if (from == 'loot'){
            juego.player.take_item(id);   
            return;     
        }
        juego.player.drop_item(id);
    }
    press_key(pressed){
        //console.log(pressed);
        
        let directions = ['right', 'left', 'down', 'up'];
        if (pressed == 'i'){
            juego.player.looting = true;
            ui.change_screen('loot');
        } else if (pressed == "Escape" && juego.player.looting){
            juego.player.looting = false;
            ui.change_screen('map');
        } else if (pressed == " " && juego.player.looting){
            juego.player.take_all();
        } else if (!juego.player.looting && directions.includes(pressed.substring(5).toLowerCase())){
            juego.player.move(pressed.substring(5).toLowerCase());
        }
    }

}

