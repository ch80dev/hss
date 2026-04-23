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
			for (let favorite of juego.favorites.set[entity]){
				let context = ''; 
				let target = juego.get.shop(favorite.id);
				if (entity == 'human'){
					context = this.display_favorites_for_human(favorite.id);
					target = juego.get.human(favorite.id);
				} 
				let favorite_symbol = `&#x2605;`;
				let name = target.name;
				if (entity == 'human'){
					name += " " + target.surname;
				} else {
					name = ShopConfig.names[target.type];
				}					

				txt += `<div class='favorite_entry'><button id='favorite-${entity}-${favorite.id}' class='favorite'>${favorite_symbol}</button>${name} (${favorite.x}, ${favorite.y}) ${favorite.path.length} locations away</div>`;
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
			} else if (human.interactions[id] == 'work'){
				txt += `<div>${human.interactions[id]} ${human.quest.narrate}</div>`;	
				continue;
			}
			let context = `${human.resources[id]} for $${human.conversion[id]}`;
			if (human.resources[id] == null || human.conversion[id] == null){
				context = '';
			}
			txt += `<div>${human.interactions[id]} ${context}</div>`;
		}
		return txt;
	}
}