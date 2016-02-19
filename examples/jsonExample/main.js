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
				items.push("<br />");
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

	//lets make a generic search function that takes a json file and a term to look for
	//this function will only search in the tags object of the json file
	function searchJson(jsonFile, searchTerm){

		//empty array for the items we find matching our term
		var foundItems = [];

		//lets use the ajax function this time instead of the convenience method "getJson"
		//ajax takes a number of different parameters
		$.ajax({
			url:jsonFile,
			dataType: 'json',
			async: false, // very important, without this set to false, nothing will be returned.
			success: function(data){

				//loop over the data and do something for ever movie
				for(var i = 0; i<data.movieDatabase.movies.length; i++){

					//loop over the tags array and do something for every tag
					for(var j = 0; j<data.movieDatabase.movies[i].tags.length; j++){

						//check to make sure the tag matches our search term
						if(data.movieDatabase.movies[i].tags[j].tag == searchTerm){

							//if it matches, put it in our found array!
							foundItems.push(data.movieDatabase.movies[i]);
						}
					}
				}

			},
			//alert us if there is an error 
			error: function(e){
				console.log("error");
				console.log(e);
			}
		});
		
		//lets get the found matches back out of the function
		return foundItems;
	}

	//do the showjson function if the button get's clicked
	$(".button").click(function(){
		showJson();
	});



	//same as above.
	$("#coolMoviesOnly").click(function(){

		//call the search json function and search for the term cool
		var found  = searchJson("sample.json", "cool");

		var items = [];
		for( var i = 0; i<found.length; i++){
			//html formatting stuff, essentially the same code as above
			$.each(found[i], function(key, val){
				if (key != "tags") {
					items.push( "<li><b>"+ key + "</b>: " + val + "</li>");
					items.push("<br />");
				} else {
					items.push("<li><b>tags</b> : </li>");
						items.push("<ul>");
						for(var j = 0; j<val.length; j++){
							items.push( "<li class='tagName' id='" + val[j].tag + "'>" + val[j].tag + "</li>");
						}
						items.push("</ul>");
				}
			});
			items.push("<hr />")
		}
		//push the formatted html back to the page, also same as above.
		$( "<ul/>", {
				"class" : "movie",
				html: items.join( "" )
			}).appendTo( $("#coolMoviesOnly") );
	});

});