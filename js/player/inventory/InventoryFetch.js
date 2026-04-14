class InventoryFetch{
    constructor(player){
        this.player = player;
    }
    by_id(id){
        if (this.player.state.inventory[id] == undefined){
            return null;
        }
        return this.player.state.inventory[id];
    }

    all_items(arr){
        let id_arr = [];
        for (let id in this.player.state.inventory){
            let item = this.player.state.inventory[id];
            if (arr.includes(item.name)){
                id_arr.push(id);
            }
        }
        return id_arr;
    }

    by_name(name){
        for (let item of this.player.state.inventory){
            if (item.name == name){
                return item;
            }
        }
        //console.log('error');
        return null;
    }
}