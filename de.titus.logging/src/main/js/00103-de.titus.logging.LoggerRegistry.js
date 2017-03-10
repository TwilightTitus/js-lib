de.titus.core.Namespace.create("de.titus.logging.LoggerRegistry", function() {
	
	var LoggerRegistry = de.titus.logging.LoggerRegistry = function(){
		this.loggers = {};
	};		
	
	LoggerRegistry.prototype.addLogger = function(aLogger){
		if(aLogger == undefined)
			return;
		
		if(this.loggers[aLogger.name] == undefined)
			this.loggers[aLogger.name] = aLogger;
	};	
	
	LoggerRegistry.prototype.getLogger = function(aLoggerName){
		if(aLoggerName == undefined)
			return;
		
		return this.loggers[aLoggerName];
	};	
	
	
	LoggerRegistry.getInstance = function(){
		if(LoggerRegistry.INSTANCE == undefined)
			LoggerRegistry.INSTANCE = new LoggerRegistry();
		
		return LoggerRegistry.INSTANCE;
	};	
	
});