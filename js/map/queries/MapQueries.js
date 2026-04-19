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

}