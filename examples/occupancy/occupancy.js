

// Example of turning a list of tracks into occupancy values, 
// which may be simpler to work with than tracks. 

// First, define the names and boundaries of the areas to 
// occupy. 

// Regions are listed in an associative array with their
// name as the key.  They each have a property called 
//  "ul", corresponding to the upper-left (x,y) point in the region
//  "lr", corresponding to the lower-right (x,y)  point in the region

// Extending this to non-square regions is an exercise for
// the reader, but you could store the radius here, and check
// distance, if you wanted circular regions. 

// We'll use this same array to keep track of the evolving
// occupancy count and percentage occupancy.
// 

// This example allows / shows overlapping regions, just in 
// case they are needed 

var REGIONS = {                            

            "apple"   : { ul : [0, 1.0],                // Upper left point of bounding box
                          lr : [1.0, 0],                // Lower right point of bounding box
                          count : 0,                    // "Current" count of people in this region
                          pct_occupancy : 0.0,          // Percentage of people in this region (relative to total people)
                          available_images: 3 },        // Manually counted # of files in the images subfolder
                          
                      
            "banana"  : { ul : [.1, .5],               // Example of overlap, w/ "A"
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

// And one to calculate percentage occupancy
function updatePercentOccupancy(regions, totalPeople) {
    for (var r in regions) 
        if (totalPeople > 0) 
            regions[r].pct_occupancy = regions[r].count / totalPeople; 
        else
            regions[r].pct_occupancy = 0. 
}

// Finally, a function to clear the counts
function clearCount(regions) {
    for (var r in regions) 
        regions[r].count = 0 ; 
}

// Helper function to put output from this example into the HTML
function mylog(s) {
    var DEBUG_ELEMENT = document.getElementById("debugOutput"); 
    DEBUG_ELEMENT.innerHTML += s + "<br />"; 
}


// Actually show an example of the above functions
// 
function doExample() { 

    // Ok, let's test on some sample data
    // Exercise to reader is to handle Wilm's library track format
    // instead of this sample data. 
    // Ours is an array of x, y - each representing a unique person's position
    
    var sample_tracks = [ [0.5, 0.7],       // Expected to be in "apple" region
                          [1.0, 1.0],       // Also in "apple" region
                          [2.0, 2.0],       // Not in any region
                          [1.25, 1.25],     // In "carp" region
                          [0.4, 0.4],       // In "apple" and "banana" region
                          [0.1, 0.1] ]      // In "apple" and "banana" region
                          
    // But we're actually going to use random #'s to make this more interesting. 
    // So, comment the following out if you want to see the results of the above: 
    
    sample_tracks = []; 
    N = Math.floor(Math.random()*10)+1;   // Number of tracks from 1 to 10. 
    for (var n=0; n<N; n++) 
        sample_tracks.push( [ Math.random()*2, Math.random()*2 ] ); 
                          

    // We assume that the sample data are all received in the same processing "cycle"
    // So they all contribute to the occupancy counts. 

    // In the data handling process, we would do something like the following
    // *each time* a new track list is received to update the counts in REGIONS

    clearCount(REGIONS);    // We would do this in a real use case, though not needed here
    for (var i in sample_tracks) { 
        track=sample_tracks[i];
        occupied = updateCount(track[0], track[1], REGIONS); 
        updatePercentOccupancy(REGIONS, sample_tracks.length);   
        if (occupied.length>0)        
            mylog(sprintf("Point %0.2f, %0.2f is in %s.", track[0], track[1], occupied));
        else
            mylog(sprintf("Point %0.2f, %0.2f is not in any regions.", track[0], track[1]));
    } 

    mylog ("------------")
    
    // After the above, we can now access the occupancy counts / percentages like this:
    //
    // REGIONS["banana"].count  or    REGIONS["apple"].pct_occupancy
    //
        
    // Here, we'll just print them all out.  
    // 
    // Note: sprintf() is just a helper function for formatting strings: 
    //                      https://github.com/alexei/sprintf.js
    
    mylog("Total number of people: " + sample_tracks.length);  
    
    // Iterate through the regions. Here 'region' holds each key to the 
    // associative array REGIONS.
    //
    for (var region in REGIONS) { 
        mylog( "Region " + region + " has " + REGIONS[region].count + " people, percent of total is " 
                + sprintf("%0.2f%%.", REGIONS[region].pct_occupancy*100) ); 
    } 
    
    mylog ("<br />Note: Percentage occupancies here do not sum to 100% <br />because we have overlapping regions, but do represent<br /> per-region occupancy.");

    // Let's now look at what video triggering would look like, but we'll use images to keep things straightforward
    // Our objective here is to see if someone is occupying a region and if so, show an image for that region.
    // We'll set opacity based on percentage occupancy as a bonus!
    
    // Our files are organized like this:
    //          images/ 
    //              region_name/            apple, banana, carp
    //                  0.jpg
    //                  ...
    //                  N.jpg               where N is available_images-1  
    
    target = document.getElementById("images"); 
    
    // Loop through each region 
    // Note that "region" here is the name of the region, because we are 
    // using that as the key for the associative array REGIONS.
    //
    for (var region in REGIONS) { 
    
        // Only show images for regions having at least one person in them
        if (REGIONS[region].count < 1) continue; 
    
        // Pick which image to use 
        k = Math.floor( Math.random() * REGIONS[region].available_images)  
        
        // Build the filename for the image
        filename = "images/" + region + "/" + k + ".jpg";
        
        // Calculate the opacity; we'll vary from 25% to 100% based on occupancy
        opacity = 0.25 + REGIONS[region].pct_occupancy * 0.75;
        
        // Build the HTML with the above
        target.innerHTML += '<img src="'+ filename + '" style="opacity:' + opacity + ';" /><br clear="all" />';
    
    }
    
}     















