(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Attribute", function() {
		let Attribute = de.titus.jstl.functions.Attribute = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Attribute"),
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Attribute.LOGGER.isDebugEnabled())
				    Attribute.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");

			    let attributes = aElement[0].attributes || [];
			    for (var i = 0; i < attributes.length; i++) {
				    let name = attributes[i].name;
				    if (name.indexOf("jstl-") != 0) {
					    let value = attributes[i].value;
					    if (value != undefined && value != "") {
						    try {
							    let newValue = aProcessor.resolver.resolveText(value, aDataContext);
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
		};

		de.titus.jstl.TaskRegistry.append("attribute", de.titus.jstl.Constants.PHASE.CONTENT, undefined, de.titus.jstl.functions.Attribute.TASK);
	});
})($);
