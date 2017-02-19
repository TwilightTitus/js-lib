(function($, SpecialFunctions) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.Processor", function() {
		var Processor = function(aElement, aContext) {
			this.element = aElement;
			this.context = aContext || {};
			this.resolver = new de.titus.core.ExpressionResolver(this.element.data("jstlExpressionRegex"));
		};
		
		Processor.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.Processor");
		Processor.STATICEVENTHANDLER = function(aExpression, aEvent, aContext, aProcessor) {
			if (aExpression && aExpression != "") {
				var eventAction = aProcessor.resolver.resolveExpression(aExpression, aContext);
				if (typeof eventAction === "function")
					eventAction(aContext.$element, aContext, aProcessor);
			}
		};
		
		Processor.prototype.compute = function(aElement, aContext, aCallback) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute compute(" + aElement + ", " + aContext + ")");			
			  if (!aElement)
				    this.element.trigger(de.titus.jstl.Constants.EVENTS.onStart, [
				           aContext, this
				    ]);
			this.__computeElement(aElement, aContext, aCallback);
		};
		
		Processor.prototype.__computeElement = function(aElement, aContext, aCallback) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("__computeElement() -> root: " + !aElement);
			var element = aElement || this.element;
			var context = aContext || this.context;
			context.$element = element;
			var root =  !aElement;
			
			
			var taskChain = new de.titus.jstl.TaskChain(element, context, this, root, Processor.prototype.__computeFinished.bind(this, element, context, root, aCallback));
			taskChain.nextTask();
			
			
		};
		
		Processor.prototype.__computeFinished = function(aElement, aContext, isRoot, aCallback) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("__computeFinished() -> is root: " + isRoot);
			
			if (aElement.tagName() == "jstl" && aElement.contents().length > 0)
				aElement.replaceWith(aElement.contents());
			
			if (typeof aCallback === "function")
				aCallback(aElement, aContext, this, isRoot);
			
			aElement.trigger(de.titus.jstl.Constants.EVENTS.onSuccess, [aContext, this]);
			
			if (isRoot)
				this.onReady();
		};
		
		
		Processor.prototype.onReady = function(aFunction) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("onReady()");
			
			if (aFunction) {
				this.element.one(de.titus.jstl.Constants.EVENTS.onReady, function(anEvent) {
					aFunction(anEvent.delegateTarget, anEvent.data);
				});
				return this;
			} else
				$(document).ready((function(aProcessor){
					aProcessor.element.trigger(de.titus.jstl.Constants.EVENTS.onReady, [aProcessor]);
				}).bind(null, this));
				
		};
		
		de.titus.jstl.Processor = Processor;
	});
})(jQuery, de.titus.core.SpecialFunctions);
