// file to hold the display view for various element positions

	// create scrollable view
	exports.scrollView = Ti.UI.createScrollView({
		showVerticalScrollIndicator: true,
		width: '90%',
		scrollEnabled: true,
		contentWidth: Ti.UI.FILL,
		layout: 'vertical'		
	});
	
	// create main views for logo placement
	exports.fullView = Ti.UI.createView({
		//height: Ti.UI.FULL,
		top: 0,
		//borderColor: "#0f0",
		//borderWidth: 2,
		//layout: 'vertical'
	});
	
	exports.cityView = Ti.UI.createView({
		top: 0,
		height: 100,
		//borderColor: "#000",
		//borderWidth: 2
		// layout: "vertical"
		
		
	});
	
	exports.dataView = Ti.UI.createView({
		height: Ti.UI.SIZE,
		top: 10,
		layout: "vertical"
		//borderColor: "#000",
		//borderWidth: 2
		
		
	});
	
	exports.logoView = Ti.UI.createView({
		//bottom: 10,
		height: Ti.UI.FILL,
		layout: 'vertical'
	});     
	 
			        
	// create display elements for current conditions
	exports.list = Ti.UI.createLabel({
		  color: '#404040',
		  text: "Random Movie Search",
		  top: 20,
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
	
	// test to call the main page function
	exports.refreshData = function() {
						
			// require our geo elements	
			var movieSearch = require("search");
						
			// run our geo function
			movieSearch.getMovie();
					
	};
	

// export displayElements to other windows
//exports.displayElements = displayElements;
