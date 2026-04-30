class CopInterview{
	avoid = null;
	buttons = {
		categories: [], 
		costs: [],
	};
	categories = ['§', '†', '¿', '¶'];
	last_choice = null;
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

