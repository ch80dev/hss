class Human extends Lifeform{
    conversion = [];
    give_when_begged = null;
    homeless = false;
    interactions = {};
    begging_unlocked = true;
    resources = [];
    min_stigma_beg = null;
    max_stigma_tolerance = null;
    name = null;
    stigma = null; 
    surname = null;

    constructor(id, x, y, are_they_homeless, location_type, location_id, map, player){
       
        //console.log(are_they_homeless);
        super('human', x, y, location_type, location_id, map);
         this.id = id;
        this.map = map;
        this.player = player;
        this.homeless = are_they_homeless;

        this.max_stigma_tolerance = rand_num(50, 100);
        this.min_stigma_beg = rand_num(0, 10);
        if (are_they_homeless){
            this.min_stigma_beg = rand_num(0, 25);
        }
        if (!are_they_homeless){
            
            this.max_stigma_tolerance = rand_num(1, 50);
        }
        this.how_much_to_give_when_begged();        
        this.generate_interactions();
        this.name = HumanConfig.names[rand_num(0, HumanConfig.names.length - 1)];
        this.surname = HumanConfig.names[rand_num(0, HumanConfig.surnames.length - 1)];
    }
    begged(time){
        this.money -= this.give_when_begged;  
        this.begging_unlocked = { days: time.days + 1, hours: time.hours};
        this.how_much_to_give_when_begged();
    }


    delete_item(name){
        for (let id in  this.inventory){
            let item = this.inventory[id];
            if (item.name == name){
                this.inventory.splice(id, 1);
            }
        }
    }

    do_they_have(name, quantity){
        for (let item of this.inventory){
            if (item.name == name && item.quantity >= quantity){
                return true;
            }
        }
        return false;
    }

    fetch_item(name){
        for (let item of this.inventory){
            if (item.name == name){
                return item;
            }
        }
        //console.log( "nothing to be fetched: " + name);
        return null;
    }

    fetch_quantity(name){
        let item = this.fetch_item(name);
        if (item == null){
            return 0;
        }
        return item.quantity;
    }

    generate_conversion(first, second){
        let costs = [ItemConfig.prices[first], ItemConfig.prices[second]];        
        if (costs[0] <= costs[1]){
            return [Math.ceil(costs[1] / costs[0]), 1];
        }
        return [1, Math.ceil(costs[0] / costs[1])];
    }

    generate_interactions(){
        let interactions = [];
        while(interactions.length < HumanConfig.num_of_interactions_per_human ){
            let rand = HumanConfig.interactions[rand_num(0, HumanConfig.interactions.length - 1)];
            if (!interactions.includes(rand)){
                interactions.push(rand);
            }
        }
        this.interactions = interactions;
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
            this.conversion[id] = null;
            this.resources[id] = null;
            if (HumanConfig.interactions_for_resources.includes(interaction) && interaction == 'trade'){
                let first = this.generate_rand_item([]);
                let second = this.generate_rand_item([first]);
                this.resources[id] = { [first]: second };
                this.conversion[id] = this.generate_conversion(first, second);
                this.inventory.push({ name: first, quantity:  Math.ceil(rand_num(10, HumanConfig.homeless_money) / ItemConfig.prices[first]), durability: 100 });
                this.inventory.push({ name: second, quantity:  Math.ceil(rand_num(10, HumanConfig.homeless_money) / ItemConfig.prices[second]), durability: 100 });
            } else if (HumanConfig.interactions_for_resources.includes(interaction)){
                this.resources[id] = this.generate_rand_item([]);
                
            }
            if (interaction == 'buy'){                                
                this.inventory.push({ name: this.resources[id], quantity:  Math.ceil(rand_num(10, HumanConfig.homeless_money) / ItemConfig.prices[this.resources[id]]), durability: 100 });
                this.conversion[id] = Number(ItemConfig.prices[this.resources[id]]  
                    +  (ItemConfig.prices[this.resources[id]] * rand_num(5, 100) * .01)).toFixed(2); 
            } else if (interaction == 'sell'){
                this.conversion[id] = Number(ItemConfig.prices[this.resources[id]]  
                    -  (ItemConfig.prices[this.resources[id]] * rand_num(5, 50) * .01)).toFixed(2); ;

            }
        }
        if (n > 0){
            this.money = n; 
        }
        //console.log(this.interactions, this.inventory, this.resources, this.conversion);
        
    }

    

    generate_rand_item(not_arr){
        //console.log(not_arr);
        let items_drawn_from = ItemConfig.human_items;
        if (this.homeless){
            items_drawn_from = Object.keys(ItemConfig.trash_item_odds);
        }
        while(true){
            let rand = rand_num(0, items_drawn_from.length - 1);
            //console.log(rand, ItemConfig.human_items);
            let rand_item = items_drawn_from[rand];
            
            if (!not_arr.includes(rand_item)){
                return rand_item;
            }
        }
    }
    give(name, quantity){
        //this creates a bug where all items given to NPC will have a 100 durabiltiy. it's fine though
        let do_they_have = this.do_they_have(name, quantity); //doing it like this to avoid fetch_item error msg
        if (!do_they_have){
            this.inventory.push({ name: name, quantity: quantity, durability: 100 });
            return;
        }
        let item = this.fetch_item(name);
        item.quantity += quantity;
    }

    how_much_to_give_when_begged(){        
        let rand = Number((rand_num(1, 500) / 100).toFixed(2)) ;
        if (rand > this.money){
             this.give_when_begged = this.money;
        }
            
        this.give_when_begged = rand;
        
    }
}