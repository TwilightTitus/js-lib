(function($, GlobalSettings) {
	de.titus.core.Namespace.create("de.titus.jstl.functions.PostProcessor", function() {
		var PostProcessor = de.titus.jstl.functions.PostProcessor = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.PostProcessor"),		    
		    
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (PostProcessor.LOGGER.isDebugEnabled())
				    PostProcessor.LOGGER.logDebug("TASK");			    
			    
			    
			    aElement.trigger(de.titus.jstl.Constants.EVENTS.onSuccess, [ aContext, aProcessor ]);
			    aTaskChain.next();			    
		    }		
		};
		
		de.titus.jstl.TaskRegistry.append("PostProcessor", de.titus.jstl.Constants.PHASE.FINISH, undefined, de.titus.jstl.functions.PostProcessor.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
