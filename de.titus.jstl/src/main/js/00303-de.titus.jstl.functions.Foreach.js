de.titus.core.Namespace.create("de.titus.jstl.functions.Foreach", function() {	
	de.titus.jstl.functions.Foreach = function(){}; 
	de.titus.jstl.functions.Foreach.prototype = new de.titus.jstl.IFunction("foreach");
	de.titus.jstl.functions.Foreach.prototype.constructor = de.titus.jstl.functions.Foreach;
	
	/****************************************************************
	 * static variables
	 ***************************************************************/
	de.titus.jstl.functions.Foreach.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Foreach");

	/****************************************************************
	 * functions
	 ***************************************************************/
	
	de.titus.jstl.functions.Foreach.prototype.run = function(aElement, aDataContext, aProcessor){
		if (de.titus.jstl.functions.Foreach.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Foreach.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.jstl.ExpressionResolver();
		var domHelper = processor.domHelper || new de.titus.core.DomHelper();
		
		var expression = domHelper.getAttribute(aElement, processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			
			this.processChilds(aElement, aDataContext, processor, expressionResolver, domHelper);
			return new de.titus.jstl.FunctionResult(true, false);
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
});
