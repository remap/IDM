$(document).ready(function(){

	// grab video from dom
	var vid = document.getElementById("vid");
	// pass to video panner
	VideoPanner.attachVideo(vid);

	// example calls to panner, begins in stereo, 
	// pan to left after 1 sec, 
	// pan to right after another sec,
	// then sweep left to right

	VideoPanner.panToStereo(vid);

	var panningValue = -1;
	window.setTimeout(function(){
		// pan to left
		VideoPanner.panToLeft(vid);
		console.log("panning to left");
		window.setTimeout(function(){
			// pan to right
			VideoPanner.panToRight(vid);
			console.log("panning to right");
			window.setTimeout(function(){
				window.setInterval(function(){
					// sweep left to right
					VideoPanner.panToValue(vid, panningValue);
					// increment panningValue, if it is larger than 1, set to -1, otherwise add 0.1
					panningValue = (panningValue <= 1) ? panningValue + 0.1 : -1;
				},400);
			},2000);
		}, 2000);
	}, 2000);
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
