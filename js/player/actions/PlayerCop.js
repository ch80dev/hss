class PlayerCop {
    constructor(player, get){
        this.player = player;
        this.get = get;
    }
   lets_them_go(){
        if (this.player.state.detained_by == null){
            return;
        }
        let cop = this.get.cop(this.player.state.detained_by);
        if (cop == null){
            return;
        }
        cop.keeping_the_peace = false;
        this.player.state.detained_by = null;
        ui.log("'Alright, you're free to go but stay out of trouble...'");
        ui.change_screen('map');
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

    serve_sentence(){

        //THIS IS IN LOOP - NEEDS TO BE JUEGO

        juego.player.state.sentence_served ++;
        ui.refresh.go();
        if (juego.player.state.sentence_served < juego.player.state.sentenced_to){
            setTimeout(juego.player.actions.cop.serve_sentence, 1000);
            return;
        }
        console.log("yeah");
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