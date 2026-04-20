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

    food_spoils(){
        for (let item of this.player.state.inventory){
            if (!Object.keys(ItemConfig.food_gain).includes(item.name) ){
                continue;
            }
            if (item.durability < 1){
                continue;
            }
            item.durability --;
        }
    }
    next_id(){
        this.id ++;
        return this.id;
    }

    

    

}
