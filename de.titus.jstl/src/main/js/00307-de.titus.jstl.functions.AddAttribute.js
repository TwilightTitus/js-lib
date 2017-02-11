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
		
		var expression = aElement.data(this.attributeName);
		if (expression) {			
			expression = aProcessor.resolver.resolveExpression(expression, aDataContext, false);			
			if (expression && typeof expression === "function")
				expression = expression(aElement, aDataContext, aProcessor);			
			
			if (expression && Array.isArray(expression))
				this.processArray(expression, aElement, aDataContext, aProcessor);
			else if (expression && typeof expression === "object")
				this.processObject(expression, aElement, aDataContext, aProcessor);
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	AddAttribute.prototype.processArray = function(theDataArray, aElement, aDataContext, aProcessor) {
		for (var i = 0; i < theDataArray.length; i++) {
			this.processObject(theDataArray[i], aElement, aDataContext, aProcessor);
		}
	};
	
	AddAttribute.prototype.processObject = function(theData, aElement, aDataContext, aProcessor) {
		if (theData.name)
			aElement.attr(theData.name, theData.value);
		else
			AddAttribute.LOGGER.logError("run processObject (" + theData + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ") -> No attribute name defined!");
	};
	
	de.titus.jstl.functions.AddAttribute = AddAttribute;
});
