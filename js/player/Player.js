class Player{
    
    
    constructor(x, y){
        this.actions = new PlayerActions(this);
        this.inventory = new PlayerInventory(this);
        this.movement = new PlayerMovement(this);
        this.state = new PlayerState(x, y);
        this.status = new PlayerStatus(this);
                        
    }

    die(){
        if (this.health > 0){
            return;
        }
        console.log("DIE");
    }
 
    

    fetch_from(){
        return `${this.state.location_type}-${this.state.location_id}-${this.state.x}-${this.state.y}`;
    }
}