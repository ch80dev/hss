class UILoot{
    display_loot_items (items, is_loot){
		let crate_here = '';
		let max_slots = '';
		let max_weight = '';
		let auto_loot_on = "";
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
		if (is_loot && juego.map.queries.is_item_here('crate (placed)', juego.player.fetch_from())){
			crate_here = ' in_crate ';
			txt += "<div id='loot-crate' class=''>crate (placed)</div>";
		}
		for (let id in items){			
			
			let item = items[id].name
			let durability = '';
			if (Config.degradable.includes(item)){
				durability = `(${items[id].durability}%)`;
			}
			
			if (item == 'crate (placed)'){
				continue;
			}
			let n = items[id].quantity;
            let auto_loot = "";
            
           
			let can_they_take = juego.player.inventory.can_they_take(item, n);
			let can_take = "";
			let equipable = "";
			let usable = "";
			let where = 'inventory';
			if (is_loot){
				where = 'loot';
			}
            if (juego.player.state.auto_loot && juego.player.state.auto_loot_preferences[item]){
                auto_loot = `<input type='checkbox' id='auto_loot_item-${where}-${id} class='auto_loot_item' checked>`;
            } else if (juego.player.state.auto_loot && !juego.player.state.auto_loot_preferences[item]){
                auto_loot = `<input type='checkbox' id='auto_loot_item-${where}-${id} class='auto_loot_item'>`;
            }
            
			if (can_they_take){
				can_take = " can_take ";
			} 
			if (!is_loot && Config.usable.includes(item)){
				usable = `<button id='use-${id}' class='use'>use</button>`;
			}
			if (!is_loot && Config.equipable.includes(item) && juego.player.state.equipped != id){
				equipable = `<button id='equip-${id}' class='equip'>equip</button>`;
			} else if (!is_loot && Config.equipable.includes(item) && juego.player.state.equipped == id){
				equipable = `<button id='unequip'>unequip</button>`;
			}
            
			let line = `<div class='item_container'>${auto_loot}<span id='${where}-${id}' class='item ${crate_here} ${can_take}'>${item} ${durability} ${usable} ${equipable} </span></div>`;
			if (Config.stackable.includes(item)){
				line = `<div class='item_container'>${auto_loot}<span id='${where}-${id}' class='item ${crate_here} ${can_take}'>${item} (${n})</span>${usable}</div>`;
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
}