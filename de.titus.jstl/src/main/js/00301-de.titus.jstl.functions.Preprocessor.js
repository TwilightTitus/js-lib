(function($) {
	de.titus.core.Namespace.create("de.titus.jstl.functions.Preprocessor", function() {
		de.titus.jstl.functions.Preprocessor = Preprocessor = {
		LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Preprocessor"),
		
		STATICEVENTHANDLER : function(aExpression, aEvent, aDataContext, aProcessor) {
			if (aExpression && aExpression != "") {
				var eventAction = aProcessor.resolver.resolveExpression(aExpression, aDataContext);
				if (typeof eventAction === "function")
					eventAction(aDataContext.$element, aDataContext, aProcessor);
			}
		},
		
		TASK : function(aElement, aDataContext, aProcessor, aExecuteChain) {
			if (Preprocessor.LOGGER.isDebugEnabled())
				Preprocessor.LOGGER.logDebug("TASK");
			
			var element = aElement || this.element;
			var tagname = element.tagName();
			if (tagname != undefined && tagname == "br")
				return aExecuteChain.preventChilds();
			
			if (!aExecuteChain.root) {
				var ignore = element.data("jstlIgnore");
				if (ignore && ignore != "") {
					ignore = aProcessor.resolver.resolveExpression(ignore, dataContext, false);
					if (ignore == "" || ignore == true || ignore == "true")
						return aExecuteChain.preventChilds();
				}
				
				var async = element.data("jstlAsync");
				if (async && async != "") {
					async = aProcessor.resolver.resolveExpression(async, dataContext, false);
					if (async == "" || async == true || async == "true") {
						aProcessor.onReady(Processor.prototype.__compute.bind(this, element, aContext || this.context), 1);
						return aExecuteChain.preventChilds();
					}
				}
			}
			
			var ignoreChilds = aElement.data("jstlIgnoreChilds");
			if (ignoreChilds && ignoreChilds != "")
				ignoreChilds = aProcessor.resolver.resolveExpression(ignoreChilds, executeChain.context, true);
			
			if (ignoreChilds != true && ignoreChilds != "true")
				aExecuteChain.preventChilds();
			
			Preprocessor.__appendEvents(aElement);
			
			aExecuteChain.nextTask();
			
		},
		
		__appendEvents : function(aElement) {
			aElement.one(de.titus.jstl.Constants.EVENTS.onLoad, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.data("jstlLoad")));
			aElement.one(de.titus.jstl.Constants.EVENTS.onSuccess, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.data("jstlSuccess")));
			aElement.one(de.titus.jstl.Constants.EVENTS.onFail, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.data("jstlFail")));
		}
		
		};
		
	});
})($);
