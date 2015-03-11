// Javscript OpenPTrack Filtering and ID Management Library
// UNTESTED with OpenPTrack

var tracks = [] // all tracks
var active = [] // active tracks
var track = {};


function normalize(data){
	var maxX = 2;
    var minX = -4.4;
    var maxY = 3;
    var minY = -1;    

	data.x = (data.x + Math.abs(minX)) / (maxX + Math.abs(minX));
	data.y = (data.y + Math.abs(minY)) / (maxY + Math.abs(minY));

}

normalize(data_ex);
console.log(data_ex);

function contains(id, arrayIn){
	for (var i = 0, len = arrayIn.length; i < len; i++){
		if(id = arrayIn[i].id){
			return [true, i];
		} else {
			return [false, -1];
		}
	}
	if(arrayIn.length<1){
		return [false, -1];
	}
}

function lastIndex(arrayIn) {
    return (arrayIn.length-1);
}

function pushToActive(data, tracks, active){
	var newFilterLimit = 3; // 
	var timeout = 3;
    var die = 5; // 
    var isActive;
    var isTrack;

    // normalize (use max/min to make 0->1)
    normalize(data);

    // ignore if out of bounds
    if(data.x <= 1.0 && data.x >= -1.0 && data.y <= 1.0 && data.x >= -1.0){

    	//console.log(data, tracks, active);

    isTrack = contains(data.id, tracks);
			
	if (isTrack[0]){
		if (tracks[isTrack[1]].valid) {
			
			// update track data
			tracks[isTrack[1]].last = data.sec;
			tracks[isTrack[1]].x = data.x;
			tracks[isTrack[1]].y = data.y;
			tracks[isTrack[1]].height = data.height;

			// check if track is in active
	        isActive = contains(tracks[isTrack[1]].id, active);

	        if(isActive[0]){
	        	active[isActive[1]] = tracks[isTrack[1]];
	        } else{
	        	// push a copy of the track to active if valid
	        	active.push(JSON.parse(JSON.stringify(tracks[isTrack[1]])));
	        }

	        // validate track
			} else {
				//	tracks[isTrack[1]].
				if (data.sec-tracks[isTrack[1]].birth>newFilterLimit){
					tracks[isTrack[1]].valid = true;
				}	
			}
		}
		else {
			// new Track
			tracks.push(JSON.parse(JSON.stringify(data)));
			pos = lastIndex(tracks);

			if(tracks[pos].birth == null){
				tracks[pos].birth = data.sec;
				tracks[pos].valid = false;
			}	

			console.log(tracks);
		}

		//remove dead tracks from active
		

		for (var i = 0; i < active.length; i++) {
			if(active[i].valid == false){
				active.splice(i, 1);
			} 
		};
		
	    //but hang onto them for a just bit before killing them
	    if (tracks[i].sampleTime - tracks[i].last > die){
	    	tracking.splice(i, 1);
	    }

		for (var i = 0; i < active.length; i++) {
			if(active[i].valid == false){
				active.splice(i, 1);
			} 
		};
	}
}

//pushToActive(data_ex2, tracks, active);

