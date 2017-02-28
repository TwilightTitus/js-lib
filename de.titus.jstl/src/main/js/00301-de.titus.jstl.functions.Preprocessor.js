(function($, GlobalSettings) {
    de.titus.core.Namespace.create("de.titus.jstl.functions.Preprocessor", function() {
	var Preprocessor = de.titus.jstl.functions.Preprocessor = {
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
		var ignore = aElement.attr("jstl-ignore");
		if (ignore && ignore != "")
		    ignore = aProcessor.resolver.resolveExpression(ignore, aContext, false);
		if (ignore == "" || ignore == true || ignore == "true")
		    return aTaskChain.preventChilds().finish();

		var async = aElement.attr("jstl-async");
		if (async && async != "")
		    async = aProcessor.resolver.resolveExpression(async, dataContext, false);
		if (async == "" || async == true || async == "true") {
		    aProcessor.onReady((function(aContext) {
			this.jstlAsync({
			    data : aContext
			});
		    }).bind(aElement, $.extend({}, aContext)));
		    return aTaskChain.preventChilds().finish();
		}

	    }

	    Preprocessor.__appendEvents(aElement);

	    aElement.trigger(de.titus.jstl.Constants.EVENTS.onLoad, [ aContext, aProcessor ]);
	    aTaskChain.nextTask();
	},

	__appendEvents : function(aElement) {
	    if (aElement.attr("jstl-load"))
		aElement.one(de.titus.jstl.Constants.EVENTS.onLoad, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.attr("jstl-load")));
	    if (aElement.attr("jstl-success"))
		aElement.one(de.titus.jstl.Constants.EVENTS.onSuccess, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.attr("jstl-success")));
	}

	};

	de.titus.jstl.TaskRegistry.append("preprocessor", de.titus.jstl.Constants.PHASE.INIT, undefined, de.titus.jstl.functions.Preprocessor.TASK);
    });
})($, de.titus.jstl.GlobalSettings);
