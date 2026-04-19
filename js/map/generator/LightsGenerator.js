class LightsGenerator{
    constructor(map){
        this.map = map;
    }
    //this kind of needs a refactor but I don't feel like figuring out the difference between them right now
    generate(){
        //console.log('lights generating', this.map.location.type);
        if (this.map.location.type == 'sewer' ){
            return;
        }
        if (this.map.location.type == 'alley'){
            this.generate_for_alley();
            return;
        }
        this.generate_for_street();
    }

    generate_for_alley(){
        let border = this.map.get.inspector.fetch_border_spot(true);        
        let lights = [border];
        let n = 0;        
        while(n < 100){
            let good = null;
            border = this.map.get.inspector.fetch_open();
            for (let spot of lights){
                let distance = this.map.get.geometry.fetch_distance(spot.x, spot.y, border.x, border.y);
                if ((border.x == spot.x && border.y == spot.y) || distance <= 6){            
                    good = false;
                    break;
                }
                if (good == null){
                    good = border;
                    
                }
                
            }
            if (good !== false && good != null){
                lights.push(good);
                n = 0;
            }
            n++;
        }
        this.map.lights[this.map.location.type][this.map.location.id] = lights;
    }

    generate_for_street(){
        
        let border = this.map.get.inspector.fetch_border_spot(true);
        let lights = [border];
        let n = 0;
        let valid_x = [border.x];
        let valid_y = [border.y];
        while(n < 1000){
            let good = null;
            let rand_spot = lights[rand_num(0, lights.length - 1)];
            let open = this.map.get.inspector.fetch_open_with_distance(rand_spot.x, rand_spot.y, 4);
            
            for (let spot of lights){                
                if ((open.x == spot.x && open.y == spot.y)){
                    good = false;
                    break;
                }
                if (good == null && (valid_x.includes(open.x)  || valid_y.includes(open.y))){
                    good = open;
                    
                }
            }
            if (good !== false && good != null){
                lights.push(good);
                n = 0;
            }
            if (n == 0 && (good.x  >= MapConfig.max_x - 5 && good.x < 5 && !valid_x.includes(good.x))){
                valid_x.push(good.x);
            } else if (n == 0 && (good.y  >= MapConfig.max_y - 5 && good.y < 5 && !valid_y.includes(good.y)) ){
                valid_y.push(good.y);
                
            }
            n++;
        }
        this.map.lights[this.map.location.type][this.map.location.id] = lights;
    }
}