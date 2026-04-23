class Quest {
    id = 0;
    set = [];
    add(human_id,  quest){
        let current = 0;
        if (quest.type == 'fetch'){
            current = juego.player.inventory.get.fetch_quantity(quest.context);
        }
        this.set.push({ human_id: human_id, id: this.next_id(), type: quest.type, current: current, quantity: quest.quantity, paying: quest.paying, canceled: false, context: quest.context });
    }
    cancel(human_id){
        let quest = this.fetch_by_id(human_id);
        if (quest == null){
            return;
        }
        quest.canceled = true;
    }
    next_id(){
        this.id ++;
        return this.id;

    }
    fetch_by_id(human_id){
        for (let quest of this.set){
            if (quest.human_id == human_id){
                return quest;
            }
        }
        return null;
    }
    process(type, delta, context){
        for (let quest of this.set){
            if (quest.canceled || quest.type != type || (type == 'fetch' && context != quest.context)){
                continue;
            }
            let favorite = juego.favorites.fetch_by_id('human', quest.human_id);
            let human = juego.get.human(quest.human_id);
            if (human == null || human.quest.completed){
                continue;
            }
            if (quest.type == type && delta != null ){
                quest.current += delta;                
            }
            let txt = `${quest.current}/${quest.quantity} rats killed`;
            if (type == 'fetch'){
                txt = `${quest.current}/${quest.quantity} ${context}`;
            }
            if (quest.current >= quest.quantity){
                human.quest.completed = true;
                ui.log(`${txt} Head back for your money!`);
                if (favorite == undefined){
                    juego.favorites.add_human_not_here(quest.human_id, human.location, human.x, human.y);
                }
            } else {
                ui.log(`(${txt})`);
            }
        }
    }
}