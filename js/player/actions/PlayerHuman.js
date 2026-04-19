class PlayerHuman{
    constructor(player){
        this.player = player;
    }
    interact(id, human, time, ui){
        //console.log(id, human, time);
        if (human.interactions[id] == undefined){
            console.log('error');
            return;
        }
        let interaction = human.interactions[id];       
        if (interaction == 'beg' && human.begging_unlocked == true 
            && this.player.state.stigma >= human.min_stigma_beg){            
            this.player.state.money += human.give_when_begged;                      
            ui.log(`They gave you $${human.give_when_begged}.`)
            human.begged(time);
        } else if (interaction == 'buy' 
            && this.player.state.money >= human.conversion[id] 
            && this.player.inventory.get.can_they_take(human.resources[id], 1)){ 
            this.player.state.money -= human.conversion[id];
            this.player.inventory.take.from_human(human.resources[id], 1, human);
            ui.log(`You bought ${human.resources[id]} for $${human.conversion[id]}.`)
        } else if (interaction == 'sell' && this.player.inventory.get.do_they_have(human.resources[id], 1)){ 
            this.player.inventory.move.give_to_human(human.resources[id], 1, human);
            this.player.money += human.conversion[id];
            ui.log(`You sell ${human.resources[id]} for $${human.conversion[id]}.`)
        } else if (interaction == 'directions' && ui.social.directions_selected != null && juego.favorites.set.directions.length < 1){
            juego.get.directions(human, ui.social.directions_selected, juego.map);
            ui.change_screen('map');
            this.player.state.socializing = null;
        } 

    }

    social(x, y, juego){
        //console.log('social', x, y, juego);
        let human = juego.get.human_by_loc(this.player.state.location.type, this.player.state.location.id, x, y);
        if (human == null){
            return;
        }

        if (this.player.state.stigma > human.max_stigma_tolerance){
            ui.log("They don't want to talk to you. Your stigma is too high.");
            return;
        }
        this.player.state.socializing = human.id;
        ui.change_screen('social');

    }

    trade(interaction_id, conversion_id, human){
        //console.log(interaction_id, conversion_id, human);        
        if (human == null ){
            console.log('error');
            return;
        }                
        let player_resource = Object.keys(human.resources[interaction_id])[0];
        let player_quantity = human.conversion[interaction_id][0];
        let human_resource = human.resources[interaction_id][player_resource];
        let human_quantity = human.conversion[interaction_id][1];        
        if (conversion_id == 1){
            human_resource = Object.keys(human.resources[interaction_id])[0];
            human_quantity = human.conversion[interaction_id][0]
            player_resource = human.resources[interaction_id][human_resource];
            player_quantity = human.conversion[interaction_id][1];
            
        }
        if (!this.player.inventory.get.do_they_have(player_resource, player_quantity) 
            || !human.do_they_have(human_resource, human_quantity)){
            console.log('not enough', player_resource, player_quantity, this.player.inventory.get.do_they_have(player_resource, player_quantity), human_resource, human_quantity, human.do_they_have(human_resource, human_quantity));
            return;
        }
        this.player.inventory.move.give_to_human(player_resource, player_quantity, human);
        this.player.inventory.take.from_human(human_resource, human_quantity, human);
        ui.log(`You give ${player_quantity} ${player_resource} and receive ${human_quantity} ${human_resource}.`)
    }
}