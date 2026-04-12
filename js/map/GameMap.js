class GameMap {
    
    distance_from_street = null;
    exits = {};
    first_shop = true;
    grid = [];   
    last_street = null;
    location = { type: 'alley', id: 0 }; 
    locations = {
        alley: [],
        sewer: [],
        street: [],
    }
    loot = {};
    marks = [];
    names = {

        alley: [],
        sewer: [],
        street: [],
    }    
    next_new_street = null;    
    shops = [];
    shops_generated = [];
    
    

    constructor(max_x, max_y){
        this.max_x = max_x;
        this.max_y = max_y;
        this.generator = new MapGenerator(this);
        this.populator = new MapPopulator(this);
        this.queries = new MapQueries(this);
        this.wipe();        
        this.generator.generate('alley', null);        
        this.locations.alley.push(this.grid);
        this.next_new_street = this.generator.generate_street_name();
        this.names.alley.push({connecting: [this.next_new_street], length: { [this.next_new_street]: null} });
        
        
    }
    
    
    format_at(location_type, location_id, x, y){
        return `${location_type}-${location_id}-${x}-${y}`;
    }

 

    is (x, y, what){
        if (!this.queries.is_valid(x, y)){
            return;
        }
        this.grid[x][y] = what;
    }
    
 

    load(location_type, id){
        this.grid = this.locations[location_type][id];
    }

    mark(at, what){
        if (what == 'Escape' && this.marks[at] != undefined){
            //console.log('go');
            delete this.marks[at];
            return;
        }
        this.marks[at] = what;
    }

    name_old_location(location_type, location_id){
        let name = this.names[location_type][location_id];
        if (this.distance_from_street == null){
            return;
        } else if (location_type == 'street'){
            this.distance_from_street = 0;
            this.last_street = name;
            return;
        }
        this.distance_from_street ++;
        
        if (!name.connecting.includes(this.last_street)){            
            name.connecting.push(this.last_street);
        }
        if (name.length[this.last_street] == undefined || (name.length[this.last_street] != undefined && name.length[this.last_street] == null)){
            name.length[this.last_street] = this.distance_from_street;
        }
    }


    name_new_location(location_type, location_id){
        //no returns in if
        let name = this.names[location_type][location_id];                
        if (location_type == 'street'){
            this.distance_from_street = 0;
            this.names[location_type][location_id] = this.next_new_street;
            this.next_new_street = this.generator.generate_street_name();
            this.last_street = this.names[location_type][location_id];
        } else if (name == undefined && this.last_street == null){
            this.names[location_type][location_id] 
                = { connecting: [this.next_new_street], length: { [this.next_new_street]: null} };
        } else if (name == undefined && this.last_street != null){
            this.names[location_type][location_id] 
                = { connecting: [this.last_street], length: { [this.last_street]: null} };
        }
        
        
    }
   
    stack_items(name, n, from){
        for (let item of this.loot[from].stuff){
            if (item.name == name){
                item.quantity += n;
            }
        }
    }


    wipe(){
        this.grid = [];
        for (let x = 0; x < this.max_x; x ++){
            this.grid[x] = [];
            for (let y = 0; y < this.max_y; y ++){
                this.grid[x][y] = null;            
            }    
        }
    }
}
