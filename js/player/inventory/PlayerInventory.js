class PlayerInventory {
    
    constructor(player){
        this.player = player;
        this.fetch = new InventoryFetch(this.player);    
        this.move = new InventoryMove(this.player);
        this.query = new InventoryQueries(this.player);
        this.take = new InventoryTake(this.player);
        this.use = new InventoryUse(this.player);

    }

    

    

    

}
