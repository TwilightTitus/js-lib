de.titus.core.Namespace.create("de.titus.logging.ConsolenAppender", function() {
	
	de.titus.logging.ConsolenAppender = function(){
	};
	
	de.titus.logging.ConsolenAppender.prototype = new de.titus.logging.LogAppender();
	de.titus.logging.ConsolenAppender.prototype.constructor = de.titus.logging.ConsolenAppender;
	
	de.titus.logging.ConsolenAppender.prototype.logMessage=  function(aMessage, anException, aLoggerName, aDate, aLogLevel){
		var log = "";
		if(aDate)
			log += log = aDate + " ";
		
		log += "***" + aLogLevel.title + "*** " + aLoggerName + "";
		
		if(aMessage)
			log += " -> " + aMessage + ":";
		if(anException)
			log += anException;
		
		console.log(log);
	};
});