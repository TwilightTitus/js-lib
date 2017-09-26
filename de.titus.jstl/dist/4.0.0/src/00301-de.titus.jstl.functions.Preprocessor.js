(function($, GlobalSettings) {
	de.titus.core.Namespace.create("de.titus.jstl.functions.Preprocessor", function() {
		let Preprocessor = de.titus.jstl.functions.Preprocessor = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Preprocessor"),

		    STATICEVENTHANDLER : function(aExpression, aEvent, aContext, aProcessor) {
			    if (aExpression && aExpression != "") {
				    var eventAction = aProcessor.resolver.resolveExpression(aExpression, aContext);
				    if (typeof eventAction === "function")
					    eventAction(aContext.$element, aContext, aProcessor);
			    }
		    },

		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Preprocessor.LOGGER.isDebugEnabled())
				    Preprocessor.LOGGER.logDebug("TASK");

			    if (aElement[0].nodeType != 1 || aElement.tagName() == "br")
				    return aTaskChain.preventChilds().finish();

			    if (!aTaskChain.root) {
				    let ignore = aElement.attr("jstl-ignore");
				    if (typeof ignore !== 'undefined') {
					    if (ignore.length > 0)
						    ignore = aProcessor.resolver.resolveExpression(ignore, aContext, false);
					    else
					    	ignore = true;
					    if (ignore)
						    return aTaskChain.preventChilds().finish();
				    }

				    let async = aElement.attr("jstl-async");
				    if (typeof async !== 'undefined') {
					    if (async.length > 0)
						    async = aProcessor.resolver.resolveExpression(async, dataContext, false);
					    else
						    async = true;
					    if (async) {
						    aProcessor.onReady(function() {
						    	aElement.jstlAsync({
								    data : $.extend({}, aContext)
							    });
						    });
						    return aTaskChain.preventChilds().finish();
					    }
				    }

			    }

			    Preprocessor.__appendEvents(aElement);

			    aElement.trigger(de.titus.jstl.Constants.EVENTS.onLoad, [ aContext, aProcessor ]);
			    aTaskChain.nextTask();
		    },

		    __appendEvents : function(aElement) {
			    if (aElement.attr("jstl-load"))
				    aElement.one(de.titus.jstl.Constants.EVENTS.onLoad, function(aEvent, aContext, aProcessor){Preprocessor.STATICEVENTHANDLER(aElement.attr("jstl-load"), aEvent, aContext, aProcessor);});
			    if (aElement.attr("jstl-success"))
				    aElement.one(de.titus.jstl.Constants.EVENTS.onSuccess, function(aEvent, aContext, aProcessor){Preprocessor.STATICEVENTHANDLER(aElement.attr("jstl-success"), aEvent, aContext, aProcessor);});
		    }

		};

		de.titus.jstl.TaskRegistry.append("preprocessor", de.titus.jstl.Constants.PHASE.INIT, undefined, de.titus.jstl.functions.Preprocessor.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
