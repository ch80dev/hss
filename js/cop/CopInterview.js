class CopInterview{
	answers = [
		['I have an anxiety disorder.', "It seems like you did something wrong considering how paranoid you are.", 
			"I did do something wrong. I was born, apparently.", "You have a gun and qualified immunity if you kill me. I think that would make anyone nervous."
		],
		["It's the 21st Century. There's literally no reason anyone needs to call anymore.", "That sucks. Maybe you should take it up with the reporting party instead?", "Like you really needed a reason to stop me...", "No reason? You sound like a nihilist."],
		['Just on my grind. God Bless America.', "Sounds like you're soliciting for a drug transaction. Maybe you should investigate yourself, buster.", "On something? I'm disabled and that's ableist! Are you able to leave me alone?", "The only thing I'm on is the road to nowhere. No wonder I met you here." ],
		["Sorry, I'm vegan.", "I'd prefer not. I don't mind dogs. It's pigs I hate.", "Uh, no, I'd prefer not to have my genital bitten off for 'resisting'.", "That depends. Did you teach it any tricks? How about you teach it how to play dead?"],
		["That's racist!", "You look a lot like a doo doo head. Are you sure you're not one?", "How can we really be sure of anything in today's age? I could be AI generated for all you know.", "I don't know anything about that but you know what I really look like? A bad bitch."],
		["How do you know it wasn't them? False flag. Fake news!", "I don't know but they ain't a truther.", "Well, that guy over there said you're bad at your job. Are you calling him a liar? Because I trust him with my life.", "Lies are merely the windows to the soul and you're a cop so you have no soul."],
		["Selfie!", "Thank you for being candid with me.", "Is that why you're here? Fell in love with me already?", "Camera? More like SHAMera."],
		["Making things harder on myself is how I thrive. I thrive every day.", "You and I makes we? And this little piggy went all the way home.", "We're not that close for you and I to agree on anything.", "U and I? Funny how that's how you end ennui. When will we end this conversation, do you think?"],
		['My fingerprints? Sure. Let me see your neck.', "My DNA? Eww. What a pervert.", "My DNA?!? That is not my baby! I just met you!", "Sure. I just spit on the ground and showed you one of my fingerprints. Does that rule me out yet?"],
		["I've been homeless for what seems like forever and I know what a fascist smells like.", "If you know what a criminal looks like, why are you bothering me?", "That's cool. Do you know what an innocent person looks like too?"],
	]
	avoid = null;
	buttons = {
		categories: [], 
		costs: [],
	};
	categories = ['§', '†', '¿', '¶'];
	last_choice = null;
	questions = [
		"You look pretty nervous. If you didn't do anything wrong, why are you nervous?",
		"So I guess I got called out here for no reason then?",
		"You look pretty amped up right now. Are you on something?",
		"If you didn't do anything wrong, you don't mind if I call the K9 in to give you a once over?",
		"You look an awful lot like the perp that was described to me. You sure that's not you?",
		
		"That guy over there said it was you. You saying they're lying?",
		"You know we have you on camera, right?",
		"You and I both know you're the one that did this. You don't wanna make things harder on yourself, do you?",
		"I'm going to need to take your fingerprints and DNA to rule you out. You don't mind, do you?",
		"I've been working as a cop a long time and I think I know what a criminal looks like...",
		/*
		"Well, you know what? I can wait all day for you to confess because I'm being paid by the taxpayers.",
		"You have the right to remain silent, but doing so is kinda mean and sounds like criminal behaviors.",
		"I don't really like you and a lot of the people I don't like...I end up arresting them. "
		*/
	];
	result = null;
	target = null;

	severity = 1;
	severity_scores = [
		3, 7, 11
	]
	score = {
		'§': 0,
		'†': 0,
		'¿': 0,
		'¶': 0,
	}
	turns = 0;
	turns_per_round = 5;
	rounds = 0;
	valid = [1, 2]
	high_scores = {

	}
	constructor(){
		for (let id in this.answers){
			let n = 0;
			for (let answer of this.answers[id]){
				//let answer = this.answers[id][answer_id];
				n++;
			}
			if (n != 4){
				console.log(id, 'error');
			}
		}
		this.reset();

		while(false){
			let rand = rand_num(0, 3);
			this.choose(rand);
			if (this.turns == 0){
				this.rounds ++;
			}
		}
		//console.log(this.high_scores);
	}

	choose(i){
		
		let color = Object.keys(this.buttons.categories[i])[0];
		let cost_color = Object.keys(this.buttons.costs[i])[0];
		this.last_choice = [color, cost_color];
		this.score[color] += this.buttons.categories[i][color];
		if (this.valid.includes(this.buttons.costs[i][cost_color]) ){
			this.score[cost_color] += this.buttons.costs[i][cost_color];

		}
    	this.turns ++;
	    this.generate_buttons();
		if (this.turns == this.turns_per_round){
			this.end_game();
			this.reset();
		}
	}

	end_game(){
		if (this.fetch_score() >= this.severity_scores[this.severity]){
			this.result = 'win';
			
			return;
		}

		this.result = 'lose';
	}
	evaluate(){
		
		if (this.score[this.target] > this.score[this.avoid]){
			return "&#128077;";
		} else if (this.score[this.target] < this.score[this.avoid]){
			return '&#128078;';
		}
		return '';
	}

	fetch_score(){
		return this.score[this.target] - this.score[this.avoid];
	}
	fetch_highest_score(){
		let n = 0;
		
		for (let color in this.score){
			if (this.score[color] > n){
				n = this.score[color];

			}
		}
		return n;
	}
	generate_buttons(){
		let num = [1, 2, 3, 4, ];
		let color_arr = this.shuffle([...this.categories]);
		let color_num_arr = this.shuffle([...num]);
		let cost_arr = [];
		let cost_num_arr = [];
		let keep_going = true;
		while(keep_going){
			cost_arr = this.shuffle([...this.categories]);
			cost_num_arr = this.shuffle([...num]);
			keep_going = false;
			for (let i = 0; i < color_arr.length; i ++){
				if (color_arr[i] == cost_arr[i] || color_num_arr[i] == cost_num_arr[i] 
					|| (this.last_choice != null 
					&& ((color_arr[i] == this.last_choice[0] && cost_arr[i] == this.last_choice[1])
					|| (color_arr[i] == this.last_choice[1] && cost_arr[i] == this.last_choice[0]))
				)) {

					keep_going = true;
				}
			}

		}
		this.buttons.categories = [];
		this.buttons.costs = [];
		for (let i = 0; i < 4; i ++){
			this.buttons.categories.push({  });
			this.buttons.categories[i][color_arr[i]] = color_num_arr[i];
			this.buttons.costs.push({});
			this.buttons.costs[i][ cost_arr[i]] =   cost_num_arr[i];
		}
	}
	generate_avoid(){
		let remaining = [...this.categories];
		remaining.splice(this.categories.indexOf(this.target), 1);
		this.avoid = remaining[rand_num(0, remaining.length - 1)];
	}

	generate_target(){
		this.target = this.categories[rand_num(0, this.categories.length - 1)];
	}

	lose(){
		console.log("LOSE");
	}

	reset(){
		this.generate_buttons();
		this.generate_target();
		this.generate_avoid();
		this.score = {
			'§': 0,
			'†': 0,
			'¿': 0,
			'¶': 0,	
		}
		this.turns = 0;
	}

	save(n){
		if (this.high_scores[n] == undefined){
			this.high_scores[n] = 0;

		}
		this.high_scores[n] ++;
	}

	shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			// Pick a random index from 0 to i
			const j = Math.floor(Math.random() * (i + 1));
			
			// Swap elements array[i] and array[j]
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
	win(){
		console.log('WON!');
	}
}

