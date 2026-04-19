class Favorite{	
    set = {
		directions: [],
		human: [],
		shop: [],
	} 
	add(set_type, set_id, directions, location, x, y, path, need){	
		if (directions)	{
			set_type = 'directions';
			set_id = 0;
		}
		if (this.set[set_type][set_id] == undefined){
			this.set[set_type][set_id] = { location: location, x:x, y:y, path: path, need: need}
		} else if (this.set[set_type][set_id] != undefined){
			delete this.set[set_type][set_id];
		}
	}
	add_shop_not_here(shop, path ){
		this.add('shop', shop.id, false, shop.location, shop.x, shop.y, path, []);
	}
    add_by_type(type, id, juego){
		let favorite_target = juego.get.human(id);
		if (type == 'shop'){
			favorite_target = juego.get.shop(id);
		}
		this.add(type, id, false, { type: juego.player.state.location.type, id: juego.player.state.location.id }, favorite_target.x, favorite_target.y, [], []);
		
	}

	add_for_directions(path, need){
		this.add('shop', null, true, {type: null, id: null}, null, null, path, need);
		
	}

	fetch_incomplete(x, y){
		for (let entity in this.set){
			for (let id in this.set[entity]){
				let favorite = this.set[entity][id];
				if (favorite.x == x && favorite.y == y){
					return favorite; 
				}
			}
		}
		return null;
	}

    is_here(at){
		
		let location_type = at.split('-')[0];
		let location_id = Number(at.split('-')[1]);
		let x = Number(at.split('-')[2]);
		let y = Number(at.split('-')[3]);
		for (let entity of Object.keys(this.set)){
			let favorite = this.set[entity];
			for (let id in favorite){
				if ((favorite[id].location.type == location_type 
					&& favorite[id].location.id == location_id 
					&& favorite[id].x == x && favorite[id].y == y) 
					|| favorite[id].path.includes(at)){
					return true;
				}

			}
		}
		return false;
	}

    process(from, to, map){
		//console.log("PROCESS", from, to, this.set);		
		for (let entity of Object.keys(this.set)){
			for (let favorite_id in this.set[entity]){ 
				let favorite = this.set[entity][favorite_id];
				let where = `${from.split('-')[0]}-${from.split('-')[1]}`;
				if (favorite.path.includes(from)){
					let index = favorite.path.indexOf(from);
                    if (index > -1) {
                        favorite.path.splice(index, 1);
                    }
				} else if (!favorite.path.includes(to)){
					favorite.path.push(to);
					continue;
				} 
			}
		}
		let directions = null;
		if (this.set.directions.length > 0 ){
			directions = this.set.directions[0];
		}
		if (directions == null || (directions != null && directions.path.length > 0)){
			return;
		}
		let location = {type: to.split('-')[0], id: Number(to.split('-')[1]) };
		let next_location_type = directions.need.shift();
		let unused_exit = map.get.inspector.fetch_unused_exit(next_location_type, location);
		
		directions.path.push(map.format_at(location.type, location.id, unused_exit.x, unused_exit.y));
		
	}

}