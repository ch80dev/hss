class MapNavigator {
    //handles the heavy lifting of moving from Point A to Point B and understanding the relationship between "Locations"
    constructor(map){
        this.map = map;
    }
    fetch_all_locations_leading_here(location){
        let locations = [location];
        for (let exit in this.map.exits){
            let to_exit = this.map.exits[exit];
            let location_type = exit.split("-")[0];
            let location_id = exit.split("-")[1];
            if (location_type == location.type && location_id == location.id){
                locations.push({ type: to_exit.split('-')[0], id: Number(to_exit.split('-')[1]) });
            }
        }
        return locations;
    }

    fetch_best_spots_for_delta(x, y, adjacent_arr, delta){
        let arr = [];
        for (let spot of adjacent_arr){
            let spot_delta = this.map.get.geometry.fetch_delta(spot.x, spot.y, x, y);
            if (spot_delta.x == delta.x || spot_delta.y == delta.y){
                arr.push(spot);
            }
        }
        return arr;
    }

    fetch_exits_for_path(path){
        let exits = [];
        for (let id in  path){
            let from_here = path[id];
            let to_there = path[Number(id) + 1];
            let exit = this.map.get.inspector.exit.fetch(from_here, to_there);
            if (exit != null){
                exits.push(exit);
            }
        }
        return exits;
    }

    find_nearest(target_location_type, start ){
        const startStr = `${start.type}-${start.id}`;
        let queue = [start];
        let came_from = {};
        came_from[startStr] = null;
        while (queue.length > 0) {
            let current = queue.shift();
            let currentStr = `${current.type}-${current.id}`;
            let exit = this.map.get.inspector.exit.fetch_unused(target_location_type, current);
            if (exit !== null) {
                return {exit: `${current.type}-${current.id}-${exit.x}-${exit.y}`, path: this.reconstruct_path(came_from, currentStr)};
            }
            let neighbors = this.fetch_all_locations_leading_here(current);
            for (let next of neighbors) {
                let nextStr = `${next.type}-${next.id}`;
                if (!(nextStr in came_from)) {
                    queue.push(next);
                    came_from[nextStr] = currentStr;
                }
            }
        }
        return null; // No path found
    }

    find_path(start, end) {
        const startStr = `${start.type}-${start.id}`;
        const endStr = `${end.type}-${end.id}`;
        let queue = [start];
        let came_from = {};
        came_from[startStr] = null;
        while (queue.length > 0) {
            let current = queue.shift();
            let currentStr = `${current.type}-${current.id}`;
            if (currentStr === endStr) {
                return this.reconstruct_path(came_from, endStr);
            }
            let neighbors = this.fetch_all_locations_leading_here(current);
            for (let next of neighbors) {
                let nextStr = `${next.type}-${next.id}`;
                if (!(nextStr in came_from)) {
                    queue.push(next);
                    came_from[nextStr] = currentStr;
                }
            }
        }
        return null; // No path found
    }


    reconstruct_path(came_from, endStr) {
        let current = endStr;
        let path = [];
        
        while (current !== null) {
            path.push(current);
            current = came_from[current];
        }
        return path.reverse(); // Flip it so it goes Start -> End
    }
}