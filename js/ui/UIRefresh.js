class UIRefresh {
	show_ui_auto_loot = false;
    constructor(ui){
        this.ui = ui;
    }
    go(){
		if (this.ui.sleeping){			
			setTimeout(this.ui.fade_for_sleep, 100);
			return;
		}
		if (juego.player.state.shopping != null ){
			this.ui.shop.display(juego.player);
		} else if (juego.player.state.looting){
			this.ui.loot.display();
		} else if (juego.player.state.detained_by != null){
			this.ui.cop.display();
		}

		this.ui.display_location_name();
		
		
		this.ui.map.display();
		
		
		this.ui.human.display();
		this.ui.favorites.display();
		let health_cent = juego.player.state.health / juego.player.state.max_health * 100;
		let stamina_cent = juego.player.state.stamina / juego.player.state.max_stamina * 100;
		
		let stigma_cent = (juego.player.state.stigma / juego.player.state.max_stigma * 100);

		$("#health_bar").css('width', health_cent.toFixed(1) + '%');
		$("#stamina_bar").css('width', stamina_cent.toFixed(1) + '%');
		$("#stigma_bar").css('width', stigma_cent.toFixed(1) + '%');
		$("#health").html(`${health_cent.toFixed(1)}%`);
		$('#stamina').html(`${stamina_cent.toFixed(1)}%`);
		$("#stamina").removeClass('low_stamina');
		if (stamina_cent < Config.low_stamina_threshold){
			$("#stamina").addClass('low_stamina');
		}
		$('#stigma').html(`${stigma_cent.toFixed(1)}%`);
		let txt  = '';
		if (Object.keys(this.ui.auto_loot_inv).length > 0){
			txt = 'You looted: ';					
		} 
		for (let name in this.ui.auto_loot_inv){
			txt += `${this.ui.auto_loot_inv[name]} ${name}, `
		}
		txt = txt.slice(0, -2) + " ";
		if (this.ui.status_msg != ''){
			this.ui.auto_loot_inv = {};
			txt += this.ui.status_msg;
		}
		if (Number($("#status").css('opacity')) <= 0){
			this.ui.auto_loot_inv = {};
		}
		if (!this.ui.sleeping && (this.show_ui_auto_loot || this.ui.status_msg != '')){
			this.ui.status_msg = '';
			this.show_ui_auto_loot = false;
			$("#status").css('opacity', 1);			
			$("#status").html(txt);
		}
		
		

		$(".screen").addClass('hidden');
		$("#" + this.ui.screen_focused).removeClass('hidden');

		$("#sickness").html(juego.player.state.sickness.toFixed(1));
		$("#sickness_container").addClass('hidden');
		if (juego.player.state.sickness > 0){
			$("#sickness_container").removeClass('hidden');
		}
		if (juego.player.state.sickness >= juego.player.state.max_sickness){
			$("#is_sick").removeClass('hidden');
			$("#sickness_caption").addClass('hidden');
			$("#sickness_penalty").html(`-${(juego.player.state.sick_hours * .1).toFixed(1)}`)

		} else {
			$("#is_sick").addClass('hidden');
			$("#sickness_caption").removeClass('hidden');
		}

		$("#equipped").html("");
		let equipment_caption = '';
		for (let where in juego.player.state.equipped){
			let id = juego.player.state.equipped[where];
			let equipped = juego.player.inventory.fetch.by_id(id);
			if (equipped == null){
				continue;
			}
			equipment_caption += `${equipped.name} (${equipped.durability}%)`;
		}
		$("#equipped").html(equipment_caption);
		const formatter = new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
		$("#money").html(`$${formatter.format(juego.player.state.money)}`);
		this.ui.display_time();
		
	}
}