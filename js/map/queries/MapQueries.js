class MapQueries{


    constructor(map){
        this.map = map;
        this.geometry = new MapGeometry(this.map);
        this.inspector = new MapInspector(this.map);
        this.navigator = new MapNavigator(this.map);
    }
    
    at (x, y){
        return this.map.grid[x][y];
    }

    fetch_common(arr1, arr2){
        let arr = [];
        for (let spot1 of arr1){
            for (let spot2 of arr2){
                if (spot1.x == spot2.x && spot1.y == spot2.y){
                    arr.push(spot1);
                }
            }
        }
        return arr;
    }

}