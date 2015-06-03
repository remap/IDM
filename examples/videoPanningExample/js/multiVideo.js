$(document).ready(function(){

	// grab videos from dom
	var vid1 = document.getElementById("vid1");
	var vid2 = document.getElementById("vid2");

	vid2.volume = 0.1; // vid2 happens to be very loud (and clips)

	// pass to video panner
	VideoPanner.attachVideo(vid1);
	VideoPanner.attachVideo(vid2);

	// pan vid1 to left
	VideoPanner.panToLeft(vid1);
	// pan vid2 to right
	VideoPanner.panToRight(vid2);

	// VideoPanner.detachVideo(vid1);

});


// can copy/paste this variable to use in your code
var VideoPanner = (function(){

	var videoPanner = {}; // VideoPanner namespace
	var sources = []; // private array to hold sources 

	// init audio context
	var context = new window.AudioContext();


	// pass in new video source
	videoPanner.attachVideo = function (videoElement){
		if(videoElement != null && typeof videoElement != "undefined"){
			//Connect to source
			var source = context.createMediaElementSource(videoElement);
			// create unique panNode
			var panNode = context.createStereoPanner();
			// connect this panNode to the output
			panNode.connect(context.destination);
			// connect source to panNode
			source.connect(panNode);

			// add to sources array, use id of element as key
			sources[videoElement.id] = {
				source : source,
				panNode: panNode
			};
		} else {
			console.log("video element is undefined or null!");
		}
	} 

	videoPanner.detachVideo = function(videoElement){
		if(videoElement != null && typeof videoElement != "undefined"){

			//Remove connections
			sources[videoElement.id].source.disconnect();
			sources[videoElement.id].panNode.disconnect();

			// remove from sources
			delete sources[videoElement.id];

		} else {
			console.log("video element is undefined or null!");
		}
	}

	//Mute left channel and set the right gain to normal
	videoPanner.panToRight = function(element){
		if(typeof sources[element.id] != "undefined"){
			sources[element.id].panNode.pan.value = 1;
		}
	}

	//Mute right channel and set the left gain to normal
	videoPanner.panToLeft = function (element){
	    if(typeof sources[element.id] != "undefined"){
			sources[element.id].panNode.pan.value = -1;
		}
	}

	//Restore stereo
	videoPanner.panToStereo = function(element){
	    if(typeof sources[element.id] != "undefined"){
			sources[element.id].panNode.pan.value = 0;
		}
	}

	// takes a -1 to 1 value, -1 = left, 1 = right
	videoPanner.panToValue = function(element, value){
		if(typeof sources[element.id] != "undefined"){
			value = Math.min(Math.max(value, -1), 1); // make sure number is between -1 and 1
			sources[element.id].panNode.pan.value = value;
		}
	}

	return videoPanner;
}());
