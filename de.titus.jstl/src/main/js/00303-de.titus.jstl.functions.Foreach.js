de.titus.core.Namespace.create("de.titus.jstl.functions.Foreach", function() {
	var Foreach = function() {};
	Foreach.prototype = new de.titus.jstl.IFunction("foreach");
	Foreach.prototype.constructor = Foreach;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	Foreach.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Foreach");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	
	Foreach.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (Foreach.LOGGER.isDebugEnabled())
			Foreach.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			this.internalProcession(expression, aElement, aDataContext, processor, expressionResolver);
			return new de.titus.jstl.FunctionResult(false, false);
		}
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	Foreach.prototype.internalProcession = function(aExpression, aElement, aDataContext, aProcessor, anExpressionResolver) {
		if (Foreach.LOGGER.isDebugEnabled())
			Foreach.LOGGER.logDebug("execute processList(" + aElement + ", " + aDataContext + ", " + aProcessor + ", " + anExpressionResolver + ")");
		
		var tempalte = this.getRepeatableContent(aElement);
		aElement.empty();
		if (tempalte == undefined)
			return;
		
		var varName = this.getVarname(aElement, aProcessor);
		var statusName = this.getStatusName(aElement, aProcessor);
		var list = undefined;
		if (aExpression == "") {
			Foreach.LOGGER.logWarn("No list data specified. Using the data context!");
			list = aDataContext;
		} else
			list = anExpressionResolver.resolveExpression(aExpression, aDataContext, new Array());
		
		var breakCondition = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-break-condition");
		if (list != undefined && (typeof list === "array" || list.length != undefined)) {
			this.processList(list, tempalte, varName, statusName, breakCondition, aElement, aDataContext, aProcessor, anExpressionResolver);
		} else if (list != undefined) {
			this.processMap(list, tempalte, varName, statusName, breakCondition, aElement, aDataContext, aProcessor, anExpressionResolver);
		}
	};
	
	Foreach.prototype.processList = function(aListData, aTemplate, aVarname, aStatusName, aBreakCondition, aElement, aDataContext, aProcessor, anExpressionResolver) {
		if (aListData == undefined || aListData.length == undefined || aListData.length < 1)
			return;
		
		var startIndex = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-start-index") || 0;
		startIndex = anExpressionResolver.resolveExpression(startIndex, aDataContext, 0) || 0;
		for (var i = startIndex; i < aListData.length; i++) {
			var newContent = $("<div>").html(aTemplate);
			var newContext = jQuery.extend({}, aDataContext);
			newContext[aVarname] = aListData[i];
			newContext[aStatusName] = {
			"index" : i,
			"number" : (i + 1),
			"count" : aListData.length,
			"data" : aListData,
			"context" : aDataContext
			};
			if (aBreakCondition != undefined && this.processBreakCondition(newContext, aBreakCondition, aElement, aProcessor)) {
				return;
			}
			
			this.processNewContent(newContent, newContext, aElement, aProcessor);
			newContext[aVarname] = undefined;
			newContext[aStatusName] = undefined;
		}
	};
	
	Foreach.prototype.processMap = function(aMap, aTemplate, aVarname, aStatusName, aBreakCondition, aElement, aDataContext, aProcessor, anExpressionResolver) {
		var count = 0;
		for ( var name in aMap)
			count++;
		
		var i = 0;
		for ( var name in aMap) {
			var newContent = $("<div>").html(aTemplate);
			var newContext = jQuery.extend({}, aDataContext);
			newContext[aVarname] = aMap[name];
			newContext[aStatusName] = {
			"index" : i,
			"number" : (i + 1),
			"key": name,
			"count" : count,
			"data" : aMap,
			"context" : aDataContext
			};
			
			if (aBreakCondition != undefined && this.processBreakCondition(newContext, aBreakCondition, aElement, aProcessor)) {
				return;
			}
			
			i++;
			this.processNewContent(newContent, newContext, aElement, aProcessor);
			newContext[aVarname] = undefined;
			newContext[aStatusName] = undefined;
		}
	};
	
	Foreach.prototype.processBreakCondition = function(aContext, aBreakCondition, aElement, aProcessor) {
		var expressionResolver = aProcessor.expressionResolver || new de.titus.jstl.ExpressionResolver();
		var expressionResult = expressionResolver.resolveExpression(aBreakCondition, aContext, false);
		if (typeof expressionResult === "function")
			expressionResult = expressionResult(aElement, aContext, aProcessor);
		
		return expressionResult == true || expressionResult == "true";
	};
	
	Foreach.prototype.processNewContent = function(aNewContent, aNewContext, aElement, aProcessor) {		
		aProcessor.compute(	aNewContent, aNewContext);
		aElement.append(aNewContent.contents());
	};
	
	Foreach.prototype.getVarname = function(aElement, aProcessor) {
		var varname = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-var");
		if (varname == undefined)
			return "itemVar";
		
		return varname;
	};
	
	Foreach.prototype.getStatusName = function(aElement, aProcessor) {
		var statusName = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-status");
		if (statusName == undefined)
			return "statusVar";
		
		return statusName;
	};
	
	Foreach.prototype.getRepeatableContent = function(aElement) {
		return aElement.html();
	};
	
	de.titus.jstl.functions.Foreach = Foreach;
});
