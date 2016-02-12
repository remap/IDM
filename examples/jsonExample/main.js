$(window).load(function(){

	//A function for getting and injecting our json data to the html page
	var showJson = function(){
		//jQuery has it's own nice json getter function 
		//"data" will contain our data if the function is successful
		//the file probably needs to be on a localhost or same domain
		$.getJSON("sample.json", function(data){
			//Make an empty array to hold our data items
			var items = [];
			
			//Lets loop over the data as many times as there are individual movies
			//Looking at the json file, you can see that movieDatabase is the outermost object, which contains an indexed array called movies inside
			for(var i = 0; i<data.movieDatabase.movies.length; i++){

				//do something for each movies contained within
				//key is the property name, val is the actual value contained in that property
				$.each(data.movieDatabase.movies[i], function(key, val) {

					//only push list elements into items if it's not a tag key
					if(key != "tags"){
						//add a string containing a formatted list element into items
						items.push( "<li>"+ key + ": " + val + "</li>");

					//if it is a tag, lets do some customize the output so we can see some visual structure
					} else{

						//Make a list element denoting everything that follows is a tag
						items.push("<li>tags : </li>");

						//Lets make a new unordered list
						items.push("<ul>");

						//Loop over the tags key as many times as there are tags
						for(var j = 0; j<val.length; j++){
							//add a string containing a formatted list element (consisting of a tag) into items
							//add id=tagName to each li
							items.push( "<li id='" + val[j].tag + "'>" + val[j].tag + "</li>");
						}
						//close the tag
						items.push("</ul>");
					}
				});

				//make a line break between movies
				items.push("<br />")
			} //end of first loop
			
			//Make a unordered list (ul) 
			$( "<ul/>", {
				//tag the ul with a class="movie"
				"class" : "movie",
				//join all the elements of items into one long string with no spaces and convert to html
				html: items.join( "" )
			//inject these tags into the body of the page
			}).appendTo( $(".dataContainer") );
			
		})
		//jquery's error function just to check if something goes wrong
		.fail(function(error){
			console.log("error");
			console.log(error);
		});

	};

	//do the showjson function if the button get's clicked
	$(".button").click(function(){
		showJson();
	});
});