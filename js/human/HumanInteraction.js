class HumanInteraction {

    constructor(human, map){
        this.human = human;
        this.map = map;
    }

    adjust_conversion(id, first, first_q, second, second_q){
        if (this.human.conversion[id][0] > first_q){
            this.human.conversion[id][0] = first_q;        
        }
        if ( this.human.conversion[id][1] > second_q){
            this.human.conversion[id][1] = second_q;
        }
    }
    begged(time){        
        this.human.begging_unlocked = { days: time.days + 1, hours: time.hours};
        this.how_much_to_give_when_begged();
        return this.human.items.get_money(this.human.items.give_when_begged);

    }

    generate_conversion(first, second){
        let costs = [ItemConfig.prices[first], ItemConfig.prices[second]];        
        if (costs[0] <= costs[1]){
            return [Math.ceil(costs[1] / costs[0]), 1];
        }
        return [1, Math.ceil(costs[0] / costs[1])];
    }

    generate(){
        let create_quest = false;
        let interactions = DefaultConfig.interactions;
        let num_of_interactions_for_them = rand_num(1, HumanConfig.num_of_interactions_per_human);
        while(interactions.length <  num_of_interactions_for_them){
            let rand = HumanConfig.interactions[rand_num(0, HumanConfig.interactions.length - 1)];
            let less_often = ['directions'];
            if (less_often.includes(rand) && rand_num(1,3) != 1){
                continue;
            }
            if (!interactions.includes(rand)){
                interactions.push(rand);
            }
        }
        this.human.interactions = interactions;
        let n = 0;
        for (let id in  interactions){
            let interaction = interactions[id];
            if (HumanConfig.interactions_for_money.includes(interaction)){
                let inc = rand_num(1, HumanConfig.homeless_money);
                if (!this.homeless){
                    inc *= 10;
                }
                n += inc;
            }
            this.human.conversion[id] = null;
            this.human.resources[id] = null;
            if (HumanConfig.interactions_for_resources.includes(interaction) && interaction == 'trade'){
                let first = this.generate_rand_item([], interaction);
                let second = this.generate_rand_item([first], interaction);
                this.human.resources[id] = { [first]: second };
                this.human.conversion[id] = this.generate_conversion(first, second);
                let first_quantity = Math.ceil(rand_num(10, HumanConfig.homeless_money) / ItemConfig.prices[first]);
                let second_quantity = Math.ceil(rand_num(10, HumanConfig.homeless_money) / ItemConfig.prices[second]);
                this.adjust_conversion(id, first, first_quantity, second, second_quantity);
                this.human.inventory.push({ name: first, quantity: first_quantity, durability: 100 });
                this.human.inventory.push({ name: second, quantity: second_quantity, durability: 100 });
            } else if (HumanConfig.interactions_for_resources.includes(interaction)){
                this.human.resources[id] = this.generate_rand_item([], interaction);
                
            }
            if (interaction == 'buy'){                                
                this.human.inventory.push({ name: this.human.resources[id], quantity:  Math.ceil(rand_num(10, HumanConfig.homeless_money) / ItemConfig.prices[this.human.resources[id]]), durability: 100 });
                this.human.conversion[id] = Number(ItemConfig.prices[this.human.resources[id]]  
                    +  (ItemConfig.prices[this.human.resources[id]] * rand_num(5, 100) * .01)).toFixed(2); 
            } else if (interaction == 'sell'){
                this.human.conversion[id] = Number(ItemConfig.prices[this.human.resources[id]]  
                    -  (ItemConfig.prices[this.human.resources[id]] * rand_num(5, 50) * .01)).toFixed(2); ;
            } else if (interaction == 'work'){
                create_quest = true;
                
            }
        }
        if (n > 0){
            this.human.money = n; 
        }
        if(create_quest){
            this.human.quest.generate();
        }
    }

    get_available_directions(){
        let directions_to = [];
        let num_of_directions = rand_num(2, 3);

        while(directions_to.length < num_of_directions){
            let rand_id = rand_num(0, Object.keys(ShopConfig.names).length - 1);
            let rand = Object.keys(ShopConfig.names)[rand_id];
            if (!directions_to.includes(rand)){
                directions_to.push(rand);
            }
        }
        return directions_to;
    }

    generate_rand_item(not_arr, interaction){
        //console.log(not_arr);
        let banned = ['food', 'food-spoiled'];
        let items_drawn_from = ItemConfig.human_items;
        if (this.human.homeless || interaction == 'sell'){
            items_drawn_from = Object.keys(this.map.populator.trash_item_odds);
        }
        let no_durables = ['trade'];
        while(true){
            let rand = rand_num(0, items_drawn_from.length - 1);
            let rand_item = items_drawn_from[rand];
            if (banned.includes(rand_item) || (no_durables.includes(interaction) && ItemConfig.degradable.includes(rand_item)) 
            || (interaction == 'trade' 
                && ((not_arr.length > 0 && ItemConfig.recyclables.includes(not_arr[0]) 
                    && ItemConfig.recyclables.includes(rand_item))
                ||   (not_arr.includes('medicine') && rand_item == 'medicine (expired)') 
                || (not_arr.includes('medicine (expired)') && rand_item == 'medicine')) && rand_num(1, 3) != 1 )){
                continue;
            }
            
            if (!not_arr.includes(rand_item) ){
                return rand_item;
            }
        }
    }
    
    how_much_to_give_when_begged(){        
        let rand = Number((rand_num(1, 500) / 100).toFixed(2)) ;
        if (rand > this.money){
             this.human.items.give_when_begged = this.human.money;
        }
            
        this.human.items.give_when_begged = rand;
        
    }
}