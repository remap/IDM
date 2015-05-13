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

var trigger = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
var totalVideo = 24;
var swapVideo = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];

// var getRand = (function(totalVideo) {
// 	var nums = [];
// 	for (var i = 0; i < 24; i++) {
// 		nums.push(i);
// 	};

//     var current = [];
//     function rand(n) {
//         return (Math.random() * n)|0;
//     }
//     return function() {
//       if (!current.length) current = nums.slice();
//       return current.splice(rand(current.length), 1);
//     }
// });


function randomVideo (videoID) {
	// Generate random number
	var randomNumber = Math.ceil(Math.random() * totalVideo);
	console.log(randomNumber);
	// Check if random number is already playing 
	// Assign new video source using randomNumber
	$("#"+videoID).stop();
	$("#"+videoID + " > source").attr("src","../video/FlipCamera/"+randomNumber+".mp4");
	$("#"+videoID).load();
	//Store video as currently playing
	// console.log("Switching To Video: "+randomNumber);
}

$(document).ready(function() {
	$("#window1").bind('ended', function(e){
	 		swapVideo[0]=true;
	 		$("#eraseWindow1").fadeIn(1500, function(){
	 			trigger = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
	 		});
					
	 		$("#window1").fadeOut(1500);			
	});
	$("#window2").bind('ended', function(e){
	 		swapVideo[1]=true;
	 		$("#eraseWindow2").fadeIn(1500, function(){
	 			trigger = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
	 		});
					
	 		$("#window2").fadeOut(1500);
	});
	$("#window3").bind('ended', function(e){
	 		swapVideo[0]=true;
	 		$("#eraseWindow3").fadeIn(1500, function(){
	 			trigger = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
	 		});
					
	 		$("#window3").fadeOut(1500);	 		
	});
	$("#window4").bind('ended', function(e){
	 		swapVideo[1]=true;
	 		$("#eraseWindow4").fadeIn(1500, function(){
	 			trigger = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
	 		});
					
	 		$("#window4").fadeOut(1500);
	});
	$("#window5").bind('ended', function(e){
	 		swapVideo[0]=true;
	 		$("#eraseWindow5").fadeIn(1500, function(){
	 			trigger = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
	 		});
					
	 		$("#window5").fadeOut(1500);	 		
	});
	$("#window6").bind('ended', function(e){
	 		swapVideo[1]=true;
	 		$("#eraseWindow6").fadeIn(1500, function(){
	 			trigger = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
	 		});
					
	 		$("#window6").fadeOut(1500);
	});
	$("#window7").bind('ended', function(e){
	 		swapVideo[0]=true;
	 		$("#eraseWindow7").fadeIn(1500, function(){
	 			trigger = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
	 		});
					
	 		$("#window7").fadeOut(1500);	 		
	});
	$("#window8").bind('ended', function(e){
	 		swapVideo[1]=true;
	 		$("#eraseWindow8").fadeIn(1500, function(){
	 			trigger = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
	 		});
					
	 		$("#window8").fadeOut(1500);
	});
	$("#window9").bind('ended', function(e){
	 		swapVideo[0]=true;
	 		$("#eraseWindow9").fadeIn(1500, function(){
	 			trigger = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
	 		});
					
	 		$("#window9").fadeOut(1500);	 		
	});
	$("#window10").bind('ended', function(e){
	 		swapVideo[1]=true;
	 		$("#eraseWindow10").fadeIn(1500, function(){
	 			trigger = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
	 		});
					
	 		$("#window10").fadeOut(1500);
	});
	$("#window11").bind('ended', function(e){
	 		swapVideo[0]=true;	
	 		$("#eraseWindow11").fadeIn(1500, function(){
	 			trigger = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
	 		});
					
	 		$("#window11").fadeOut(1500); 		
	});
	$("#window12").bind('ended', function(e){
	 		swapVideo[1]=true;
	 		$("#eraseWindow12").fadeIn(1500, function(){
	 			trigger = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
	 		});
					
	 		$("#window12").fadeOut(1500);
	});
});


