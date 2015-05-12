
de.titus.core.Namespace.create("de.titus.logging.LogAppender", function() {
	
	de.titus.logging.LogAppender = function(aDomHelper) {
		this.domHelper = aDomHelper || de.titus.core.DomHelper.getInstance();
	};

	
	/*This need to be Implemented*/
	de.titus.logging.LogAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel){};
});

