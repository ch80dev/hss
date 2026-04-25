class Input {
    number_key_pressed(number){
        $(`.button_${number}`).first().trigger('click');
    }
    press_key(pressed){
        //console.log(pressed, ui.screen_focused, );
        if (ui.sleeping || juego.player.state.unconscious_for > 0){
            return;
        }
        let directions = ['right', 'left', 'down', 'up'];
        if (Number(pressed) >= 0 || Number(pressed) <= 9){
            this.number_key_pressed(Number(pressed));
        } else if (pressed == 'f' && juego.player.state.socializing != null){
            juego.favorites.add_by_type('human', juego.player.state.socializing, juego);
        } else if (pressed == 'f' && juego.player.state.shopping != null){
            juego.favorites.add_by_type('shop', juego.player.state.shopping, juego);    
        } else if (pressed == 'f'){
            ui.change_screen('favorites');  
        } else if (pressed == 'Escape' && ui.screen_focused == 'favorites'){
            ui.change_screen('map');        
        } else if (juego.player.state.marking && (pressed.length == 1 || pressed == "Escape")){
            juego.map.mark(juego.player.fetch_from(), pressed);
        } else if (pressed == 'Shift' && !juego.player.state.fighting){
            juego.player.state.fighting = true;
        } else if (pressed == 'i'){
            juego.player.state.looting = true;
            ui.change_screen('loot');
        } else if (pressed == "Escape" && (juego.player.state.looting || juego.player.state.socializing != null || juego.player.state.shopping != null)){
            juego.player.state.looting = false;
            juego.player.state.socializing = null;
            juego.player.state.shopping = null;
            ui.change_screen('map');
        } else if (pressed == " " && juego.player.state.shopping != null){
            let shop = juego.get.shop(juego.player.state.shopping);
            if (shop == null || shop.type != 'recycling'){
                return;
            }
            juego.player.actions.shop.sell_all_recycling(shop);
        } else if (pressed == " " && juego.player.state.looting){
            juego.player.inventory.take.all(juego.map, false);
        } else if (!juego.player.state.looting && directions.includes(pressed.substring(5).toLowerCase())){
            juego.player.movement.move(pressed.substring(5).toLowerCase(), juego.map, juego);
            juego.next();
        } else if (pressed == 'm' && juego.player.state.marking == false){
            juego.player.state.marking = true;
        } 
    }

    release_key(pressed){
        if (ui.sleeping || juego.player.state.unconscious_for > 0){
            return;
        }
        if (pressed == 'Shift' && juego.player.state.fighting){
            juego.player.state.fighting = false;
            ui.refresh.go();
        } else if (pressed == 'm'){
            juego.player.state.marking = false;
            ui.refresh.go();
        }
    }

    selecting_directions(id){
        if (id == ""){
            ui.social.directions_selected = null;
        } else if (Object.keys(ShopConfig.names).includes(id)){
            ui.social.directions_selected = id;
        }   
    }

}

