(function($) {
	de.titus.core.Namespace.create("de.titus.jstl.Processor", function() {
		
		/**
		 * <code>
		 * config: {
		 * "element": element,
		 * "data": dataContext,
		 * "expressionRegex": expressionRegex,
		 * "onLoad": function(){},
		 * "onSuccess":function(){},
		 * "onFail": function(){},
		 * "attributePrefix" : "jstl-" 
		 * }
		 * </code>
		 */
		de.titus.jstl.Processor = function(aConfig) {
			
			this.config = {
			"element" : undefined,
			"data" : {},
			"attributePrefix" : "jstl-",
			"expressionRegex" : undefined
			};
			
			this.config = $.extend(true, this.config, aConfig);
			var expressionRegex = this.config.element.attr(this.config.attributePrefix + "expression-regex");
			if (expressionRegex != undefined && expressionRegex != "")
				this.config.expressionRegex = expressionRegex;
			
			this.expressionResolver = new de.titus.core.ExpressionResolver(this.config.expressionRegex);
			
			this.onReadyEvent = new Array();
		};
		
		/******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
		 * static variables
		 *****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
		de.titus.jstl.Processor.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.Processor");
		
		/******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
		 * functions
		 *****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
		
		de.titus.jstl.Processor.prototype.compute = /* boolean */function(aElement, aDataContext) {
			if (de.titus.jstl.Processor.LOGGER.isDebugEnabled())
				de.titus.jstl.Processor.LOGGER.logDebug("execute compute(" + (aElement.prop("tagName") || aElement) + ", " + aDataContext + ")");
			if (aElement == undefined)
				return this.internalComputeRoot();
			
			if (!this.isElementProcessable(aElement)) {
				return true;
			}
			
			var events = this.getEvents(aElement) || {};
			return this.internalComputeElement(aElement, aDataContext, events, false);
		};
		
		de.titus.jstl.Processor.prototype.internalComputeRoot = /* boolean */function() {
			var events = this.getEvents(this.config.element) || {};
			if (this.config.onLoad)
				events.onLoad = this.config.onLoad;
			if (this.config.onSuccess)
				events.onSuccess = this.config.onSuccess;
			if (this.config.onFail)
				events.onFail = this.config.onFail;
			return this.internalComputeElement(this.config.element, this.config.data, events, true);
		};
		
		de.titus.jstl.Processor.prototype.internalComputeElement = /* boolean */function(aElement, aDataContext, theEvents, isRoot) {
			var dataContext = aDataContext || this.config.data;			
			if (!isRoot) {
				var ignore = aElement.attr(this.config.attributePrefix + "ignore");
				if (ignore != undefined && ignore != "")
					ignore = de.titus.core.SpecialFunctions.doEvalWithContext(ignore, aDataContext, false);
				
				if (ignore == true || ignore == "true") {
					return true;
				}
			}
		
			
			if (theEvents.onLoad != undefined && typeof theEvents.onLoad === "function")
				theEvents.onLoad(aElement, aDataContext, this);
			aElement.trigger(de.titus.jstl.Constants.EVENTS.onLoad, aDataContext);
			
			var processResult = true;
			var childprocessing = aElement.attr(this.config.attributePrefix + "processor-child-processing") || aElement.attr(this.config.attributePrefix + "ignore-childs");
			if (childprocessing != undefined && childprocessing != "")
				childprocessing = de.titus.core.SpecialFunctions.doEvalWithContext(childprocessing, aDataContext, false);
			
			var result = this.internalExecuteFunction(aElement, dataContext);
			if ((childprocessing == "true" || childprocessing == true) && result.processChilds)
				this.internalComputeChilds(aElement, dataContext);
			
			if (aElement.tagName() == "jstl" && aElement.contents().length > 0)
				aElement.replaceWith(aElement.contents());
			
			if (processResult) {
				if (theEvents.onSuccess != undefined && typeof theEvents.onSuccess === "function")
					theEvents.onSuccess(aElement, aDataContext, this);
				aElement.trigger(de.titus.jstl.Constants.EVENTS.onSuccess, aDataContext);
			} else if (theEvents.onFail != undefined && typeof theEvents.onFail === "function") {
				theEvents.onFail(aElement, aDataContext, this);
				aElement.trigger(de.titus.jstl.Constants.EVENTS.onFail, aDataContext);
			}
			
			if (isRoot) {
				var processor = this;
				$(document).ready(function() {
					processor.onReady();
				});
			}
			
			return processResult;
		};
		
		de.titus.jstl.Processor.prototype.isElementProcessable = function(aElement) {
			var tagname = aElement.tagName();
			if (tagname != undefined) {
				if (tagname == "br")
					return false;
				
				return true;
			}
			return false;
		};
		
		de.titus.jstl.Processor.prototype.internalExecuteFunction = /* boolean */function(aElement, aDataContext) {
			if (de.titus.jstl.Processor.LOGGER.isDebugEnabled())
				de.titus.jstl.Processor.LOGGER.logDebug("execute internalExecuteFunction(" + aElement + ", " + aDataContext + ")");
			
			var functions = de.titus.jstl.FunctionRegistry.getInstance().functions;
			var result = new de.titus.jstl.FunctionResult();
			for (var i = 0; i < functions.length; i++) {
				var functionObject = functions[i];
				var executeFunction = this.isFunctionNeeded(functionObject, aElement);
				if (executeFunction) {
					var newResult = this.executeFunction(functionObject, aElement, aDataContext, result) || new de.titus.jstl.FunctionResult();
					result.runNextFunction = newResult.runNextFunction && result.runNextFunction;
					result.processChilds = newResult.processChilds && result.processChilds;
					if (!result.runNextFunction)
						return result;
				}
			}
			return result;
		};
		
		de.titus.jstl.Processor.prototype.internalComputeChilds = /* boolean */function(aElement, aDataContext) {
			if (de.titus.jstl.Processor.LOGGER.isDebugEnabled())
				de.titus.jstl.Processor.LOGGER.logDebug("execute internalComputeChilds(" + aElement + ", " + aDataContext + ")");
			
			var childs = aElement.children();
			if (childs == undefined)
				return true;
			
			var processor = this;
			var result = true;
			childs.each(function() {
				if (result && !processor.compute($(this), aDataContext))
					result = false;
			});
			
			return result;
			
		};
		
		de.titus.jstl.Processor.prototype.getEvents = function(aElement) {
			var events = {};
			
			var onLoad = aElement.attr(this.config.attributePrefix + "load");
			var onSuccess = aElement.attr(this.config.attributePrefix + "success");
			var onFail = aElement.attr(this.config.attributePrefix + "fail");
			
			if (onLoad != null)
				events.onLoad = this.expressionResolver.resolveExpression(onLoad, {});
			if (onSuccess != null)
				events.onSuccess = this.expressionResolver.resolveExpression(onSuccess, {});
			if (onFail != null)
				events.onFail = this.expressionResolver.resolveExpression(onFail, {});
			
			return events;
		};
		
		de.titus.jstl.Processor.prototype.isFunctionNeeded = function(aFunction, aElement) {
			if (de.titus.jstl.Processor.LOGGER.isDebugEnabled())
				de.titus.jstl.Processor.LOGGER.logDebug("execute isFunctionNeeded(" + aFunction + ", " + aElement + ")");
			
			var executeFunction = true;
			if (aFunction.attributeName != undefined && aFunction.attributeName != "") {
				var expression = aElement.attr(this.config.attributePrefix + aFunction.attributeName);
				executeFunction = expression !== undefined;
			}
			
			return executeFunction;
		};
		
		de.titus.jstl.Processor.prototype.executeFunction = function(aFunction, aElement, aDataContext, aCurrentFunctionResult) {
			if (de.titus.jstl.Processor.LOGGER.isDebugEnabled())
				de.titus.jstl.Processor.LOGGER.logDebug("execute executeFunction(" + aFunction + ", " + aElement + ", " + aDataContext + ", " + aCurrentFunctionResult + ")");
			
			var result = aFunction.run(aElement, aDataContext, this);
			if (result != undefined) {
				aCurrentFunctionResult.runNextFunction = aCurrentFunctionResult.runNextFunction && result.runNextFunction;
				aCurrentFunctionResult.processChilds = aCurrentFunctionResult.processChilds && result.processChilds;
			}
			
			return aCurrentFunctionResult;
		};
		
		de.titus.jstl.Processor.prototype.onReady = function(aFunction) {
			if (aFunction) {
				// this.onReadyEvent.push(aFunction);
				this.config.element.on(de.titus.jstl.Constants.EVENTS.onReady, function(anEvent) {
					aFunction(anEvent.delegateTarget, anEvent.data);
				});
				return this;
			} else {
				for (var i = 0; i < this.onReadyEvent.length; i++) {
					try {
						this.onReadyEvent[i](this.config.element, this);
					} catch (e) {
						de.titus.jstl.Processor.LOGGER.logError("Error by process an on ready event! -> " + (e.message || e));
					}
				}
				
				this.config.element.trigger(de.titus.jstl.Constants.EVENTS.onReady, this);
			}
		};
	});
})(jQuery);
