class Lifeform {
    dead = false;
    delta= {x: 0, y: 0};
    health = null;
    hungry = false;
    sense_range = null;
    stamina = null;
    max_health = null;
    max_stamina = null;
    x = null;
    y = null;

    constructor(type, x, y, map){
        this.map = map;
        this.x = x;
        this.y = y;
        let lifeform = Config.lifeforms[type]
        for (let attr in lifeform){
            let value = lifeform[attr];
            this[attr] = value;
        }
        this.health = this.max_health;
        this.stamina = this.max_stamina;


    }
    die(){
        this.dead = true;
    }

    get_hit(dmg){
        this.health -= dmg;
        if (this.health <= 0){
            this.health = 0;
            this.dead = true;
        }
        

    }

    go(x, y, map_id, movement_cost){
        if (this.stamina > 0){
            this.stamina -= movement_cost;
        } else if(this.health > 0){
            this.health -= movement_cost;
        }
        if (this.map.queries.at(this.x, this.y) == map_id){
            this.map.is(this.x, this.y, 1);
        }
        if (this.map.queries.at(x, y) == 1){
            this.map.is(x, y, map_id);
        }
        if (this.health < 1){
            this.die();
        }
        this.x = x;
        this.y = y;
    }

    is_blocked(x, y){
        if (!this.map.queries.is_valid(x, y)){
            return true;
        }
        if (this.map.queries.at(x, y) == 1 || this.map.queries.at(x, y) == 5){
            return false;
        }
        return true;
    }

}