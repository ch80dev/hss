class HumanInventory{
    constructor(human){
        this.human = human;
    }
    
    delete(name){
        for (let id in  this.human.inventory){
            let item = this.human.inventory[id];
            if (item.name == name){
                this.human.inventory.splice(id, 1);
            }
        }
    }

    do_they_have(name, quantity){
        for (let item of this.human.inventory){
            if (item.name == name && item.quantity >= quantity){
                return true;
            }
        }
        return false;
    }

    fetch(name){
        for (let item of this.human.inventory){
            if (item.name == name){
                return item;
            }
        }
        //console.log( "nothing to be fetched: " + name);
        return null;
    }

    fetch_quantity(name){
        let item = this.fetch(name);
        if (item == null){
            return 0;
        }
        return item.quantity;
    }

    give(name, quantity){
        //this creates a bug where all items given to NPC will have a 100 durabiltiy. it's fine though
        let do_they_have = this.do_they_have(name, quantity); //doing it like this to avoid fetch_item error msg
        if (!do_they_have){
            this.human.inventory.push({ name: name, quantity: quantity, durability: 100 });
            return;
        }
        let item = this.fetch(name);
        item.quantity += quantity;
    }

    get_money(n){
        if (n > this.human.money){
            console.log('too much money');
            let send = this.human.money;
            this.human.money = 0;
            return send;
        }
        this.human.money -= n;
        return n;
    }

    give_money(n){
        this.human.money += n;
        return n;
    }
}