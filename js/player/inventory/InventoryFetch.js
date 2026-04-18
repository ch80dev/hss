class InventoryFetch{
    constructor(player){
        this.player = player;
    }
    by_id(id){
        for (let item of this.player.state.inventory){
            if (item.id == id){
                return item;
            }
        }
        return null;
    }

    all_items(arr){
        let id_arr = [];
        for (let item of this.player.state.inventory){
            if (arr.includes(item.name)){
                id_arr.push(item.id);
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