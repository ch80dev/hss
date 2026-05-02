class Input {
    click(x, y, jail){
        //console.log(x, y, jail);
        let delta = { x: x - juego.player.state.x, y: y - juego.player.state.y };
        let direction = null;
        let move_delta = juego.map.get.geometry.fetch_delta(x, y, juego.player.state.x, juego.player.state.y);
        if (jail){
            delta = { x: x - juego.jail.player_at.x, y: y - juego.jail.player_at.y };
            move_delta = juego.map.get.geometry.fetch_delta(x, y, juego.jail.player_at.x, juego.jail.player_at.y);
        }
        let rand = rand_num(1, 2)
        if (Math.abs(delta.x) > Math.abs(delta.y) 
            || (Math.abs(delta.x) == Math.abs(delta.y) && rand == 1)){
            move_delta.y = 0;
        } else if (Math.abs(delta.x) < Math.abs(delta.y) 
            || (Math.abs(delta.x) == Math.abs(delta.y) && rand == 2)){
            move_delta.x = 0;

        } 
        direction = juego.player.movement.fetch_direction_from_delta(move_delta);
        if (direction == null){
            return;
        }
        if (jail){
            juego.jail.move(direction);
            return;
        }
        juego.player.movement.move(direction, juego.map, juego);
        juego.next();
    }

    number_key_pressed(number){
        $(`.button_${number}`).first().trigger('click');
    }

    press_key(pressed){
        //console.log(pressed, ui.screen_focused, );
        if (ui.sleeping || juego.player.state.unconscious_for > 0){
            return;
        }
        let directions = ['right', 'left', 'down', 'up'];
        if (pressed.trim() !== "" && Number(pressed) >= 0 && Number(pressed) <= 9){
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
        } else if (pressed == "Escape" && juego.waiting < 1 && (juego.player.state.looting || juego.player.state.socializing != null || juego.player.state.shopping != null)){
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
        } else if (juego.player.state.in_pacman_jail 
            && directions.includes(pressed.substring(5).toLowerCase())){
            juego.jail.move(pressed.substring(5).toLowerCase());
        } else if (juego.player.status.can_they_move() 
            && directions.includes(pressed.substring(5).toLowerCase())){
            juego.player.movement.move(pressed.substring(5).toLowerCase(), juego.map, juego);
            juego.next();
        } else if (pressed == 'm' && juego.player.state.marking == false){
            juego.player.state.marking = true;
        } else if (pressed == ' ' && juego.player.status.can_they_move() ){
            juego.next();
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
            ui.human.directions_selected = null;
        } else if (Object.keys(ShopConfig.names).includes(id)){
            ui.human.directions_selected = id;
        }   
    }

}

