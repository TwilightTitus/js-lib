de.titus.core.Namespace.create("de.titus.jstl.functions.TextContent", function() {	
	de.titus.jstl.functions.TextContent = function(){}; 
	de.titus.jstl.functions.TextContent.prototype = new de.titus.jstl.IFunction();
	de.titus.jstl.functions.TextContent.prototype.constructor = de.titus.jstl.functions.TextContent;
	
	/****************************************************************
	 * static variables
	 ***************************************************************/
	de.titus.jstl.functions.TextContent.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.TextContent");
	
	/****************************************************************
	 * functions
	 ***************************************************************/	
	de.titus.jstl.functions.TextContent.prototype.run = function(aElement, aDataContext, aProcessor){
		if (de.titus.jstl.functions.TextContent.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.TextContent.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver;
		var domHelper = processor.domHelper || new de.titus.core.DomHelper();
		var childCount = domHelper.getChildCount(aElement);
		
		
		if(childCount == 0){
			var text = domHelper.getText(aElement);
			text = expressionResolver.resolveText(text, aDataContext);
			
			domHelper.setText(aElement, text, "replace");
		}
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
});