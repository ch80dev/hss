class Player{
    health = 100;
    location_type = 'alley';
    location_id = 0;
    looting = false;
    max_health = 100;
    max_inventory_weight = 100;
    max_stamina = 100;
    movement_cost = .1;
    slots_in_inventory = 5;
    stamina = 100;
    x = null;
    y = null;
    inventory = [];
    inventory_weight =  0;
    constructor(juego){
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

    die(){
        if (this.health > 0){
            return;
        }
        console.log("DIE");
    }

    explore(exit_id, juego){                
        let from = `${this.location_type}-${this.location_id}-${this.x}-${this.y}`;
        if (this.have_they_used_this_exit(juego, this.location_type, this.location_id, this.x, this.y)){
            let exits_to = juego.map.exits[from];
            let to_type = exits_to.split('-')[0];
            let to_id = exits_to.split('-')[1];
            let to_x = exits_to.split('-')[2];
            let to_y = exits_to.split('-')[3];
            juego.map.load(to_type, to_id);
            this.location_type = to_type;
            this.location_id = parseInt(to_id, 10);
            this.x = parseInt(to_x, 10);
            this.y = parseInt(to_y, 10);
            return;
        }
        juego.map.wipe();  
        let start = juego.map[`generate_${Config.exit_types[exit_id]}`](this.location_type);        
        juego.map.locations[Config.exit_types[exit_id]].push(juego.map.grid);
        let to = `${Config.exit_types[exit_id]}-${juego.map.locations[Config.exit_types[exit_id]].length - 1}-${start.x}-${start.y}`;
        this.location_type = Config.exit_types[exit_id];
        this.location_id = juego.map.locations[Config.exit_types[exit_id]].length - 1;
        this.x = start.x;
        this.y = start.y;
        juego.map.exits[from] = to;
        juego.map.exits[to] = from;
        
        
    }

    fetch_from(){
        return `${this.location_type}-${this.location_id}-${this.x}-${this.y}`;
    }

    fetch_weight(name, quantity){
        
        return Config.weights[name] * quantity;
    }

    have_they_used_this_exit(juego, location_type, location_id, x, y){
        let from = `${location_type}-${location_id}-${x}-${y}`;
        return (juego.map.exits[from] != undefined);

        
    }

    is_in_inventory(what){
        for (let item of this.inventory){
            if (item.name == what){
                return true;
            }
        }
        return false;
    }

    move(where, juego){
        let directions = {
            up: { x: 0, y: -1 },
            right: { x: 1, y: 0 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
        };
        let pos = {x : this.x + directions[where].x, y: this.y + directions[where].y};        
        if (juego.map.at(pos.x, pos.y) == null || !juego.map.is_valid(pos.x, pos.y)){
            return;
        }  
        if (this.stamina > 0){
            this.use_stamina(this.movement_cost);
        } else if (this.health > 0){
            this.health -= this.movement_cost;
        }
        this.x = pos.x;
        this.y = pos.y;
        if (juego.map.at(pos.x, pos.y) != 1 && juego.map.at(pos.x, pos.y) < 5){
            this.explore(juego.map.at(pos.x, pos.y), juego);
            return;
        } else if (juego.map.at(pos.x, pos.y) == 5){
            this.search_trash(this.x, this.y, juego)
        }
    }
    open_trash(x, y){
        ui.change_screen('loot');
        this.looting = true;
    }

    

    search_trash(x, y, juego){
        let already_found = [];
        let trash_usable = rand_num(1, 2) == 1;
        this.use_stamina(.4);
        if (!trash_usable){
            ui.log("Nothing usable in trash");
            juego.map.is(x, y, 1);
            return;
        }
        let num_of_items = rand_num(1, Config.max_num_of_items_in_trash);
        let found = [];    
        for (let i = 0; i < num_of_items; i ++){            
            let item = juego.generate_item_from_trash();
            let n = 1;
            if(already_found.includes(item)){
                continue;
            }
            already_found.push(item);
            if (item == 'recyclables'){
                n = rand_num(1, 10);
            }
            found.push({ name: item, quantity: n });
            
        }
        juego.map.loot[`${this.location_type}-${this.location_id}-${this.x}-${this.y}`] = found;
        this.open_trash(x, y);
        
    }

    stack_item(what, n){
        for (let item of this.inventory){
            if (item.name == what){
                item.quantity += n;
                return;
            }
        }
    }

    take_all(juego){
        let at = this.fetch_from();
        if (juego.map.loot[at] == undefined){
            return;
        }
        while (juego.map.loot[at] && juego.map.loot[at].length > 0){
            let status = this.take_item(0, juego);
            if (status === false){
                return;
            }
        }
    }

    take_item(id, juego){
        //you should be able to take stuff when adjacent but not now

        let at = this.fetch_from();
        console.log(juego.map.loot[at], at);
        if (juego.map.loot[at] == undefined 
            || !this.can_they_take(juego.map.loot[at][id].name, juego.map.loot[at][id].quantity)){
            return false;
        }
        let weight = this.fetch_weight(juego.map.loot[at][id].name, juego.map.loot[at][id].quantity);
        let what = juego.map.loot[at][id].name;
        this.inventory_weight += weight;

        if (Config.stackable.includes(what) && this.is_in_inventory(what)){
            this.stack_item(what, juego.map.loot[at][id].quantity);
            juego.map.loot[at].splice(id, 1)
        } else {
            this.inventory.push(juego.map.loot[at].splice(id, 1)[0]);        
        }
        
        if (juego.map.loot[at].length == 0 && juego.map.at(this.x, this.y) == 5){
            juego.map.is(this.x, this.y, 1);
        }
        if (juego.map.loot[at].length == 0){
            delete juego.map.loot[at];
            this.looting = false;
            ui.change_screen('map');
        }
    }

    use_stamina(n){
        this.stamina -= n;
        this.stamina = this.stamina.toFixed(1);
    }
}
