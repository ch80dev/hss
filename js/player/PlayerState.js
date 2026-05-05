class PlayerState{
    auto_loot = true;
    auto_loot_preferences = {
        'raw meat (human)': false,
        'raw meat (rat)': false,
    };
    crimes_this_turn = [];
    dead = false;
    cop_interview = false;
    detained_by = null;
    equipped = {
        bag: null,
        hand: null,
        light: null,
    };
    fighting = false;
    health = Config.lifeforms.human.max_health;
    hours_delta = 0;    
    inventory = [ ];
    inventory_slots = 8;
    inventory_weight =  0;
    last_exit = {from: null, to: null };
    last_slept = { days: 1, hours: 0 };
    last_unconscious = null;
    light_equipped = null;
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
    movement_cost = null;
    reported_crimes = [];
    in_pacman_jail = false;
    sentence_served = null; //null
    sentenced_to = null; //null
    shopping = null;
    socializing = null;
    
    stamina = Config.lifeforms.human.max_stamina;
    stamina_delta = 0;
    stigma = 0;
    sick_hours = 0;
    sickness = 0;
    unconscious_for = 0;
    x = null;
    y = null;
    constructor(x, y, player){
        this.player = player;
        this.money = rand_num(0, HumanConfig.homeless_money);
        this.x = x;
        this.y = y;
        this.movement_cost = Config.stamina_cost.move
        for (let item_name of Object.keys(ItemConfig.prices)){
            this.auto_loot_preferences[item_name] = true;
        }
        for (let item_name of Object.keys(ItemConfig.food_gain)){
            this.auto_loot_preferences[item_name + ' (spoiled)'] = false;
        }
        if (DefaultConfig.init_inventory != null){
            this.inventory.push(DefaultConfig.init_inventory);
        }
        if (DefaultConfig.equip_init_inventory){
            this.equipped.hand = 0;
        }
    }
    
}