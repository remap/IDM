
// This example allows / shows overlapping regions, just in 
// case they are needed 

var regions = {                            

            "lower"   : { ul : [0, 0.5],                // Upper left point of bounding box
                          lr : [1.0, 0],                // Lower right point of bounding box
                          count : 0,                    // "Current" count of people in this region
                          trigger : false
                      },                          
                      
            "upper"  : { ul : [0, 1],               
                          lr : [1.0, 0.5],
                          count : 0,
                          trigger : false
                      },
                          
}; 
            
// Now, need a function to check if a point is in the REGIONS and update occupancy count
// For convenience, we'll have it return also the list of region names occupied by the
// point.  
function updateCount( x, y, regions ) {
    var occupied = [];      // This will hold the list of regions occupied by this point 
    for (var r in regions) 
    { 
        if (x >= regions[r].ul[0] && x <= regions[r].lr[0] &&           // Just like region checking code you already have, 
            y <= regions[r].ul[1] && y >= regions[r].lr[1] )            // But with variables
            {
                regions[r].count += 1; 
                occupied.push(r); 
           }
    }       
    return occupied;      
}

// Finally, a function to clear the counts
function clearCount(regions) {
    for (var r in regions) 
        regions[r].count = 0 ; 
}


// This is a simulation of the callback function from OpenPTrack. 

function onData() {       
    // We're going to create some random tracks:
    sample_actives = []; 
    N = Math.floor(Math.random()*10)+1;   // Number of tracks from 1 to 10. 
    for (var n=0; n<N; n++) 
        sample_actives.push( [ Math.random()*2, Math.random()*2 ] ); 
                          
    // clear the count index for each region before updating it
    clearCount(regions);   

    for (var i in sample_actives) { 
        // assign each index of the sample_actives array to a new variable called active
        var active=sample_actives[i];
        
        // Call the update count function at every data point so we get the current number of people in that area 
        updateCount(active[0], active[1], regions);
    } 

    $("#upper_count").text("There are currently " + regions.upper.count + " in the upper area");
    $("#lower_count").text("There are currently " + regions.lower.count + " in the lower area");

    if (regions.upper.count > 0 && regions.upper.trigger == false) {
        // do something i.e. start a video
        // We post some text to the html with jquery
        $("#upper_activated").text("upper region is blocked/activated");
        
        // Set the region trigger to true so this region cannot be activated anymore
        regions.upper.trigger = true;

    } else if (regions.upper.count == 0 && regions.upper.trigger == true){
        // do something i.e. stop a video
        // We post some text to the html with jquery
        $("#upper_activated").text("upper region is unblocked");
        
        // Set the region trigger to false to unblock this region 
        regions.upper.trigger = false;
    }

    if (regions.lower.count > 0 && regions.lower.trigger == false) {
        // do something i.e. start a video
        // We post some text to the html with jquery
        $("#lower_activated").text("lower region is blocked/activated");

        // Set the region trigger to true so this region cannot be activated anymore
        regions.lower.trigger = true;

    } else if (regions.lower.count == 0 && regions.lower.trigger == true){
        // do something i.e. stop a video
        // We post some text to the html with jquery
        $("#lower_activated").text("lower region is unblocked");

        // Set the region trigger to false to unblock this region 
        regions.lower.trigger = false;        
    }
}    

setInterval(function(){ onData(); }, 1000);
