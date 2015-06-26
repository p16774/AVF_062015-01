// create window


var win = Ti.UI.createWindow({
	height: Ti.UI.FULL,
	backgroundColor: '#ffffff',
	layout: 'vertical'
});


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