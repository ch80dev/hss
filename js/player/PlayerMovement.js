class PlayerMovement{
    constructor(player){
        this.player = player;
    }

    at(x, y){
        return (x == this.player.state.x && y == this.player.state.y);
    }

    explore(exit_id, map, juego){   
        let from = this.player.fetch_from();
        let coming_from = { type: this.player.state.location.type, id: this.player.state.location.id };
        if (map.get.inspector.have_they_used_this_exit(this.player.state.location.type, this.player.state.location.id, this.player.state.x, this.player.state.y)){
            
            let exits_to = map.exits[from];
            let to_type = exits_to.split('-')[0];
            let to_id = exits_to.split('-')[1];
            
            console.log(`Loading previous location: ${to_type}-${to_id}`);
            let to_x = exits_to.split('-')[2];
            let to_y = exits_to.split('-')[3];
            map.load(to_type, to_id);
            this.player.state.location.type = to_type;
            this.player.state.location.id = parseInt(to_id, 10);
            this.player.state.x = parseInt(to_x, 10);
            this.player.state.y = parseInt(to_y, 10);
            juego.favorites.process(from, this.player.fetch_from(), map);
            map.name_old_location(this.player.state.location.type, this.player.state.location.id);
            return;
        }
        map.wipe();  
        let start = map.generator.location.generate(MapConfig.exit_types[exit_id], this.player.state.location.type);   
        
        console.log(`Exploring to: ${MapConfig.exit_types[exit_id]}-${map.locations[MapConfig.exit_types[exit_id]].length - 1}`);
        map.locations[MapConfig.exit_types[exit_id]].push(map.grid);
        let to = `${MapConfig.exit_types[exit_id]}-${map.locations[MapConfig.exit_types[exit_id]].length - 1}-${start.x}-${start.y}`;
        this.player.state.location.type = MapConfig.exit_types[exit_id];
        map.location.type = this.player.state.location.type;
        this.player.state.location.id = map.locations[MapConfig.exit_types[exit_id]].length - 1;
        map.location.id = this.player.state.location.id
        juego.populate(this.player.state.location.type, this.player.state.location.id);
        map.generator.lights.generate();     
        this.player.state.x = start.x;
        this.player.state.y = start.y;
        
        map.exits[from] = to;
        map.exits[to] = from;
        juego.favorites.process(from, to, map);
        map.name_new_location( this.player.state.location.type,  this.player.state.location.id);
        
    }

    

     move(where, map, juego){
        juego.facing = where;
        let directions = {
            up: { x: 0, y: -1 },
            right: { x: 1, y: 0 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
        };
        let pos = {x : this.player.state.x + directions[where].x, y: this.player.state.y + directions[where].y};
        let target = juego.get.target(this.player.state.location.type, this.player.state.location.id, pos.x, pos.y);
        if (!map.get.geometry.is_valid(pos.x, pos.y) || map.get.at(pos.x, pos.y) == null ){
            return;
        }  
        if (this.player.state.location.type == 'sewer'){
            this.player.status.change_stigma(Config.stigma_effects['sewer']);
            this.player.status.change_sickness(Config.sickness_effects['sewer']);
        }
        if (map.get.at(pos.x, pos.y) == MapConfig.cell_class.indexOf('shop')){ //ENTER SHOP
            //console.log('enter shop');
            this.player.actions.enter_shop(pos.x, pos.y, map);
            return;
        } else if (this.player.state.fighting && MapConfig.attackable.includes(map.get.at(pos.x, pos.y)) && target != null && !target.dead){//ATTACK
            this.player.actions.attack(pos.x, pos.y, juego);
            return;
        } else if (!this.player.state.fighting && MapConfig.sociable.includes(map.get.at(pos.x, pos.y)) && target != null && !target.dead){//SOCIAL
            this.player.actions.human.social(pos.x, pos.y, juego);
            return;
        }
        if (this.player.state.stamina > 0){
            this.player.status.change_stamina_delta(-this.player.state.movement_cost);
        } else if (this.player.state.health > 0){
            this.player.state.health -= this.player.state.movement_cost;
        }
        
        if (map.get.at(pos.x, pos.y) == MapConfig.cell_class.indexOf('trash') && !this.player.inventory.get.is_equipped_with('tool')
            && map.loot[`${this.player.state.location.type}-${this.player.state.location.id}-${pos.x}-${pos.y}`] != undefined 
            && map.loot[`${this.player.state.location.type}-${this.player.state.location.id}-${pos.x}-${pos.y}`].locked){
            ui.log('This trash can is locked.');
            return;
        }  else if (map.get.at(pos.x, pos.y) == MapConfig.cell_class.indexOf('trash') 
            && this.player.inventory.get.is_equipped_with('tool')
            && map.loot[`${this.player.state.location.type}-${this.player.state.location.id}-${pos.x}-${pos.y}`] != undefined 
            && map.loot[`${this.player.state.location.type}-${this.player.state.location.id}-${pos.x}-${pos.y}`].locked){
            this.player.actions.trash.unlock(pos.x, pos.y, map);
            return;
        }
        
        this.player.state.x = pos.x;
        this.player.state.y = pos.y;        
        if (map.get.at(pos.x, pos.y) != 1 && map.get.at(pos.x, pos.y) < 5){
            this.explore(map.get.at(pos.x, pos.y), map, juego);
            return;
        } else if (map.get.at(pos.x, pos.y) == 5){
            this.player.actions.trash.search(this.player.state.x, this.player.state.y, map)
            return;
         } else if (MapConfig.attackable.includes(map.get.at(pos.x, pos.y)) 
            && target != null && target.dead){
                console.log('d');
            this.player.actions.loot_corpse(map, juego);
        }
        ui.log("");
        
    }
}