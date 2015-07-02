// single application file (can't work the above require elements right)
exports.getLocation = function() {
	
	Ti.Geolocation.purpose = "This application is used to display the weather at your current location.";
	Ti.Geolocation.getCurrentPosition(function(e) {
		
		// require our display elements
		var	displayElements = require("display");
		
		// create variable for our SQLite loop elements
		var conditionObject = "";
		
		// create and open SQLite database while creating the table if one doesn't exist'
		var geoDB = Ti.Database.open('weather');
		var createCheck = geoDB.execute("CREATE TABLE IF NOT EXISTS geoLocate (id INTEGER PRIMARY KEY, city TEXT, state TEXT, full TEXT, forecastURL TEXT, tempfFull INTEGER, tempcFull INTEGER, tempfDisplay TEXT, tempcDisplay TEXT, pullTime TEXT, currentWeather TEXT, iconImage TEXT, visibility TEXT, windDir TEXT, windSpeed TEXT, windGust TEXT, humidity TEXT)");

		var dataVerify = geoDB.execute('SELECT sql FROM sqlite_master WHERE type = "table" AND tbl_name = "geoLocate"');
		
		console.log(JSON.stringify(createCheck) + " this is the create result");
		console.log(JSON.stringify(dataVerify) + "This is the stringify data");
	
		if(e.error) {
			
			/* check for previous data pull and if within the past 6 hours display
			   this can be a setting eventually that allows the user to define when
			   or how old the data needs to be to "clear" the system or display
			   when no network is found */ 
			  
			  //console.log(Ti.App.Properties.getString('oldData'));
			  
			  // clear data for testing purposes only
			  // Ti.App.Properties.setString('oldData', "");
			  
			  // pull data from SQL to verify saved information
			  //dataVerify = geoDB.execute('SELECT * FROM geoLocate WHERE id = 1');
			  dataVerify = geoDB.execute('SELECT sql FROM sqlite_master WHERE type = "table" AND tbl_name = "geoLocate"');
			  
			  console.log(JSON.stringify(dataVerify) + "This is the stringify data");
			  
			 if (!dataVerify.isValidRow()) {
			 	
			 	//console.log(e.error);
			 	alert("Unable to Acquire Current Location. Please check network and try again.");
			 	
			 	var noData = Ti.UI.createLabel({
			 		text: "No Network Found\nPlease Check Network\n\n",
			 		height: Ti.UI.FULL,
			 		top: 150,
			 		textAlign: 'center'
			 	});
			 	
			 	displayElements.fullView.add(noData);
			 	displayElements.logoView.add(displayElements.logo);
			 	displayElements.fullView.add(displayElements.logoView);
			 	win.add(displayElements.fullView);
			 	
			 	// close the database that had no data
			 	geoDB.close();
			 	
			 } else {
			 	
				// pull a new database variable
				var oldData = geoDB.execute('SELECT * FROM geoLocate WHERE id = 1');
				
				console.log(JSON.stringify(oldData) + " this is the data pull data");
			
				//console.log(e.error);
				alert("Unable to Acquire Current Location. Displaying Previous Data.");
				
				// retrieve old data and parse it out
				var currentConditions = JSON.parse(Ti.App.Properties.getString('oldData'));
				
				//console.log(currentConditions);
			
		        // create link to forecast site
		        var forecastLink = Ti.UI.createLabel ({
		        	text: "Click for Full Forecast"
		        });
		        
		        
		        displayElements.logo.addEventListener ('click', function(e) {
		        	// link should open in safari
		        	Ti.Platform.openURL(currentConditions['forecastURL']);
		        });
		        
		        // place values into the app page after data pulled
		        geoCity = Ti.UI.createLabel({
				  color: '#900',
				  font: { fontSize:48 },
				  shadowColor: '#aaa',
				  shadowOffset: {x:3, y:3},
				  shadowRadius: 2,
				  text: currentConditions['full'],
				  //textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				  top: 30,
				  width: Ti.UI.SIZE, 
				  //height: Ti.UI.SIZE
				});
				
				geoDate = Ti.UI.createLabel({
					top: 0,
					text: currentConditions['pullTime']
					
				});
				
				geoData = Ti.UI.createLabel({
					//top: -50,
					left: 10,
					right: 10,
					text: "Current Temp: " + currentConditions['tempfDisplay'] + "\xB0F/"
						+ currentConditions['tempcDisplay'] + "\xB0C\n" 
						+ "Humidity: " + currentConditions['humidity'] + "\n"
						+ currentConditions['currentWeather'] + "\n"
						+ "Visibility: " + currentConditions['visibility'] + " miles\n"
						+ "Winds out of the " + currentConditions['windDir'] + " at "
						+ currentConditions['windSpeed'] + " mph with gusts up to "
						+ currentConditions['windGust'] + " mph\n\n"
					
					 
					//textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
					
					
					
				});
				
				// currentConditions icon
				geoImage = Ti.UI.createImageView ({
					image: currentConditions['iconImage']
					
					
				});
				
				// add the elements to the display
				displayElements.cityView.add(geoCity);
				displayElements.dataView.add(geoDate);
				displayElements.dataView.add(geoImage);
				displayElements.dataView.add(geoData);
				displayElements.dataView.add(forecastLink);
				displayElements.logoView.add(displayElements.logo);
				displayElements.fullView.add(displayElements.list);
				displayElements.fullView.add(displayElements.dataView);
				

				
				// add views to the window
				win.add(displayElements.cityView);
				displayElements.fullView.add(displayElements.dataView);
				displayElements.fullView.add(displayElements.logoView);
				win.add(displayElements.fullView);
				//win.add(displayElements.logoView);
			
			}; //close if/else statement determining previous data
		
		} else {
			
				// pull a new database variable
				var oldData = geoDB.execute('SELECT * FROM geoLocate WHERE id = 1');
				
				console.log("This is the old data" + oldData);
						
			var locationURL = "http://api.wunderground.com/api/d28a21c2abfd0024/conditions/q/" + e.coords.latitude + "," + e.coords.longitude + ".json";	
			
			var getData = Ti.Network.createHTTPClient();
			
			getData.onload = function(e){
				
		        var json = JSON.parse(this.responseText);  //convert the string to JS object notation
		        
		        //console.log(json);
		        
		        // set variables from API response
		        var currentConditions = {
		        	
		       			id: 1, // set to only hold one past data
		       			city: json.current_observation.display_location.city,
		       			state: json.current_observation.display_location.state,
		        		full: json.current_observation.display_location.full,
		       			forecastURL: json.current_observation.forecast_url,
		        		tempfFull: json.current_observation.temp_f,
		        		tempfDisplay: Math.round(json.current_observation.temp_f),
		        		tempcFull: json.current_observation.temp_c,
		        		tempcDisplay: Math.round(json.current_observation.temp_c),
		        		pullTime: json.current_observation.observation_time,
		        		currentWeather: json.current_observation.weather,
		        		iconImage: json.current_observation.icon_url.replace("/k/","/j/"),
		        		visibility: json.current_observation.visibility_mi,
		        		windDir: json.current_observation.wind_dir,
		        		windSpeed: json.current_observation.wind_mph,
		        		windGust: json.current_observation.wind_gust_mph,
		        		humidity: json.current_observation.relative_humidity
		        		
		        	};
		        	



		        
		        // loops through object and insert into SQLite
		        for (var key in currentConditions) {
		        	
		        	if (currentConditions.hasOwnProperty(key)) {
		        		
		        		// shorten value of object property
		        		var obj = currentConditions[key];
		        		   						
          				// for testing output of loop
          				// console.log(key + " = " + obj);
          				
          				// encapsulate the variable
          				//var pattern = new RegExp(","),
          				//	objTest = pattern.test(obj);
          					
          					conditionObject = conditionObject + ",'" + obj + "'";
          					
          				/*if (objTest === true) {
          					
          					//console.log("this is true for " + obj);
          					
          					// add encapsulation to the variable if a comma is found
          					conditionObject = conditionObject + ",\"" + obj + "\"";
          					
          				} else {
          				
          					// add values to our object for SQLite insertion for all other variables
          					conditionObject = conditionObject + "," + obj;
          					
          				};*/ // end for/else statement to find commas
          						
          			};
          		};
          		
          		// remove the preceeding comma
          		while (conditionObject.charAt(0) === ",") {
          			conditionObject = conditionObject.substr(1);
          		};
          		
          		// testing purposes of conditionObject
          		console.log(conditionObject);
          		
          		// determine if this is a first time data save or if we need to update previous info
          		var dataCheck = geoDB.execute('SELECT FROM geoLocate WHERE id = 1');
          		
          		console.log(dataCheck);
          		
          		if (!dataCheck) {
          			
          			console.log("no data found");
          		
          			// take loops variable and insert into database
          			var insertStatement = geoDB.execute('INSERT INTO geoLocate VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', '1','Sunnyvale','CA','Sunnyvale, CA','http://www.wunderground.com/US/CA/Sunnyvale.html','81.2','81','27.3','27','Last Updated on July 1, 5:45 PM PDT','Mostly Cloudy','http://icons.wxug.com/i/c/j/mostlycloudy.gif','10.0','NE','2','5.0','37%');
          			
          			console.log(insertStatement + " insert here");
          			
          			//console.log(statement);
          			
          			var validateCheck = geoDB.execute('SELECT * FROM geoLocate');
          			
          			console.log(validateCheck + " this is the validation check"); 
          			
          			// close database
          			geoDB.close();      	
          				        			
          		} else {
          			
          			console.log("data found and removed");
          			
          			// delete data from the table to update to new info and remove empty space
          			geoDB.execute('DELETE FROM geoLocate');
          			geoDB.execute('VACUUM');
          		
          			// take loops variable and insert into database
          			geoDB.execute('INSERT INTO geoLocate VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', conditionObject); 
          			
          			// close database
          			geoDB.close();
          			
          		};	        	
          				        	
          				        	
		        // save data and clear past information in local storage
		        //Ti.App.Properties.setString('oldData', "");
		        //Ti.App.Properties.setString('oldData', JSON.stringify(currentConditions));
		        			        	
		        // used to display json data
		        // console.log(json.current_observation.display_location.city)
		        
		        // create link to forecast site
		        var forecastLink = Ti.UI.createLabel ({
		        	text: "Click for Full Forecast"
		        });
		        
		        
		        displayElements.logo.addEventListener ('click', function(e) {
		        	// link should open in safari
		        	Ti.Platform.openURL(currentConditions['forecastURL']);
		        });
		        
		        // place values into the app page after data pulled
		        geoCity = Ti.UI.createLabel({
				  color: '#900',
				  font: { fontSize:48 },
				  shadowColor: '#aaa',
				  shadowOffset: {x:3, y:3},
				  shadowRadius: 2,
				  text: currentConditions['full'],
				  //textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				  top: 30,
				  width: Ti.UI.SIZE, 
				  //height: Ti.UI.SIZE
				});
				
				geoDate = Ti.UI.createLabel({
					top: 0,
					text: currentConditions['pullTime']
					
				});
				
				geoData = Ti.UI.createLabel({
					//top: -50,
					left: 10,
					right: 10,
					text: "Current Temp: " + currentConditions['tempfDisplay'] + "\xB0F/"
						+ currentConditions['tempcDisplay'] + "\xB0C\n" 
						+ "Humidity: " + currentConditions['humidity'] + "\n"
						+ currentConditions['currentWeather'] + "\n"
						+ "Visibility: " + currentConditions['visibility'] + " miles\n"
						+ "Winds out of the " + currentConditions['windDir'] + " at "
						+ currentConditions['windSpeed'] + " mph with gusts up to "
						+ currentConditions['windGust'] + " mph\n\n"
					
					 
					//textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
					
					
					
				});
				
				// currentConditions icon
				geoImage = Ti.UI.createImageView ({
					image: currentConditions['iconImage']
					
					
				});
				
				// add the elements to the display
				displayElements.cityView.add(geoCity);
				displayElements.dataView.add(geoDate);
				displayElements.dataView.add(geoImage);
				displayElements.dataView.add(geoData);
				displayElements.dataView.add(forecastLink);
				displayElements.logoView.add(displayElements.logo);
				displayElements.fullView.add(displayElements.list);
				displayElements.fullView.add(displayElements.dataView);
				

				
				// add views to the window
				win.add(displayElements.cityView);
				displayElements.fullView.add(displayElements.dataView);
				displayElements.fullView.add(displayElements.logoView);
				win.add(displayElements.fullView);
				//win.add(displayElements.logoView);
				
		        	
		     }; //getData.onload closing
			
			// setup and run data pull for current location
			getData.open("GET", locationURL);
			getData.send();

			// close database
			geoDB.close();
			
		}; // end if/else statement
		
	});	// end Ti.Geolocation.getCurrentPosition
	
}; // end getLocation function
