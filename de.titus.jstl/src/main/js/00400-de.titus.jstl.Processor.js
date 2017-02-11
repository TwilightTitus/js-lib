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
				Processor.LOGGER.logDebug("execute compute(" + aElement + ", " + aDataContext + ")");
						
			if (!aElement)
				this.element.trigger(de.titus.jstl.Constants.EVENTS.onStart, [this.context, this]);
			if (this.__isProcessable(aElement)){
				this.__appendEvents(aElement);
				this.__computeElement(aElement, aContext);
			}
		};
		
		Processor.prototype.__appendEvents = function(aElement) {
			var element = aElement || this.element;			
			element.one(de.titus.jstl.Constants.EVENTS.onLoad, Processor.STATICEVENTHANDLER.bind(null, element.data("jstlLoad")));
			element.one(de.titus.jstl.Constants.EVENTS.onSuccess, Processor.STATICEVENTHANDLER.bind(null, element.data("jstlSuccess")));
			element.one(de.titus.jstl.Constants.EVENTS.onFail, Processor.STATICEVENTHANDLER.bind(null, element.data("jstlFail")));		
		};		
		
		Processor.prototype.__computeElement = function(aElement, aDataContext) {
			var element = aElement || this.element;
			var dataContext = aDataContext || this.context;
			dataContext.$element = element;
			
			element.trigger(de.titus.jstl.Constants.EVENTS.onLoad, [dataContext, this]);
			var result = this.__executeFunction(element, dataContext);
			if (result.processChilds) {
				
				var ignoreChilds = element.data("jstlIgnoreChilds");
				if (ignoreChilds && ignoreChilds != "")
					ignoreChilds = de.titus.core.SpecialFunctions.doEvalWithContext(ignoreChilds,dataContext, true);
				
				if (ignoreChilds != true && ignoreChilds != "true")
					this.__computeChildren(element, dataContext);
			}
			
			if (element.tagName() == "jstl" && element.contents().length > 0)
				element.replaceWith(element.contents());
			
			element.trigger(de.titus.jstl.Constants.EVENTS.onSuccess, [dataContext, this]);		
			
			if (!aElement)
				$(document).ready(Processor.prototype.onReady.bind(this));			
		};
		
		Processor.prototype.__isProcessable = function(aElement, aContext) {
			var element = aElement || this.element;
			var tagname = element.tagName();
			if (tagname != undefined && tagname == "br")
				return false;			
			
			if (!aElement) {								
				var ignore = element.data("jstlIgnore");
				if (ignore && ignore != "") {
					ignore = de.titus.core.SpecialFunctions.doEvalWithContext(ignore, dataContext, false);
					if (ignore == "" || ignore == true || ignore == "true")
						return false;
				}				
				
				var async = element.data("jstlAsync");
				if (async && async != "") {
					async = de.titus.core.SpecialFunctions.doEvalWithContext(async, dataContext, false);					
					if (async == "" || async == true || async == "true") {
						this.onReady(Processor.prototype.__compute.bind(this, element, aContext || this.context), 1);
						return false;
					}
				}
			}
			
			return true;
		};
		
		Processor.prototype.__executeFunction = function(aElement, aDataContext) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute internalExecuteFunction(" + aElement + ", " + aDataContext + ")");
			
			var functions = de.titus.jstl.FunctionRegistry.getInstance().functions;
			var result = new de.titus.jstl.FunctionResult();
			for (var i = 0; i < functions.length; i++) {
				var functionObject = functions[i];
				if (this.__executing(functionObject, aElement)) {
					var newResult = this.executeFunction(functionObject, aElement, aDataContext, result) || new de.titus.jstl.FunctionResult();
					result.runNextFunction = newResult.runNextFunction && result.runNextFunction;
					result.processChilds = newResult.processChilds && result.processChilds;
					if (!result.runNextFunction)
						return result;
				}
			}
			return result;
		};
		
		Processor.prototype.__computeChildren = /* boolean */function(aElement, aContext) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute __computeChildren(" + aElement + ", " + aContext + ")");
			
			var processor = this;
			aElement.children().each(function(){
				processor.compute($(this), aContext);
			});
		};	
		
		Processor.prototype.__executing = function(aFunction, aElement) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute __executeFunction(" + aFunction + ", " + aElement + ")");
			
			return aElement.data(aFunction.attributeName) != undefined;
		};
		
		Processor.prototype.executeFunction = function(aFunction, aElement, aDataContext, aCurrentFunctionResult) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute executeFunction(" + aFunction + ", " + aElement + ", " + aDataContext + ", " + aCurrentFunctionResult + ")");
			
			var result = aFunction.run(aElement, aDataContext, this);
			if (result != undefined) {
				aCurrentFunctionResult.runNextFunction = aCurrentFunctionResult.runNextFunction && result.runNextFunction;
				aCurrentFunctionResult.processChilds = aCurrentFunctionResult.processChilds && result.processChilds;
			}
			
			return aCurrentFunctionResult;
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
