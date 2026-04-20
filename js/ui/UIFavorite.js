class UIFavorite{
    display(){
		let txt = "";
		for (let entity in juego.favorites.set){
			if (entity == 'directions'){
                
                
                if (juego.favorites.set.directions.length > 0) {
                    txt += `<div class='favorite_entry'><button id='favorite-${entity}-0' class='favorite'>&#x2605</button>${ShopConfig.names[juego.map.generator.shop.queue[0]]} - got directions from someone </div>`;
                }
				continue;
			}
			for (let id in juego.favorites.set[entity]){
				
				let favorite = juego.favorites.set[entity][id];
			
				let context = ''; 
				let target = juego.get.shop(id);
				if (entity == 'human'){
					context = this.display_favorites_for_human(id);
					target = juego.get.human(id);
				} 
				let favorite_symbol = `&#x2606;`;
				let name = target.name;
				if (entity == 'human'){
					name += " " + target.surname;
				} else {
					name = ShopConfig.names[target.type];
				}					
        		if (juego.favorites.set[entity][id] != undefined){
            		favorite_symbol = `&#x2605;`;
        		}
				txt += `<div class='favorite_entry'><button id='favorite-${entity}-${id}' class='favorite'>${favorite_symbol}</button>${name} (${favorite.x}, ${favorite.y}) ${favorite.path.length} locations away</div>`;
				txt += `<div class='favorite_context'>${context}</div>`;
			}
		}
		$("#favorites").html(txt);
	}

    display_directions(){

    }

	display_favorites_for_human(id){
		let human = juego.get.human(id);
		let txt = "";
		if (human == null){
			return;
		}
		for (let id in human.interactions){
			if (human.interactions[id] == 'trade'){
				let trade_this = Object.keys(human.resources[id]);
				let get_that = human.resources[id][trade_this];
				txt += `<div>${human.interactions[id]} ${human.conversion[id][0]} ${trade_this} for ${human.conversion[id][1]} ${get_that}</div>`;
				continue;
			} else if (human.interactions[id] == 'beg' || human.interactions[id] == 'directions'){
				txt += `<div>${human.interactions[id]}</div>`;	
				continue;
			}
			txt += `<div>${human.interactions[id]} ${human.resources[id]} for $${human.conversion[id]}</div>`;
		}
		return txt;
	}
}