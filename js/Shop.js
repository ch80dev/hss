class Shop{
    interactions = null;
    max_stigma = null;
    resources = [];    
    selling = 'all';
    type =  null;
    
    constructor(type){
        console.log(type, Config.shop_interactions);
        this.type = type;
        this.interactions = Config.shop_interactions[type];
        this.resources = Config.shop_resources[type];
        this.max_stigma = Config.max_stigma_for_shop[type];
    }

    
}