// single application file (can't work the above require elements right)

exports.getMovie = function() {
	
		
		var buildUI = function(results) {
			
			// parse our string back into an object
			var movieInfo = JSON.parse(results);
			
			
			// logic check - comment out for production
			//console.log(movieInfo);
			
					
			// require our display elements
			var	displayElements = require("display");
	        
	        // place values into the app page after data pulled
	        movieGenre = Ti.UI.createLabel({
			  color: '#900',
			  font: { fontSize:48 },
			  shadowColor: '#aaa',
			  shadowOffset: {x:3, y:3},
			  shadowRadius: 2,
			  text: movieInfo['genre'],
			  //textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			  top: 30,
			  width: Ti.UI.SIZE, 
			  //height: Ti.UI.SIZE
			});
			
			movieTitle = Ti.UI.createLabel({
				top: 0,
				text: movieInfo['title']
				
			});
			
			movieData = Ti.UI.createLabel({
				//top: -50,
				left: 10,
				right: 10,
				text: "\nTitle: " + movieInfo.title + "\n"
					+ "Language: " + movieInfo.language + "\n"
					+ "Release Date: " + movieInfo.date + "\n"
					+ "Genre: " + movieInfo.genre + "\n\n"
					+ "Overview: " + movieInfo.overview	+ "\n"
			});
			
			moviePoster = Ti.UI.createImageView({
				image: movieInfo.base + movieInfo.poster
			});
			
			
			// add the elements to the display
			displayElements.cityView.add(movieGenre);
			displayElements.dataView.add(movieTitle);
			displayElements.dataView.add(movieData);
			displayElements.logoView.add(moviePoster);
			displayElements.fullView.add(displayElements.list);
			displayElements.fullView.add(displayElements.dataView);
			

			
			// add views to the window
			win.add(displayElements.cityView);
			displayElements.fullView.add(displayElements.dataView);
			displayElements.fullView.add(displayElements.logoView);
			win.add(displayElements.fullView);
			//win.add(displayElements.logoView);
			
			
		};
		
		var read = function() {
			
			// pull all data
			var movieDB = Ti.Database.open('movies');
			var movieRead = movieDB.execute("SELECT * FROM randomMovie");
			
			
			// logic check - comment out for production
			//console.log("This is the rowCount " + movieRead.rowCount);
			
			
			while (movieRead.isValidRow()) {
				
				buildUI(movieRead.fieldByName('movie'));
				movieRead.next();
				
			};
			
			movieRead.close();
			movieDB.close();
			
		};
		
		var save = function(movieData) {
			
			var data = movieData;
			
			// create and open SQLite database while creating the table if one doesn't exist'
			var movieDB = Ti.Database.open('movies');
			movieDB.execute("CREATE TABLE IF NOT EXISTS randomMovie (id INTEGER PRIMARY KEY, movie TEXT)");
			
			// empty database
			movieDB.execute("DELETE FROM randomMovie");
			movieDB.execute("VACUUM");
			movieDB.execute("INSERT INTO randomMovie (movie) VALUES (?)", JSON.stringify(data));
			
			
			// logic checking - comment out for production
			//var rowID = movieDB.lastInsertRowId;
	        //console.log("This is the row ID " + rowID);
	        
	        // close the movieDB call
			movieDB.close();
			
			// read data to build the UI
			read();
			
		};
		
		// pull in our display elements page
		var displayElements = require('display');
		
		// create variable for our SQLite loop elements
		var conditionObject;
		
		// pull the genre ids
		var searchURL = "http://api.themoviedb.org/3/genre/movie/list?api_key=d18ca777adaacbbb6cf589285c402ed7";
		var pulledGenre = {};
		var getMovies = Ti.Network.createHTTPClient();
		
		getMovies.onload = function(e){
			
			// parse the data and count the number of genres pulled
	        var json = JSON.parse(this.responseText);	        
	        var length = json.genres.length;
	        
	        // randomize our pull to make the app "discover" new movies
	        var randID = Math.floor(Math.random() * length) + 0;
	        var genreID = json.genres[randID].id;
	        
	        // pull the name of the genre to display
	        var genreName = json.genres[randID].name;
	        
	        // push items into variable
	        var pulledGenre = {
	        	id: genreID,
	        	name: genreName
	        };
						
			var movieURL = "http://api.themoviedb.org/3/discover/movie?api_key=d18ca777adaacbbb6cf589285c402ed7&with_genres=" + pulledGenre.id;	
			
			var getData = Ti.Network.createHTTPClient();
			
			getData.onload = function(e){
				
		        var movieData = JSON.parse(this.responseText);  //convert the string to JS object notation
		        var movieLength = movieData.results.length;
		        
		        // pull a random movie title from the random genre
		        var movieResult = Math.floor(Math.random() * movieLength) + 0;
		        var movieName = movieData.results[movieResult].original_title;
		        
		        
		        // logic check - comment out for production
		        //console.log(movieData.results[movieResult]);
		        
		        
		        // set variables from API response
		        var movieData = {
		        
		       			movieID: movieData.results[movieResult].id,
		       			language: movieData.results[movieResult].original_language,
		        		title: movieData.results[movieResult].title,
		       			overview: movieData.results[movieResult].overview,
		        		backdrop: movieData.results[movieResult].backdrop_path,
		        		date: movieData.results[movieResult].release_date,
		        		genre: pulledGenre.name,
		        		poster: movieData.results[movieResult].poster_path,
		        		base: "http://image.tmdb.org/t/p/w500"
		        			        		
		        	};
		        	

          		// save the pulled data to the SQLite database and build the UI
          		save(movieData);		
		        	
		     }; //getData.onload closing
			
			// setup and run data pull for current location
			getData.open("GET", movieURL);
			getData.send(); 
			
			
		};
			
		// setup and run data pull for current location
		getMovies.open("GET", searchURL);
		getMovies.send();
	
}; // end getLocation function