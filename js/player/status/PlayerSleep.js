class PlayerSleep {
    constructor(player, time){
        this.player = player;
        this.time = time;
    }
    can_they(){
        return this.fetch_time_til_they_can_sleep() <= 0;
    }
    fetch_hours_since_last_sleep(){
        //doesn't keep track of weeks
        let days =  this.time.days - this.player.state.last_slept.days;
        let hours = this.time.hours - this.player.state.last_slept.hours;
        if (hours < 0){
            hours = this.time.hours;
        }
        if (days > 0){
            hours += days * 24;
        }
        return hours;
    }

    fetch_time_til_they_can_sleep(){
        let hours = Config.can_sleep_every - this.fetch_hours_since_last_sleep();
        return hours;
    }

    go_unconscious(){
        if (this.player.state.unconscious_for != 0){
            return;
        }
        let unconscious_for = rand_num(1, Config.init_unconscious);
        if (this.player.state.last_unconsious != null){
            unconscious_for = rand_num(Math.ceil(this.player.state.last_unconsious / 2), Math.round(this.player.state.last_unconsious * 1.5));
        }
        this.player.state.last_unconsious = unconscious_for;
        this.player.state.unconscious_for = unconscious_for;
        ui.sleeping = true;
        ui.unconscious = true;

    }

    start(indoors, in_a_building){
        let stamina_gain = Math.round((this.player.state.max_stamina - this.player.state.stamina) * .5);
        this.player.state.stamina += stamina_gain;
        if (in_a_building){
            this.player.state.stigma = Math.round(this.player.state.stigma * .5);
            //set to 0 if you own the room or apartment            
        }
        let rand = Number((rand_num(1, 10) * .1).toFixed(1));
        let health_change = this.player.status.stats.change_health(rand);
        juego.next();
        if (!indoors){
            rand = Number((rand_num(1, 15) * .1).toFixed(1));
            this.player.status.stats.change_health(-rand);
            return -rand;
        }
        return health_change;
    }
}