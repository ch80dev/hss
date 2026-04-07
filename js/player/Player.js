class Player{
    
    
    constructor(x, y){
        this.action = new PlayerActions(this);
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
        return `${this.location_type}-${this.location_id}-${this.x}-${this.y}`;
    }
}