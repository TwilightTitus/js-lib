(function($) {
	de.titus.core.Namespace.create("de.titus.jstl.functions.If", function() {
		de.titus.jstl.functions.If = If = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.If"),
		    TASK : function(aElement, aDataContext, aProcessor, aExecuteChain) {
			    if (If.LOGGER.isDebugEnabled())
				    If.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.data(this.attributeName);
			    if (expression != undefined) {
				    var expression = aProcessor.resolver.resolveExpression(expression, aDataContext, false);
				    if (typeof expression === "function")
					    expression = expression(aElement, aDataContext, aProcessor);
				    
				    if (!(expression == true || expression == "true")) {
					    aElement.remove();
					    aExecuteChain.preventChilds();
				    } else
					    aExecuteChain.nextTask();
			    }
		    }
		};
	});
})($);
