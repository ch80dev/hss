class Player{
    health = 100;
    location_type = 'alley';
    location_id = 0;
    max_health = 100;
    max_stamina = 100;
    movement_cost = .1;
    stamina = 100;
    x = null;
    y = null;
    
    constructor(juego){
        let open = juego.map.fetch_open();
        this.x = open.x;
        this.y = open.y;
    }

    at(x, y){
        return (x == this.x && y == this.y);
    }

    die(){
        if (this.health > 0){
            return;
        }
        console.log("DIE");
    }

    explore(exit_id, juego){                
        let from = `${this.location_type}-${this.location_id}-${this.x}-${this.y}`;
        console.log(from, exit_id, juego.map.exits, juego.map.exits[from]);
        if (juego.map.exits[from] != undefined){
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
        
        
        //juego.map.exits[]
        juego.map.locations[Config.exit_types[exit_id]].push(juego.map.grid);
        let to = `${Config.exit_types[exit_id]}-${juego.map.locations[Config.exit_types[exit_id]].length - 1}-${start.x}-${start.y}`;
        console.log(from, to);
        this.location_type = Config.exit_types[exit_id];
        this.location_id = juego.map.locations[Config.exit_types[exit_id]].length - 1;
        this.x = start.x;
        this.y = start.y;
        juego.map.exits[from] = to;
        juego.map.exits[to] = from;
        
        
    }

    move(where, juego){
        let directions = {
            up: { x: 0, y: -1 },
            right: { x: 1, y: 0 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
        };
        let pos = {x : this.x + directions[where].x, y: this.y + directions[where].y};
        if (this.stamina > 0){
            this.stamina -= this.movement_cost;
            this.stamina = this.stamina.toFixed(1);
        } else if (this.health > 0){
            this.health -= this.movement_cost;
        }
        if (juego.map.at(pos.x, pos.y) == null || !juego.map.is_valid(pos.x, pos.y)){
            return;
        }  
        this.x = pos.x;
        this.y = pos.y;
        if (juego.map.at(pos.x, pos.y) != 1){
            this.explore(juego.map.at(pos.x, pos.y), juego);
            return;
        }
    }
}
