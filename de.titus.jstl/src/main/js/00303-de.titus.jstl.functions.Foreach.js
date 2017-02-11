(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Foreach", function() {
		var Foreach = function() {
		};
		Foreach.prototype = new de.titus.jstl.IFunction("jstlForeach");
		Foreach.prototype.constructor = Foreach;
		
		/***********************************************************************
		 * static variables
		 **********************************************************************/
		Foreach.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Foreach");
		
		/***********************************************************************
		 * functions
		 **********************************************************************/
		
		Foreach.prototype.run = function(aElement, aDataContext, aProcessor) {
			if (Foreach.LOGGER.isDebugEnabled())
				Foreach.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			
			var expression = aElement.data(this.attributeName);
			if (expression != undefined) {
				this.__compute(expression, aElement, aDataContext, aProcessor, aProcessor.resolver);
				return new de.titus.jstl.FunctionResult(false, false);
			}
			return new de.titus.jstl.FunctionResult(true, true);
		};
		
		Foreach.prototype.__compute = function(aExpression, aElement, aDataContext, aProcessor, anExpressionResolver) {
			if (Foreach.LOGGER.isDebugEnabled())
				Foreach.LOGGER.logDebug("execute __compute(" + aElement + ", " + aDataContext + ", " + aProcessor + ", " + anExpressionResolver + ")");
			
			var tempalte = this.__template(aElement);
			if (tempalte == undefined)
				return;

			aElement.empty();
			
			var varName = aElement.data("jstlForeachVar") || "itemVar";
			var statusName = aElement.data("jstlForeachStatus") || "statusVar";
			var list = anExpressionResolver.resolveExpression(aExpression, aDataContext, aDataContext);
			
			var breakCondition = aElement.data("jstlForeachBreakCondition");
			if (Array.isArray(list))
				this.__list(list, tempalte, varName, statusName, breakCondition, aElement, aDataContext, aProcessor);
			else if (typeof list === "object")
				this.__map(list, tempalte, varName, statusName, breakCondition, aElement, aDataContext, aProcessor);
		};
		
		Foreach.prototype.__list = function(aListData, aTemplate, aVarname, aStatusName, aBreakCondition, aElement, aDataContext, aProcessor) {						
			var startIndex = aProcessor.resolver.resolveExpression(aElement.data("jstlForeachStartIndex"), aDataContext, 0) || 0;
			for (var i = startIndex; i < aListData.length; i++) {
				var newContent = aTemplate.clone();
				var newContext = $.extend({}, aDataContext);
				newContext[aVarname] = aListData[i];
				newContext[aStatusName] = {
				"index" : i,
				"number" : (i + 1),
				"count" : aListData.length,
				"data" : aListData,
				"context" : aDataContext
				};
				if (aBreakCondition != undefined && this.__break(newContext, aBreakCondition, aElement, aProcessor)) {
					return;
				}
				
				this.__computeContent(newContent, newContext, aElement, aProcessor);
			}
		};
		
		Foreach.prototype.__map = function(aMap, aTemplate, aVarname, aStatusName, aBreakCondition, aElement, aDataContext, aProcessor) {			
			var i = 0;
			for ( var name in aMap) {
				var newContent = aTemplate.clone();
				var newContext = jQuery.extend({}, aDataContext);
				newContext[aVarname] = aMap[name];
				newContext[aStatusName] = {
				"index" : i,
				"number" : (i + 1),
				"key" : name,
				"data" : aMap,
				"context" : aDataContext
				};
				
				if (aBreakCondition != undefined && this.__break(newContext, aBreakCondition, aElement, aProcessor))
					return;				
				
				this.__computeContent(newContent, newContext, aElement, aProcessor);
				i++;
			}
		};
		
		Foreach.prototype.__break = function(aContext, aBreakCondition, aElement, aProcessor) {
			var expression = aProcessor.resolver.resolveExpression(aBreakCondition, aContext, false);
			if (typeof expression === "function")
				expression = expression(aElement, aContext, aProcessor);
			
			return expression == true || expression == "true";
		};
		
		Foreach.prototype.__computeContent = function(aNewContent, aNewContext, aElement, aProcessor) {
			aProcessor.compute(aNewContent, aNewContext);
			aElement.append(aNewContent.contents());
		};
		
		Foreach.prototype.__template = function(aElement) {			
			var template = aElement.data("de.titus.jstl.functions.Foreach.Template");
			if(template == undefined){
				template = $("<div>").append(aElement.contents());
				aElement.data("de.titus.jstl.functions.Foreach.Template", template);
			}
			return template;
		};
		
		de.titus.jstl.functions.Foreach = Foreach;
	});
})($);
