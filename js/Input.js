class Input {

    number_key_pressed(number){
        //might need to check if locked
        let loot = juego.map.loot[juego.player.fetch_from()].stuff;
        if ((juego.player.state.looting && loot == undefined) 
            && (!juego.player.state.looting && juego.player.state.socializing == null)){
            return;
        }
        if (juego.player.state.looting && loot[number - 1] != undefined){
            juego.player.inventory.take_item(number - 1, juego.map);
            return;
        }
        if (juego.player.state.socializing == null){ // is this even possible?
            return;
        }
        let human = juego.fetch_human(juego.player.state.location_type, juego.player.state.location_id, juego.player.state.socializing.x, juego.player.state.socializing.y);        
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
        juego.player.actions.interact(interaction_id, human)
        
    }

    press_key(pressed){
        console.log(pressed);
        
        let directions = ['right', 'left', 'down', 'up'];
         if (pressed == 'Shift' && !juego.player.state.fighting){
            juego.player.state.fighting = true;
        } else if (pressed == 'i'){
            juego.player.state.looting = true;
            ui.change_screen('loot');
        } else if (pressed == "Escape" && (juego.player.state.looting || juego.player.state.socializing != null)){
            juego.player.state.looting = false;
            juego.player.state.socializing = null;
            ui.change_screen('map');
        } else if (pressed == " " && juego.player.state.looting){
            juego.player.inventory.take_all(juego.map);
        } else if (!juego.player.state.looting && directions.includes(pressed.substring(5).toLowerCase())){
            juego.player.movement.move(pressed.substring(5).toLowerCase(), juego.map, juego);
            juego.next_turn();
        } else if (pressed >= 0 && pressed <= 10){
            this.number_key_pressed(Number(pressed));
        } 
    }

    release_key(pressed){
        if (pressed == 'Shift' && juego.player.state.fighting){
            juego.player.state.fighting = false;
        }
    }

}

