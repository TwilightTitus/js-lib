de.titus.core.Namespace.create("de.titus.logging.HtmlAppender", function() {
	
	
	
	de.titus.logging.HtmlAppender = function(){
	};
	
	de.titus.logging.HtmlAppender.CONTAINER_QUERY = "#log";
	
	de.titus.logging.HtmlAppender.prototype = new de.titus.logging.LogAppender();
	de.titus.logging.HtmlAppender.prototype.constructor = de.titus.logging.HtmlAppender;
	
	de.titus.logging.HtmlAppender.prototype.logMessage=  function(aMessage, anException, aLoggerName, aDate, aLogLevel){
		var container = this.domHelper.toDomObject(de.titus.logging.HtmlAppender.CONTAINER_QUERY);
		if(container == undefined)
			return;
		
		var log = '<div class="log-entry ' + aLogLevel.title + '">';
		if(aDate)
			log += log = aDate + " ";
		
		log += "***" + aLogLevel.title + "*** " + aLoggerName + "";
		
		if(aMessage)
			log += " -> " + aMessage + ":";
		if(anException)
			log += anException;
		
		log += "</div>";
		
		this.domHelper.setHtml(container, log, "append");
	};
});