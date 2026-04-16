class PlayerMovement{
    constructor(player){
        this.player = player;
    }

    at(x, y){
        return (x == this.player.state.x && y == this.player.state.y);
    }

    explore(exit_id, map, juego){   
        let from = this.player.fetch_from();
        let coming_from = { type: this.player.state.location_type, id: this.player.state.location_id };
        if (this.have_they_used_this_exit(this.player.state.location_type, this.player.state.location_id, this.player.state.x, this.player.state.y, map)){
            
            let exits_to = map.exits[from];
            let to_type = exits_to.split('-')[0];
            let to_id = exits_to.split('-')[1];
            
            console.log(`Loading previous location: ${to_type}-${to_id}`);
            let to_x = exits_to.split('-')[2];
            let to_y = exits_to.split('-')[3];
            map.load(to_type, to_id);
            this.player.state.location_type = to_type;
            this.player.state.location_id = parseInt(to_id, 10);
            this.player.state.x = parseInt(to_x, 10);
            this.player.state.y = parseInt(to_y, 10);
            juego.favorites.process(from, this.player.fetch_from());
            map.name_old_location(this.player.state.location_type, this.player.state.location_id);
            return;
        }
        map.wipe();  
        let start = map.generator.generate(Config.exit_types[exit_id], this.player.state.location_type);   
        
        console.log(`Exploring to: ${Config.exit_types[exit_id]}-${map.locations[Config.exit_types[exit_id]].length - 1}`);
        map.locations[Config.exit_types[exit_id]].push(map.grid);
        let to = `${Config.exit_types[exit_id]}-${map.locations[Config.exit_types[exit_id]].length - 1}-${start.x}-${start.y}`;
        this.player.state.location_type = Config.exit_types[exit_id];
        map.location.type = this.player.state.location_type;
        this.player.state.location_id = map.locations[Config.exit_types[exit_id]].length - 1;
        map.location.id = this.player.state.location_id
        juego.populate(this.player.state.location_type, this.player.state.location_id);     
        this.player.state.x = start.x;
        this.player.state.y = start.y;
        
        map.exits[from] = to;
        map.exits[to] = from;
       // console.log(this.player.state.location_type, this.player.state.location_id, from, to);
        juego.favorites.process(from, to);
        map.name_new_location( this.player.state.location_type,  this.player.state.location_id);
        
    }

    have_they_used_this_exit(location_type, location_id, x, y, map){
        let from = `${location_type}-${location_id}-${x}-${y}`;
        return (map.exits[from] != undefined);

        
    }


     move(where, map, juego){
        let directions = {
            up: { x: 0, y: -1 },
            right: { x: 1, y: 0 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
        };
        let pos = {x : this.player.state.x + directions[where].x, y: this.player.state.y + directions[where].y};
        let target = juego.fetch_target(this.player.state.location_type, this.player.state.location_id, pos.x, pos.y);
        if (!map.queries.is_valid(pos.x, pos.y) || map.queries.at(pos.x, pos.y) == null ){
            return;
        }  
        if (this.player.state.location_type == 'sewer'){
            this.player.status.change_stigma(Config.stigma_effects['sewer']);
            this.player.status.change_sickness(Config.sickness_effects['sewer']);
        }
        if (map.queries.at(pos.x, pos.y) == Config.cell_class.indexOf('shop')){ //ENTER SHOP
            //console.log('enter shop');
            this.player.actions.enter_shop(pos.x, pos.y, map);
            return;
        } else if (this.player.state.fighting && Config.attackable.includes(map.queries.at(pos.x, pos.y)) && target != null && !target.dead){//ATTACK
            this.player.actions.attack(pos.x, pos.y, juego);
            return;
        } else if (!this.player.state.fighting && Config.sociable.includes(map.queries.at(pos.x, pos.y)) && target != null && !target.dead){//SOCIAL
            this.player.actions.social(pos.x, pos.y, juego);
            return;
        }
        if (this.player.state.stamina > 0){
            this.player.status.change_stamina_delta(-this.player.state.movement_cost);
        } else if (this.player.state.health > 0){
            this.player.state.health -= this.player.state.movement_cost;
        }
        
        if (map.queries.at(pos.x, pos.y) == Config.cell_class.indexOf('trash') && !this.player.inventory.query.is_equipped_with('tool')
            && map.loot[`${this.player.state.location_type}-${this.player.state.location_id}-${pos.x}-${pos.y}`] != undefined 
            && map.loot[`${this.player.state.location_type}-${this.player.state.location_id}-${pos.x}-${pos.y}`].locked){
            ui.log('This trash can is locked.');
            return;
        }  else if (map.queries.at(pos.x, pos.y) == Config.cell_class.indexOf('trash') 
            && this.player.inventory.query.is_equipped_with('tool')
            && map.loot[`${this.player.state.location_type}-${this.player.state.location_id}-${pos.x}-${pos.y}`] != undefined 
            && map.loot[`${this.player.state.location_type}-${this.player.state.location_id}-${pos.x}-${pos.y}`].locked){
            this.player.actions.unlock_trash(pos.x, pos.y, map);
            return;
        }
        
        this.player.state.x = pos.x;
        this.player.state.y = pos.y;        
        if (map.queries.at(pos.x, pos.y) != 1 && map.queries.at(pos.x, pos.y) < 5){
            this.explore(map.queries.at(pos.x, pos.y), map, juego);
            return;
        } else if (map.queries.at(pos.x, pos.y) == 5){
            this.player.actions.search_trash(this.player.state.x, this.player.state.y, map)
            return;
         } else if (Config.attackable.includes(map.queries.at(pos.x, pos.y)) 
            && target != null && target.dead){
                console.log('d');
            this.player.actions.loot_corpse(map, juego);
        }
        ui.log("");
        
    }
}