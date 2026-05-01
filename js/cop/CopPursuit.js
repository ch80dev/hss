class CopPursuit {

    constructor(cop, map, player){
        this.cop = cop;
        this.map = map;
        this.player = player;
    }
     go_through_exit(){
        console.log('go through exit');
        if (this.cop.heading_to_exit.exit == null){
            console.log('exit');
            return;
        }
        let to = this.map.exits[this.cop.heading_to_exit.exit];
        if(this.map.locations[this.cop.location.type ][this.cop.location.id][this.cop.x][this.cop.y] != 1){
            console.log(this.map.locations[this.cop.location.type ][this.cop.location.id][this.cop.x][this.cop.y]);
        }
        this.map.locations[this.cop.location.type ][this.cop.location.id][this.cop.x][this.cop.y] = 1;;
        this.cop.location.type = to.split('-')[0];
        this.cop.location.id = to.split('-')[1];
        this.cop.x = Number(to.split('-')[2]);
        this.cop.y = Number(to.split('-')[3]);
        this.cop.player_gone = false;
        this.cop.heading_to_exit.exit = null;
        this.cop.heading_to_exit.distance = null;
    }
     player_disappeared(){
        let last_exit = this.player.state.last_exit.from;
        let exit_location_type = last_exit.split('-')[0];
        let exit_location_id = last_exit.split('-')[1];
        let exit_x = last_exit.split('-')[2];
        let exit_y = last_exit.split('-')[3];
        if (this.cop.severity == 0 || exit_location_type != this.cop.location.type 
            || exit_location_id != this.cop.location.id){
            console.log('player not here - patrolling');
            this.cop.wait_for_player();
            return;
        } else if (exit_location_type == 'sewer' 
            && (this.cop.severity < 3 || (this.cop.severity == 3 && rand_num(1, 3) != 1))){
            console.log('player went in sewer - patrolling');
            this.cop.wait_for_player();
            return;

        }        
        
        let player_distance_to_exit 
            = this.map.get.geometry.fetch_distance(this.cop.heading_towards.x, this.cop.heading_towards.y, exit_x, exit_y);
        if (player_distance_to_exit >= 2){
            console.log("player too far from exit - don't know where they went ");
            this.cop.wait_for_player();
            return;
        }
        let distance_to_exit = this.map.get.geometry.fetch_distance(this.cop.x, this.cop.y, exit_x, exit_y);
        let bonus = (1 + Number(CopConfig.escape_bonus));
        this.cop.heading_to_exit.exit = last_exit;
        this.cop.heading_to_exit.distance = Math.ceil(distance_to_exit * bonus);
    }

    player_is_not_here(){
        if (!this.cop.player_gone){
            this.cop.player_gone = true;
            this.cop.player_disappeared();
            return;
        }
        if (this.cop.patrolling != null && this.cop.patrolling > 0 
            && this.cop.heading_to_exit.distance != null && this.cop.heading_to_exit.distance > 0){
            console.log("this shouldn't happen");
            return;
        }
        if (this.cop.patrolling != null && this.cop.patrolling > 0){
            this.cop.patrolling --;
            if (this.cop.patrolling < 1){
                console.log("DELETE");
            }
            return;
        }

        if (this.cop.heading_to_exit.distance != null && this.cop.heading_to_exit.distance > 0 ){
            this.cop.heading_to_exit.distance --;
            if (this.cop.heading_to_exit.distance < 1){
                this.cop.go_through_exit();
            }
        }
    }

    wait_for_player(){
        this.cop.patrolling = CopConfig.severity_wait[this.cop.severity];
    }
}