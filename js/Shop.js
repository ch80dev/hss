class Shop{
    interactions = null;
    inventory = [];
    max_stigma = null;
    prices = [];
    resources = [];    
    selling = 'all';
    type =  null;
    
    constructor(type){
        console.log(type, Config.shop_interactions);
        this.type = type;
        if (type == 'pawn'){
            this.stock_pawn_shop();
        }
        this.interactions = Config.shop_interactions[type];
        this.resources = Config.shop_resources[type];
        this.max_stigma = Config.max_stigma_for_shop[type];
    }

    stock_pawn_shop(){
        
        while (this.inventory.length < Config.num_of_items_in_pawn_shop){
            let item_name = Config.shop_resources['pawn'][rand_num(0, Config.shop_resources['pawn'].length - 1)];
            let durability = rand_num(50, 95);
            console.log(item_name, durability);
            this.inventory.push( { name: item_name, quantity: 1, durability: durability });            
        }
    }
}