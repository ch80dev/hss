class UICop{

    interview_questions = [];
    display(){

        if (juego.player.state.detained_by == null){
            return;
        }

        let cop = juego.get.cop(juego.player.state.detained_by);
        if (cop == null){
            return;
        }
        if (juego.player.state.in_pacman_jail){
            $("#detained").html(this.display_jail());
            return;
        } else if (juego.player.state.sentence_served != null){
            $("#detained").html(this.display_sentence_served());
            return;
        } else if (juego.player.state.sentenced_to != null){
            $("#detained").html(this.display_sentenced());
            return;
        } else if (juego.player.state.cop_interview){
            $("#detained").html(this.display_interview(cop));
            return;
        }
        $("#detained").html(this.display_start(cop));

        
    }
    display_interview(cop){
        let question_id = this.fetch_interview_question();
        let answers = [0, 1, 2, 3];
        answers.sort(() => Math.random() - 0.5);
        let interview = juego.cop_interview;
        let txt = `<div>Officer ${cop.name} ${cop.surname}</div><div><div class='cop_interview_question'>"${interview.questions[question_id]}"</div>`;
        for (let i in interview.buttons.categories){
            let answer = interview.answers[question_id][answers[Object.keys(interview.buttons.categories).indexOf(i)]];
            let category  = Object.keys(interview.buttons.categories[i])[0];
            let category_num = interview.buttons.categories[i][category];
            let cost  = Object.keys(interview.buttons.costs[i])[0];
            let secondary = '';
            let cost_num = interview.buttons.costs[i][cost];
            if (cost_num == 1 || cost_num == 2){
                secondary += `<span class='${cost}'>(+${cost_num}${cost})</span>`;
            }
            txt += `<div class='cop_interview_answer'><button id='cop_interview-${i}' class='cop_interview'><span class='${category}'>+${category_num}${category}</span> ${secondary}</button>"${answer}"</div>`;
        }
        txt += `</div><div id='cop_interview_score'>`;
            for(let category of interview.categories){
                let score = interview.score[category];
                txt += `<span class='${category} cop_score'>${category}: ${score}</span>`;
            }
        txt +=  `</div><div id='cop_interview_context'>${interview.turns}/${interview.turns_per_round} ${interview.evaluate()}</div>`;
        return txt;
    }

    display_jail(){
        let cell_classes = [null, 'jail_wall', 'jail_player', 'jail_enemy', 'jail_guard'];

        let txt = `<div>${this.format_sentencing(juego.player.state.sentence_served)} of ${this.format_sentencing(juego.player.state.sentenced_to)}</div><div id='jail_map_container'><div id='jail_map'>`;
        let jail = juego.jail;
        for (let y = 0; y < jail.max_y; y ++){
            txt += "<div class='row'>"
            for (let x = 0; x < jail.max_x; x ++){
                let cell_class = ' jail_empty ';
                let cell_txt = '';
                if (jail.map.at(x, y) != null){
                    cell_class = cell_classes[jail.map.at(x, y)];
                } else if (jail.guard_sees(x, y)){
                    cell_class = 'jail_guard_sees';
                }

                if (jail.power_ups[x][y]){
                    cell_txt = '*';
                }
                txt += `<div id='cell-${x}-${y}' class='jail_cell ${cell_class}'>${cell_txt}</div>`;

            }
        }
        txt += "</div></div>"
        return txt;        
    }

    display_sentenced(){
        let txt = `<div>For the following crimes:</div>`;
        for (let crime of juego.player.state.reported_crimes){
            txt += `<div>${CopConfig.crime_captions[crime]}</div>`;
        }
        
        txt += `You've been sentenced to ${this.format_sentencing(juego.player.state.sentenced_to)}.</div><div><button id='start_sentence'>start</button></div>`;
        return txt;
    }

    display_sentence_served(){
        let txt = `<div>Day #${juego.player.state.sentence_served} of ${this.format_sentencing(juego.player.state.sentenced_to)}</div>`;
        txt += `<button id='go_to_the_yard'>Go to the yard. (time passes 10x faster)</button>`
        return txt;
    }

    display_start(cop){
        let txt = `<div>Officer ${cop.name} ${cop.surname}</div><div>Police!</div> <div>So we got a call for a perp matching your description for the following:`;
        for (let crime of juego.player.state.reported_crimes){
            txt += `<div class='crime_reported'>${CopConfig.crime_captions[crime]}</div>`;
        }

        txt += `<div>Know anything about that?</div>`;
        txt += `<div><button id='detained-accept' class='detained'>"${CopConfig.detained.accept[rand_num(0, CopConfig.detained.accept.length - 1)]}" </button></div><div>[Go straigh to jail.]</div>`
        txt += `<div><button id='detained-deny' class='detained'>"${CopConfig.detained.deny[rand_num(0, CopConfig.detained.deny.length - 1)]}"</button></div><div>[ Talk your way out of things. (You'll receive a worse sentence if you fail.) ]</div>`
        txt += `<div><button id='detained-escape' class='detained'>"${CopConfig.detained.escape[rand_num(0, CopConfig.detained.escape.length - 1)]}"</button></div><div>[ Try to run. (You'll receive the max sentence if you fail.) ]</div>`
        return txt;
    }

    fetch_interview_question(){
        if (this.interview_questions.length == juego.cop_interview.questions.length){
            this.interview_questions = [];
        }
        while(true){
            let rand = rand_num(0, juego.cop_interview.questions.length - 1);
            if (!this.interview_questions.includes(rand)){
                this.interview_questions.push(rand);
                return rand;
            }
        }
    }

    format_sentencing(n){
        let txt = `${n} days`;
        if (n >= 365){
            txt = `${(n / 365).toFixed(1)} years`;        
        } else if (n >= 30){
            txt = `${(n / 30).toFixed(1)} months`;        
        }
        return txt;
    }
}