function testlocation (oscMsg, colorElement, finger){
		// Pane 1 (bottom left)
		// console.log(trigger[0]);

			if(oscMsg.args[1] < 0.23 && oscMsg.args[0] <= 0.31 && trigger[0] == 0){
					//console.log(swapVideo[0]);
					// Is what is below placed in the correct spot????
					if(swapVideo[0]==true){
						randomVideo("window1");
						swapVideo[0]=false;
					}
					$("#eraseWindow1").fadeOut(1500);
					$("#window1").fadeIn(1500);
					document.getElementById('window1').play();
					trigger[0]=1;


			} else if (oscMsg.args[1] > 0.23 || oscMsg.args[0] >= 0.31 && trigger[0] == 1){
					$("#eraseWindow1").fadeIn(1500);
					$("#window1").fadeOut(1500);
					document.getElementById('window1').pause();
					trigger[0]=0;	

			}
			
		// Pane 2 (bottom center left)
			if(oscMsg.args[1] <= 0.51 && oscMsg.args[1] >= 0.23 && oscMsg.args[0] <=0.31 && trigger[1] == 0)
			{
					if(swapVideo[1]==true){
						randomVideo("window2");
						swapVideo[1]=false;
					}
					$("#eraseWindow2").fadeOut(1500);
					$("#window2").fadeIn(1500);		
					document.getElementById('window2').play();
					trigger[1]=1;

			} else if (oscMsg.args[1] >= 0.51 || oscMsg.args[1] <= 0.23 || oscMsg.args[0] >=0.31 && trigger[1] == 1){
					$("#eraseWindow2").fadeIn(1500);
					$("#window2").fadeOut(1500);
					document.getElementById('window2').pause();
					trigger[1]=0;	
			}

		// Pane 3 (Middle Center left)
			if(oscMsg.args[1] < 0.23 && oscMsg.args[0] <= 0.67 && oscMsg.args[0] > 0.31 && trigger[2] == 0)
			{
					if(swapVideo[2]==true){
						randomVideo("window2");
						swapVideo[2]=false;
					}
					$("#eraseWindow3").fadeOut(1500);
					$("#window3").fadeIn(1500);		
					document.getElementById('window3').play();
					trigger[2]=1;


			} else if (oscMsg.args[1] > 0.23 || oscMsg.args[0] >= 0.67 || oscMsg.args[0] < 0.31 && trigger[2] == 1) {
					$("#eraseWindow3").fadeIn(1500);
					$("#window3").fadeOut(1500);
					document.getElementById('window3').pause();	
					trigger[2]=0;
			}

		// Pane 4 (Left Center)
			if(oscMsg.args[1] <= 0.51 && oscMsg.args[1] >= 0.23 && oscMsg.args[0] <= 0.67 && oscMsg.args[0] > 0.31 && trigger[3] == 0)
			{
					if(swapVideo[3]==true){
						randomVideo("window2");
						swapVideo[3]=false;
					}
					$("#eraseWindow4").fadeOut(1500);
					$("#window4").fadeIn(1500);		
					document.getElementById('window4').play();
					trigger[3]=1;

			} else if (oscMsg.args[1] >= 0.51 || oscMsg.args[1] <= 0.23 || oscMsg.args[0] >= 0.67 || oscMsg.args[0] < 0.31 && trigger[3] == 1){
					$("#eraseWindow4").fadeIn(1500);
					$("#window4").fadeOut(1500);
					document.getElementById('window4').pause();	
					trigger[3]=0;
			}

		// Pane 5 (Top Left)
			if(oscMsg.args[1] <= 0.23 && oscMsg.args[0] > 0.67 && trigger[4] == 0)
			{
					if(swapVideo[4]==true){
						randomVideo("window2");
						swapVideo[4]=false;
					}
					$("#eraseWindow5").fadeOut(1500);
					$("#window5").fadeIn(1500);		
					document.getElementById('window5').play();
					trigger[4]=1;

			} else if (oscMsg.args[1] >= 0.23 || oscMsg.args[0] < 0.67 && trigger[4] == 1){
					$("#eraseWindow5").fadeIn(1500);
					$("#window5").fadeOut(1500);
					document.getElementById('window5').pause();	
					trigger[4]=0;
			}

		// Pane 6 (Top Center Left)
			if(oscMsg.args[1] <= 0.51 && oscMsg.args[1] > 0.23 && oscMsg.args[0] > 0.67 && trigger[5] == 0)
			{
					if(swapVideo[5]==true){
						randomVideo("window2");
						swapVideo[5]=false;
					}
					$("#eraseWindow6").fadeOut(1500);
					$("#window6").fadeIn(1500);		
					document.getElementById('window6').play();
					trigger[5]=1;

			} else if (oscMsg.args[1] >= 0.51 || oscMsg.args[1] < 0.23 || oscMsg.args[0] < 0.67 && trigger[5] == 1){
					$("#eraseWindow6").fadeIn(1500);
					$("#window6").fadeOut(1500);
					document.getElementById('window6').pause();
					trigger[5]=0;
			}

		// Pane 7 (Top Center Right)
			if(oscMsg.args[1] > 0.51 && oscMsg.args[1] <= 0.78 && oscMsg.args[0] > 0.67 && trigger[6] == 0)
			{
					if(swapVideo[6]==true){
						randomVideo("window2");
						swapVideo[6]=false;
					}
					$("#eraseWindow7").fadeOut(1500);
					$("#window7").fadeIn(1500);		
					document.getElementById('window7').play();
					trigger[6]=1;

			} else if (oscMsg.args[1] < 0.51 || oscMsg.args[1] >= 0.78 || oscMsg.args[0] < 0.67 && trigger[6] == 1){
					$("#eraseWindow7").fadeIn(1500);
					$("#window7").fadeOut(1500);
					document.getElementById('window7').pause();
					trigger[6]=0;
			}

		// Pane 8 (Top Right)
			if(oscMsg.args[1] > 0.78 && oscMsg.args[0] > 0.67 && trigger[7] == 0)
			{
				
					if(swapVideo[7]==true){
						randomVideo("window2");
						swapVideo[7]=false;
					}
					$("#eraseWindow8").fadeOut(1500);
					$("#window8").fadeIn(1500);		
					document.getElementById('window8').play();
					trigger[7]=1;

			} else if (oscMsg.args[1] < 0.78 || oscMsg.args[0] < 0.67 && trigger[7] == 1){
					$("#eraseWindow8").fadeIn(1500);
					$("#window8").fadeOut(1500);
					document.getElementById('window8').pause();
					trigger[7]=0;
			}

		// Pane 9 (Middle Center Right)
			if(oscMsg.args[1] > 0.51 && oscMsg.args[1] <= 0.78 && oscMsg.args[0] >= 0.31 && oscMsg.args[0] <= 0.67 && trigger[8] == 0)
			{
					if(swapVideo[8]==true){
						randomVideo("window2");
						swapVideo[8]=false;
					}
					$("#eraseWindow9").fadeOut(1500);
					$("#window9").fadeIn(1500);		
					document.getElementById('window9').play();
					trigger[8]=1;

			} else if (oscMsg.args[1] < 0.51 || oscMsg.args[1] >= 0.78 || oscMsg.args[0] <= 0.31 || oscMsg.args[0] >= 0.67 && trigger[8] == 1) {
					$("#eraseWindow9").fadeIn(1500);
					$("#window9").fadeOut(1500);
					document.getElementById('window9').pause();
					trigger[8]=0;
			}

		// Pane 10 (Center Right)
			if(oscMsg.args[1] > 0.78 && oscMsg.args[0] >= 0.31 && oscMsg.args[0] <= 0.67 && trigger[9] == 0)
			{
					if(swapVideo[9]==true){
						randomVideo("window2");
						swapVideo[9]=false;
					}
					$("#eraseWindow10").fadeOut(1500);
					$("#window10").fadeIn(1500);
					document.getElementById('window10').play();
					trigger[9]=1;

			} else if (oscMsg.args[1] < 0.78 || oscMsg.args[0] <= 0.31 || oscMsg.args[0] >= 0.67 && trigger[9] == 1){
					$("#eraseWindow10").fadeIn(1500);
					$("#window10").fadeOut(1500);
					document.getElementById('window10').pause();
					trigger[9]=0;
			}

		// Pane 11 (Bottom Center Right)
			if(oscMsg.args[1] > 0.51 && oscMsg.args[1] <= 0.78 && oscMsg.args[0] < 0.31 && trigger[10] == 0)
			{
					if(swapVideo[10]==true){
						randomVideo("window2");
						swapVideo[10]=false;
					}
					$("#eraseWindow11").fadeOut(1500);
					$("#window11").fadeIn(1500);		
					document.getElementById('window11').play();
					trigger[10]=1;

			} else if (oscMsg.args[1] < 0.51 || oscMsg.args[1] >= 0.78 || oscMsg.args[0] > 0.31 && trigger[10] == 1){
					$("#eraseWindow11").fadeIn(1500);
					$("#window11").fadeOut(1500);
					document.getElementById('window11').pause();
					trigger[10]=0;
			}

		// Pane 12 (Bottom Right)
			if(oscMsg.args[1] > 0.78 && oscMsg.args[0] < 0.31 && trigger[11] == 0)
			{
					if(swapVideo[11]==true){
						randomVideo("window2");
						swapVideo[11]=false;
					}
					$("#eraseWindow12").fadeOut(1500);
					$("#window12").fadeIn(1500);		
					document.getElementById('window12').play();
					trigger[11]=1;

			} else if (oscMsg.args[1] < 0.78 || oscMsg.args[0] > 0.31 && trigger[11] == 1){
					$("#eraseWindow12").fadeIn(1500);
					$("#window12").fadeOut(1500);
					document.getElementById('window12').pause();
					trigger[11]=0;
			}

 };




var x = [0,0,0];
var y = [0,0,0];

function updateHTML(oscMsg) {
	

//Finger1
	switch(oscMsg.address){
		case '/1/multixy1/1':
			x[0] = oscMsg.args[0];
			y[0] = oscMsg.args[1];
			var finger1Div = $('#Person1');

			{
				testlocation(oscMsg,'#Person1', 0);
				// colorTrigger = false;
			}

			finger1Div.css("left", oscMsg.args[1]*754-25);	
			finger1Div.css("top",(1-oscMsg.args[0])*380-25);


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