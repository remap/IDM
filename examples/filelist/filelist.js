// Helper function to put debug output from this example into the HTML
function mylog(s) {
    var DEBUG_ELEMENT = document.getElementById("debugOutput"); 
    DEBUG_ELEMENT.innerHTML += s + "<br />"; 
}

//  Run after the page is loaded. 
// 
function doExample() { 
    $.getJSON( "getImages.php", 
    function( data ) {
      // This function is called after the file list has been retrieved successfully;
      mylog("Data received:");
      mylog(JSON.stringify(data));  
      showImages(data);       
    });
}

// Pass in a JSON array of images/ file stracture
//
function showImages(filelist) { 
    mylog("----------");
    mylog("Folders (file count): " );
    
    // Here, we *assume* all files from the
    // remote script are folders.  
    folders=[];
    for (var r in filelist) {
        // Make a list of folders
        folders.push(r);
        // Print each folder and file count
        mylog(sprintf("- %s (%d)", r, filelist[r].length));
    }
   
    // Pick a folder at random
    folder = folders[Math.floor(Math.random()*folders.length)]; 
    
    // Show all images in the folder
    // Note: this assumes ALL files in the folder are image files
    //       and there are no subdirectories. 
    target = document.getElementById("images"); 
    target.innerHTML = (sprintf("<h1>Showing all images in %s folder.</h1>", folder)); 
    for (var k in filelist[folder]) {
        target.innerHTML += sprintf('<img src="images/%s/%s" /><br clear="all" />', folder, filelist[folder][k]);
    }
    
}     















