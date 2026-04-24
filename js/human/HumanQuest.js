class HumanQuest{
    constructor(human, map){
        this.human = human;
        this.map = map;
    }
    check(){
        if (this.type == null){
            return;
        }
        let num_of_trash = this.map.get.inspector.entity.fetch_num_of_trash();
        if (this.type == 'trash' && !this.accepted && num_of_trash != this.quantity){
            this.generate();
        }
    }

    generate(){
        let quests_available = ['trash', 'rats', 'fetch']; // trash needs to be first
        let num_of_trash = this.map.get.inspector.entity.fetch_num_of_trash();
        let min = 0;
        

        if (num_of_trash < 10){
            min = 1;
        }
        let quest = quests_available[rand_num(min, quests_available.length - 1)];        
        let price = {
            rats: 10,
            fetch: 1,
            trash: rand_num(1, 3),
        }
        let context = null;
        //let paying = price[quest] * quantity;
        let paying = rand_num(Math.round (this.human.money / 2), this.human.money); //limit it to money
        let quantity = Math.round(paying / price[quest]);
        if (quest == 'trash'){
            quantity = num_of_trash;
        }
        if (quest == 'fetch'){
            //this will run into an edge case where the human might not have enough money
            let rand_item = ItemConfig.stackable[rand_num(0, ItemConfig.stackable.length - 1)];
            let price = ItemConfig.prices[rand_item];
            let rand_variance = Number((rand_num(10, 50) / 100).toFixed(2));
            price = Number((price + (price * rand_variance)).toFixed(2));
            paying = rand_num(10, this.human.money);
            quantity = Math.ceil(paying / price)
            context = rand_item;
        }
        let narrate = this.narrate(quest, quantity, paying, context);
        this.completed = false; 
        this.type = quest; 
        this.quantity = quantity; 
        this.paying = paying; 
        this.accepted = false; 
        this.narrate = narrate;
        this.context = context;
    }
    
    narrate(type, quantity, paying, context){
        if (type == 'rats'){
            return `kill ${quantity}  rats for $${paying}`;
        } else if (type == 'fetch'){
            return `bring me ${quantity} ${context} for $${paying}`;
        } else if (type == 'trash'){
            return `empty all ${quantity} trash cans here for ${paying}`;
        }
    }
}