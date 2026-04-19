class MapGenerator {
    

    constructor(map){
        this.map = map;
        this.shop = new ShopGenerator(this.map);
        this.lights = new LightsGenerator(this.map);
        this.location = new LocationGenerator(this.map);
    }
    
    generate_street_name(){
        return Config.street_names[rand_num(0, Config.street_names.length - 1)];
    }

}