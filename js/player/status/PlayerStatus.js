class PlayerStatus{
    constructor(player, time, map){
        this.map = this.map;
        this.player = player;
        this.time = time;

        this.sleep = new PlayerSleep(player, time);
        this.stats = new PlayerStats(player);
    }
    
    add_crime(what){
        this.player.state.crimes_this_turn.push(what);
    }

    add_time(hours, minutes){
        this.player.state.hours_delta += hours;
        this.player.state.minutes_delta += minutes;
    }

    can_they_move(){
        return this.player.state.detained_by == null && this.player.state.socializing == null && this.player.state.looting == false;
    }

    did_they_hit(){
        return rand_num(1, 100) <= this.player.state.stamina;
    }

    fetch_dmg(){
        let max_dmg = 1;
        let weapon_equipped =  null;
        if (this.player.state.equipped.hand!= null){
            weapon_equipped = this.player.inventory.fetch.by_id(this.player.state.equipped.hand).name;
            max_dmg = ItemConfig.weapon_dmgs[weapon_equipped];
        }
        return rand_num(1, max_dmg);
    }

    toggle_auto_loot(where, id, map){
        let item = this.player.inventory.fetch.by_id(id);
        if (where == 'loot'){
            item = map.get.inspector.entity.fetch_loot(this.player.fetch_from(), id);
        }
        if (item == null){
            return;
        }
        this.player.state.auto_loot_preferences[item.name] = !this.player.state.auto_loot_preferences[item.name];
    }
}