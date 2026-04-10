class PlayerStatus{
    constructor(player){
        this.player = player;
    }
    change_sickness(n){
        n = Number(n);
        this.player.state.sickness = (Number(this.player.state.sickness ) || 0) + n;
        if (this.player.state.sickness < 0){
            this.player.state.sickness = 0;
        } else if (this.player.state.sickness > Config.max_sickness){
            this.player.state.sickness = Config.max_sickness;
        }
    }

    change_stamina(){
        if (this.player.state.is_sick ){
			this.player.state.stamina_delta  *= 2;
		}
        let n = Number(this.player.state.stamina_delta );
        this.player.state.stamina  = (Number(this.player.state.stamina ) || 0) + n;
        if (this.player.state.stamina  > this.player.state.max_stamina){
            this.player.state.stamina  = this.player.state.max_stamina;            
        } else if (this.player.state.stamina  < 0){
            this.player.state.stamina  = 0;
        }
        this.player.state.stamina  = Math.round(this.player.state.stamina  * 10) / 10;
        this.player.state.stamina_delta  = 0;
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
}