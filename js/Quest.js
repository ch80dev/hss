class Quest {
    id = 0;
    set = [];
    add(human_id,  type, quantity, paying){
        this.set.push({ human_id: human_id, id: this.next_id(), type: type, current: 0, quantity: quantity, paying: paying, canceled: false });
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
    process(type, delta, favorites){
        for (let quest of this.set){
            if (quest.canceled){
                continue;
            }
            let favorite = favorites.fetch_by_id('human', quest.human_id);
            let human = juego.get.human(quest.human_id);
            if (human == null || human.quest.completed){
                continue;
            }
            if (quest.type == type && delta != null ){
                quest.current += delta;                
            }
            if (quest.current >= quest.quantity){
                human.quest.completed = true;
                ui.log(`You've killed ${quest.quantity} rats. Head back for your money!`);
                if (favorite == undefined){
                    favorites.add_human_not_here(quest.human_id, human.location, human.x, human.y);
                }
            } else {
                ui.log(`Killed ${quest.current}/${quest.quantity} rats.`);
            }
        }
    }
}