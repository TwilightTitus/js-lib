(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.If", function() {
		var If = de.titus.jstl.functions.If = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.If"),
		    TASK : function(aElement, aDataContext, aProcessor, aExecuteChain) {
			    if (If.LOGGER.isDebugEnabled())
				    If.LOGGER.logDebug("TASK");
			    
			    var expression = aElement.data("jstlIf");
			    if (expression != undefined) {
				    var expression = aProcessor.resolver.resolveExpression(expression, aDataContext, false);
				    if (typeof expression === "function")
					    expression = expression(aElement, aDataContext, aProcessor);
				    
				    if (!(expression == true || expression == "true")) {
					    aElement.remove();
					    aExecuteChain.preventChilds();
				    } else
					    aExecuteChain.nextTask();
			    } else
				    aExecuteChain.nextTask();
		    }
		};
	});
})($);
