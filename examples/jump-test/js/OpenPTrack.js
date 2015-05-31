// Javscript OpenPTrack Filtering and ID Management Library

var OpenPTrackJS = {
    tracks : [], // all tracks
    active : [], // active tracks
    track : {}
};

OpenPTrackJS.normalize = function(data_orig){
    
    data = (JSON.parse(JSON.stringify(data_orig)));

    var maxX = 1.5  ;
    var minX = -1.5;
    var maxY = 4.9;
    var minY = -1.5;    

    // normalize
    data.x = (data.x + Math.abs(minX)) / (maxX + Math.abs(minX));
    data.y = (data.y + Math.abs(minY)) / (maxY + Math.abs(minY));     


    // bound
    if (data.x < 0.0 ) {
        data.x = 0.0;
    } else if (data.x > 1.0) {
        data.x = 1.0;
    }

    if (data.y < 0.0 ) {
        data.y = 0.0;
    } else if (data.y > 1.0) {
        data.y = 1.0;
    }

    return data;
}

OpenPTrackJS.contains = function(tracks, id) {

    if(tracks.length<1){
        return [false, -1];
    }

    for (var i = 0, len = tracks.length; i < len; i++){
        if(id == tracks[i].id){
            return [true, i];
        }
    }

    return [false, -1];
}

Array.prototype.lastIndex = function() {
    return (this.length-1);
}

OpenPTrackJS.pushToActive = function(data_orig){
    var newFilterLimit = 3; // 
    var timeout = 3;
    var die = 5; // 
    var isActive;
    var isTrack;
    var data;

    // normalize (use max/min to make 0->1)
    data = this.normalize(data_orig);

    // ignore if out of bounds
    if(data.x <= 1.0 && data.x >= -1.0 && data.y <= 1.0 && data.x >= -1.0){

        isTrack = this.contains(this.tracks, data.id);
                
        if (isTrack[0]){

            // update track data
            this.tracks[isTrack[1]].sec = data.sec;
            this.tracks[isTrack[1]].x = data.x;
            this.tracks[isTrack[1]].y = data.y;
            this.tracks[isTrack[1]].z = data.z;
            this.tracks[isTrack[1]].height = data.height;

            if (this.tracks[isTrack[1]].valid) {

                this.tracks[isTrack[1]].last = data.sec;

                // check if track is in active
                isActive = this.contains(this.active, this.tracks[isTrack[1]].id);

                if(isActive[0]){
                    this.active[isActive[1]] = this.tracks[isTrack[1]];
                } else{
                    // push a copy of the track to active if valid
                    this.active.push(JSON.parse(JSON.stringify(this.tracks[isTrack[1]])));
                }

                // validate track
            } else {
                //console.log(data.sec-this.tracks[isTrack[1]].birth);
                if (data.sec-this.tracks[isTrack[1]].birth>newFilterLimit){
                    this.tracks[isTrack[1]].valid = true;
                }   
            }
        } else {
            // new Track
            this.tracks.push(JSON.parse(JSON.stringify(data)));
            pos = this.tracks.lastIndex();

            if(this.tracks[pos].birth == null){
                this.tracks[pos].birth = data.sec;
                this.tracks[pos].valid = false;
            }   
        }

        //remove dead tracks from active
            
        for (var i = 0; i < this.active.length; i++) {
            if(data.sec - this.active[i].last > timeout){
                this.active.splice(i, 1); 
            } 
        }

        // hang onto them for a just bit in tracks before killing them 
        for (var i = 0; i < this.tracks.length; i++) {
            if(data.sec - this.tracks[i].last > die){
                this.tracks.splice(i, 1); 
            } 
        } 
    }
}

