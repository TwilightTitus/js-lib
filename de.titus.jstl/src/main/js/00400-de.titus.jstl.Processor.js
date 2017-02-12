(function($, SpecialFunctions) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.Processor", function() {		
		var Processor = function(aElement, aContext) {
			this.element = aElement;
			this.context = aContext || {};
			this.resolver = new de.titus.core.ExpressionResolver(this.element.data("jstlExpressionRegex"));
		};
		
		Processor.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.Processor");
		Processor.STATICEVENTHANDLER = function(aExpression, aEvent, aDataContext, aProcessor){			
			if(aExpression && aExpression != ""){
				var eventAction = aProcessor.resolver.resolveExpression(aExpression, aDataContext);
				if(typeof eventAction === "function")
					eventAction(aDataContext.$element, aDataContext, aProcessor);
			}
		};
		
		Processor.prototype.compute = function(aElement, aContext) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute compute(" + aElement + ", " + aContext + ")");
						
			if (!aElement)
				this.element.trigger(de.titus.jstl.Constants.EVENTS.onStart, [this.context, this]);
			
			this.__computeElement(aElement, aContext);
		};
		
		Processor.prototype.__computeElement = function(aElement, aDataContext) {
			var element = aElement || this.element;
			var dataContext = aDataContext || this.context;
			dataContext.$element = element;
			
			element.trigger(de.titus.jstl.Constants.EVENTS.onLoad, [dataContext, this]);
			var executeChain = new de.titus.jstl.ExecuteChain(element, dataContext, this, !aElement);
			executeChain.nextTask();
			
			if (executeChain.isPreventChilds())
					this.__computeChildren(element, executeChain.context);
			
			if (element.tagName() == "jstl" && element.contents().length > 0)
				element.replaceWith(element.contents());
			
			element.trigger(de.titus.jstl.Constants.EVENTS.onSuccess, [dataContext, this]);		
			
			if (!aElement)
				$(document).ready(Processor.prototype.onReady.bind(this));			
		};		
		
		Processor.prototype.__computeChildren = function(aElement, aContext) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute __computeChildren(" + aElement + ", " + aContext + ")");
			
			var children = aElement.children() || [];
			for(var i = 0; i < children.length; i++)
				this.compute($(children[i]), aContext);
		};		
		
		
		Processor.prototype.onReady = function(aFunction) {
			if (aFunction) {
				this.element.one(de.titus.jstl.Constants.EVENTS.onReady, function(anEvent) {
					aFunction(anEvent.delegateTarget, anEvent.data);
				});
				return this;
			} else {
				for (var i = 0; i < this.onReadyEvent.length; i++) {
					try {
						this.onReadyEvent[i](this.config.element, this);
					} catch (e) {
						Processor.LOGGER.logError("Error by process an on ready event! -> " + (e.message || e));
					}
				}
				
				this.config.element.trigger(de.titus.jstl.Constants.EVENTS.onReady, this);
			}
		};
		
		de.titus.jstl.Processor = Processor;
	});
})(jQuery, de.titus.core.SpecialFunctions);
