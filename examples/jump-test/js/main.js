// SIMPLE JUMP TRACKING EXAMPLE
//
// PLEASE BE AWARE: the lerpVal and threshold vars will
// need to be adjusted depending on the state of 
// tracking data coming in. 
// 

$( document ).ready(function () {
  var height = 597;
  var width = 1920;

  // initial variables

  var lastZ = -1;
  var lerpVal = 0.1; // requires adjustment
  var threshold = 10; // requires adjustment
  var jumpTrigger = true;


  // Original Version of Z-Test Function
  // 
  // Call functions directly from within function
  //
  function zTest(data){

    // make sure lastZ exists
    if(lastZ == -1){
      lastZ = data.z;
    } else {
      // smooth z
      var smoothZ = lastZ + (data.z - lastZ)*lerpVal;
      // check for fluctuation 
      var changeZ = Math.abs((smoothZ - lastZ))*1000;

      // check if jump is happening
      if(changeZ > threshold && jumpTrigger){
        // jump detected
        // console.log("jump");

        // change div to "RED"
        $("#jumpDiv").css("background-color", "red");
        $("#jumpDiv div").text(":)");

        jumpTrigger = false; // stop false positives

        // hold jump state for a moment
        window.setTimeout(function(){
          $("#jumpDiv").css("background-color", "blue");
          $("#jumpDiv div").text("");
          jumpTrigger = true;
        }, 1000); // 1 sec delay
      }
    

      lastZ = smoothZ;
    }


  };

  // Alternative Version of Function (not fully tested in space)
  //
  // Acts as a jump testing function that returns true or false
  // 
  function jumpTest(data){
    var isJumpHappening = false;

    // make sure lastZ exists
    if(lastZ == -1){
      lastZ = data.z; 
    } else {
      // smooth z
      var smoothZ = lastZ + (data.z - lastZ)*lerpVal;
      // check for fluctuation 
      var changeZ = Math.abs((smoothZ - lastZ))*1000;

      // check if jump is happening
      if(changeZ > threshold && jumpTrigger){
        // jump detected

        jumpTrigger = false;

        // start a delay to avoid extra jump fires
        window.setTimeout(function(){
          jumpTrigger = true;
        }, 1000); // currently 1 sec delay

        isJumpHappening = true; 
      }
      lastZ = smoothZ;
    }

    return isJumpHappening;
  }


  function run() {
    var face;
    if (Config.hostName != "") {
      if (Config.wsPort != 0) {
        face = new Face({host: Config.hostName, port: Config.wsPort});
      } else {
        face = new Face({host: Config.hostName});
      }
    } else {
      face = new Face();
    }
        
    var rootPrefix = new Name(Config.rootPrefix);
    var spaceName = new Name(Config.spaceName);
      
    var consumer = new Consumer(face, rootPrefix, spaceName, displayCallback);
    consumer.start();
  };

  function displayCallback(trackData) {

    OpenPTrackJS.pushToActive(trackData);

    if(OpenPTrackJS.active.length > 0){
      var checkActive=OpenPTrackJS.contains(OpenPTrackJS.active, trackData.id);
      if(checkActive[0]){
        zTest(OpenPTrackJS.normalize(trackData, true));
      }
    }
    
  }


  run();

});
