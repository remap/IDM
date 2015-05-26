
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

// ** TEMPORARY - Flatten one path deep only, to use all images in all places, 
//    since there are not very many files per wall. 
// We exclude main/ because all of the files are large
//
function flattenFileNames(allfiles, themefiles) {
    for (p in allfiles) {
        if (p=="main") continue;
        for (k in allfiles[p]) {
            themefiles.push(p+"/"+allfiles[p][k]);
        }
    } 
}

function loadImages(theme, files) {

    console.log("loadImages", theme); 
    
    // The following is a temporary step to get more files per collage by using all subdirectories
    // Otherwise, could just pick the theme files here
    // themefiles = files[theme]
    //
    var themefiles=[];  // output
    flattenFileNames(files[theme], themefiles); 
    console.log("themefiles", themefiles);     
    
    function getRandomCount(m,n) {return Math.min(n, Math.floor(Math.random()*(themefiles.length-m))+m ); }
    
    // WING LEFT
    var target = document.getElementById("collage-WingL"); 
    var numImages = getRandomCount(4,10); // How many images? 
    var images = getRandomSubarray(themefiles, numImages);
    th = Math.floor(595/(numImages/2)); // target height for this collage
    target.setAttribute("targetHeight", th.toString());
    for (var k in images) {
        console.log(k);
        target.innerHTML += sprintf("<img src='images/%s/%s' />", theme, images[k]); 
    }


    // WING RIGHT
    target = document.getElementById("collage-WingR"); 
    numImages = getRandomCount(4,10);
    images = getRandomSubarray(themefiles, numImages);
    th = Math.floor(595/(numImages/2)); 
    target.setAttribute("targetHeight", th.toString());
    for (var k in images) {
        target.innerHTML += sprintf("<img src='images/%s/%s' />", theme, images[k]); 
    }
    
    // REAR LEFT
    target = document.getElementById("collage-RearL"); 
    numImages = getRandomCount(4,6);
    images = getRandomSubarray(themefiles, numImages);
    th = Math.floor(595/(numImages/2));
    target.setAttribute("targetHeight", th.toString());
    for (var k in images) {
        target.innerHTML += sprintf("<img src='images/%s/%s' />", theme, images[k]); 
    }

    // REAR RIGHT
    target = document.getElementById("collage-RearR"); 
    numImages = getRandomCount(4,6);
    images = getRandomSubarray(themefiles, numImages);
    th = Math.floor(595/(numImages/2));
    for (var k in images) {
        target.innerHTML += sprintf("<img src='images/%s/%s' />", theme, images[k]); 
    }

    // MAIN_WALL
    target = document.getElementById("collage-MainWall"); 
    numImages = getRandomCount(10,25);
    images = getRandomSubarray(themefiles, numImages);
    th = Math.floor(595/(numImages/2));
    for (var k in images) {
        target.innerHTML += sprintf("<img src='images/%s/%s' />", theme, images[k]); 
    }


};