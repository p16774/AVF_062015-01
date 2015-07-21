// file to hold the display view for various element positions

	
	// create main views for logo placement
	exports.fullView = Ti.UI.createView({
		//height: Ti.UI.FULL,
		top: 0,
		//borderColor: "#0f0",
		//borderWidth: 2,
		layout: "vertical"
	});
	
	exports.cityView = Ti.UI.createView({
		height: 100,
		//borderColor: "#000",
		//borderWidth: 2
		//layout: "vertical"
		
		
	});
	
	exports.dataView = Ti.UI.createView({
		height: Ti.UI.SIZE,
		top: -110,
		layout: "vertical",
		//borderColor: "#000",
		//borderWidth: 2
		
		
	});
	
	exports.logoView = Ti.UI.createView({
		bottom: 10,
		height: Ti.UI.FILL
	});     
	 
			        
	// create display elements for current conditions
	exports.list = Ti.UI.createLabel({
		  color: '#404040',
		  text: "Random Movie Search",
		  top: 0,
		  height: 20,
		  textAlign: 'left',
		  verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
		  font:{
		    fontSize: '18sp',
		    fontWeight: 'bold'
		  },
		  //borderColor: "#000",
		  //borderWidth: 3
	});
	

// export displayElements to other windows
//exports.displayElements = displayElements;

