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
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();		
		
		if(aElement.children() == undefined || aElement.children().length == 0){
			var contentEscaping = aElement.attr(processor.config.attributePrefix + "text-content-type");
			var text = aElement.text();
			text = expressionResolver.resolveText(text, aDataContext);
			if(contentEscaping == "html" || contentEscaping == "text/html"){
				aElement.html(text);
			}
			else if(contentEscaping == "json" || contentEscaping == "application/json"){
				aElement.html(text);
			}else {
				aElement.text(text);
			}	
		}
		return new de.titus.jstl.FunctionResult(true, true);
	};	
});
