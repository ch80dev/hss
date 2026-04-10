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
    money = 0;
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
        this.money = rand_num(0, Config.homeless_money);
        this.x = x;
        this.y = y;
    }
    change_money(n){
        this.money += n;
        if (this.money < 0){
            this.money = 0;
        }
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        this.money = formatter.format(this.money);
    }
}