
// "collage-WingL" 

// http://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array
function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}


function loadImages() {

    var REGIONS = [ "apple", "banana", "carp", "david", "eel", "fungi", "giraffe" ]; 
    var MAX_IMAGES = 8;  // images per region
    
    // Array of [0, 1, ..., MAX_IMAGES-1] 
    var IDX_ARRAY = []
    for (var i=0; i < MAX_IMAGES; i++) IDX_ARRAY.push(i); 
    
    function getRandomRegion() { return REGIONS[ Math.floor(Math.random()*REGIONS.length) ]; } 
    function getRandomCount() {return Math.floor(Math.random()*(MAX_IMAGES-2))+2; }
    
    // WING LEFT
    var target = document.getElementById("collage-WingL"); 
    var region = getRandomRegion(); // What region?
    var numImages = getRandomCount(); // How many images? 
    var images = getRandomSubarray(IDX_ARRAY, numImages);
    th = Math.floor(288/(numImages/2)); // target height for this collage
    target.setAttribute("targetHeight", th.toString());
    for (var k in images) {
        console.log(k);
        target.innerHTML += sprintf("<img src='images/%s/%d.jpg' />", region, images[k]); 
    }


    // WING RIGHT
    target = document.getElementById("collage-WingR"); 
    region = getRandomRegion();
    numImages = getRandomCount();
    images = getRandomSubarray(IDX_ARRAY, numImages);
    th = Math.floor(288/(numImages/2)); 
    target.setAttribute("targetHeight", th.toString());
    for (var k in images) {
        target.innerHTML += sprintf("<img src='images/%s/%d.jpg' />", region, images[k]); 
    }
    
    // REAR LEFT
    target = document.getElementById("collage-RearL"); 
    region = getRandomRegion();
    numImages = getRandomCount();
    images = getRandomSubarray(IDX_ARRAY, numImages);
    th = Math.floor(179/(numImages/2));
    target.setAttribute("targetHeight", th.toString());
    for (var k in images) {
        target.innerHTML += sprintf("<img src='images/%s/%d.jpg' />", region, images[k]); 
    }

    // REAR RIGHT
    target = document.getElementById("collage-RearR"); 
    region = getRandomRegion();   
    numImages = getRandomCount();
    images = getRandomSubarray(IDX_ARRAY, numImages);
    th = Math.floor(179/(numImages/2));
    for (var k in images) {
        target.innerHTML += sprintf("<img src='images/%s/%d.jpg' />", region, images[k]); 
    }
    
    // MAIN WALL
    target = document.getElementById("collage-MainWall"); 
    th = 150;  
    target.setAttribute("targetHeight", th.toString());
    // Just pick a bunch of stuff... 
    var someregions = []
    for (var i=0; i < 4; i++)
        someregions.push( getRandomRegion() );  
    for (var r in someregions) { 
        for (var k=0; k < 4; k++) {
            target.innerHTML += sprintf("<img src='images/%s/%d.jpg' />", someregions[r], k);  
        }
    }

}