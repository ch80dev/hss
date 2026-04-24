class MapGenerator {
    street_names = [
		// Trees
		"Ash", "Birch", "Cedar", "Dogwood", "Elm", "Fir", "Gum", "Hazel", "Ivy", "Juniper", "Koa", "Larch", "Maple", "Nutmeg", "Oak", "Pine", "Quince", "Redwood", "Spruce", "Teak", "Umbrella", "Vine", "Walnut", "Xylosma", "Yew", "Zelkova",
		// States/Regions
		"Alabama", "Brunswick", "Colorado", "Delaware", "East Dakota", "Florida", "Georgia", "Hawaii", "Idaho", "Jersey", "Kansas", "Louisiana", "Montana", "Nebraska", "Oregon", "Pennsylvania", "Quincy", "Rhode", "Savannah", "Texas", "Utah", "Virginia", "Wyoming", "Xavier", "York", "Zion",
		// Historical/Professional
		"Adams", "Benton", "Clark", "Douglass", "Edison", "Franklin", "Grant", "Hancock", "Irving", "Jefferson", "Kennedy", "Lincoln", "Marshall", "Newton", "Otis", "Parker", "Quantico", "Reeds", "Sherman", "Tatcher", "Ulysses", "Victor", "Wright", "Xerxes", "Yancy", "Zimmer",
		// Two-Syllable
		"Archer", "Baker", "Chapel", "Driver", "Eagle", "Foster", "Grover", "Hunter", "Island", "Jacket", "Kettle", "Logan", "Miller", "Nelson", "Owen", "Porter", "Quarry", "River", "Silver", "Tucker", "Under", "Valley", "Weaver", "Xylon", "Yarrow", "Zenith",
		// Three-Syllable
		"Allison", "Bannister", "Covington", "Delaney", "Emerson", "Finnegan", "Galloway", "Harrison", "Indigo", "Jeffries", "Killinger", "Liberty", "Madrigal", "Novinger", "Overton", "Patterson", "Quinnifer", "Rafferty", "Sullivan", "Tennyson", "Unity", "Valencia", "Whittaker", "Xenophon", "Yosemite", "Zimmerman"
	];

    constructor(map){
        this.map = map;
        this.shop = new ShopGenerator(this.map);
        this.lights = new LightsGenerator(this.map);
        this.location = new LocationGenerator(this.map);
    }
    
    generate_street_name(){
        return this.street_names[rand_num(0, this.street_names.length - 1)];
    }

}