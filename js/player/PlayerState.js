class PlayerState{    
    health = 100;    
    inventory = [];
    inventory_weight =  0;
    is_sick = false;
    location_type = 'alley';
    location_id = 0;
    looting = false;
    max_health = 100;
    max_inventory_weight = 100;
    max_stamina = 100;
    max_stigma = 100;
    movement_cost = .1;
    slots_in_inventory = 5;
    stamina = 100;
    stamina_delta = 0;
    stigma = 0;
    sickness = 0;

    x = null;
    y = null;
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}