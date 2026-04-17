class Player{
    constructor(x, y){
        this.actions = new PlayerActions(this);
        this.inventory = new PlayerInventory(this);
        this.movement = new PlayerMovement(this);
        this.state = new PlayerState(x, y);
        this.status = new PlayerStatus(this);                 
    }

    fetch_from(){
        return `${this.state.location.type}-${this.state.location.id}-${this.state.x}-${this.state.y}`;
    }
}