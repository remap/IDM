
// CHANGE THIS VARIBLE TO 
// false TO USE OPEN_PTRACK 
var USE_OSC = true;         // Set to false to use OPT


// Declare functions for both OPT (Chiparaki OpenPTrack) and OSC (TouchOSC)
// support, and then pick which one to turn on.
//
// The function   onData(track)    is called regardless of the source 
// of the data. 
//
// We also call   onPageLoad()    for project-specific  setup.
//
$( document ).ready(function() {

    // OpenPTrack handling
    // 
    // Pretty much no change to this - 
    //
      function onOPTData(trackData)
        {
          var data = JSON.parse(JSON.stringify(trackData));
          OpenPTrack.normalize(data);
          console.log("OPT data.id " + data.id + " x,y=" + data.x + "," + data.y);  
          onData([data]);  // Callback into project code      
        }
      function runOPT()
      {
          console.log("Setting up for OpenPTrack data via NDN");
          var face;
          if (Config.hostName != "") {
            if (Config.wsPort != 0) {
              face = new Face({host: Config.hostName, port: Config.wsPort});
            }
            else {
              face = new Face({host: Config.hostName});
            }
          }
          else {
            face = new Face();
          }
          var rootPrefix = new Name(Config.rootPrefix);
          var spaceName = new Name(Config.spaceName);
          var consumer = new Consumer(face, rootPrefix, spaceName, onOPTData);
          consumer.start();
      } 
      
    // OSC Handling
    // 
    // We parse the OSC messages to generate the tracking data.
    //
    // To fake the evolving IDs of OpenPTrack, we keep track of finger indexes and,
    // if we don't hear from them for awhile, increase the id associated
    // with them. 
    //
    var fingers_lastseen = [0,0,0,0,0,0,0,0,0,0]; // When we last got an update for each finger 
    var fingers_replacement_id = [0,0,0,0,0,0,0,0,0,0]; // What to replace each incoming finger ID with
    var next_id = 1;  
    var EXPIRE_FINGER = 500; // milliseconds
    function onOSCData(oscMsg) {
        var data = {};
        var finger = Number(oscMsg.address.slice(oscMsg.address.lastIndexOf("/")+1)); // finger # is last part of OSC path
        t = Date.now(); 
        if (t-fingers_lastseen[finger] > EXPIRE_FINGER) 
            fingers_replacement_id[finger] = next_id++;
        fingers_lastseen[finger] = t; 
        data.id = fingers_replacement_id[finger]; 
        data.x = oscMsg.args[0];
        data.y = oscMsg.args[1]; 
        // TODO: Normalize / scale / flip coordinates?
        console.log("OSC data.id " + data.id + " x,y=" + data.x + "," + data.y); 
        // Pass to project code  
        onData([data]);
    }
    // This is pretty much the same - 
    function runOSC() { 
        console.log("Setting up for OSC data via NDN");
        var host = window.document.location.host.replace(/:.*/, '');
        if (host=="") host="localhost";
        var port = 3000;
        var ws = new WebSocket('ws://' + host + ':' + port);
        ws.onmessage = function (event) {	
            var arrayBuffer;
            var fileReader = new FileReader();
            fileReader.onload = function(){
                arrayBuffer = this.result;
                onOSCData(osc.readMessage(arrayBuffer));
            };
            fileReader.readAsArrayBuffer(event.data);
        };

    }

    // First, call project-specific setup before starting tracking.
    onPageLoad(); 
    
    // Run tracking: 
    if (USE_OSC) {
        runOSC();
      } else {
        runOPT();
    }
});



/// ------ The rest of this is adapted from the tinydancer example

// One thing it *doesn't* do is remove sprites for IDs not seen in a while.
// This can be done by keeping track of when things are seen and calling 
// a function periodically to reap unseen IDs.  But this is handled in some
// of Wilm's code (for active tracks) for other reasons, so not done here. 


// Toggle this in the UI to see the results of the hysteresis in the new updateCount function 
var useRegionStickiness = true; 

// Random walk parameters
var MAX_STEPSIZE = 7;   // Maximum absolute value we can shift in each direction per step
var MAX_X = 550;        // Our boundaries (when walkers turn around)
var MAX_Y = 475; 

var last_occupied = {}; // Hold the last regions occupied for each track  

// The sprites we'll animate.  We use an object/assoc. array so we can have arbitrary ids
var sprites = {}; 
var SPRITEWIDTH = 20; 

// ------- THIS PART IS BASICALLY SAME AS OCCUPANCY EXAMPLE
// *** But here we use pixel coordinates *** to make the example
// simpler, and have colors and hold the divs.
//  
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
    if (typeof last_regions == 'undefined') last_regions = [];  // Added this because we have arbitrary track ids, making it hard to guarantee a value here
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



// Start generating fake data after page is loaded, which calls the onData callback
// 
function onPageLoad() { 
    drawRegions();
}


// Process incoming data [ [id, x, y], ... ]
// 
function onData(newtracks) {
    clearCount(REGIONS);       // Used in our occupancy counter
    clearlog();                // where we will print our output
    for (var k=0; k < newtracks.length; k++) {
        // Update the count, this time keeping track of the regions occupied by the sprites 
        // and passing the previous value into the call
        id = newtracks[k].id.toString();
        
        // In this example, we convert normalized track coordinates to pixel dimensions 
        // since our regions are expressed in that coordinate system
        last_occupied[id] = updateCount(newtracks[k].x*MAX_X, newtracks[k].y*MAX_X, REGIONS, last_occupied[id]);
        
        // Animate our sprites, creating a new one if necessary: 
        if (id in sprites == false)
            makeNewSprite(id);
        sprites[id].style.top = newtracks[k].y*MAX_Y; 
        sprites[id].style.left = newtracks[k].x*MAX_X;
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

// In this example, we make a new sprite for every new id
// 
function makeNewSprite(id) {
    var firstdiv = document.getElementById("controls"); 
    sprites[id] = document.createElement("div");
    sprites[id].style.backgroundColor = "#9ee";
    sprites[id].style.opacity = "0.8";
    sprites[id].style.position = "absolute";
    sprites[id].style.zIndex = -1*Number(id);  //hm.
    sprites[id].style.height = SPRITEWIDTH;
    sprites[id].style.width = SPRITEWIDTH;
    sprites[id].style.textAlign = "center";
    sprites[id].innerHTML = "<span style='color:#52f;'>"+id+"</span>";
    document.body.insertBefore(sprites[id], firstdiv); 
} 















