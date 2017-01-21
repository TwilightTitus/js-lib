(function() {
	de.titus.core.Namespace.create("de.titus.jstl.functions.If", function() {
		var If = function() {};
		If.prototype = new de.titus.jstl.IFunction("if");
		If.prototype.constructor = If;
		
		/***********************************************************************
		 * static variables
		 **********************************************************************/
		If.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.If");
		
		If.prototype.run = /* boolean */function(aElement, aDataContext, aProcessor) {
			if (If.LOGGER.isDebugEnabled())
				If.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			
			var processor = aProcessor || new de.titus.jstl.Processor();
			var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
			
			var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
			if (expression != undefined) {
				var expressionResult = expressionResolver.resolveExpression(expression, aDataContext, false);
				if (typeof expressionResult === "function")
					expressionResult = expressionResult(aElement, aDataContext, aProcessor);
				
				expressionResult = expressionResult == true || expressionResult == "true";
				if (!expressionResult) {
					aElement.remove();
					return new de.titus.jstl.FunctionResult(false, false);
				}
			}
			
			return new de.titus.jstl.FunctionResult(true, true);
		};
		
		de.titus.jstl.functions.If = If;
		
	});
})();
