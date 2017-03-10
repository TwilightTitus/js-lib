(function($) {
	de.titus.core.Namespace.create("de.titus.logging.HtmlAppender", function() {
		
		var HtmlAppender = de.titus.logging.HtmlAppender = function() {};
		
		HtmlAppender.CONTAINER_QUERY = "#log";
		
		HtmlAppender.prototype = new de.titus.logging.LogAppender();
		HtmlAppender.prototype.constructor = HtmlAppender;
		
		HtmlAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel) {
			var container = $(de.titus.logging.HtmlAppender.CONTAINER_QUERY);
			if (container == undefined)
				return;
			
			var log = $("<div />").addClass("log-entry " + aLogLevel.title);
			var logEntry = "";
			if (aDate)
				logEntry += logEntry = this.formatedDateString(aDate) + " ";
			
			logEntry += "***" + aLogLevel.title + "*** " + aLoggerName + "";
			
			if (aMessage)
				logEntry += " -> " + aMessage;
			if (anException)
				logEntry += ": " + anException;
			
			log.text(logEntry);
			container.append(log);
		};
	});
})($);
