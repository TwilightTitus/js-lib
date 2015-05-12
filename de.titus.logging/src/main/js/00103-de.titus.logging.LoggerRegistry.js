de.titus.core.Namespace.create("de.titus.logging.LoggerRegistry", function() {
	
	de.titus.logging.LoggerRegistry = function(){
		this.loggers = {};
	};		
	
	de.titus.logging.LoggerRegistry.prototype.addLogger = function(aLogger){
		if(aLogger == undefined)
			return;
		
		if(this.loggers[aLogger.name] == undefined)
			this.loggers[aLogger.name] = aLogger;
	};	
	
	de.titus.logging.LoggerRegistry.prototype.getLogger = function(aLoggerName){
		if(aLoggerName == undefined)
			return;
		
		return this.loggers[aLoggerName];
	};	
	
	
	de.titus.logging.LoggerRegistry.getInstance = function(){
		if(de.titus.logging.LoggerRegistry.INSTANCE == undefined)
			de.titus.logging.LoggerRegistry.INSTANCE = new de.titus.logging.LoggerRegistry();
		
		return de.titus.logging.LoggerRegistry.INSTANCE;
	};	
	
});