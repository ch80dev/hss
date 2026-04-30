class Queries{
    constructor(humans, rats, shops, cops){
		this.cops = cops;
        this.humans = humans;
		this.rats = rats;
        this.shops = shops;
    }

	cop(id){
		for (let cop of this.cops){
			if (cop.id == id){
				return cop;
			}
		}
		return null;
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

	rand_human(not_them_id){
		if (this.humans.length <= 2){
			return null;
		}
		while(true){
			let rand = rand_num(0, this.humans.length - 1);
			let human = this.human(rand);
			if (human != null && human.id != not_them_id){
				return human;
			}
		}
	}

	rat(location_type, location_id, x, y){
		//console.log(location_type, location_id, x, y);
        for (let rat of this.rats){
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

	directions(human, what, map, favorites){
		//console.log(human, what);
		let target_shop = null;
		for (let shop of this.shops){
			if (shop.type == what){
				target_shop = shop;
				break;
			}
		}
		if (target_shop != null && target_shop.location != null){
			let path = map.get.navigator.find_path(human.location, target_shop.location);
			let exits = map.get.navigator.entity.fetch_exits_for_path(path);
			favorites.add_shop_not_here(target_shop, exits);			
			ui.log("They give you directions to " + what);
			return;
		}
		map.generator.shop.queue.push(what);
		if (map.unused_exits.street > 0){
			let nearest = map.get.navigator.find_nearest('street', human.location);
			console.log('BUG', nearest);
			let exits = map.get.navigator.entity.fetch_exits_for_path(nearest.path);
			let last_loc = nearest.path[nearest.path.length - 1];
			exits.push(nearest.exit);
			favorites.add_for_directions(exits, []);
			ui.log("They give you directions to " + what);
			return;

		}
		//this makes an assumption that the starting alley has another alley that you can go to
		map.generator.location.exit_queue.push('street');
		let nearest = map.get.navigator.find_nearest('alley', human.location);
		let exits = map.get.navigator.entity.fetch_exits_for_path(nearest.path);
		let last_loc = nearest.path[nearest.path.length - 1];
		exits.push(nearest.exit);
		favorites.add_for_directions(exits, ['street']);
		ui.log("They give you directions to " + what);
	}
}