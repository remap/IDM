var host = window.document.location.host.replace(/:.*/, '');
var port = 3000;
var ws = new WebSocket('ws://' + host + ':' + port);

var height = document.height;
var width = document.width;
// multiply element (oscMsg.args) with this height and width. 
window.onresize = function(event) {
	height = $(window).height();//document.height;
	width = $(window).width();//document.width;
};

var trigger = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]]; 
var colorTrigger= [0,0,0,0,0]; 

function testlocation (oscMsg, colorElement, finger){
			
			// Quadrant bottom left
			if(oscMsg.args[0] < 0.5 && oscMsg.args[1] < 0.5 && trigger[finger][0] == 0)
			{
				$(colorElement).css("background-color", "#4A6BFF");
				trigger [finger] = [1,0,0,0];
				//console.log ("square one");

			}
			if(oscMsg.args[0] >= 0.5 && oscMsg.args[1] < 0.5 && trigger[finger][1] == 0)
			{
				$(colorElement).css("background-color", "#57CEFF");
				trigger [finger]= [0,1,0,0];
			}
			if(oscMsg.args[0] < 0.5 && oscMsg.args[1] >= 0.5 && trigger[finger][2] == 0)
			{
				$(colorElement).css("background-color", "#43E3E8");
				trigger [finger] = [0,0,1,0];
			}
			if(oscMsg.args[0] >= 0.5 && oscMsg.args[1] >= 0.5 && trigger[finger][3] == 0)
			{
				$(colorElement).css("background-color", "#4AFFD1");
				trigger [finger] = [0,0,0,1];
			}

	}

var lineLength = function(x, y, x0, y0){
    	return Math.sqrt(Math.pow((x-x0),2) + Math.pow((y-y0),2));
};




var x = [0,0,0];
var y = [0,0,0];

function updateHTML(oscMsg) {
	

//Finger1
	switch(oscMsg.address){
		case '/1/multixy1/1':
			x[0] = oscMsg.args[0];
			y[0] = oscMsg.args[1];
			var finger1Div = $('#happy');

			var length1 = lineLength(x[1], y[1], x[0], y[0]);
			if (length1 < 0.4) 
			{
				if(colorTrigger[0]== 0){
					finger1Div.css("background-color", "#ff0000");
					colorTrigger[0]=1; 
				}
				
				trigger[0]=[0,0,0,0] ;
				
			}
		
			else 
			{
				testlocation(oscMsg,'#happy', 0);
				colorTrigger[0]=0;
				// colorTrigger = false;
			}

			finger1Div.css("left", oscMsg.args[1]*1560-25);	
			finger1Div.css("top",(1-oscMsg.args[0])*597-25);

			break;
//Finger2
		case '/1/multixy1/2':
			x[1] = oscMsg.args[0];
			y[1] = oscMsg.args[1];
			var finger2Div = $('#sad');
			
			var length1 = lineLength(x[1], y[1], x[0], y[0]);
			// distance(length1);
			if (length1 < 0.4) 
			{
				if(colorTrigger[1]== 0){
					finger2Div.css("background-color", "#ff0000");
					colorTrigger[1]=1; 
				}
				
				trigger[1]=[0,0,0,0] ;
			}
		
			else
			{
				testlocation(oscMsg,'#sad', 1);
				colorTrigger[1]=0;
			}
			
			finger2Div.css("left", oscMsg.args[1]*1560-25);	
			finger2Div.css("top",(1-oscMsg.args[0])*597-25);
			
			
			break;

//Finger3
		case '/1/multixy1/3':
			x[2] = oscMsg.args[0];
			y[2] = oscMsg.args[1];
			var finger3Div = $('#nice');
			var length2 = lineLength(x[2], y[2], x[0], y[0]);
			if (length2 < 0.4) 
			{
				if(colorTrigger[2]== 0){
					finger3Div.css("background-color", "#ff0000");
					colorTrigger[2]=1; 
				}
				
				trigger[2]=[0,0,0,0] ;
			}
		
			else
			{
				testlocation(oscMsg,'#sad', 2);
				colorTrigger[2]=0;
			}
			
			
			var length3 = lineLength(x[2], y[2], x[1], y[1]);
				if (length3 < 0.4) 
			{
				if(colorTrigger[2]== 0){
					finger3Div.css("background-color", "#ff0000");
					colorTrigger[2]=1; 
				}
				
				trigger[2]=[0,0,0,0] ;
			}
		
			else
			{
				testlocation(oscMsg,'#sad', 2);
				colorTrigger[2]=0;
			}

			finger3Div.css("left", oscMsg.args[1]*1560-25);	
			finger3Div.css("top",(1-oscMsg.args[0])*597-25);

			break;	

//Finger4
		case '/1/multixy1/4':
			x[3] = oscMsg.args[0];
			y[3] = oscMsg.args[1];
			testlocation(oscMsg,'#mean', 3);
			var length4 = lineLength(x[3], y[3], x[0], y[0]);
			var length5 = lineLength(x[3], y[3], x[1], y[1]);
			var length6 = lineLength(x[3], y[3], x[2], y[2]);

			
			
			break;

//Finger5 
		case '/1/multixy1/5':
			x[5] = oscMsg.args[0];
			y[5] = oscMsg.args[1];
			testlocation(oscMsg,'#indifferent', 4);
			var length7 = lineLength(x[4], y[4], x[0], y[0]);
			var length8 = lineLength(x[4], y[4], x[1], y[1]);
			var length9 = lineLength(x[4], y[4], x[2], y[2]);
			var length10 = lineLength(x[4], y[4], x[3], y[3]);
			
			// console.log(length7)
			// console.log(length8)
			// console.log(length9)
			// console.log(length10)

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