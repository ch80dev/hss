class PlayerActions {
    
    constructor(player){
        this.player = player;
        this.human = new PlayerHuman(player);        
        this.shop = new PlayerShop(player);
        this.trash = new PlayerTrash(player);
    }

    attack(x, y, juego){
        let map_at = juego.map.get.at(x, y);
        let target = null;
        if (map_at == MapConfig.cell_class.indexOf('rat')){
            target = juego.get.rat(this.player.state.location.type, this.player.state.location.id, x, y);
        } else if (map_at == MapConfig.cell_class.indexOf('human')){
            target = juego.get.human_by_loc(this.player.state.location.type, this.player.state.location.id, x, y);
        }
        let are_they_unconscious = target.unconscious_for != 0;
        let unconscious = '';
        this.player.status.change_stamina_delta(Config.stamina_cost['attack']);
        let did_they_hit = this.player.status.did_they_hit();
        let dmg = this.player.status.fetch_dmg();
        if (did_they_hit){
            let bleeding_txt = '';
            this.player.inventory.use.weapon();
            let bleed = this.player.inventory.get.weapon_bleed();
            this.player.status.add_crime('attack-' + target.type);
            if (target.bleeding < 1 && bleed > 0){
                bleeding_txt = " They started bleeding!"
            }
            target.get_hit(dmg, false, bleed);
            let money_caption = '';
            if (target.money > 0 && target.health < 1){
                money_caption = ` You took $${target.money} from them. `;
            }
            if (target.health < 1){ 
                this.player.status.add_crime(`kill-${target.type}$`)
                target.inventory.push({ name: `raw meat (${target.type})`, quantity: ItemConfig.meat[target.type], durability: 100 })
                          
                juego.map.loot[juego.map.format_at(this.player.state.location.type, this.player.state.location.id, x, y)] = { stuff: null };
                juego.map.loot[juego.map.format_at(this.player.state.location.type, this.player.state.location.id, x, y)].stuff = target.inventory;
                this.player.state.money += target.money;
                target.money = 0;
            } else if (target.type == 'rat' && !are_they_unconscious && target.unconscious_for != 0){
                unconscious = `A ${target.type} lost consciousness.`;
            } else if (!are_they_unconscious && target.unconscious_for != 0){
                this.player.status.add_crime(`knock_out-${target.type}$`)
                unconscious = `${target.name} ${target.surname} lost consciousness.`;
            }
            
            ui.log(`You hit them for ${dmg} dmg. [${target.health}] ${money_caption} ${unconscious} ${bleeding_txt}`);
            return;
        }
        ui.log(`You missed them! ${target.health}/${target.max_health}`);
    }

    cop_lets_them_go(get){
        if (this.player.state.detained_by == null){
            return;
        }
        let cop = get.cop(this.player.state.detained_by);
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
        let cop = juego.get.cop(this.player.state.detained_by);
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

    detained(what, get){
        if (this.player.state.detained_by == null){
            return;
        }
        let cop = get.cop(this.player.state.detained_by);
        if (cop == null){
            return;
        }
        console.log(cop, what);
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
            ui.log(`Get to ${juego.cop_interview.severity_scores[cop.severity]}. Your final score is &#128077; - &#128078; `)
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

    look (x, y, map){
        let simple = ["rat", 'human'];
        if (this.player.state.looking_at != null && this.player.state.looking_at.x == x && this.player.state.looking_at.y == y){
            this.player.looking_at = null;
            return;
        }
        this.player.state.looking_at = { x: x, y: y };
        let map_at = map.get.at(x, y);
        let msg = `(${x}, ${y}) There is nothing here.`;
        if (map_at == null){
            return;
        }
        let at = map.format_at(this.player.state.location.type, this.player.state.location.id, x, y);
        let cell_class = MapConfig.cell_class[map_at];
        let trash = map.loot[at];
        if (cell_class.split('_').length > 0 && cell_class.split("_")[1] == 'exit'){
            msg = `(${x}, ${y}) There is a ${cell_class.split("_")[0]} ${cell_class.split("_")[1]} here.`;
        } else if (simple.includes(cell_class)){
            msg = `(${x}, ${y}) There is a ${cell_class} here.`; // later show health and show if homeless
        } else if (cell_class == 'crate'){
            msg = `(${x}, ${y}) You placed a crate here for your stuff.`;
        } else if (cell_class == 'trash' && trash != null && trash.locked){
            msg = `(${x}, ${y}) There is a locked trash can here. (need a tool to open)`;
        } else if (cell_class == 'trash' && trash != null && !trash.locked){
            msg = `(${x}, ${y}) There is a trash can here.`;
        }
        
        ui.log(msg);
    }
    loot_body(map, juego){
       
        ui.change_screen('loot');
        this.player.state.looting = true;
    }
    loot_corpse(map, juego){
        this.loot_body(map, juego);
    }

    loot_unconscious(map, juego){
        let target = juego.get.target(this.player.state.location.type, this.player.state.location.id, this.player.state.x, this.player.state.y);
        if (target == null){
            return;
        }
        if (target.type == 'human'){
            this.player.status.add_crime('loot_unconscious');
        }
        if (target.inventory != null){
            juego.map.loot[this.player.fetch_from()] = { stuff: null };
            juego.map.loot[this.player.fetch_from()].stuff = target.inventory;
            target.inventory = null;
        }
        this.loot_body(map, juego);
    }

    sleep_in_tent(map){
        let caption = "";
        let loot = map.loot[this.player.fetch_from()];
        let tent = map.get.inspector.entity.fetch_tent(this.player.fetch_from());
        this.player.status.add_crime('sleep');
        console.log(tent);
        if(tent == null || !this.player.status.can_they_sleep()){
            return;
        }
        this.player.status.add_time(8, 0);
        let penalty = this.player.status.sleep(true, false);
        tent.durability -= 1;
        if (tent.durability < 1){
            caption = " Your tent broke!";
            map.delete_loot(this.player.fetch_from(), tent.id);
            let map_is = 1;
            if (loot != undefined && loot.stuff.length > 0){
                map_is = MapConfig.cell_class.indexOf('debris');
            }
            map.is(this.player.state.x, this.player.state.y, map_is);
            
        }
        ui.sleeping = true;
        let txt = "You sleep in a tent."
        if (penalty > 0){
            txt += `And you regain a little health. [${penalty}] `;
        }
        ui.log(`${txt} ${caption}`)
        ui.change_screen('map');
        this.player.state.looting = false;
    }
    serve_sentence(){
        juego.player.state.sentence_served ++;
        ui.refresh.go();
        if (juego.player.state.sentence_served < juego.player.state.sentenced_to){
            setTimeout(juego.player.actions.serve_sentence, 1000);
            return;
        }
        
        this.player.state.sentence_served = null;
        this.player.state.sentenced_to = null;
        this.player.state.cop_interview = false;

    }

    start_sentence(){
        this.player.state.sentence_served = 0;
        console.log(this.player.state.sentence_served);
        setTimeout(juego.player.actions.serve_sentence, 1000);
    }
}
