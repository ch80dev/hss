class PlayerCop {
    serving_sentence = null;
    constructor(player, get){
        this.player = player;
        this.get = get;
    }
    confiscate_contraband(){
        for (let item of ItemConfig.contraband){
            if (!this.player.inventory.get.do_they_have(item, 1)){
                continue;
            }

            if(ItemConfig.drugs_hard.includes(item) 
                && !this.player.state.reported_crimes.includes('possession-drugs')){
                this.player.state.reported_crimes.push('possession-drugs')
            } else if (item == 'weed' && !this.player.state.reported_crimes.includes('possession-weed')){
                this.player.state.reported_crimes.push('possession-weed')
            } else if(!this.player.state.reported_crimes.includes('possession-weapon') 
                && (item == 'knife' || item == 'hatchet' || item == 'machete')){
                this.player.state.reported_crimes.push('possession-weapon')
            }
            this.player.inventory.move.delete(item, null);
            
        }
        if (this.player.status.were_they_fighting() && this.player.inventory.get.is_equipped_with('bat')){
            this.player.inventory.move.delete('bat', null);
            this.player.state.reported_crimes.push('possession-weapon');
        } else if (this.player.status.were_they_fighting() && this.player.inventory.get.is_equipped_with('pipe')){
            this.player.inventory.move.delete('pipe', null);
            this.player.state.reported_crimes.push('possession-weapon');
        }
    }

    crime_sentencing(){
        if (this.player.state.detained_by == null){
            console.log('error');
            return;
        }
        let cop = this.get.cop(this.player.state.detained_by);
        if (cop == null){
            console.log('error');
            return;
        }
        this.confiscate_contraband();
        let max_sentence = 0;
        for (let crime of this.player.state.reported_crimes){
            max_sentence += CopConfig.crime_sentencing[crime];

        }
        let min_sentence = 1;
        if (cop.denied){
            min_sentence = Math.round(this.player.state.stigma / this.player.state.max_stigma * max_sentence);
        } else if (cop.escaped){
            min_sentence = max_sentence;
        }
        let sentence = rand_num(min_sentence, max_sentence);
        this.player.state.sentenced_to = sentence;        
    }

    detained(what){
        if (this.player.state.detained_by == null){
            return;
        }
        let cop = this.get.cop(this.player.state.detained_by);
        if (cop == null){
            return;
        }
        if (what == 'accept'){
            
            this.crime_sentencing();
            return;
        } else if (what == 'deny'){
            if (cop.severity == null){
                console.log('error');
                return;
            }
            cop.denied = true;
            juego.cop_interview.severity = cop.severity;
            this.player.state.cop_interview = true;
            ui.log(`Keep the balance between &#128077; and &#128078; above ${juego.cop_interview.severity_scores[cop.severity]}.   `)
            return;
        } 
        
        if (what != 'escape'){
            console.log('how?');
            return;
        }
        this.player.state.detained_by = null;
        ui.change_screen('map');
        cop.escaping = true;

    }

    detained_interview(id){
        this.player.state.detained_by = id;
        ui.change_screen('detained');
    }

    go_to_the_yard(){
        this.player.state.in_pacman_jail = true;
        juego.jail.start();
    }

    lets_them_go(){
        if (this.player.state.detained_by == null){
            return;
        }
        let cop = this.get.cop(this.player.state.detained_by);
        if (cop == null){
            return;
        }
        cop.leaving = true;
        this.player.state.detained_by = null;
        ui.log("'Alright, you're free to go but stay out of trouble...'");
        ui.change_screen('map');
    }

    serve_sentence(){
        //THIS IS IN LOOP - NEEDS TO BE JUEGO

        juego.player.state.sentence_served ++;
        ui.refresh.go();
        if (juego.player.state.in_pacman_jail){
            return;
        }

        if (juego.player.state.sentence_served < juego.player.state.sentenced_to){
            setTimeout(juego.player.actions.cop.serve_sentence, 1000);
            return;
        }
        juego.player.state.sentence_served = null;
        juego.player.state.sentenced_to = null;
        juego.player.state.cop_interview = false;
        juego.player.state.detained_by = null;
        ui.change_screen('map');
        ui.refresh.go();

    }

    start_sentence(){
        this.player.state.sentence_served = 0;
        setTimeout(juego.player.actions.cop.serve_sentence, 1000);
    }
}