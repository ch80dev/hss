class CopConfig{
    	static audit(){
		const config_class = new this();
		const mistakes = Object.getOwnPropertyNames(config_class).filter(p => p !== 'constructor');
		if (mistakes.length > 0){
			console.log(mistakes);
		}		
    }
	static escape_bonus = .5
    
	static detained = {
        accept: [
            'It was me. Book me, Danno.',
            'I cannot tell a lie. It was I.',
            'Alright, man. Quit the yip yapping. Take me in.',
            "I committed the crime...so I'll do the time.",
        ],   
        deny: [
            "I don't know anything about that!",
            "It wasn't me. That was the one armed man.",
            "Who? Me? Never!",
            "I'm not a criminal. I'm a citizen.",
        ],
        escape: [
            'Fuck you, copper!',
            "You'll never take me alive!",
            "Shoo, pig! Don't bother me!",
            "I am rubber and you are glue. So fuck your mother and fuck you too.",
        ],
    }
    
    static crime_captions = {
		'attack-cop': 'assault on an officer',
		'attack-human': 'assault',
		'attack-rat': 'cruelty to animals (attacked a rat)',
		beg: 'panhandling',
		hit_trash: 'vandalism (hitting trash cans)',
		intoxication: 'public intoxication',
		'kill-human': 'murder',
		'kill-rat': 'animal cruelty (killed rat)',
		'knock_out-cop': 'battery on a peace officer',
		'knock_out-rat': 'animal cruelty (knocked out rat)',
		'knock_out-human': 'battery causing serious bodily injury',
		loot_unconscious: 'theft',
		open_trash: 'suspicious behavior (opening trash cans)',
		'possession-drugs': 'possession of a controlled substance',
		'possession-weapon': 'possession of a deadly weapon',
		'possession-weed': 'unlawful possession of cannabis',
		'sell-alcohol': 'unlicensed sale of alcohol',
		'sell-cigarette': 'unlicensed sale of tobacco products',
		'sell-drugs': 'possession of a controlled substance for sale',
		'sell-weed': 'unlicensed sale of cannabis',
		sleep: 'loitering',
		talk: 'suspicious behavior',
		unlock_trash: 'vandalism (unlocking trash cans)',
	}
	static crime_severity = {
		'attack-cop': 3,
		'attack-human': 0,
		'attack-rat': 1,
		beg: 1,
		hit_trash: 2,
		intoxication: 1,
		'kill-human': 3,
		'kill-rat': 1,
		'knock_out-cop': 3,
		'knock_out-rat': 1,
		'knock_out-human': 2,
		loot_unconscious: 2,
		open_trash: 0,
		'possession-drugs': 1,
		'possession-weed': 0,
		'possession-weapon': 0,
		'sell-alcohol': 1,
		'sell-cigarette': 1,
		'sell-drugs': 2,
		'sell-weed': 1,
		sleep: 1,
		talk: 0,
		unlock_trash: 1,
	}
	static crime_sentencing = {
		'attack-cop': 365,
		'attack-human': 365,
		'attack-rat': 1,
		beg: 180,
		hit_trash: 180,
		intoxication: 180,
		'kill-human': 9125,
		'kill-rat': 30,
		'knock_out-cop': 1095,
		'knock_out-rat': 3,
		'knock_out-human': 1465,
		loot_unconscious: 1095,
		open_trash: 1,
		'possession-drugs': 365,
		'possession-weed': 1,
		'possession-weapon': 365,
		'sell-alcohol': 180,
		'sell-cigarette': 180,
		'sell-drugs': 7300,
		'sell-weed': 180,
		sleep: 180,
		talk: 1,
		unlock_trash: 30,
	}

	static severity_wait = [ 100, 100, 100, 1000 ];

	static tazer_max_distance = 5;
	static tazer_damage = 10;
}