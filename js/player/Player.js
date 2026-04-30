class Player{
    constructor(x, y, time, map){
        this.actions = new PlayerActions(this);
        this.inventory = new PlayerInventory(this);
        this.movement = new PlayerMovement(this);
        this.state = new PlayerState(x, y, this);
        this.status = new PlayerStatus(this, time, map);                 
    }
    fetch_loc_str(){
        return `${this.state.location.type}-${this.state.location.id}`;
    }
    fetch_from(){
        return `${this.state.location.type}-${this.state.location.id}-${this.state.x}-${this.state.y}`;
    }
}