class ExitInspector{
    constructor(map){
        this.map = map;
    }
    fetch(from, to){
        for (let enter in this.map.exits){
            let exit = this.map.exits[enter];
            if (from == `${enter.split("-")[0]}-${enter.split('-')[1]}` 
                && to == `${exit.split("-")[0]}-${exit.split('-')[1]}`){
                return enter;
            }

        }
        return null;
    }

    fetch_all(){
        let exits = [];
        for (let x = 0; x < MapConfig.max_x; x ++){
            for (let y = 0; y < MapConfig.max_y; y ++){
                let at = this.map.get.at(x, y);
                if (at == null){
                    continue;
                }
                let el = MapConfig.cell_class[at]
                if (el.slice(-4) == 'exit'){
                    exits.push({ x: x, y: y });
                }
            }
        }
        return exits;
    }

    fetch_all_of_type(type){
        if (type == null){
            return [];
        }
        let exits = [];
        for (let x = 0; x < MapConfig.max_x; x ++){
            for (let y = 0; y < MapConfig.max_y; y ++){
                let at = this.map.get.at(x, y);
                if (at == null){
                    continue;
                }
                let el = MapConfig.cell_class[at]
                if (el.slice(0, -5) == type){
                    exits.push({ x: x, y: y });
                }
            }
        }
        return exits;
    }

    fetch_count(){
        let exits = ['alley_exit', 'street_exit', 'sewer_exit'];
        let num_of_exits = { alley: 0, sewer: 0, street: 0 };
        for (let x = 0; x < MapConfig.max_x; x ++){
            for (let y = 0; y < MapConfig.max_y; y ++){
                let at = this.map.get.at(x, y);
                if (at == null){
                    continue;
                }
                let el = MapConfig.cell_class[at]
                if (!exits.includes(el)){
                    continue;
                }
                num_of_exits[el.slice(0, -5)] ++;
            }
        }
        return num_of_exits;
    }

    fetch_unused(target_location_type, location){
        let exits = [];
        for (let x = 0; x < MapConfig.max_x; x ++){
            for (let y = 0; y < MapConfig.max_y; y ++){
                let at = this.map.locations[location.type][location.id][x][y];
                if (at == MapConfig.cell_class.indexOf(target_location_type + "_exit")                    
                    && !this.have_they_used_this(location.type, location.id, x, y)){
                    exits.push({ x: x, y: y});
                }
            }
        }
        if (exits.length < 1){
            return null;
        }
        return exits[rand_num(0, exits.length - 1)];
    }

    have_they_used_this(location_type, location_id, x, y){        
        let from = this.map.format_at(location_type, location_id, x, y);
        return (this.map.exits[from] != undefined);
    }
}