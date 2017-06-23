de.titus.core.Namespace.create("de.titus.logging.ConsolenAppender", function() {
	
	var ConsolenAppender = de.titus.logging.ConsolenAppender = function() {
	};
	
	ConsolenAppender.prototype = new de.titus.logging.LogAppender();
	ConsolenAppender.prototype.constructor = ConsolenAppender;
	
	ConsolenAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel) {
		if (de.titus.logging.LogLevel.NOLOG == aLogLevel)
			return;
		var log = [];
		if (aDate)
			Array.prototype.push.apply(log, [
			        this.formatedDateString(aDate), " "
			]);
		
		Array.prototype.push.apply(log, [
		        "***", aLogLevel.title, "*** ", aLoggerName
		]);
		if (aMessage) {
			log.push(" -> ");
			if (Array.isArray(aMessage))
				Array.prototype.push.apply(log, aMessage);
			else
				log.push(aMessage);
		}
		if (anException)
			Array.prototype.push.apply(log, [
			        ": ", anException
			]);
		
		if (de.titus.logging.LogLevel.ERROR == aLogLevel)
			console.error == undefined ? console.error.apply(console,log) : console.log.apply(console,log);
		else if (de.titus.logging.LogLevel.WARN == aLogLevel)
			console.warn == undefined ? console.warn.apply(console,log) : console.log.apply(console,log);
		else if (de.titus.logging.LogLevel.INFO == aLogLevel)
			console.info == undefined ? console.info.apply(console,log) : console.log.apply(console,log);
		else if (de.titus.logging.LogLevel.DEBUG == aLogLevel)
			console.debug == undefined ? console.debug.apply(console,log) : console.log.apply(console,log);
		else if (de.titus.logging.LogLevel.TRACE == aLogLevel)
			console.trace == undefined ? console.trace.apply(console,log) : console.log.apply(console,log);
		
	};
});
