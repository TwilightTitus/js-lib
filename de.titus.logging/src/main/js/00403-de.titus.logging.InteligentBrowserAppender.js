de.titus.core.Namespace.create("de.titus.logging.InteligentBrowserAppender", function() {	
	de.titus.logging.InteligentBrowserAppender = function(){
		this.appender = undefined;
	};
	
	de.titus.logging.InteligentBrowserAppender.prototype = new de.titus.logging.LogAppender();
	de.titus.logging.InteligentBrowserAppender.prototype.constructor = de.titus.logging.InteligentBrowserAppender;
	
	de.titus.logging.InteligentBrowserAppender.prototype.getAppender = function(){
		if(this.appender == undefined)
		{
			if(console.log)
				this.appender = new de.titus.logging.ConsolenAppender();
			else if(this.domHelper.toDomObject(de.titus.logging.HtmlAppender.CONTAINER_QUERY))
				this.appender = new de.titus.logging.HtmlAppender();
			else
				this.appender = new de.titus.logging.MemoryAppender();
			
			this.appender.domHelper = this.domHelper;
		}
		
		return this.appender;
	}
	
	de.titus.logging.InteligentBrowserAppender.prototype.logMessage=  function(aMessage, anException, aLoggerName, aDate, aLogLevel){		
		this.getAppender().logMessage(aMessage, anException, aLoggerName, aDate, aLogLevel);
	};
});