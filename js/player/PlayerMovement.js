class PlayerMovement{
    constructor(player){
        this.player = player;
    }

    at(x, y){
        return (x == this.player.state.x && y == this.player.state.y);
    }

    explore(exit_id, map){   
        let from = this.player.fetch_from();
        if (this.have_they_used_this_exit(this.player.state.location_type, this.player.state.location_id, this.player.state.x, this.player.state.y, map)){
            let exits_to = map.exits[from];
            let to_type = exits_to.split('-')[0];
            let to_id = exits_to.split('-')[1];
            let to_x = exits_to.split('-')[2];
            let to_y = exits_to.split('-')[3];
            map.load(to_type, to_id);
            this.player.state.location_type = to_type;
            this.player.state.location_id = parseInt(to_id, 10);
            this.player.state.x = parseInt(to_x, 10);
            this.player.state.y = parseInt(to_y, 10);
            return;
        }
        map.wipe();  
        let start = map.generator.generate(Config.exit_types[exit_id], this.player.state.location_type);        
        map.locations[Config.exit_types[exit_id]].push(map.grid);
        let to = `${Config.exit_types[exit_id]}-${map.locations[Config.exit_types[exit_id]].length - 1}-${start.x}-${start.y}`;
        this.player.state.location_type = Config.exit_types[exit_id];
        map.location.type = this.player.state.location_type;
        this.player.state.location_id = map.locations[Config.exit_types[exit_id]].length - 1;
        map.location.id = this.player.state.location_id
        this.player.state.x = start.x;
        this.player.state.y = start.y;
        map.exits[from] = to;
        map.exits[to] = from;
        
        
    }

    have_they_used_this_exit(location_type, location_id, x, y, map){
        let from = `${location_type}-${location_id}-${x}-${y}`;
        return (map.exits[from] != undefined);

        
    }


     move(where, map){
        let directions = {
            up: { x: 0, y: -1 },
            right: { x: 1, y: 0 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
        };
        let pos = {x : this.player.state.x + directions[where].x, y: this.player.state.y + directions[where].y};        
        if (map.queries.at(pos.x, pos.y) == null || !map.queries.is_valid(pos.x, pos.y)){
            return;
        }  
        if (this.player.state.stamina > 0){
            this.player.status.change_stamina_delta(-this.player.state.movement_cost);
        } else if (this.player.state.health > 0){
            this.player.state.health -= this.player.state.movement_cost;
        }
        this.player.state.x = pos.x;
        this.player.state.y = pos.y;        
        if (map.queries.at(pos.x, pos.y) != 1 && map.queries.at(pos.x, pos.y) < 5){
            this.explore(map.queries.at(pos.x, pos.y), map);
            return;
        } else if (map.queries.at(pos.x, pos.y) == 5){
            this.search_trash(this.player.state.x, this.player.state.y, map)
        }
        
    }
}