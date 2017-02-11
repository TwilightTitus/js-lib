de.titus.core.Namespace.create("de.titus.jstl.functions.AddAttribute", function() {
	var AddAttribute = function() {};
	AddAttribute.prototype = new de.titus.jstl.IFunction("jstlAddAttribute");
	AddAttribute.prototype.constructor = AddAttribute;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	AddAttribute.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.AddAttribute");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	
	AddAttribute.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (AddAttribute.LOGGER.isDebugEnabled())
			AddAttribute.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.resolver || new de.titus.core.ExpressionResolver();
		
		var expression = aElement.data(this.attributeName);
		if (expression != undefined) {
			
			var expressionResult = expressionResolver.resolveExpression(expression, aDataContext, false);
			
			if (expressionResult != undefined && typeof expressionResult === "function")
				expressionResult = expressionResult(aElement, aDataContext, aProcessor);			
			else if (expressionResult != undefined && typeof expressionResult === "array")
				this.processArray(expressionResult, aElement, aDataContext, processor);
			else
				this.processObject(expressionResult, aElement, aDataContext, processor);
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	AddAttribute.prototype.processArray = function(theDataArray, aElement, aDataContext, aProcessor) {
		for (var i = 0; i < theDataArray.length; i++) {
			this.processObject(theDataArray[i], aElement, aDataContext, aProcessor);
		}
	};
	
	AddAttribute.prototype.processObject = function(theData, aElement, aDataContext, aProcessor) {
		if (theData.name != undefined) {
			aElement.attr(theData.name, theData.value);
		} else {
			AddAttribute.LOGGER.logError("run processObject (" + theData + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ") -> No attribute name defined!");
		}
	};
	
	de.titus.jstl.functions.AddAttribute = AddAttribute;
});
