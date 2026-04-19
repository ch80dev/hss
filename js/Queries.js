class Queries{
    constructor(humans, rats, shops){
        this.humans = humans;
		this.rats = rats;
        this.shops = shops;
    }
    human_by_loc(location_type, location_id, x, y){
		for (let human of this.humans){			
            if (human.location.type == location_type && human.location.id == location_id 
				&& human.x == x && human.y == y){
                return human;
            }
        }
        return null;
	}

	human(id){
		//console.log(id);
		for (let human of this.humans){			
            if (human.id == id){
				//console.log(human.id, id);
                return human;
            }
        }
        return null;
	}

	rat(location_type, location_id, x, y){
		//console.log(location_type, location_id, x, y);
		//console.log(rats);
        for (let rat of this.rats){
			//console.log(rat.location, rat.x, rat.y);
            if (rat.location.type == location_type && rat.location.id == location_id 
				&& rat.x == x && rat.y == y){
                return rat;
            }
        }
        return null;
    }

	

	target(location_type, location_id, x, y){
		let target = this.human_by_loc(location_type, location_id, x, y);
		if (target != null){
			return target;
		}
		target = this.rat(location_type, location_id, x, y);
		return target;

	}

	shop(id){
		
		for (let shop of this.shops){
			if (shop.id == id){
				return shop;
			}
		}		
		return null;
	}

	directions(human, what, map){
		//console.log(human, what);
		let target_shop = null;
		for (let shop of this.shops){
			if (shop.type == what){
				target_shop = shop;
				break;
			}
		}
		if (target_shop != null && target_shop.location != null){
			let path = this.map.get.navigator.find_path(human.location, target_shop.location);
			let exits = this.map.get.navigator.fetch_exits_for_path(path);
			this.favorites.add_shop_not_here(target_shop, exits);			
			ui.log("They give you directions to " + what);
			return;
		}
		this.map.generator.shop.queue.push(what);
		if (this.map.unused_exits.street > 0){
			let nearest = this.map.get.navigator.find_nearest('street', human.location);
			let exits = this.map.get.navigator.fetch_exits_for_path(nearest.path);
			let last_loc = nearest.path[nearest.path.length - 1];
			exits.push(nearest.exit);
			this.favorites.add_for_directions(exits, []);
			ui.log("They give you directions to " + what);
			return;

		}
		//this makes an assumption that the starting alley has another alley that you can go to
		this.map.generator.location.exit_queue.push('street');
		let nearest = this.map.get.navigator.find_nearest('alley', human.location);
		let exits = this.map.get.navigator.fetch_exits_for_path(nearest.path);
		let last_loc = nearest.path[nearest.path.length - 1];
		exits.push(nearest.exit);
		this.favorites.add_for_directions(exits, ['street']);
		ui.log("They give you directions to " + what);
	}
}