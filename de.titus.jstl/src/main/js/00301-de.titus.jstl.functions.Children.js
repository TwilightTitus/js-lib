(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Children", function() {
		var Children = de.titus.jstl.functions.Children = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Children"),
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Children.LOGGER.isDebugEnabled())
			    	Children.LOGGER.logDebug("TASK");
			    
			    
			    if (!aTaskChain.isPreventChilds())
			    	aElement.children().jstl(aContext);
			    
			    aTaskChain.nextTask();
		    }
		};
	});
})($);
