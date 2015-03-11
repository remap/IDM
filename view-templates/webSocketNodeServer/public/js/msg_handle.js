var host = window.document.location.host.replace(/:.*/, '');
var port = 3000;
var ws = new WebSocket('ws://' + host + ':' + port);
var height;
var width;


window.onresize = function(event) {
    height = $(window).height();
	width = $(window).width();
};


function updateHTML(oscMsg) {

	// split incoming messages
	switch(oscMsg.address){
		case '/1/multixy1/1':
			$('#touch1').css("top", (1-oscMsg.args[0])*height-100);
			$('#touch1').css("left", oscMsg.args[1]*width-100 );
			break;	
		case '/1/multixy1/2':
			$('#touch2').css("top", (1-oscMsg.args[0])*height-100);
			$('#touch2').css("left", oscMsg.args[1]*width-100);
			break;	
		case '/1/multixy1/3':
			$('#touch3').css("top", (1-oscMsg.args[0])*height-100);
			$('#touch3').css("left", oscMsg.args[1]*width-100);		
			break;	
		case '/1/multixy1/4':
			$('#touch4').css("top", (1-oscMsg.args[0])*height-100);
			$('#touch4').css("left", oscMsg.args[1]*width-100);		
			break;	
		case '/1/multixy1/5':
			$('#touch5').css("top", (1-oscMsg.args[0])*height-100);
			$('#touch5').css("left", oscMsg.args[1]*width-100);		
			break;
	}

}

// Parsing from Web Socket 
ws.onmessage = function (event) {	
	var arrayBuffer;
	var fileReader = new FileReader();
	fileReader.onload = function(){
		arrayBuffer = this.result;
		updateHTML(osc.readMessage(arrayBuffer));
	};
	fileReader.readAsArrayBuffer(event.data)
};