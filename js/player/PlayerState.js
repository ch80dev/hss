class PlayerState{    
    equipped = null;
    fighting = false;
    health = Config.lifeforms.human.max_health;    
    inventory = [];
    inventory_weight =  0;
    is_sick = false;
    location_type = 'alley';
    location_id = 0;
    looting = false;
    max_health = Config.lifeforms.human.max_health;    
    max_inventory_weight = 100;
    max_stamina = Config.lifeforms.human.max_stamina;    ;
    max_stigma = 100;
    movement_cost = .1;
    socializing = null;
    slots_in_inventory = 5;
    stamina = Config.lifeforms.human.max_stamina;
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