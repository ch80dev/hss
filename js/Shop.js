class Shop{
    id = null;
    interactions = null;
    inventory = [];
    location = {
        id: null,
        type: null,
    }
    max_stigma = null;
    prices = [];
    resources = [];    
    room_rented_at = null;
    selling = 'all';
    type =  null;
    x = null;
    y = null;
    constructor(id, type, location, x, y){
        //console.log(id, type);
        this.id = id;
        this.location = location;
        this.x = x;
        this.y = y;
        this.type = type;
        if (type == 'pawn'){
            this.stock_pawn_shop();
        }
        this.interactions = ShopConfig.interactions[type];
        this.resources = ShopConfig.resources[type];
        this.max_stigma = ShopConfig.max_stigma[type];
    }
    sleep_at_homeless_shelter(player, time){
        let time_delta = 24 - (time.hours + ShopConfig.homeless_out) + 12;
        player.status.add_time(time_delta, 0)
        player.status.sleep(true, true);
        
        
        ui.sleeping = true;
        ui.change_screen('map');
        player.state.shopping = false;
    }

    rent_a_room(player){
        if (player.state.money < ShopConfig.motel_room_cost){
            return;
        }
        
        player.status.change_money(-ShopConfig.motel_room_cost);
        this.room_rented_at = true;

    }

    sleep(player){
        if(this.type == 'motel' && this.room_rented_at == null){
            return;

        }
        if(this.type == 'motel'){   
            player.status.add_time(8, 0)         
            player.status.sleep(true, true);
            this.room_rented_at == null; // eventually do time
            return;
        }
    }

    stock_pawn_shop(){
        
        while (this.inventory.length < ShopConfig.num_of_items_in_pawn_shop){
            let item_name = ShopConfig.resources['pawn'][rand_num(0, ShopConfig.resources['pawn'].length - 1)];
            let durability = rand_num(50, 95);
            //console.log(item_name, durability);
            this.inventory.push( { name: item_name, quantity: 1, durability: durability });            
        }
    }
}