class HumanConfig{
    static audit(){
		const config_class = new this();
		const mistakes = Object.getOwnPropertyNames(config_class).filter(p => p !== 'constructor');
		if (mistakes.length > 0){
			console.log(mistakes);
		}		
	}
    	//HUMAN
    static starting_gamble_ante = 10;
	static human_chance_to_be_cop = 1;
	static interactions = ['buy', 'sell', 'trade', 'beg', 'directions', 'gamble', 'work'];//, 'escort', 'favor', ];
	static interactions_for_money = ['sell', 'beg', 'work'];
	static interactions_for_resources = ['trade', 'buy', 'sell'];
	static homeless_money = 25;
    
	static num_of_interactions_per_human = 3;
    
    static names = [
    "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
    "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
    "Christopher", "Lisa", "Daniel", "Nancy", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra",
    "Donald", "Ashley", "Steven", "Dorothy", "Paul", "Kimberly", "Andrew", "Emily", "Joshua", "Donna",
    "Kenneth", "Michelle", "Kevin", "Carol", "Brian", "Amanda", "George", "Dorothy", "Timothy", "Melissa",
    "Ronald", "Deborah", "Edward", "Stephanie", "Jason", "Rebecca", "Jeffrey", "Sharon", "Ryan", "Laura",
    "Jacob", "Cynthia", "Gary", "Kathleen", "Nicholas", "Amy", "Eric", "Angela", "Jonathan", "Shirley",
    "Stephen", "Anna", "Larry", "Brenda", "Justin", "Pamela", "Scott", "Nicole", "Brandon", "Emma",
    "Benjamin", "Samantha", "Samuel", "Katherine", "Gregory", "Christine", "Alexander", "Helen", "Frank", "Debra",
    "Patrick", "Rachel", "Raymond", "Carolyn", "Jack", "Janet", "Dennis", "Maria", "Jerry", "Catherine",
    "Tyler", "Heather", "Aaron", "Diane", "Jose", "Virginia", "Adam", "Julie", "Nathan", "Joyce",
    "Henry", "Victoria", "Douglas", "Olivia", "Zachary", "Kelly", "Peter", "Christina", "Kyle", "Lauren",
    "Ethan", "Joan", "Walter", "Evelyn", "Harold", "Judith", "Jeremy", "Megan", "Christian", "Cheryl",
    "Keith", "Andrea", "Roger", "Hannah", "Terry", "Martha", "Gerald", "Jacqueline", "Lawrence", "Frances",
    "Sean", "Ann", "Christian", "Gloria", "Albert", "Alice", "Joe", "Kathryn", "Ethan", "Teresa",
    "Austin", "Doris", "Jesse", "Sara", "Willie", "Janice", "Billy", "Julia", "Bryan", "Ruby",
    "Bruce", "Nicole", "Jordan", "Madison", "Eugene", "Judy", "Arthur", "Beverly", "Logan", "Denise",
    "Louis", "Marilyn", "Wayne", "Kayla", "Alan", "Alexis", "Harry", "Lori", "Russell", "Tammy",
    "Juan", "Tiffany", "Dylan", "Jane", "Randy", "Rose", "Philip", "Kayla", "Vincent", "Natalie",
    "Noah", "Victoria", "Bobby", "Lois", "Howard", "Grace", "Liam", "Wendy", "Shawn", "Alice",
    "Ralph", "Jean", "Roy", "Phyllis", "Victor", "Theresa", "Martin", "Rose", "Eugene", "Heather",
    "Bradley", "Diana", "Leon", "Annie", "Phillip", "Lillian", "Clarence", "Emily", "Ernest", "Robin",
    "Fred", "Peggy", "Dave", "Crystal", "Danny", "Gladys", "Allan", "Rita", "Eddie", "Dawn",
    "Barry", "Connie", "Alexander", "Florence", "Bernard", "Tracey", "Marcus", "Edna", "Micheal", "Carmen",
    "Theodore", "Rosa", "Clifford", "Cindy", "Clyde", "Grace", "Glen", "Vera", "Oscar", "Ruby",
    "Shane", "Anita", "Floyd", "Charlotte", "Isaac", "Bessie", "Harvey", "Nellie", "Milton", "Eula",
    "Corey", "Sonia", "Daryl", "Erma", "Lester", "Viola", "Neil", "Ida", "Lloyd", "Esther",
    "Rene", "Matilda", "Franklin", "Lula", "Curtis", "Beatrice", "Guy", "Ethel", "Duane", "Beulah",
    "Andre", "Gertrude", "Byron", "Bernice", "Casey", "Mildred", "Lamar", "Della", "Adrian", "Myrtle",
    "Julian", "Maggie", "Felix", "Bessie", "Reginald", "Mamie", "Morris", "Jennie", "Evan", "Agnes",
    "Ivan", "Ora", "Gilbert", "Lulu", "Ross", "Hattie", "Clinton", "Cora", "Claude", "Verna",
    "Wesley", "Lottie", "Herman", "Leona", "Everett", "Flora", "Lyle", "Addie", "Cecil", "May",
    "Alfred", "Olive", "Chester", "Daisy", "Elmer", "Sophia", "Alvin", "Nettie", "Grant", "Isabel",
    "Gordon", "Effie", "Warren", "Ina", "Perry", "Maude", "Manuel", "Lina", "Leo", "Sallie",
    "Calvin", "Elsie", "Edgar", "Eula", "Silas", "Celia", "Hiram", "Lida", "Rufus", "Ollie",
    "Otis", "Iva", "Ollie", "Bula", "Lonnie", "Wilda", "Bennie", "Tillie", "Sherman", "Zella",
    "Dewey", "Vada", "Marion", "Zola", "Jessie", "Leta", "Irving", "Lacy", "Mack", "Almeta",
    "Willard", "Retta", "Ellis", "Letha", "Wilbur", "Meta", "Elbert", "Cleo", "Berton", "Sina",
    "Hubert", "Iona", "Clifton", "Zona", "Homer", "Zena", "Lola", "Rella", "Verne", "Meda",
    "Milton", "Oda", "Lacy", "Bina", "Ira", "Lula", "Myles", "Pansy", "Enoch", "Tressie",
    "Alonzo", "Vena", "Foster", "Alpha", "Major", "Euna", "Wiley", "Ocie", "Emery", "Zita",
    "Adolph", "Mona", "Orville", "Lura", "Vernon", "Sena", "Stewart", "Oda", "Ferdinand", "Ula",
    "Roderick", "Lela", "August", "Alvia", "Dominic", "Letha", "Garrett", "Vada", "Jules", "Mina",
    "Hassan", "Gena", "Ariel", "Elda", "Dante", "Ova", "Dorian", "Lela", "Xavier", "Zada",
    "Quentin", "Osa", "Ramiro", "Tilda", "Gideon", "Mona", "Thaddeus", "Beda", "Isiah", "Elba",
    "Simeon", "Auda", "Ezra", "Rilla", "Burl", "Loma", "Elias", "Sina", "Amos", "Aura",
    "Irwin", "Retha", "Stacy", "Lura", "Dana", "Ova", "Emmett", "Zada", "Antony", "Osa",
    "Milo", "Tilda", "Rube", "Gena", "Olin", "Elda", "Abe", "Mona", "Vito", "Auda",
    "Cletus", "Rilla", "Grover", "Loma", "Orson", "Sina", "Eldred", "Aura", "Dixon", "Retha"];

