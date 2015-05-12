

// How often to generate new "tracking" data, in ms
var RELOAD_INTERVAL = 25; 

// Toggle this to pause / play the fake data
var isPaused = false; 

// Toggle this in the UI to see the results of the hysteresis in the new updateCount function 
var useRegionStickiness = true; 

// Random walk parameters
var MAX_STEPSIZE = 7;   // Maximum absolute value we can shift in each direction per step
var MAX_X = 550;        // Our boundaries (when walkers turn around)
var MAX_Y = 475; 

// Sample tracks
// Initialize the sample tracks here using a list comprehension for compactness
var tracks = [for (id of [0,1,2,3,4,5,6,7,8,9]) [id,Math.floor(Math.random()*MAX_X),Math.floor(Math.random()*MAX_Y)]];

// Hold the last regions occupied for each track
var last_occupied = [for (x of tracks) []]; 

// The sprites we'll animate
var sprites = []; 
var SPRITEWIDTH = 20; 


// ------- THIS PART IS BASICALLY SAME AS OCCUPANCY EXAMPLE
// But here we use pixel coordinates to make the example
// simpler, and have colors and hold the divs. 
var REGIONS = {                            
            "apple"   : { ul : [0, 0],            // here these are the (y,x) of graphics coordinates                
                          lr : [200, 400],                
                          count : 0,                     
                          pct_occupancy : 0.0,           
                          available_images: 3, 
                          div : null,
                          color : "#400" },        
            "banana"  : { ul : [50, 100],                
                          lr : [120, 350],
                          count : 0,
                          pct_occupancy : 0.0,
                          available_images: 3,
                          div : null,
                          color : "#040" },
            "carp"    : { ul : [201, 0],             
                          lr : [320, 500],
                          count : 0, 
                          pct_occupancy : 0.0, 
                          available_images: 3,
                          div : null, 
                          color : "#004" },
            "david"    : { ul : [0, 400],             
                          lr : [200, 500],
                          count : 0, 
                          pct_occupancy : 0.0, 
                          available_images: 3,
                          div : null, 
                          color : "#440" },  
            "eel"    : { ul : [251, 50],             
                          lr : [350, 375],
                          count : 0, 
                          pct_occupancy : 0.0, 
                          available_images: 3,
                          div : null, 
                          color : "#404" },
            "fungi"    : { ul : [375, 0],             
                          lr : [440, 500],
                          count : 0, 
                          pct_occupancy : 0.0, 
                          available_images: 3,
                          div : null, 
                          color : "#426" },                          
                             
            };             
