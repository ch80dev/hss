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
        this.player.status.change_stamina_delta(Config.stamina_cost['attack']);
        let did_they_hit = rand_num(1, 100) <= this.player.state.stamina;
        let max_dmg = 1;
        let weapon_equipped =  null;
        if (this.player.state.equipped != null){
            weapon_equipped = this.player.inventory.fetch.by_id(this.player.state.equipped).name;
            max_dmg = ItemConfig.weapon_dmgs[weapon_equipped];
            this.player.inventory.use.weapon();
        }
        let dmg = rand_num(1, max_dmg);
        if (did_they_hit){
            target.get_hit(dmg);
            let money_caption = '';
            if (target.money > 0 && target.health < 1){
                money_caption = ` You took $${target.money} from them. `;
            }
            if (target.health < 1){                                
                juego.map.loot[juego.map.format_at(this.player.state.location.type, this.player.state.location.id, x, y)] = { stuff: null };
                juego.map.loot[juego.map.format_at(this.player.state.location.type, this.player.state.location.id, x, y)].stuff = target.inventory;
                this.player.state.money += target.money;
                target.money = 0;
            }
            ui.log(`You hit them for ${dmg} dmg. [${target.health}] ${money_caption}`);
            return;
        }
        ui.log(`You missed them! ${target.health}/${target.max_health}`);
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

    loot_corpse(map, juego){

        let target = juego.get.target(this.player.state.location.type, this.player.state.location.id, this.player.state.x, this.player.state.y);
        if (target == null){
            return;
        }
        ui.change_screen('loot');
        this.player.state.looting = true;

    }

    sleep_in_tent(map){
        let tent = map.get.inspector.fetch_tent(this.player.fetch_from());
        console.log(tent);
        if(tent == null || !this.player.status.can_they_sleep()){
            return;
        }
        this.player.status.add_time(8, 0);
        let penalty = this.player.status.sleep(true, false);
        ui.sleeping = true;
        let txt = "You sleep in a tent."
        if (penalty > 0){
            txt += `And you regain a little health. [${penalty}]`;
        }
        ui.log(txt)
        ui.change_screen('map');
        this.player.state.looting = false;
    }
}
