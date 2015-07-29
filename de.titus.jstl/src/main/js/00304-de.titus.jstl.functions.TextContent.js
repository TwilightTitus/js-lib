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
		var expressionResolver = processor.expressionResolver || new de.titus.jstl.ExpressionResolver();
		var domHelper = processor.domHelper || de.titus.core.DomHelper.getInstance();
		var childCount = domHelper.getChildCount(aElement);
		
		
		
		if(childCount == 0){
			var contentEscaping = domHelper.getAttribute(aElement, processor.config.attributePrefix + "text-content-type");
			var text = domHelper.getText(aElement);
			text = expressionResolver.resolveText(text, aDataContext);
			
			if(contentEscaping == "html" || contentEscaping == "text/html"){
				de.titus.jstl.functions.TextContent.prototype.asHtmlText(text, aElement, domHelper);
			}else {
				de.titus.jstl.functions.TextContent.prototype.asPlainText(text, aElement, domHelper);
			}	
		}
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	de.titus.jstl.functions.TextContent.prototype.asHtmlText = function(aText, aElement, aDomHelper){
		aDomHelper.setHtml(aElement, aText, "replace");
	};
	
	de.titus.jstl.functions.TextContent.prototype.asPlainText = function(aText, aElement, aDomHelper){
		aDomHelper.setText(aElement, aText, "replace");
	};	
});
