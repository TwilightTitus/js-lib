de.titus.core.Namespace.create("de.titus.logging.MemoryAppender", function() {
	
	window.MEMORY_APPENDER_LOG = new Array();
	
	var MemoryAppender = de.titus.logging.MemoryAppender = function(){};
	
	MemoryAppender.prototype = new de.titus.logging.LogAppender();
	MemoryAppender.prototype.constructor = MemoryAppender;
	
	MemoryAppender.prototype.logMessage=  function(aMessage, anException, aLoggerName, aDate, aLogLevel){		
		var log = {"date": aDate, 
				"logLevel": aLogLevel,
				"loggerName": aLoggerName,
				"message": aMessage,
				"exception": anException
		};
		if(!window.MEMORY_APPENDER_LOG)
			window.MEMORY_APPENDER_LOG = [];
		window.MEMORY_APPENDER_LOG.push(log);
	};
});