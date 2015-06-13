var win = Ti.UI.createWindow({
	height: '100%',
	backgroundColor: '#ffffff',
	layout: 'vertical'
});

var topView = Ti.UI.createView({
	top: 0
});

var logoView = Ti.UI.createView({
	bottom: 10,
	height: 50
});




var getLocation = function() {
	
	Ti.Geolocation.purpose = "This application is used to display the weather at your current location.";
	Ti.Geolocation.getCurrentPosition(function(e) {
	
		if(e.error) {
			
			console.log(e.error);
			alert("Unable to Acquire Current Location. Please check network and try again.");
		
		} else {
			
			var locationURL = "http://api.wunderground.com/api/d28a21c2abfd0024/conditions/q/" + e.coords.latitude + "," + e.coords.longitude + ".json";	
			
			var getData = Ti.Network.createHTTPClient();
			
			getData.onload = function(e){
				
		        var json = JSON.parse(this.responseText);  //convert the string to JS object notation
		        
		        // set variables from API response
		       var	city = json.current_observation.display_location.city,
		       		state = json.current_observation.display_location.state,
		        	full = json.current_observation.display_location.full,
		       		forecastURL = json.current_observation.forecast_url,
		        	tempfFull = json.current_observation.temp_f,
		        	tempfDisplay = Math.round(tempfFull),
		        	tempcFull = json.current_observation.temp_c,
		        	tempcDisplay = Math.round(tempcFull),
		        	pullTime = json.current_observation.observation_time,
		        	currentWeather = json.current_observation.weather,
		        	iconImage = json.current_observation.icon_url,
		        	icon = iconImage.replace("/k/","/j/");
		        	
		        // used to display json data
		        // console.log(json.current_observation.display_location.city);

		     }; //getData.onload closing
			
			getData.open("GET", locationURL);
			getData.send();
			
		}
		
	});
	
};


if (Ti.Network.online) {
	
	getLocation();
	
} else {
	
	alert("No Network Found. Please Check you Connection and Try Again.");
	
}



var timeView = Ti.UI.createView({
  top:0,
  width: '100%',
  height: '15%',
  backgroundColor: '#1C1C1C'
});


var label = Ti.UI.createLabel({
  color: '#404040',
  text: 'READY?',
  height: Ti.UI.SIZE,
  textAlign: 'center',
  verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
  font:{
    fontSize: '55sp',
    fontWeight: 'bold'
  }
});

var logo = Ti.UI.createImageView({
	image: 'http://icons.wxug.com/logos/PNG/wundergroundLogo_4c_horz.png',
});

topView.add(label);
logoView.add(logo);

topView.add(logoView);

//timeView.add(label);


win.add(topView); // wunderground logo

win.open();