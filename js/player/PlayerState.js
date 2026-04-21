class PlayerState{
    auto_loot = true;
    auto_loot_preferences = {
        'raw meat (human)': true,
        'raw meat (rat)': true,
    };
    dead = false;
    equipped = null;
    fighting = false;
    health = Config.lifeforms.human.max_health;
    hours_delta = 0;    
    inventory = [ ];
    inventory_weight =  0;
    location = {
        id: 0,
        type: 'alley',
    }
    looting = false;
    looking_at = null;
    marking = false;
    max_health = Config.lifeforms.human.max_health;    
    max_inventory_weight = 100;
    max_sickness = Config.max_sickness;
    max_stamina = Config.lifeforms.human.max_stamina;    ;
    max_stigma = 100;
    minutes_delta = 0;
    money = null;
    movement_cost = .1;
    socializing = null;
    slots_in_inventory = 7;
    stamina = Config.lifeforms.human.max_stamina;
    stamina_delta = 0;
    stigma = 0;
    sick_hours = 0;
    sickness = 0;

    x = null;
    y = null;
    constructor(x, y, player){
        this.player = player;
        this.money = rand_num(0, HumanConfig.homeless_money);
        this.x = x;
        this.y = y;
        for (let item_name of Object.keys(ItemConfig.prices)){
            this.auto_loot_preferences[item_name] = true;
        }
        this.inventory.push({name: 'screw driver', id: this.player.inventory.next_id(), quantity: 1, durability: 100 });
    }
    
}