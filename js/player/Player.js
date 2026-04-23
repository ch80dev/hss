class Player{
    constructor(x, y, time){
        this.actions = new PlayerActions(this);
        this.inventory = new PlayerInventory(this);
        this.movement = new PlayerMovement(this);
        this.state = new PlayerState(x, y, this);
        this.status = new PlayerStatus(this, time);                 
    }

    fetch_from(){
        return `${this.state.location.type}-${this.state.location.id}-${this.state.x}-${this.state.y}`;
    }
}