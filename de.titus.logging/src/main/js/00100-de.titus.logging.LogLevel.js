de.titus.core.Namespace.create("de.titus.logging.LogLevel", function() {
	
	var LogLevel = de.titus.logging.LogLevel = function(aOrder, aTitle){
		this.order = aOrder;
		this.title = aTitle;
	};
	
	LogLevel.prototype.isIncluded = function(aLogLevel){
		return this.order >= aLogLevel.order;
	};
	
	LogLevel.getLogLevel = function(aLogLevelName){
		if(aLogLevelName == undefined)
			return de.titus.logging.LogLevel.NOLOG;
		
		var levelName = aLogLevelName.toUpperCase();
		return de.titus.logging.LogLevel[levelName];
	};
	
	LogLevel.NOLOG = new LogLevel(0, "NOLOG");
	LogLevel.ERROR = new LogLevel(1, "ERROR");
	LogLevel.WARN 	= new LogLevel(2, "WARN");
	LogLevel.INFO 	= new LogLevel(3, "INFO");
	LogLevel.DEBUG = new LogLevel(4, "DEBUG");
	LogLevel.TRACE = new LogLevel(5, "TRACE");	
});