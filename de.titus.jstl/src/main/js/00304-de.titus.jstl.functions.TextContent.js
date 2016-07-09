de.titus.core.Namespace.create("de.titus.jstl.functions.TextContent", function() {
	de.titus.jstl.functions.TextContent = function() {
	};
	de.titus.jstl.functions.TextContent.prototype = new de.titus.jstl.IFunction();
	de.titus.jstl.functions.TextContent.prototype.constructor = de.titus.jstl.functions.TextContent;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	de.titus.jstl.functions.TextContent.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.TextContent");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	de.titus.jstl.functions.TextContent.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (de.titus.jstl.functions.TextContent.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.TextContent.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		var ignore = aElement.attr(processor.config.attributePrefix + "text-ignore");
		
		if (ignore != true || ignore != "true") {			
			var contentEscaping = aElement.attr(processor.config.attributePrefix + "text-content-type");
			aElement.contents().filter(function() {
				return this.nodeType === 3 && this.textContent != undefined && this.textContent.trim() != "";
			}).each(function() {
				var node = this;
				var text = node.textContent;
				text = expressionResolver.resolveText(text, aDataContext);
				if (contentEscaping == "html" || contentEscaping == "text/html") {
					$(node).replaceWith(text);
				} else if (contentEscaping == "json" || contentEscaping == "application/json") {
					if (typeof text === "string")
						node.textContent = text;
					else
						node.textContent = JSON.stringify(text);
				} else {
					node.textContent = text;
				}
			});
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
});
