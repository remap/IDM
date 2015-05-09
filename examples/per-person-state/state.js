

// How often to generate new "tracking" data, in ms
var RELOAD_INTERVAL = 500; 


// Here we are going to extend the occupancy example
// to use it to show how tracking per person state might work.  


// ------- THIS PART IS SAME AS OCCUPANCY EXAMPLE
var REGIONS = {                            
            "apple"   : { ul : [0, 1.0],                 
                          lr : [1.0, 0],                 
                          count : 0,                     
                          pct_occupancy : 0.0,           
                          available_images: 3 },        
            "banana"  : { ul : [.1, .5],                
                          lr : [.6, .1],
                          count : 0,
                          pct_occupancy : 0.0,
                          available_images: 3 },
            "carp"    : { ul : [1.2, 1.9],             
                          lr : [1.8, 1.1],
                          count : 0, 
                          pct_occupancy : 0.0, 
                          available_images: 3 },    
            };             
function updateCount( x, y, regions ) {
    var occupied = [];   
    for (var r in regions) { 
        if (x >= regions[r].ul[0] && x <= regions[r].lr[0] &&           
            y <= regions[r].ul[1] && y >= regions[r].lr[1] ) {
                regions[r].count += 1; 
                occupied.push(r); 
           }
    }       
    return occupied;      
}
function updatePercentOccupancy(regions, totalPeople) {
    for (var r in regions) 
        if (totalPeople > 0) 
            regions[r].pct_occupancy = regions[r].count / totalPeople; 
        else
            regions[r].pct_occupancy = 0. 
}
function clearCount(regions) {
    for (var r in regions) 
        regions[r].count = 0 ; 
}
function mylog(s) {
    var DEBUG_ELEMENT = document.getElementById("debugOutput"); 
    DEBUG_ELEMENT.innerHTML += s + "<br />"; 
}
function clearlog() {
    var DEBUG_ELEMENT = document.getElementById("debugOutput"); 
    DEBUG_ELEMENT.innerHTML = "";
} 

// ------- END OF THE OCCUPANCY EXAMPLE FUNCTIONS 


// ------- THE FOLLOWING GENERATES FAKE DATA
//         AND CALLS onData() EVERY SECOND.
//         NOT NECESSARY IF YOU HAVE LIVE TRACKING

// Generate some fake data and call a call pack 
// Format is [ [id, x, y], ... ] 
// 
// How this function works is not that critical here
// 
var isPaused = false; 
function generateFakeData(step) {
    if (isPaused && !step) return; 
    sample_tracks = []; 
    N = Math.floor(Math.random()*8)+2;  
    bucket = [];
    for (var n=0; n<N; n++)
        bucket.push(n); 
    for (var n=0; n<N; n++) { 
        var k = Math.floor(Math.random()*bucket.length);
        var id = bucket.splice(k, 1)[0] + 1; 
        sample_tracks.push( [ id, Math.random()*2, Math.random()*2 ] ); 
    }
    onData(sample_tracks); 
} 

// Start generating fake data, which calls the onData callback
// 
function onPageLoad() { 
    window.setInterval(function() { generateFakeData(false) }, RELOAD_INTERVAL);
}

// ------- END OF FAKE DATA GENERATOR


//
// ON TO THE EXAMPLE: 
// 

/* 
    
    Q: What's the logic we are trying to build in this example?

    A: 
    - Define possible 'state' for each person that we can use
      to make decisions about what to show onscreen, or do. 
      
    - Calculate this state for each ID as we get new tracks
    
    - Remember state for each active track, so we can consider
      changes

*/


// Let's define three states:
var VISITOR_STATE = {
    NEW: 0,             // For things that only happens the first time an id appears
    ACTIVE: 1, 
    LEAVING: 2
}
var VISITOR_STATE_NAMES = [
    "new", 
    "active", 
    "leaving"
    ];  
    
// An associative array to track the info (including state)
// for each active id
var visitors = {} 

/* When filled, this will contain something like:
    visitors = {        "9" :  { state: VISITOR_STATE.ACTIVE, last_state: ..., regions : [...], last_region :...,  position : [...] }, 
                        "2" :  { state: VISITOR_STATE.NEW, last_state: ..., regions : [...], last_region: ..., position : [...] }       }; 
*/


