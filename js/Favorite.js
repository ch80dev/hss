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
		//console.log(this.set);
	}
	add_shop_not_here(shop, path ){
		this.add('shop', shop.id, false, shop.location, shop.x, shop.y, path, []);
	}
    add_by_type(type, id, juego){
		let favorite_target = juego.fetch_human(id);
		if (type == 'shop'){
			favorite_target = juego.fetch_shop(id);
		}
		this.add(type, id, false, { type: juego.player.state.location.type, id: juego.player.state.location.id }, favorite_target.x, favorite_target.y, [], []);
		
	}

	add_for_directions(path, need){
		//console.log(set_id, location, x, y, path);
		this.add('shop', null, true, {type: null, id: null}, null, null, path, need);
		
	}

	fetch_incomplete(x, y){
		//console.log(x, y, this.set)
		for (let entity in this.set){
			//console.log(entity, this.set);
			for (let id in this.set[entity]){
				let favorite = this.set[entity][id];
				//console.log(favorite);
				if (favorite.x == x && favorite.y == y){
					return favorite; 
				}
			}
		}
		return null;
	}
/*
    fetch_relevant(from, to){
        let locations = [
            { type: from.split('-')[0], id: from.split('-')[1] },
            { type: to.split('-')[0], id: to.split('-')[1] },
        ]        
		let id_arr = {
			human: [],
			shop: [],
		};
		for (let entity of Object.keys(id_arr)){
			let favorite = this.set[entity];
			for (let id in favorite){     
				if ((favorite[id].location.type == locations[0].type 
					&& favorite[id].location.id == locations[0].id)
                    || (favorite[id].location.type == locations[1].type 
					&& favorite[id].location.id == locations[1].id)
                ){
					id_arr[entity].push([id, null]);
				}
				for (let to in favorite[id].path){
					
                    for (let spot of favorite[id].path[to]){ 
                        if ((spot.split('-')[0] == locations[0].type  && spot.split('-')[1] == locations[0].id)
                        || (spot.split('-')[0] == locations[1].type  && spot.split('-')[1] == locations[1].id)){
						id_arr[entity].push([id, to]);
					}
                    }
					
				}
			}
		}
		return id_arr;
	}
*/
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
				/*
				for (let from in favorite[id].path){					
					let to = favorite[id].path[from];
					if (at == from || at == to){
						return true;
					}
				}
					*/
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
				//console.log(favorite.path, favorite.path.includes(from))
				if (favorite.path.includes(from)){
					//console.log('delete');
					                    let index = favorite.path.indexOf(from);
                    if (index > -1) {
                        favorite.path.splice(index, 1);
                    }
				} else if (!favorite.path.includes(to)){
					favorite.path.push(to);
					continue;
				} 
				//console.log(favorite.path, favorite.path.includes(from))
			}
		}
		let directions = null;
		//console.log(this.set.directions.length);
		if (this.set.directions.length > 0 ){
			directions = this.set.directions[0];
		}
		//console.log(directions);
		if (directions == null || (directions != null && directions.path.length > 0)){
			return;
		}
		let location = {type: to.split('-')[0], id: Number(to.split('-')[1]) };
		let next_location_type = directions.need.shift();
		let unused_exit = map.queries.fetch_unused_exit(next_location_type, location);
		
		directions.path.push(map.format_at(location.type, location.id, unused_exit.x, unused_exit.y));
		//console.log(directions);

		
	}
/*
    remove(from, to){
        //console.log('remove', from, to, this.set);
        for (let entity of Object.keys(this.set)){
			for (let id in this.set[entity]){
                let favorite = this.set[entity][id];
                for (let path_to in favorite.path){
                    //console.log('path:', path_to, path_to == from, favorite.path[path_to], favorite.path[path_to].includes(to), favorite.path[path_to].length )
                    if (path_to == from && favorite.path[path_to].includes(to) && favorite.path[path_to].length < 2){
                        //console.log('small', this.set[entity][id].path[path_to]);
                        delete this.set[entity][id].path[path_to];
                        //console.log('small', this.set[entity][id].path[path_to]);
                    } else if (path_to == from && favorite.path[path_to].includes(to) && favorite.path[path_to].length > 1){
                        //console.log('big ');
                        delete favorite.path[path_to][favorite.path[path_to].indexOf(to)];
                    }
                }
            }
        }
    }
		*/
		
		}