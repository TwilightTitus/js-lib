(function($, SpecialFunctions) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.Processor", function() {
		var Processor = function(aElement, aContext) {
			this.element = aElement;
			this.context = aContext || {};
			this.resolver = new de.titus.core.ExpressionResolver(this.element.data("jstlExpressionRegex"));
		};
		
		Processor.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.Processor");
		Processor.STATICEVENTHANDLER = function(aExpression, aEvent, aDataContext, aProcessor) {
			if (aExpression && aExpression != "") {
				var eventAction = aProcessor.resolver.resolveExpression(aExpression, aDataContext);
				if (typeof eventAction === "function")
					eventAction(aDataContext.$element, aDataContext, aProcessor);
			}
		};
		
		Processor.prototype.compute = function(aElement, aContext, aCallback) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute compute(" + aElement + ", " + aContext + ")");
			
			if (!aElement)
				this.element.trigger(de.titus.jstl.Constants.EVENTS.onStart, [
				        this.context, this
				]);
			
			this.__computeElement(aElement, aContext, aCallback);
		};
		
		Processor.prototype.__computeElement = function(aElement, aDataContext) {
			var element = aElement || this.element;
			var dataContext = aDataContext || this.context;
			dataContext.$element = element;
			
			element.trigger(de.titus.jstl.Constants.EVENTS.onLoad, [
			        dataContext, this
			]);
			var taskChain = new de.titus.jstl.TaskChain(element, dataContext, this, !aElement);
			taskChain.nextTask();
			
			if (element.tagName() == "jstl" && element.contents().length > 0)
				element.replaceWith(element.contents());
			
			if (typeof aCallback === "function")
				aCallback(aElement, aDataContext, this);
			
			element.trigger(de.titus.jstl.Constants.EVENTS.onSuccess, [dataContext, this]);
			
			if (!aElement)
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