// This is called by the fake data generator in our example
function onData(sample_tracks) { 

// ******** Note that the first part of this function is fairly generic
//  and only handles state management.  The actual code that would
//  affect what's drawn would come after the next asterisks.... "*****"
//

    // Use this "seen" array  to keep track of whether
    // we received a track for known visitors in this call to onData. 
    // Also, update last_state and last_regions here. 
    seen = {}; 
    for (var id in visitors) {
        seen[id] = false;
        visitors[id].last_state = visitors[id].state; 
        visitors[id].last_regions = visitors[id].regions; 
    }
    
    // Loop through the tracks and update the state for each visitor
    // 
    for (var i in sample_tracks) { 
        track=sample_tracks[i];
        id = track[0].toString(); // keys to object fields must be strings
        
        if (id in visitors) {          // we have state for this id
         
            visitors[id].last_state = visitors[id].state; 
            // If they're new, or were leaving but are back 
            // move them to active
            // 
            if (visitors[id].state==VISITOR_STATE.NEW) {
                console.log(id + " New => Active");  
                visitors[id].state=VISITOR_STATE.ACTIVE;
            } else if (visitors[id].state==VISITOR_STATE.LEAVING) {
                console.log(id + " Leaving => Active"); 
                visitors[id].state=VISITOR_STATE.ACTIVE;
            }
        } else {                                // no state for this id, new!
            console.log(id + " New"); 
            visitors[id] = {};
            visitors[id].state=VISITOR_STATE.NEW;      
            visitors[id].last_regions=[];
             
        }
        seen[id] = true; 
    }    
    
    // Purge leaving visitor state
    //
    toDelete = [];  
    for (var id in visitors) {
        if (seen[id]==false) {
            console.log("Didn't see "+id+" this update."); 
            switch (visitors[id].state) {
                case VISITOR_STATE.NEW:
                case VISITOR_STATE.ACTIVE:
                    console.log(id + " => Leaving ");
                    visitors[id].state = VISITOR_STATE.LEAVING; 
                    break; 
                case VISITOR_STATE.LEAVING:
                    toDelete.push(id);
                    break; 
                deafult:
                    console.log("Unknown state " + id); 
            } 
        }
    }
    // Actually remove leaving ids from visitors 
    for (var k in toDelete) {
        console.log(toDelete[k] + " Delete");
        delete visitors[toDelete[k]];
    }
    
    // Do occupancy checks
    clearlog(); 
    clearCount(REGIONS);   
    idsReceived = [];  // Let's keep a list of what ids we saw, so we can report it 
    for (var i in sample_tracks) { 
        track=sample_tracks[i];
        occupied = updateCount(track[1], track[2], REGIONS); 
        updatePercentOccupancy(REGIONS, sample_tracks.length); 
        idsReceived.push(track[0]);
        // now, keep track of occupied regions per visitor
        id =  track[0].toString();
        visitors[id].regions = occupied; 
        visitors[id].position = [ track[1], track[2] ];        
    }
    mylog("View the console log for more output detail as this is running."); 
    mylog("Received new data for ids: " + idsReceived);
    mylog("---------------")

// ********
// ******** Here's where the specific logic for your application could be -- 

    // Loop through things in terms of users, rather than regions!
    // This allows us to work in a fundamentally different way
    
    // List out what's happening
    for (var id in visitors) { 
        
        if (visitors[id].state==VISITOR_STATE.LEAVING) {
            mylog(sprintf("Visitor %d (%s=>%s) not seen this update.", 
                id, VISITOR_STATE_NAMES[visitors[id].last_state], VISITOR_STATE_NAMES[visitors[id].state])); 
        } else {
            mylog(sprintf("Visitor %d (%s=>%s) is in [%s], previously in [%s], has position (%0.2f, %0.2f).", 
                id, VISITOR_STATE_NAMES[visitors[id].last_state], VISITOR_STATE_NAMES[visitors[id].state], 
                visitors[id].regions, visitors[i].last_regions, 
                visitors[id].position[0], visitors[id].position[1])); 
        }
    
    }
    
    // Do something "more interesting"
    
    newfolks = [];
    leavingfolks = [];  
    for (var id in visitors) {
        if (visitors[id].state==VISITOR_STATE.LEAVING) {   
            leavingfolks.push(id);
        }
        else if (visitors[id].state==VISITOR_STATE.NEW) {
            newfolks.push(id);
        }
    } 
    
    var target = document.getElementById("message"); 
    target.innerHTML = "";
    if (newfolks.length>0)
        target.innerHTML += "<p style='font-size:42pt'> Hello " + newfolks + "!</p>";
    if (leavingfolks.length>0)
        target.innerHTML += "<p style='font-size:42pt'> Goodbye " + leavingfolks + "!</p>";
    
    // Show an image if NEW people are in a region
    // 
    for (var id in newfolks) { 
        if (visitors[newfolks[id]].regions.length > 0) { 
            for (var r in visitors[newfolks[id]].regions) {
                region = visitors[newfolks[id]].regions[r]; 
                // Pick which image to use 
                k = Math.floor( Math.random() * REGIONS[region].available_images);
                // Build the filename for the image
                filename = "images/" + region + "/" + k + ".jpg";
                // Build the HTML with the above
                target.innerHTML += '<img src="'+ filename + '" /><br clear="all" />';
            } 
        }
    
    
    }
    
}     















