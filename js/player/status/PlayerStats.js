class PlayerStats {
    constructor(player){
        this.player = player;
    }

    add_energy(n){
        this.player.state.energy += n;
    }
    change_health (n){
        if (n < 0 && this.player.state.drugs.duration['pcp'] > 0){
            this.player.state.deferred_damage += n;
            return;
        }
        this.player.state.health += n;
        if (n < 0 && rand_num(1, 100) > this.player.state.health 
            && (this.player.state.drugs.duration['cocaine'] <= 0 
                && this.player.state.drugs.duration['crack'] <= 0)){
            this.player.status.sleep.go_unconscious();
        }
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
        if (this.player.state.sickness >= this.player.state.max_sickness){
            this.player.state.sick_hours = null;
        }
        this.player.state.sickness = (Number(this.player.state.sickness ) || 0) + n;
        if (this.player.state.sickness < 0){
            this.player.state.sickness = 0;
        } else if (this.player.state.sickness >= this.player.state.max_sickness){
            this.player.state.sick_hours = 0;
            this.player.state.sickness = this.player.state.max_sickness;
        }
    }

    change_stamina(immediate_stamina_change){
        if (this.player.state.drugs.duration['crystal meth'] > 0){
            this.player.state.stamina_delta = 0;
            return;
        }

        if (this.player.state.sickness >= this.player.state.max_sickness ){
			this.player.state.stamina_delta  -= Number((this.player.state.sick_hours * .1).toFixed(1));
		}
        let n = Number(this.player.state.stamina_delta );
        if (immediate_stamina_change != null){
            n = immediate_stamina_change;
        }
        this.player.state.stamina  = this.player.state.stamina + n;
        if (this.player.state.stamina  > this.player.state.max_stamina){
            this.player.state.stamina  = this.player.state.max_stamina;            
        } else if (this.player.state.stamina  < 0){
            if (this.player.state.drugs.duration['uppers'] <= 0){
                
                this.change_health(this.player.state.stamina);
            }
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
        if (n > 0 && this.player.state.drugs.duration['weed'] > 0){
            return;
        }
        this.player.state.stigma += Number(n);
        if (this.player.state.stigma > this.player.state.max_stigma){
            this.player.state.stigma = this.player.state.max_stigma;            
        } else if (this.player.stigma < 0){
            this.player.state.stigma = 0;
        }
        this.player.state.stigma  = Math.round(this.player.state.stigma  * 10) / 10;
    }

    degrade_max_health(n){
        this.player.state.max_health -= n;
        if (this.player.state.health > this.player.state.max_health){
            this.player.state.health = this.player.state.max_health;
        }
        if (this.player.state.max_health == 0){
             this.player.state.dead = true;            
        }
    }

    player_still_sick(){
        if (this.player.state.sickness >= this.player.state.max_sickness){
            this.player.state.sick_hours ++;
        }
    }
    withdraw_from_drugs(){
        if (this.player.state.drunkenness > 0){
            this.player.state.drunkenness --;
        }
        if (this.player.state.energy > 0){
            this.player.state.energy --;
        }
        for (let drug in this.player.state.drugs.duration){
            if (this.player.state.drugs.withdrawal[drug] > 0 && this.player.state.drugs.duration[drug] == -this.player.state.drugs.withdrawal[drug]){
                this.player.state.drugs.withdrawal[drug] --;
                this.player.state.drugs.duration[drug] ++;
            } else if (this.player.state.drugs.withdrawal[drug] > 0 
                && this.player.state.drugs.duration[drug] > -this.player.state.drugs.withdrawal[drug]){
                this.player.state.drugs.duration[drug] --;
            } 
        }
        if (this.player.state.drugs.duration['pcp'] <= 0 && this.player.state.deferred_damage < 0){
            this.player.state.health += this.player.state.deferred_damage;
            if (this.player.state.health <= 0){
                this.player.state.max_health += this.player.state.health;
                if (this.player.state.max_health < 10){
                    this.player.state.max_health = 10;
                }
                this.player.state.health = 1;
            }

            this.player.state.deferred_damage = 0;
        }
    }
}