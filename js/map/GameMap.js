class GameMap {
    
    location = { type: 'alley', id: 0 }; 
    exits = {};
    grid = [];   
    locations = {
        alley: [],
        sewer: [],
        street: [],
    }
    loot = {};
    
    

    constructor(max_x, max_y){
        this.max_x = max_x;
        this.max_y = max_y;
        this.generator = new MapGenerator(this);
        this.populator = new MapPopulator(this);
        this.queries = new MapQueries(this);
        this.wipe();        
        this.generator.generate('alley', null);
        this.locations.alley.push(this.grid);
        
        
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
