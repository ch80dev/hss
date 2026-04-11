class Shop{
    interactions = null;
    max_stigma = null;
    selling = 'all';
    type =  null;
    
    constructor(type){
        this.type = type;
        this.interactions = Config.shop_interactions[type];
        this.resources = Config.shop_resources[type];
        this.max_stigma = Config.max_stigma_for_shop[type];
    }

    
}