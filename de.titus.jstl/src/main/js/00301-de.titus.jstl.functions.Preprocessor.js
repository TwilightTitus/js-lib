(function($) {
	de.titus.core.Namespace.create("de.titus.jstl.functions.Preprocessor", function() {
		de.titus.jstl.functions.Preprocessor = Preprocessor = {
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
			    
			    var tagname = aElement.tagName();
			    if (tagname != undefined && tagname == "br")
				    aTaskChain.preventChilds().finish();
			    
			    if (!aTaskChain.root) {
				    var ignore = aElement.attr("jstl-ignore");
				    if (ignore && ignore != "") {
					    ignore = aProcessor.resolver.resolveExpression(ignore, aContext, false);
					    if (ignore == "" || ignore == true || ignore == "true")
						    aTaskChain.preventChilds().finish();
				    }
				    
				    var async = aElement.attr("jstl-async");
				    if (async && async != "") {
					    async = aProcessor.resolver.resolveExpression(async, dataContext, false);
					    if (async == "" || async == true || async == "true")
						    aProcessor.onReady(Processor.prototype.__compute.bind(aProcessor, aElement, aContext));
					    aTaskChain.preventChilds().finish();
				    }
			    }
			    
			    Preprocessor.__appendEvents(aElement);
			    
			    aElement.trigger(de.titus.jstl.Constants.EVENTS.onLoad, [ aContext, aProcessor]);
			    
			    aTaskChain.nextTask();
			    
		    },
		    
		    __appendEvents : function(aElement) {
			    if (aElement.attr("jstl-load"))
				    aElement.one(de.titus.jstl.Constants.EVENTS.onLoad, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.attr("jstl-load")));
			    if (aElement.attr("jstl-success"))
				    aElement.one(de.titus.jstl.Constants.EVENTS.onSuccess, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.attr("jstl-success")));
			    if (aElement.attr("jstl-fail"))
				    aElement.one(de.titus.jstl.Constants.EVENTS.onFail, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.attr("jstl-fail")));
		    }
		
		};
		
		de.titus.jstl.TaskRegistry.append("preprocessor", de.titus.jstl.Constants.PHASE.INIT, undefined, de.titus.jstl.functions.Preprocessor.TASK);
	});
})($);
