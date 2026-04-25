class PlayerHuman{
    constructor(player){
        this.player = player;
    }
    cancel_quest(human, quests){
        human.quest.accepted = null;
        quests.cancel(human.id);
    }
    cash_out(human, time, ui){
        human.gambled = { days: time.days, hours: time. hours };
        human.ante = null;
        this.player.status.change_money(human.items.get_money(human.gambled_and_won));
        ui.log(`You won $${human.gambled_and_won}!`);
        human.gambled_and_won = 0;        
    }

    complete_quest(human, ui){
        human.quest.completed = null;
        this.player.status.change_money(human.items.get_money(human.quest.paying));
        ui.log(`You just got $${human.quest.paying}! [$${this.player.state.money}]`)
    }
    gamble (human, time, ui){
        if (human == null){
            return;
        }
        let you = rand_num(2, 13);
        let them = rand_num(2, 13);
        let txt = `You drew ${you}. They drew ${them}. `
        //console.log(you, them, typeof you, typeof them, you)
        if (you > them){
            human.gambled_and_won += human.ante;    
            txt += `You won! +$${human.ante} [${human.gambled_and_won}]`
            human.ante = Math.round(human.ante * 1.5);
        } else if (you < them){
            this.player.status.change_money(-human.ante);
            human.items.get_money(-human.ante);
            txt += `You lost! -$${human.ante} [${this.player.state.money}]`;
            human.ante = null;
            human.gambled_and_won = 0;
        } else {
            txt += "Draw! "
            human.ante = Math.round(human.ante * 1.5);
        }
        human.gambled = { days: time.days, hours: time. hours };
        ui.log(txt);
    }
    interact(id, human, time, ui, quests){
        //console.log(id, human, time);
        if (human.interactions[id] == undefined){
            console.log('error');
            return;
        }
        let interaction = human.interactions[id];       
        if (interaction == 'beg' && human.begging_unlocked == true 
            && this.player.state.stigma >= human.min_stigma_beg){
            let begged = human.interaction.begged(time);
            this.player.status.change_money(begged);
            ui.log(`They gave you $${begged}.`)
            
        } else if (interaction == 'buy' 
            && this.player.state.money >= human.conversion[id] 
            && this.player.inventory.get.can_they_take(human.resources[id], 1)){ 
            this.player.state.money -= human.conversion[id];
            this.player.inventory.take.from_human(human.resources[id], 1, human);
            ui.log(`You bought ${human.resources[id]} for $${human.conversion[id]}.`)
        } else if (interaction == 'sell' && this.player.inventory.get.do_they_have(human.resources[id], 1) 
            && human.money >= human.conversion[id]){ 
            this.player.inventory.move.give_to_human(human.resources[id], 1, human);
            this.player.status.change_money(human.items.get_money(Number(human.conversion[id])));
            ui.log(`You sell ${human.resources[id]} for $${human.conversion[id]}.`)
        } else if (interaction == 'directions' && ui.social.directions_selected != null && juego.favorites.set.directions.length < 1){
            juego.get.directions(human, ui.social.directions_selected, juego.map, juego.favorites);
            ui.change_screen('map');
            this.player.state.socializing = null;
        } else if (interaction == 'gamble' && this.player.state.money >= 10){
            this.gamble(human, time, ui);
        } else if (interaction == 'work'){
            human.quest.accepted = true;
            quests.add(human.id, human.quest);
            ui.log("You've accepted some work.");
            juego.favorites.add_by_type('human', human.id, juego);
            if (human.quest.type == 'beating'){
                let target = juego.get.human(human.quest.context);
                if (target == null){
                    console.log('error');
                    return;
                }
                juego.favorites.add_human_not_here(target.id, target.location, target.x, target.y);
            }
        } 

    }

    sell_all_to_human(id, human, ui){
        if (human.interactions[id] == undefined){
            console.log('error');
            return;
        }
        let n = this.player.inventory.get.fetch_quantity(human.resources[id]);
        this.player.inventory.move.give_to_human(human.resources[id], n, human);
        this.player.status.change_money(human.items.get_money(Number(human.conversion[id] * n)));
        ui.log(`You sell ${human.resources[id]} for $${(human.conversion[id] * n).toFixed(2)}.`)
    }

    sell_unique_to_human(id, human, ui){
        let item = this.player.inventory.fetch.by_id(id);
        if (human.interactions[id] == undefined || item == null){
            console.log('error');
            return;
        }
        this.player.inventory.move.give_to_human(human.resources[id], 1, human);
        this.player.status.change_money(human.items.get_money(Number(human.conversion[id] * n)));
        ui.log(`You sell ${human.resources[id]} for $${(human.conversion[id] * n).toFixed(2)}.`)
    }

    social(x, y, juego){
        //console.log('social', x, y, juego);
        let human = juego.get.human_by_loc(this.player.state.location.type, this.player.state.location.id, x, y);
        if (human == null){
            return;
        }

        if (!human.quest.accepted && this.player.state.stigma > human.max_stigma_tolerance){
            ui.log("They don't want to talk to you. Your stigma is too high.");
            return;
        }
        human.quest.check();
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
            || !human.items.do_they_have(human_resource, human_quantity)){
            console.log('not enough', player_resource, player_quantity, this.player.inventory.get.do_they_have(player_resource, player_quantity), human_resource, human_quantity, human.items.do_they_have(human_resource, human_quantity));
            return;
        }
        this.player.inventory.move.give_to_human(player_resource, player_quantity, human);
        this.player.inventory.take.from_human(human_resource, human_quantity, human);
        ui.log(`You give ${player_quantity} ${player_resource} and receive ${human_quantity} ${human_resource}.`)
    }
}