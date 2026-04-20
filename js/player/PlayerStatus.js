class PlayerStatus{
    constructor(player){
        this.player = player;
    }
    add_time(hours, minutes){
        this.player.state.hours_delta += hours;
        this.player.state.minutes_delta += minutes;
    }

    change_health (n){
        this.player.state.health += n;
        let changed = n;
        if (this.player.state.health >= this.player.state.max_health){
            changed = this.player.state.health - this.player.state.max_health - n;
            this.player.state.health = this.player.state.max_health;            
        } else if (this.player.state.health <= 0 ){
            this.player.state.health = 0;
            this.player.state.dead = true;            
        }
        return changed;
    }
    change_money(n){
        n = Number(n);
        this.player.state.money += n;
        if (this.player.state.money < 0){
            this.player.state.money = 0;
        }
        
       
    }

    change_sickness(n){
        n = Number(n);
        this.player.state.sickness = (Number(this.player.state.sickness ) || 0) + n;
        if (this.player.state.sickness < 0){
            this.player.state.sickness = 0;
        } else if (this.player.state.sickness > this.player.state.max_sickness){
            this.player.state.sickness = this.player.state.max_sickness;
        }
    }

    change_stamina(immediate_stamina_change){
        if (this.player.state.sickness >= this.player.state.max_sickness ){
			this.player.state.stamina_delta  *= 2;
		}
        let n = Number(this.player.state.stamina_delta );
        if (immediate_stamina_change != null){
            n = immediate_stamina_change;
        }
        this.player.state.stamina  = this.player.state.stamina + n;
        if (this.player.state.stamina  > this.player.state.max_stamina){
            this.player.state.stamina  = this.player.state.max_stamina;            
        } else if (this.player.state.stamina  < 0){
            this.player.state.stamina  = 0;
        }
        this.player.state.stamina  = Number((this.player.state.stamina).toFixed(2));
        if (immediate_stamina_change == null){
            this.player.state.stamina_delta  = 0;
        }
    }

    change_stamina_delta(n){
        this.player.state.stamina_delta  += Number(n);
    }
    change_stigma(n){
        this.player.state.stigma += Number(n);
        if (this.player.state.stigma > this.player.state.max_stigma){
            this.player.state.stigma = this.player.state.max_stigma;            
        } else if (this.player.stigma < 0){
            this.player.state.stigma = 0;
        }
        this.player.state.stigma  = Math.round(this.player.state.stigma  * 10) / 10;
    }

    heal(){
        let rand = Number((rand_num(1, 10) * .1).toFixed(1));
        if (this.player.state.health >= this.player.state.max_health){ 
            return;
        }
        this.player.state.health += rand;
        
        if (this.player.state.health >= this.player.state.max_health){
            this.player.state.max_health;
        }
        //console.log(rand, this.player.state.health);

    }

    sleep(indoors, in_a_building){
        if (in_a_building){
            this.player.state.stigma = Math.round(this.player.state.stigma * .5);
            //set to 0 if you own the room or apartment            
        }
        let rand = Number((rand_num(1, 10) * .1).toFixed(1));
        let health_change = this.change_health(rand);
        //add a thing to show how much health increaseds        
        
        this.player.state.hours_delta += 8;     
        if (!indoors){
            rand = Number((rand_num(1, 15) * .1).toFixed(1));
            this.change_health(-rand);
            return -rand;
        }
        return health_change;
    }
}