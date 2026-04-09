class Human extends Lifeform{
    conversion = [];
    homeless = false;
    interactions = {};
    inventory = [];
    last_begged = null;
    resources = [];
    stigma_req = null;
    stigma = null; 
    constructor(x, y, are_they_homeless, map, player){
        super('human', x, y, map);
        this.map = map;
        this.player = player;
        this.homeless = are_they_homeless;
        this.stigma_req = rand_num(50, 100);
        
        if (!are_they_homeless){
            this.stigma_req = rand_num(1, 50);
        }
        
        this.generate_interactions();
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
        console.log( "nothing to be fetched: " + name);
        return null;
    }

    generate_conversion(first, second){
        let costs = [Config.prices[first], Config.prices[second]];
        let quantity = rand_num(1, 3);
        
        
        if (costs[0] <= costs[1]){
            this.inventory.push({ name: second, quantity: quantity, durability: 100 });
            this.inventory.push({ name: first, quantity: rand_num(1, quantity * costs[1] / costs[0]), durability: 100 });
            console.log(this.inventory, quantity, costs, quantity * costs[1] / costs[0]);    
            return [Math.ceil(costs[1] / costs[0]), 1];
        }
        return [1, Math.ceil(costs[0] / costs[1])];
    }

    generate_interactions(){
        let interactions = ['trade'];
        while(interactions.length < Config.num_of_interactions_per_human ){
            let rand = Config.interactions[rand_num(0, Config.interactions.length - 1)];
            if (!interactions.includes(rand)){
                interactions.push(rand);
            }
        }
        this.interactions = interactions;
        let n = 0;
        for (let id in  interactions){
            let interaction = interactions[id];
            if (Config.interactions_for_money.includes(interaction)){
                let inc = rand_num(1, Config.homeless_money);
                if (!this.homeless){
                    inc *= 10;
                }
                n += inc;
            }
            this.conversion[id] = null;
            this.resources[id] = null;
            if (Config.interactions_for_resources.includes(interaction) && interaction == 'trade'){
                let first = this.generate_rand_item([]);
                let second = this.generate_rand_item([first]);
                this.resources[id] = { [first]: second };
                this.conversion[id] = this.generate_conversion(first, second);
            } else if (Config.interactions_for_resources.includes(interaction)){
                this.resources[id] = this.generate_rand_item([]);
                this.conversion[id] = Config.prices[this.resources[id]];
            }
        }
        if (n > 0){
            this.inventory.push({ name: 'money', quantity: n, durability: 100 });
        }
        //console.log(this.interactions, this.inventory, this.resources, this.conversion);
        
    }

    generate_rand_item(not_arr){
        //console.log(not_arr);
        while(true){
            let rand = rand_num(0, Config.human_items.length - 1);
            //console.log(rand, Config.human_items);
            let rand_item = Config.human_items[rand];
            
            if (!not_arr.includes(rand_item)){
                return rand_item;
            }
        }
    }
}