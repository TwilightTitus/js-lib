de.titus.core.Namespace.create("de.titus.logging.ConsolenAppender", function() {
	
	var ConsolenAppender = de.titus.logging.ConsolenAppender = function() {};
	
	ConsolenAppender.prototype = new de.titus.logging.LogAppender();
	ConsolenAppender.prototype.constructor = ConsolenAppender;
	
	ConsolenAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel) {
		if (de.titus.logging.LogLevel.NOLOG == aLogLevel)
			return;
		var log = "";
		if (aDate)
			log += log = this.formatedDateString(aDate) + " ";
		
		log += "***" + aLogLevel.title + "*** " + aLoggerName + "";
		
		if (aMessage)
			log += " -> " + aMessage;
		if (anException)
			log += ": " + anException;
		
		if (de.titus.logging.LogLevel.ERROR == aLogLevel)
			console.error == undefined ? console.error(log) : console.log(log);
		else if (de.titus.logging.LogLevel.WARN == aLogLevel)
			console.warn == undefined ? console.warn(log) : console.log(log);
		else if (de.titus.logging.LogLevel.INFO == aLogLevel)
			console.info == undefined ? console.info(log) : console.log(log);
		else if (de.titus.logging.LogLevel.DEBUG == aLogLevel)
			console.debug == undefined ? console.debug(log) : console.log(log);
		else if (de.titus.logging.LogLevel.TRACE == aLogLevel)
			console.trace == undefined ? console.trace(log) : console.log(log);
		
	};
});
