# OpenPTrack NDN Calibration Normalizer

### Prerequisites 
1. [NDN-JS](https://github.com/named-data/ndn-js/blob/master/build/ndn.js)

### Purpose

The purpose of this software is to consume tracking data from OpenPtrack, and do the initial tracking filter and normalization.

a global JS variable 'active' holds the filtered and normalized track data. 

### Data Structures & Pseudocode

incoming tracks:

tracks
    track
   	 id
     x
   	 y
   	 sampleTime
   	 

we push to active[] if it survives long enough
and add the following to each track

track    
    valid
    birth
    last
    
// so something like

var newFilterLimit = 3 // wait 3 sec to validate
var array active[] // active tracks
var timeout == 3; // 
var die == 5; // 
var maxX
var minY
var maxX
var minY

//'tracks[]' from raw NDN Publisher:
for each track in tracks:
   	// filter
    if track.ID in active[]:
	if track.valid:
		tracking[track.ID].last = track.sampleTime
   	 	// bound (ignore if out of max/min)
   	 	// normalize (use max/min to make 0->1)
    	else: //new track
		if(track.birth == NULL):
			track.birth=track.sampleTime;
   		 if track.sampleTime-track.birth>newFilterLimit:
   			 track.valid = true;
   			 tracking.add(track)
	// get rid of old tracks
	if track.sampleTime - track.last > timeout;
        track.valid = False;
        //but hang onto them for a just bit before killing them
        if track.sampleTime - track.last > die;
		tracking.remove(track)
### How to use

import the JS into your HTML artwork. 

a global JS variable 'active' holds the filtered and normalized track data.

### Consumer
The consumer tries to fetch the [starting timestamp] with configured prefix, and fetches track hint and data under that [starting timestamp]

The consumer maintains an outstanding interest for track hint, with older timestamps excluded. 

For each new active track mentioned in track hint, the consumer maintains an outstanding interest for the new data sequence number.

The consumer stops maintaining outstanding interest for a track when a series of timeouts is received.