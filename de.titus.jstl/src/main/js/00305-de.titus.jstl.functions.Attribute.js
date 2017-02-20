(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Attribute", function() {
		var Attribute = de.titus.jstl.functions.Attribute = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Attribute"),
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Attribute.LOGGER.isDebugEnabled())
				    Attribute.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var attributes = aElement[0].attributes || [];
			    for (var i = 0; i < attributes.length; i++) {
				    var name = attributes[i].name;
				    if (name.indexOf("jstl-") != 0) {
					    var value = attributes[i].value;
					    if (value != undefined && value != "") {
						    try {
							    var newValue = aProcessor.resolver.resolveText(value, aDataContext);
							    if (value != newValue) {
								    if (Attribute.LOGGER.isDebugEnabled()) {
									    Attribute.LOGGER.logDebug("Change attribute \"" + name + "\" from \"" + value + "\" to \"" + newValue + "\"!");
								    }
								    aElement.attr(name, newValue);
							    }
						    } catch (e) {
							    Attribute.LOGGER.logError("Can't process attribute\"" + name + "\" with value \"" + value + "\"!");
						    }
					    }
				    }
			    }
			    
			    aTaskChain.nextTask();
		    }
		}
	});
})($);
