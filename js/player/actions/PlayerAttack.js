class PlayerAttack {
    constructor(player){
        this.player = player;
    }
    go(x, y, get, map){
        let map_at = map.get.at(x, y);
        let target = null;
        if (map_at == MapConfig.cell_class.indexOf('rat')){
            target = get.rat(this.player.state.location.type, this.player.state.location.id, x, y);
        } else if (map_at == MapConfig.cell_class.indexOf('human')){
            target = get.human_by_loc(this.player.state.location.type, this.player.state.location.id, x, y);
        }
        let are_they_unconscious = target.unconscious_for != 0;
        let unconscious = '';
        this.player.status.stats.change_stamina_delta(Config.stamina_cost['attack']);
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
                          
                map.loot[map.format_at(this.player.state.location.type, this.player.state.location.id, x, y)] = { stuff: null };
                map.loot[map.format_at(this.player.state.location.type, this.player.state.location.id, x, y)].stuff = target.inventory;
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
}