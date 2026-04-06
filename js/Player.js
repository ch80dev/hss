class Player{
    health = 100;    
    is_sick = true;
    location_type = 'alley';
    location_id = 0;
    looting = false;
    max_health = 100;
    max_inventory_weight = 100;
    max_stamina = 100;
    movement_cost = .1;
    slots_in_inventory = 5;
    stamina = 100;
    stamina_delta = 0;    
    sickness = 0;

    x = null;
    y = null;
    inventory = [{name: 'crate', quantity: 1}];
    inventory_weight =  0;
    constructor(juego){
        this.juego = juego;
        let open = juego.map.fetch_open();
        this.x = open.x;
        this.y = open.y;
    }


    at(x, y){
        return (x == this.x && y == this.y);
    }

    can_they_take(name, quantity){
        let weight = this.fetch_weight(name, quantity);
        if (weight + this.inventory_weight >= this.max_inventory_weight){
            return false;
        } else if (Config.stackable.includes(name) && this.is_in_inventory(name)){
            return true;
        } else if (this.inventory.length >= this.slots_in_inventory ){
            return false;
        }
        return true;
    }

    can_they_use(name){
        if ((name == 'lighter' && !this.is_in_inventory('fuel')) 
            || (name == 'crate' && this.juego.map.is_item_here('crate (placed)', this.fetch_from()))
            || (name == 'crate' && this.juego.map.at(this.x, this.y) != 1)){
            return false;

        }
        return Config.usable.includes(name);
    }

    change_sickness(n){
        n = Number(n);
        this.sickness = (Number(this.sickness) || 0) + n;
        if (this.sickness < 0){
            this.sickness = 0;
        } else if (this.sickness > Config.max_sickness){
            this.sickness = Config.max_sickness;
        }
    }

    change_stamina(){
        if (this.is_sick){
			this.stamina_delta *= 2;
		}
        let n = Number(this.stamina_delta);
        this.stamina = (Number(this.stamina) || 0) + n;
        if (this.stamina > this.max_stamina){
            this.stamina = this.max_stamina;            
        } else if (this.stamina < 0){
            this.stamina = 0;
        }
        this.stamina = Math.round(this.stamina * 10) / 10;
        this.stamina_delta = 0;
    }

    change_stamina_delta(n){
        this.stamina_delta += Number(n);
    }

    die(){
        if (this.health > 0){
            return;
        }
        console.log("DIE");
    }

    drop_item(id){
        let at = this.fetch_from();
        let item = this.inventory[id];
        if (Config.stackable.includes(item.name) && this.juego.map.is_item_here(item.name, at)){
            this.juego.map.stack_items(item.name, item.quantity, at);
            this.inventory.splice(id, 1)
            return;
        } 
        
        if (this.juego.map.loot[at] == undefined){
            this.juego.map.loot[at] = [];
        } 
        this.juego.map.loot[at].push(this.inventory.splice(id, 1)[0]);        
                
    }

    explore(exit_id){   
        let from = `${this.location_type}-${this.location_id}-${this.x}-${this.y}`;
        if (this.have_they_used_this_exit(this.juego, this.location_type, this.location_id, this.x, this.y)){
            let exits_to = this.juego.map.exits[from];
            let to_type = exits_to.split('-')[0];
            let to_id = exits_to.split('-')[1];
            let to_x = exits_to.split('-')[2];
            let to_y = exits_to.split('-')[3];
            this.juego.map.load(to_type, to_id);
            this.location_type = to_type;
            this.location_id = parseInt(to_id, 10);
            this.x = parseInt(to_x, 10);
            this.y = parseInt(to_y, 10);
            return;
        }
        this.juego.map.wipe();  
        let start = this.juego.map[`generate_${Config.exit_types[exit_id]}`](this.location_type);        
        this.juego.map.locations[Config.exit_types[exit_id]].push(this.juego.map.grid);
        let to = `${Config.exit_types[exit_id]}-${this.juego.map.locations[Config.exit_types[exit_id]].length - 1}-${start.x}-${start.y}`;
        this.location_type = Config.exit_types[exit_id];
        this.location_id = this.juego.map.locations[Config.exit_types[exit_id]].length - 1;
        this.x = start.x;
        this.y = start.y;
        this.juego.map.exits[from] = to;
        this.juego.map.exits[to] = from;
        
        
    }

    fetch_from(){
        return `${this.location_type}-${this.location_id}-${this.x}-${this.y}`;
    }

    fetch_weight(name, quantity){
        
        return Config.weights[name] * quantity;
    }


    have_they_used_this_exit(location_type, location_id, x, y){
        let from = `${location_type}-${location_id}-${x}-${y}`;
        return (this.juego.map.exits[from] != undefined);

        
    }

    is_in_inventory(what){
        for (let item of this.inventory){
            if (item.name == what){
                return true;
            }
        }
        return false;
    }

    move(where){
        let directions = {
            up: { x: 0, y: -1 },
            right: { x: 1, y: 0 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
        };
        let pos = {x : this.x + directions[where].x, y: this.y + directions[where].y};        
        if (this.juego.map.at(pos.x, pos.y) == null || !this.juego.map.is_valid(pos.x, pos.y)){
            return;
        }  
        if (this.stamina > 0){
            this.change_stamina_delta(-this.movement_cost);
        } else if (this.health > 0){
            this.health -= this.movement_cost;
        }
        this.x = pos.x;
        this.y = pos.y;
        this.juego.next_turn();
        if (this.juego.map.at(pos.x, pos.y) != 1 && this.juego.map.at(pos.x, pos.y) < 5){
            this.explore(this.juego.map.at(pos.x, pos.y), this.juego);
            return;
        } else if (this.juego.map.at(pos.x, pos.y) == 5){
            this.search_trash(this.x, this.y, this.juego)
        }
        
    }
    open_trash(x, y){
        ui.change_screen('loot');
        this.looting = true;
    }

    

    search_trash(x, y){
        let trash = this.juego.map.loot[this.fetch_from()];
        if (trash == undefined){
            console.log('trash');
            return;
        }
        this.change_stamina_delta(-.4);
        if (trash.length == 0){
            ui.log("Nothing usable in trash");
            delete this.juego.map.loot[this.fetch_from()];
            this.juego.map.is(x, y, 1);
            return;
        }
        this.open_trash(x, y);
        
    }

    stack_item_in_inventory(what, n){
        for (let item of this.inventory){
            if (item.name == what){
                item.quantity += n;
                return;
            }
        }
    }

    take_all(){
        let at = this.fetch_from();
        if (this.juego.map.loot[at] == undefined){
            return;
        }
        while (this.juego.map.loot[at] && this.juego.map.loot[at].length > 0){
            let status = this.take_item(0, this.juego);
            if (status === false){
                return;
            }
        }
    }

    take_item(id){
        //you should be able to take stuff when adjacent but not now
        let at = this.fetch_from();
        if (this.juego.map.loot[at] == undefined 
            || (this.juego.map.loot[at] != undefined && !this.can_they_take(this.juego.map.loot[at][id].name, this.juego.map.loot[at][id].quantity))){
            return false;
        }
        let weight = this.fetch_weight(this.juego.map.loot[at][id].name, this.juego.map.loot[at][id].quantity);
        let what = this.juego.map.loot[at][id].name;
        this.inventory_weight += weight;

        if (Config.stackable.includes(what) && this.is_in_inventory(what)){
            this.stack_item_in_inventory(what, this.juego.map.loot[at][id].quantity);
            this.juego.map.loot[at].splice(id, 1)
        } else {
            this.inventory.push(this.juego.map.loot[at].splice(id, 1)[0]);        
        }
        
        if (this.juego.map.loot[at].length == 0 && this.juego.map.at(this.x, this.y) == 5){
            this.juego.map.is(this.x, this.y, 1);
        }
        if (this.juego.map.loot[at].length == 0){
            delete this.juego.map.loot[at];
            this.looting = false;
            ui.change_screen('map');
        }
    }

    use_item(id){
        let item = this.inventory[id];
        let medicine_works = rand_num(1, 10) == 1;
        if (!this.can_they_use(item.name)){
            return;
        }
        if (item.name == 'crate'){
           
            item.name = 'crate (placed)';
            this.drop_item(id);
            this.juego.map.is(this.x, this.y, 8);
            return;
        } else if (item.name == 'food' || item.name == 'food (spoiled)'){
            this.change_stamina(rand_num(Config.food_gain[0], Config.food_gain[1]));
        } else if (item.name == 'medicine' || (medicine_works && item.name == 'medicine(expired)')){
            this.change_sickness(-rand_num(Config.medicine_gain[0], Config.medicine_gain[1]));
        
        }

        if (item.name == 'food (spoiled)'){
            this.change_sickness(rand_num(Config.spoiled_sick_gain[0], Config.spoiled_sick_gain[1]));
        }

        this.inventory.splice(id, 1);
    }

}
