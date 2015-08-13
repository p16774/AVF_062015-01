// single application file (can't work the above require elements right)

exports.getMovie = function() {	
	
		
		var buildUI = function(results) {
			
			// parse our string back into an object
			var movieInfo = JSON.parse(results);
			
			
			// logic check - comment out for production
			//console.log(movieInfo);
			
			// create refresh button
			var refreshBtn = Ti.UI.createButton({
				title: 'Choose New Movie',
				systemButton: Ti.UI.iPhone.SystemButtonStyle.BORDERED,
				backgroundColor: '#000',
				color: '#fff',
				font: { fontSize:24 },
				top: 10,
				width: '90%',
				height: 50
			});
			
					
			// require our display elements
			var	displayElements = require("display");
			
			// create window
			var win = Ti.UI.createWindow({
				height: Ti.UI.Fill,
				backgroundColor: '#ffffff',
				fullscreen: false,
				layout: 'vertical'
			});
	        
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
				image: movieInfo.base + movieInfo.poster,
				width: '100%'
			});
			
			refreshBtn.addEventListener('click', function(e) {
				
				// remove all children elements
				displayElements.cityView.remove(movieGenre);
				displayElements.dataView.remove(movieData);
				displayElements.dataView.remove(moviePoster);
				displayElements.scrollView.remove(displayElements.list);
				displayElements.scrollView.remove(refreshBtn);
				displayElements.scrollView.remove(displayElements.cityView);
				displayElements.scrollView.remove(displayElements.dataView);
				displayElements.fullView.remove(displayElements.logoView);
				displayElements.scrollView.remove(displayElements.fullView);
				win.remove(displayElements.scrollView);
				
				// close window before opening a new one
				win.close();
				
				// code to refresh page
				displayElements.refreshData();
			
			});
			
			// add the elements to the display
			displayElements.cityView.add(movieGenre);
			displayElements.dataView.add(movieData);
			displayElements.dataView.add(moviePoster);
			displayElements.scrollView.add(displayElements.list);
			displayElements.scrollView.add(refreshBtn);
			displayElements.scrollView.add(displayElements.cityView);
			displayElements.scrollView.add(displayElements.dataView);
			

			
			// add views to the window
			displayElements.fullView.add(displayElements.logoView);
			displayElements.scrollView.add(displayElements.fullView);
			win.add(displayElements.scrollView);
			//win.add(displayElements.logoView);
			
			// open our window
			win.open();
			
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
		
		
		var randomMovie = function() {
			
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
			
		}; //end the randomMovie function
		
		// run the randomMovie funciton to start the app
		randomMovie();
	
}; // end getLocation function
