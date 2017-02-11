de.titus.core.Namespace.create("de.titus.jstl.functions.Databind", function() {
	var Databind = function() {};
	Databind.prototype = new de.titus.jstl.IFunction("jstlDatabind");
	Databind.prototype.constructor = Databind;
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * static variables
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	Databind.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Databind");
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * functions
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	
	Databind.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (Databind.LOGGER.isDebugEnabled())
			Databind.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var expressionResolver = aProcessor.resolver || new de.titus.core.ExpressionResolver();
		
		var varname = this.getVarname(aElement, aDataContext, aProcessor, expressionResolver);
		if (varname != undefined && varname.trim().length != 0) {
			var value = this.getValue(aElement, aDataContext, aProcessor, expressionResolver);
			if(value != undefined)
				aElement.data(varname, value);			
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	Databind.prototype.getVarname = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		return aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-name");
	};
	
	Databind.prototype.getValue = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		var valueString =  aElement.attr(aProcessor.config.attributePrefix + this.attributeName);
		
		return anExpressionResolver.resolveExpression(valueString, aDataContext, undefined);
	};
	
	de.titus.jstl.functions.Databind = Databind;
});
