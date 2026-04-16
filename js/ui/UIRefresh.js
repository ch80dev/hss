class UIRefresh {
    constructor(ui){
        this.ui = ui;
    }
    go(){
		if (juego.player.state.shopping != null ){
			this.ui.shop.display(juego.player);
		}
		this.ui.display_location_name();
		
		
		this.ui.map.display();
		this.ui.loot.display();
		
		this.ui.social.display();
		this.ui.display_favorites();
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
		if (this.ui.status_msg != ''){
			$("#status").html(this.ui.status_msg);
		}
		
		this.ui.status_msg = '';

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

		} else {
			$("#is_sick").addClass('hidden');
			$("#sickness_caption").removeClass('hidden');
		}

		$("#equipped").html("");
		if (juego.player.state.equipped != null){
			
			let equipped = juego.player.inventory.fetch.by_id(juego.player.state.equipped, null);
			//console.log(juego.player.state.equipped, equipped);
			$("#equipped").html(`${equipped.name} (${equipped.durability}%)`)
		}
		const formatter = new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
		$("#money").html(`$${formatter.format(juego.player.state.money)}`);
		this.ui.display_time();
	}
}