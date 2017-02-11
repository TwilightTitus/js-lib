de.titus.core.Namespace.create("de.titus.jstl.functions.AttributeContent", function() {
	var AttributeContent = function() {
	};
	AttributeContent.prototype = new de.titus.jstl.IFunction();
	AttributeContent.prototype.constructor = AttributeContent;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	AttributeContent.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.AttributeContent");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	
	AttributeContent.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (AttributeContent.LOGGER.isDebugEnabled())
			AttributeContent.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var attributes = aElement[0].attributes || [];
		for (var i = 0; i < attributes.length; i++) {
			var name = attributes[i].name;
			if (name.indexOf("data-jstl-") != 0) {
				var value = attributes[i].value;
				if (value != undefined && value != "") {
					try {
						var newValue = aProcessor.resolver.resolveText(value, aDataContext);
						if (value != newValue) {
							if (AttributeContent.LOGGER.isDebugEnabled()) {
								AttributeContent.LOGGER.logDebug("Change attribute \"" + name + "\" from \"" + value + "\" to \"" + newValue + "\"!");
							}
							aElement.attr(name, newValue);
						}
					} catch (e) {
						AttributeContent.LOGGER.logError("Can't process attribute\"" + name + "\" with value \"" + value + "\"!");
					}
				}
			}
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	de.titus.jstl.functions.AttributeContent = AttributeContent;
});
