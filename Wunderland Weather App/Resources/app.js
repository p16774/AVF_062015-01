/* Wunderland weather app so named because I misread the Weather Underground API information
 * Developed and tested by Nathan Wharry for Advanced Visual Framework class 201506 section 01
 * Under the direction of Professor Jennifer McCarrick
 * Using the Titanium Framework for construction in both iOS and Android platforms.
 */


// create window
var win = Ti.UI.createWindow({
	height: Ti.UI.FILL,
	backgroundColor: '#ffffff',
	layout: 'vertical'
});


// check network and run geo functions
if (Ti.Network.online) {

	// require our geo elements	
	var geoElements = require("geo");
	
	// run our geo function
	geoElements.getLocation();
	
	
} else {
	
	alert("No Network Found. Please Check you Connection and Try Again.");
	
};

// open our window
win.open();