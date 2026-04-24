class Lifeform {
    attacking_player = false;
    damage = 1;
    dead = false;
    delta= {x: 0, y: 0};
    health = null;
    hungry = false;
    inventory = [];
    location = {
        id: null,
        type: null,
    }
    money = 0;
    sense_range = null;
    stamina = null;
    max_health = null;
    max_stamina = null;
    type = null;
    x = null;
    y = null;

    constructor(type, x, y, location_type, location_id, map){        
        this.location.type = location_type;
        this.location.id = location_id;
        this.map = map;
        this.x = x;
        this.y = y;
        this.inventory.push({ name: `raw meat (${type})`, quantity: ItemConfig.meat[type], durability: 100 })
        let lifeform = Config.lifeforms[type]
        for (let attr in lifeform){
            let value = lifeform[attr];
            this[attr] = value;
        }
        this.type = type;
        this.health = this.max_health;
        this.stamina = this.max_stamina;
        this.damage = 1;
    }

    attack_player(player){
        this.stamina += Config.stamina_cost.attack;
        let did_they_hit = rand_num(1, 100) <= this.stamina;
        let distance = this.map.get.geometry.fetch_distance(this.x, this.y, player.state.x, player.state.y);       
        if (Math.floor(distance) > 1){ //if shooting, do something else
            return;
        }
        if (!did_they_hit){
            ui.log(`A ${this.type} missed.`);
            return;
        }        
        let dmg = rand_num(1, this.damage);
        this.player.status.change_health(-dmg);
        ui.log(`A ${this.type} hit player for  ${dmg} damage. [${player.state.health}]`);
        
    }

    die(){
        this.dead = true;
        if (this.type == 'rat'){
            juego.quests.process('rats', 1, null);
        }
    }

    get_hit(dmg){
        if (!this.attacking_player){
            this.attacking_player = true;
        }
        this.health -= dmg;
        if (this.health <= 0){
            this.health = 0;
            this.die();
            
        }
        

    }

    go(x, y, map_id, movement_cost){
        if (this.stamina > 0){
            this.stamina -= movement_cost;
        } else if(this.health > 0){
            this.health -= movement_cost;
        }
        if (this.map.get.at(this.x, this.y) == map_id){
            this.map.is(this.x, this.y, 1);
        }
        if (this.map.get.at(x, y) == 1){
            this.map.is(x, y, map_id);
        }
        if (this.health < 1){
            this.die();
        }
        this.x = x;
        this.y = y;
    }

    is_blocked(x, y){
        if (!this.map.get.geometry.is_valid(x, y)){
            return true;
        }
        if (this.map.get.at(x, y) == 1 || this.map.get.at(x, y) == 5){
            return false;
        }
        return true;
    }

}