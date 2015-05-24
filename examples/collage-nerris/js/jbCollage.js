
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
};

function getFiles() {
    var files; 
    $.getJSON( "getImages.php", 
    function( data ) {
      files = data;  
      console.log(JSON.stringify(data));    
    });
    return files; 
};

function loadImages(theme) {

    console.log("loadImages", theme); 
    
    var MAX_IMAGES = 6;  // max images per theme
    
    // Array of [0, 1, ..., MAX_IMAGES-1] 
    var IDX_ARRAY = []
    for (var i=0; i < MAX_IMAGES; i++) IDX_ARRAY.push(i); 
    
    function getRandomCount() {return Math.floor(Math.random()*(MAX_IMAGES-2))+2; }
    
    // WING LEFT
    var target = document.getElementById("collage-WingL"); 
    var numImages = getRandomCount(); // How many images? 
    var images = getRandomSubarray(IDX_ARRAY, numImages);
    th = Math.floor(595/(numImages/2)); // target height for this collage
    target.setAttribute("targetHeight", th.toString());
    for (var k in images) {
        console.log(k);
        target.innerHTML += sprintf("<img src='images/%s/%d.jpg' />", theme, images[k]); 
    }


    // WING RIGHT
    target = document.getElementById("collage-WingR"); 
    numImages = getRandomCount();
    images = getRandomSubarray(IDX_ARRAY, numImages);
    th = Math.floor(595/(numImages/2)); 
    target.setAttribute("targetHeight", th.toString());
    for (var k in images) {
        target.innerHTML += sprintf("<img src='images/%s/%d.jpg' />", theme, images[k]); 
    }
    
    // REAR LEFT
    target = document.getElementById("collage-RearL"); 
    numImages = getRandomCount();
    images = getRandomSubarray(IDX_ARRAY, numImages);
    th = Math.floor(595/(numImages/2));
    target.setAttribute("targetHeight", th.toString());
    for (var k in images) {
        target.innerHTML += sprintf("<img src='images/%s/%d.jpg' />", theme, images[k]); 
    }

    // REAR RIGHT
    target = document.getElementById("collage-RearR"); 
    numImages = getRandomCount();
    images = getRandomSubarray(IDX_ARRAY, numImages);
    th = Math.floor(595/(numImages/2));
    for (var k in images) {
        target.innerHTML += sprintf("<img src='images/%s/%d.jpg' />", theme, images[k]); 
    }

    // MAIN_WALL
    target = document.getElementById("collage-MainWall"); 
    numImages = getRandomCount();
    images = getRandomSubarray(IDX_ARRAY, numImages);
    th = Math.floor(595/(numImages/2));
    for (var k in images) {
        target.innerHTML += sprintf("<img src='images/%s/%d.jpg' />", theme, images[k]); 
    }


};