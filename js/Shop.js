class Shop{
    id = null;
    interactions = null;
    inventory = [];
    max_stigma = null;
    prices = [];
    resources = [];    
    room_rented_at = null;
    selling = 'all';
    type =  null;
    
    constructor(id, type){
        //console.log(id, type);
        this.id = id;
        this.type = type;
        if (type == 'pawn'){
            this.stock_pawn_shop();
        }
        this.interactions = Config.shop_interactions[type];
        this.resources = Config.shop_resources[type];
        this.max_stigma = Config.max_stigma_for_shop[type];
    }

    rent_a_room(player){
        //console.log(player.state.money, Config.motel_room_cost, this.room_rented_at);
        if (player.state.money < Config.motel_room_cost){
            return;
        }
        
        player.status.change_money(-Config.motel_room_cost);
        this.room_rented_at = true;

    }

    sleep(player){
        if(this.type == 'motel' && this.room_rented_at == null){
            return;

        }
        if(this.type == 'motel'){            
            player.status.sleep(true, true);
            this.room_rented_at == null; // eventually do time
            return;
        }
    }

    stock_pawn_shop(){
        
        while (this.inventory.length < Config.num_of_items_in_pawn_shop){
            let item_name = Config.shop_resources['pawn'][rand_num(0, Config.shop_resources['pawn'].length - 1)];
            let durability = rand_num(50, 95);
            //console.log(item_name, durability);
            this.inventory.push( { name: item_name, quantity: 1, durability: durability });            
        }
    }
}