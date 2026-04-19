class PlayerInventory {
    
    constructor(player){
        this.id = 0;
        this.player = player;
        this.fetch = new InventoryFetch(this.player);    
        this.move = new InventoryMove(this.player);
        this.get = new InventoryQueries(this.player);
        this.take = new InventoryTake(this.player);
        this.use = new InventoryUse(this.player);

    }

    next_id(){
        this.id ++;
        return this.id;
    }

    

    

}
