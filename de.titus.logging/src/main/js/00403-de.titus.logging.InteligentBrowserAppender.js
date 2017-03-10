de.titus.core.Namespace.create("de.titus.logging.InteligentBrowserAppender", function() {
	var InteligentBrowserAppender = de.titus.logging.InteligentBrowserAppender = function() {
		this.appender = undefined;
	};
	
	InteligentBrowserAppender.prototype = new de.titus.logging.LogAppender();
	InteligentBrowserAppender.prototype.constructor =InteligentBrowserAppender;
	
	InteligentBrowserAppender.prototype.getAppender = function() {
		if (this.appender == undefined) {
			var consoleAvalible = console && console.log === "function";
			
			if (consoleAvalible)
				this.appender = new de.titus.logging.ConsolenAppender();
			else if ($(de.titus.logging.HtmlAppender.CONTAINER_QUERY))
				this.appender = new de.titus.logging.HtmlAppender();
			else
				this.appender = new de.titus.logging.MemoryAppender();
		}
		
		return this.appender;
	}

	InteligentBrowserAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel) {
		this.getAppender().logMessage(aMessage, anException, aLoggerName, aDate, aLogLevel);
	};
});
