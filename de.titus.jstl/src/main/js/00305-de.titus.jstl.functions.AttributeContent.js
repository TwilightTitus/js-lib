de.titus.core.Namespace.create("de.titus.jstl.functions.AttributeContent", function() {
	de.titus.jstl.functions.AttributeContent = function() {
	};
	de.titus.jstl.functions.AttributeContent.prototype = new de.titus.jstl.IFunction();
	de.titus.jstl.functions.AttributeContent.prototype.constructor = de.titus.jstl.functions.AttributeContent;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	de.titus.jstl.functions.AttributeContent.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.AttributeContent");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	
	de.titus.jstl.functions.AttributeContent.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (de.titus.jstl.functions.AttributeContent.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.AttributeContent.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		
		var attributes = aElement[0].attributes || {};
		for (name in attributes) {
			if (name.indexOf(processor.config.attributePrefix) != 0) {
				var value = attributes[name];
				if (value != undefined && value != null && value != "" && value != "null") {
					try {
						var newValue = expressionResolver.resolveText(value, aDataContext);
						if (value != newValue) {
							if (de.titus.jstl.functions.AttributeContent.LOGGER.isDebugEnabled()) {
								de.titus.jstl.functions.AttributeContent.LOGGER.logDebug("Change attribute \"" + name + "\" from \"" + value + "\" to \"" + newValue + "\"!");
							}
							aElement.attr(name, newValue);
						}
					} catch (e) {
						de.titus.jstl.functions.AttributeContent.LOGGER.logError("Can't process attribute\"" + name + "\" with value \"" + value + "\"!");
					}
				}
			}
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
});