    // Top 500 most common last names in America
    static surnames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
    "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes",
    "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Morgan", "Cooper", "Peterson",
    "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson",
    "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes", "Price",
    "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez", "Powell",
    "Jenkins", "Perry", "Russell", "Sullivan", "Bell", "Coleman", "Butler", "Henderson", "Barnes", "Gonzales",
    "Fisher", "Vasquez", "Simmons", "Romero", "Jordan", "Patterson", "Alexander", "Hamilton", "Graham", "Reynolds",
    "Griffin", "Wallace", "Moreno", "West", "Cole", "Hayes", "Bryant", "Herrera", "Gibson", "Ellis",
    "Tran", "Medina", "Aguilar", "Stevens", "Murray", "Ford", "Castro", "Marshall", "Owens", "Harrison",
    "Fernandez", "McDonald", "Woods", "Washington", "Kennedy", "Wells", "Vargas", "Henry", "Chen", "Freeman",
    "Webb", "Tucker", "Guzman", "Burns", "Novak", "Wagner", "Hunter", "Romero", "Hicks", "Crawford",
    "Grant", "Knight", "Ferguson", "Burke", "Fowler", "Little", "Elliott", "Spencer", "Grant", "Stephens",
    "West", "Cole", "Hayes", "Bryant", "Herrera", "Gibson", "Ellis", "Tran", "Medina", "Aguilar",
    "Stevens", "Murray", "Ford", "Castro", "Marshall", "Owens", "Harrison", "Fernandez", "McDonald", "Woods",
    "Washington", "Kennedy", "Wells", "Vargas", "Henry", "Chen", "Freeman", "Webb", "Tucker", "Guzman",
    "Burns", "Novak", "Wagner", "Hunter", "Romero", "Hicks", "Crawford", "Grant", "Knight", "Ferguson",
    "Burke", "Fowler", "Little", "Elliott", "Spencer", "Stephens", "Gardner", "Pierce", "Berry", "Matthews",
    "Arnold", "Wagner", "Willis", "Ray", "Watkins", "Olson", "Carroll", "Duncan", "Snyder", "Hart",
    "Cunningham", "Bradley", "Lane", "Andrews", "Ruiz", "Harper", "Fox", "Riley", "Armstrong", "Carpenter",
    "Weaver", "Greene", "Lawrence", "Elliott", "Chavez", "Sims", "Austin", "Peters", "Kelley", "Franklin",
    "Lawson", "Fields", "Gutierrez", "Ryan", "Schmidt", "Carr", "Vasquez", "George", "Day", "Bacon",
    "Fuller", "Lynch", "Dean", "Gilbert", "Garrett", "Romero", "Welch", "Larson", "Frazier", "Burke",
    "Hanson", "Day", "Mendoza", "Moreno", "Bowman", "Medina", "Fowler", "Brewer", "Hoffman", "Carlson",
    "Silva", "Pearson", "Holland", "Douglas", "Fleming", "Jensen", "Vargas", "Byrd", "Davidson", "Hopkins",
    "May", "Terry", "Herrera", "Wade", "Soto", "Walters", "Curtis", "Neal", "Caldwell", "Lowe",
    "Jennings", "Barnett", "Graves", "Jimenez", "Horton", "Shelton", "Barrett", "Obrien", "Castro", "Sutton",
    "Gregory", "McKinney", "Lucas", "Miles", "Craig", "Rodriquez", "Chambers", "Holt", "Lambert", "Fletcher",
    "Watts", "Gibbs", "Rowe", "Haynes", "Barber", "Arias", "Maldonado", "Ferris", "Hogan", "Lyon",
    "Pratt", "Robbins", "Burton", "Stanley", "Ball", "Phan", "Mars", "Newton", "Abbott", "Wolfe",
    "Ballard", "Vaughn", "Rhodes", "Ramsey", "Drake", "Benitez", "Atkins", "Munoz", "Potter", "Goodwin",
    "Bowers", "Hansen", "Miles", "Sherman", "McDaniel", "Beck", "Paul", "Le", "Vance", "Reed",
    "Yates", "Glover", "Estes", "Maxwell", "Heath", "Benson", "Mueller", "Todd", "Blair", "Higgins",
    "Ingram", "Reese", "Cannon", "Strickland", "Townsend", "Pappas", "Wilder", "Love", "Gross", "Best",
    "Everett", "Mays", "Lang", "Patton", "Cherry", "Chang", "Banks", "Solis", "Hardy", "Wall",
    "Vogel", "Richards", "Beard", "Dalton", "Monroe", "Hester", "Bridges", "Wilkins", "Mullins", "Chan",
    "Hines", "Blake", "Castaneda", "Hayes", "Pope", "Rich", "Humphrey", "Stein", "Kane", "Morse",
    "Hodge", "Randolph", "Clayton", "Barrera", "Dorsey", "McCall", "Pollard", "Durham", "Atkinson", "Britt",
    "Carlson", "Gamble", "Roach", "Preston", "Lowery", "Vick", "Blevins", "Crane", "Gilbert", "Fry",
    "Kemp", "Moyer", "Sloan", "Ochoa", "Guy", "Hardin", "Waller", "Shepard", "Mayo", "Zuniga",
    "Pitts", "Conley", "Valencia", "Macias", "Pruitt", "Rivas", "Barr", "Serenity", "Valentine", "Guerra",
    "Quinn", "Manning", "Bartlett", "Durham", "Atkinson", "Britt", "Carlson", "Gamble", "Roach", "Preston",
    "Lowery", "Vick", "Blevins", "Crane", "Gilbert", "Fry", "Kemp", "Moyer", "Sloan", "Ochoa",
    "Guy", "Hardin", "Waller", "Shepard", "Mayo", "Zuniga", "Pitts", "Conley", "Valencia", "Macias",
    "Pruitt", "Rivas", "Barr", "Serenity", "Valentine", "Guerra", "Quinn", "Manning", "Bartlett", "Durham"
    ];
}