// Populate height and width
for (var r in REGIONS) { 
    REGIONS[r].height = REGIONS[r].lr[0] - REGIONS[r].ul[0]; 
    REGIONS[r].width = REGIONS[r].lr[1] - REGIONS[r].ul[1];
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



// We modify this updateCount to keep track of visitors and implement hysteresis 

function updateCount( x, y, regions, last_regions) {
    var occupied = [];   
    for (var r in regions) {
        
         // If  already in the region, expand the boundaries
        var adj_lr = [0,0];         
        var adj_ul = [0,0]; 
        var A = 0.12;             // A 12% proportional "expansion" of the border to trigger leaving
        if (useRegionStickiness && last_regions.indexOf(r) > -1) {        
            adj_lr[0] = A*regions[r].height;
            adj_lr[1] = A*regions[r].width;
            adj_ul[0] = -1*A*regions[r].height;
            adj_ul[1] = -1*A*regions[r].width;
        }  
        
        // Now, use the adjusted region boundaries in the test
        //
        if (y >= regions[r].ul[0]+adj_ul[0]  && y <= regions[r].lr[0]+adj_lr[0] &&           // These checks are for a graphics coordinate
            x >= regions[r].ul[1]+adj_ul[1]  && x <= regions[r].lr[1]+adj_lr[1] ) {          // system with (0,0) in the top left
                regions[r].count += 1; 
                occupied.push(r); 
           }
    }       
    return occupied;      
}


// This is a revision to the fake data generator
// that does a random walk. 
//

function generateFakeData(step) {
    if (isPaused && !step) return; 
    for (var m=0; m < tracks.length; m++) {
        // Calc the random steps in each direction
        tracks[m][1] += (Math.round(Math.random()*2)-1) * Math.floor(Math.random()*MAX_STEPSIZE); 
        tracks[m][2] += (Math.round(Math.random()*2)-1) * Math.floor(Math.random()*MAX_STEPSIZE);
        // Check the boundaries
        if (tracks[m][1] < 0) tracks[m][1] = 0;
        else if (tracks[m][1] > MAX_X) tracks[m][1] = MAX_X;
        if (tracks[m][2] < 0) tracks[m][2] = 0;
        else if (tracks[m][2] > MAX_Y) tracks[m][2] = MAX_Y;             
    }
    onData(tracks); 
} 

// if needed
function resetPositions() {
    for (var k=0; k < tracks.length; k++) {
        tracks[k][1] = Math.floor(Math.random()*MAX_X);
        tracks[k][2] = Math.floor(Math.random()*MAX_Y);
        last_occupied[k] = []; 
    }
} 


// Start generating fake data after page is loaded, which calls the onData callback
// 
function onPageLoad() { 
    drawRegions();
    drawSprites(); 
    window.setInterval(function() { generateFakeData(false) }, RELOAD_INTERVAL);
}



// Process incoming data
// 
function onData(newtracks) { 
    clearCount(REGIONS);       // Used in our occupancy counter
    clearlog();                // where we will print our output
    for (var k=0; k < newtracks.length; k++) {
        // Update the count, this time keeping track of the regions occupied by the sprites 
        // and passing the previous value into the call
        last_occupied[k] = updateCount(newtracks[k][1] + 0.5*SPRITEWIDTH, newtracks[k][2] + 0.5*SPRITEWIDTH, REGIONS, last_occupied[k]);
        // Animate our sprites: 
        sprites[k].style.top = newtracks[k][2]; 
        sprites[k].style.left = newtracks[k][1];
        // Print the message
        mylog (sprintf("Person %d in %s.", k, last_occupied[k]));
        }
    // Print some other messages
    for (var region in REGIONS) { 
        mylog(sprintf("Region %s contains %d.", region, REGIONS[region].count)); 
    } 
    mylog("-------");
    mylog(sprintf("Region stickiness <strong>%s</strong>.", useRegionStickiness ? "on" : "off"));

}     


// ---- Some cheesy div drawing functions

// We set CSS here programmatically for fun, but it's better done in 
// a separate file
//
function drawRegions() {
    var firstdiv = document.getElementById("controls"); 
    for (var r in REGIONS) { 
        REGIONS[r].div = document.createElement("div");
        REGIONS[r].div.style.backgroundColor = REGIONS[r].color;
        REGIONS[r].div.style.position = "absolute";
        REGIONS[r].div.style.zIndex = "-20";
        REGIONS[r].div.style.left = REGIONS[r].ul[1];
        REGIONS[r].div.style.top = REGIONS[r].ul[0];
        REGIONS[r].div.style.height = REGIONS[r].lr[0]-REGIONS[r].ul[0];
        REGIONS[r].div.style.width = REGIONS[r].lr[1]-REGIONS[r].ul[1];
        REGIONS[r].div.innerHTML = "<span style='color:#fff;'>"+r+"</span>";
        document.body.insertBefore(REGIONS[r].div, firstdiv); 
    }
} 

function drawSprites() {
    var firstdiv = document.getElementById("controls"); 
    for (var k=0; k < tracks.length; k++) {
        sprites.push( [] ); 
        sprites[k] = document.createElement("div");
        sprites[k].style.backgroundColor = "#9ee";
        sprites[k].style.opacity = "0.8";
        sprites[k].style.position = "absolute";
        sprites[k].style.zIndex = -1*k;
        sprites[k].style.height = SPRITEWIDTH;
        sprites[k].style.width = SPRITEWIDTH;
        sprites[k].style.textAlign = "center";
        sprites[k].innerHTML = "<span style='color:#52f;'>"+k+"</span>";
        document.body.insertBefore(sprites[k], firstdiv); 
    }
} 















