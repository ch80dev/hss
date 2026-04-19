class Input {
    
    number_key_pressed(number){
        //might need to check if locked

        /*
        let loot = juego.map.loot[juego.player.fetch_from()];
        if ((juego.player.state.looting && loot == undefined) 
            && (!juego.player.state.looting && juego.player.state.socializing == null)){
            return;
        }
        if (juego.player.state.looting && loot.stuff[number - 1] != undefined){
            juego.player.inventory.take.item(number - 1, juego.map); //3rd parameter added for null
            return;
        }
            */
        if (juego.player.state.socializing == null){ // is this even possible?
            return;
        }
        let human = juego.fetch_human(juego.player.state.socializing);        
        if (human == null){
            return;
        }
        let local_interactions = [...human.interactions];
        
        let trade_at = local_interactions.indexOf('trade'); // Let's say we want to double 'b'

        // splice(starting index, how many to delete, what to add)
        if (trade_at != -1){
            local_interactions.splice(trade_at + 1, 0, local_interactions[trade_at]);
        }
        

        let interaction = local_interactions[number - 1];        
        if (interaction == undefined){
            return;
        }
        let interaction_id = human.interactions.indexOf(interaction);
        if (interaction == 'trade' && local_interactions[number] != undefined && local_interactions[number] == 'trade'){
            juego.player.actions.trade(interaction_id, 0, human);
            return;
        } else if (interaction == 'trade'){
            juego.player.actions.trade(interaction_id, 1, human);
            return;
        }        
        juego.player.actions.interact(interaction_id, human, juego.time, ui)
        
    }

    press_key(pressed){
        //console.log(pressed, ui.screen_focused);
        
        let directions = ['right', 'left', 'down', 'up'];
        if (pressed == 'f' && juego.player.state.socializing != null){
            juego.favorites.add_by_type('human', juego.player.state.socializing, juego);
        } else if (pressed == 'f' && juego.player.state.shopping != null){
            juego.favorites.add_by_type('shop', juego.player.state.shopping, juego);    
        } else if (pressed == 'f'){
            ui.change_screen('favorites');  
        } else if (pressed == 'Escape' && ui.screen_focused == 'favorites'){
            ui.change_screen('map');        
        } else if (juego.player.state.marking && (pressed.length == 1 || pressed == "Escape")){
            //need to put acceptable marks
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
        } else if (pressed == " " && juego.player.state.looting){
            juego.player.inventory.take.all(juego.map);
        } else if (!juego.player.state.looting && directions.includes(pressed.substring(5).toLowerCase())){
            juego.player.movement.move(pressed.substring(5).toLowerCase(), juego.map, juego);
            juego.next_turn();
        } else if (pressed == 'm' && juego.player.state.marking == false){
            juego.player.state.marking = true;
            //console.log(juego.player.state.marking);
        } else if (pressed >= 0 && pressed <= 10){
            this.number_key_pressed(Number(pressed));
        } 
    }

    release_key(pressed){
        //console.log(pressed);
        if (pressed == 'Shift' && juego.player.state.fighting){
            juego.player.state.fighting = false;
        } else if (pressed == 'm'){
            juego.player.state.marking = false;
            //console.log(juego.player.state.marking);
            return;
        }
        
        ui.refresh.go();
    }

    selecting_directions(id){
        
        if (id == ""){
            ui.social.directions_selected = null;
            return;
        } else if (Object.keys(Config.shop_names).includes(id)){
            ui.social.directions_selected = id;
        }   

        
    }

}

