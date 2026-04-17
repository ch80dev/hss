class Favorite{
    set = {
		human: [],
		shop: [],
	} 

    add(type, id, juego){
		console.log(type, id, juego);
		let favorite_target = juego.fetch_human(id);
		if (type == 'shop'){
			favorite_target = juego.fetch_shop(id);
		}
		
		if (this.set[type][id] == undefined){
			this.set[type][id] = { location: { type: juego.player.state.location.type, id: juego.player.state.location.id }, x: favorite_target.x, y: favorite_target.y, path: {}, past_locations: [] }
		} else if (this.set[type][id] != undefined){
			delete this.set[type][id];
		}
	}

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
					|| favorite[id].past_locations.includes(at)){
					return true;
				}
				for (let from in favorite[id].path){					
					let to = favorite[id].path[from];
					if (at == from || at == to){
						return true;
					}
				}
			}
		}
		return false;
	}

    process(from, to){
		//console.log("PROCESS", from, to, this.set);		
		for (let entity of Object.keys(this.set)){
			for (let favorite_id in this.set[entity]){ 
				let favorite = this.set[entity][favorite_id];
				let where = `${from.split('-')[0]}-${from.split('-')[1]}`;
				if (favorite.past_locations.includes(from)){
					delete favorite.past_locations[from];
				} else if (!favorite.past_locations.includes(to)){
					favorite.past_locations.push(to);
					continue;
				} 
			}
		}
	}

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
}