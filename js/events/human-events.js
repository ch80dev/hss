$(document).on('click', '#bet', function(e) {
    let human = juego.get.human(juego.player.state.socializing);
    if (human == null){
        return;
    }
    juego.player.actions.human.gamble(human, juego.time, ui);
    ui.refresh.go();
});

$(document).on('click', '#cancel_quest', function(e) {
    let human = juego.get.human(juego.player.state.socializing);
    if (human == null){
        return;
    }
    juego.player.actions.human.cancel_quest(human, juego.quests);
    ui.refresh.go();
});

$(document).on('click', '#complete_quest', function(e) {
    let human = juego.get.human(juego.player.state.socializing);
    if (human == null){
        return;
    }
    juego.player.actions.human.complete_quest(human, ui);
    ui.refresh.go();
});

$(document).on('click', '#cash_out', function(e) {
    let human = juego.get.human(juego.player.state.socializing);
    if (human == null){
        return;
    }
    juego.player.actions.human.cash_out(human, juego.time, ui);
    ui.refresh.go();
});





$(document).on('change', '#directions_to', function() {
    let selected_value = $(this).val();    
    juego.input.selecting_directions(selected_value);
    ui.refresh.go();
});


$(document).on('click', '.interact:not(.trade)', function(e) {
    let human = juego.get.human(juego.player.state.socializing);
    if (human == null){
        return;
    }
    juego.player.actions.human.interact(Number(this.id.split('-')[1]), human, juego.time, ui, juego.quests);
    ui.refresh.go();
});




$(document).on('click', '.sell_all_to_human', function(e) {
    let human = juego.get.human(juego.player.state.socializing);
    if (human == null){
        return;
    }
    juego.player.actions.human.sell_all_to_human(Number(this.id.split('-')[1]), human, ui);
    ui.refresh.go();
});




$(document).on('click', '.sell_unique_to_human', function() {
    let human = juego.get.human(juego.player.state.socializing);
    if (human == null){
        return;
    }
    juego.player.actions.human.sell_unique_to_human(Number(this.id.split('-')[1]), Number(this.id.split('-')[2]), human, ui);
    ui.refresh.go();
});








$(document).on('click', '.trade', function(e) {
    let human = juego.get.human(juego.player.state.socializing);
    if (human == null){
        return;
    }
    juego.player.actions.human.trade(Number(this.id.split('-')[1]), Number(this.id.split('-')[2]), human);
    ui.refresh.go();
});
