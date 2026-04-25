class Human extends Lifeform{
    ante = 10;
    begging_unlocked = true;

    conversion = [];
    directions_to = [];
    gambled = null;
    gambled_and_won = 0;
    give_when_begged = null;
    homeless = false;
    interaction = new HumanInteraction(this);
    interactions = {};
    items = new HumanInventory(this);
    
    quest = null;
    resources = [];
    min_stigma_beg = null;
    max_stigma_tolerance = null;
    name = null;
    stigma = null; 
    surname = null;

    constructor(id, x, y, are_they_homeless, location_type, location_id, map, player, get){
        
        super('human', x, y, location_type, location_id, map);
         this.id = id;
        this.map = map;
        this.player = player;
        this.get = get;
        this.quest = new HumanQuest(this, this.map, this.get);
        this.homeless = are_they_homeless;
        this.max_stigma_tolerance = rand_num(50, 100);
        this.min_stigma_beg = rand_num(0, 10);
        if (are_they_homeless){
            this.min_stigma_beg = rand_num(0, 25);
        }
        if (!are_they_homeless){
            this.max_stigma_tolerance = rand_num(1, 50);
        }
        this.interaction.generate();
        this.name = HumanConfig.names[rand_num(0, HumanConfig.names.length - 1)];
        this.surname = HumanConfig.names[rand_num(0, HumanConfig.surnames.length - 1)];
        this.directions_to = this.interaction.get_available_directions();
    }

}