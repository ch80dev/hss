class UILoot{
    display_loot_items (items, is_loot){
		let crate_here = '';
		let max_slots = '';
		let max_weight = '';
		let auto_loot_on = "";
		let tent_here = juego.map.get.inspector.fetch_tent(juego.player.fetch_from());
		if (juego.player.state.auto_loot){
			auto_loot_on = ' checked ';
		}
		let txt = `<div><button id='take_all_loot'>take all</button></div><div id='auto_loot_container'><input type='checkbox' id='auto_loot' ${auto_loot_on}> Auto-loot on?</div>`;
		if (!is_loot && juego.player.state.inventory_weight >= juego.player.state.max_inventory_weight){
			max_weight = ' max ';
		}
		if (!is_loot && juego.player.state.inventory.length >= juego.player.state.slots_in_inventory){
			max_slots = ' max ';
		}
		if (!is_loot){
			txt = `<span class='heading'>Slots</span>: <span class='${max_slots}'>${juego.player.state.inventory.length}/${juego.player.state.slots_in_inventory}</span> <span class='heading'>Weight</span>: <span class='${max_weight}'>${juego.player.state.inventory_weight.toFixed(1)}/${juego.player.state.max_inventory_weight}</span>`;
		}
		if (is_loot && juego.map.get.inspector.is_item_here('crate (placed)', juego.player.fetch_from())){
			crate_here = ' in_crate ';
			txt += "<div id='loot-crate' class=''>crate (placed)</div>";
		} else if (is_loot && juego.map.get.inspector.is_item_here('tent (placed)', juego.player.fetch_from()) && tent_here != null){
			
			crate_here = ' in_crate ';
			txt += `<div id='loot-tent' class=''>tent (placed) ${tent_here.durability}%<button id='sleep_in_tent-${tent_here.id}' class='sleep_in_tent'>sleep</button></div>`;
		}
		for (let item of items){			
			let durability = '';
			let is_food = Object.keys(ItemConfig.food_gain).includes(item.name); 
			if (ItemConfig.degradable.includes(item.name)){
				durability = `(${item.durability}%)`;
			} else if (is_food && item.durability < 1){
				durability = '(spoiled)';		
			} else if (is_food && item.durability > 0){		
				durability = `(${this.fetch_spoil_time(item.durability)})`;
			}
			if (item.name == 'crate (placed)' || item.name == 'tent (placed)'){
				continue;
			}
			let n = item.quantity;
            let auto_loot = "";
            
           
			let can_they_take = juego.player.inventory.get.can_they_take(item.name, n);
			let can_take = "";
			let equipable = "";
			let usable = "";
			let where = 'inventory';
			if (is_loot){
				where = 'loot';
			}
            if (juego.player.state.auto_loot && juego.player.state.auto_loot_preferences[item.name]){
                auto_loot = `<input type='checkbox' id='auto_loot_item-${where}-${item.id} class='auto_loot_item' checked>`;
            } else if (juego.player.state.auto_loot && !juego.player.state.auto_loot_preferences[item.name]){
                auto_loot = `<input type='checkbox' id='auto_loot_item-${where}-${item.id} class='auto_loot_item'>`;
            }
            
			if (can_they_take){
				can_take = " can_take ";
			} 
			if (!is_loot && ItemConfig.usable.includes(item.name)){
				usable = `<button id='use-${item.id}' class='use'>use</button>`;
			}
			if (!is_loot && ItemConfig.equipable.includes(item.name) && juego.player.state.equipped != item.id){
				equipable = `<button id='equip-${item.id}' class='equip'>equip</button>`;
			} else if (!is_loot && ItemConfig.equipable.includes(item.name) && juego.player.state.equipped == item.id){
				equipable = `<button id='unequip'>unequip</button>`;
			}
			let line = `<div class='item_container'>${auto_loot}<span id='${where}-${item.id}' class='item ${crate_here} ${can_take}'>${item.name} ${durability} ${usable} ${equipable} </span></div>`;
			if (ItemConfig.stackable.includes(item.name)){
				line = `<div class='item_container'>${auto_loot}<span id='${where}-${item.id}' class='item ${crate_here} ${can_take}'>${item.name} (${n})</span>${usable}</div>`;
			}
			txt += line;
		}
		return txt;
	}

	display(){
		$(".inventory").html(this.display_loot_items(juego.player.state.inventory, false));
		if (juego.map.loot[juego.player.fetch_from()] == undefined){
			juego.map.loot[juego.player.fetch_from()] = { locked: null, searched: false, stuff: [], durability: null };
		}
		if (juego.player.state.looting){
			$("#loot_container").html( this.display_loot_items(juego.map.loot[juego.player.fetch_from()].stuff, true));
		}
		
	}

	fetch_spoil_time(hours){
		console.log(hours);
		if (hours < 24){
			return `${hours}h`;
		}
		return `${(hours/24).toFixed(1)}d`;
	}
}