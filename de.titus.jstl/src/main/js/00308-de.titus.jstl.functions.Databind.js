(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Databind", function() {
		var Databind = de.titus.jstl.functions.Databind = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Databind"),
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Databind.LOGGER.isDebugEnabled())
				    Databind.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var varname = aElement.attr("jstl-databind-name");
			    if (varname && varname.trim() != "") {
				    var value = this.__value(aElement, aDataContext, aProcessor);
				    if (value != undefined)
					    aElement.data(varname, value);
			    }
			    
			    aTaskChain.nextTask();
		    },
		    
		    __value : function(aElement, aDataContext, aProcessor) {
			    return aProcessor.resolver.resolveExpression(aElement.attr("jstl-databind"), aDataContext, undefined);
		    }		
		};
		
		de.titus.jstl.TaskRegistry.append("databind", de.titus.jstl.Constants.PHASE.BINDING, "[jstl-databind]", de.titus.jstl.functions.Databind.TASK);
	});
})($);
