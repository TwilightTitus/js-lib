de.titus.core.Namespace.create("de.titus.jstl.functions.AttributeContent", function() {	
	de.titus.jstl.functions.AttributeContent = function(){}; 
	de.titus.jstl.functions.AttributeContent.prototype = new de.titus.jstl.IFunction();
	de.titus.jstl.functions.AttributeContent.prototype.constructor = de.titus.jstl.functions.AttributeContent;
	
	/****************************************************************
	 * static variables
	 ***************************************************************/
	de.titus.jstl.functions.AttributeContent.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.AttributeContent");

	/****************************************************************
	 * functions
	 ***************************************************************/
	
	de.titus.jstl.functions.AttributeContent.prototype.run = function(aElement, aDataContext, aProcessor){
		if (de.titus.jstl.functions.AttributeContent.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.AttributeContent.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.jstl.ExpressionResolver();
		var domHelper = processor.domHelper || de.titus.core.DomHelper.getInstance();
		
		var attributes = domHelper.getAttributes(aElement);
		for (var name in attributes) {
			if (name.indexOf(processor.config.attributePrefix) != 0) {
				var value = attributes[name];
				value = expressionResolver.resolveText(value, aDataContext);
				domHelper.setAttribute(aElement, name, value);
			}
		}
		
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
});
