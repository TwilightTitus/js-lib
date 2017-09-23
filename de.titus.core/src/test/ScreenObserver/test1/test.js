(function($) {
	de.titus.core.ScreenObserver.addHandler({
	    "condition" : "true",
	    "callback" : function() {
		    console.log("screen handler", this)
		    $('#screen-data').text("");
		    $('#screen-data').text(JSON.stringify(this));
	    }
	});
})($);
