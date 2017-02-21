(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Eventbind", function() {
		var Eventbind = de.titus.jstl.functions.Eventbind = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Eventbind"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Eventbind.LOGGER.isDebugEnabled())
				    Eventbind.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    if (aElement.attr("jstl-eventbind") != undefined)
				    aElement.de_titus_core_EventBind(aDataContext);
			    
			    aTaskChain.nextTask();
		    }
		
		};
	});
})($);
