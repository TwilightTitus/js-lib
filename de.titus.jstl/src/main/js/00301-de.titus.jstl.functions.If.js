(function($) {
	de.titus.core.Namespace.create("de.titus.jstl.functions.If", function() {
		var If = function() {};
		If.prototype = new de.titus.jstl.IFunction("jstlIf");
		If.prototype.constructor = If;
		
		If.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.If");
		
		If.prototype.run = function(aElement, aDataContext, aProcessor) {
			if (If.LOGGER.isDebugEnabled())
				If.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			
			var expression = aElement.data(this.attributeName);
			if (expression != undefined) {
				var expression = aProcessor.resolver.resolveExpression(expression, aDataContext, false);
				if (typeof expression === "function")
					expression = expression(aElement, aDataContext, aProcessor);
				
				if (!(expression == true || expression == "true")) {
					aElement.remove();
					return new de.titus.jstl.FunctionResult(false, false);
				}
			}
			
			return new de.titus.jstl.FunctionResult(true, true);
		};
		
		de.titus.jstl.functions.If = If;		
	});
})($);
