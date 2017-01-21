de.titus.core.Namespace.create("de.titus.jstl.functions.Data", function() {
	var Data = function() {};
	Data.prototype = new de.titus.jstl.IFunction("data");
	Data.prototype.constructor = Data;
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * static variables
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	Data.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Data");
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * functions
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	
	Data.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (Data.LOGGER.isDebugEnabled())
			Data.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			this.internalProcessing(expression, aElement, aDataContext, processor, expressionResolver);
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	Data.prototype.internalProcessing = function(anExpression, aElement, aDataContext, aProcessor, anExpressionResolver) {
		var varname = this.getVarname(aElement, aDataContext, aProcessor, anExpressionResolver);
		var mode = this.getMode(aElement, aProcessor, anExpressionResolver);
		if (this[mode] != undefined && typeof this[mode] === "function")
			this[mode].call(this, anExpression, aElement, varname, aDataContext, aProcessor, anExpressionResolver);
		else
			this["direct"].call(this, anExpression, aElement, varname, aDataContext, aProcessor, anExpressionResolver);
	};
	
	Data.prototype.getOptions = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		var options = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-options");
		if (options != undefined) {
			options = anExpressionResolver.resolveText(options, aDataContext);
			options = anExpressionResolver.resolveExpression(options, aDataContext);
			return options || {};
		}
		
		return {};
	};
	
	Data.prototype.getMode = function(aElement, aProcessor, anExpressionResolver) {
		return aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-mode") || "direct";
	};
	
	Data.prototype.getVarname = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		return aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-var");
	};
	
	Data.prototype["direct"] = function(anExpression, aElement, aVarname, aDataContext, aProcessor, anExpressionResolver) {
		var newData = anExpressionResolver.resolveExpression(anExpression, aDataContext);
		this.addNewData(newData, aVarname, aDataContext, aProcessor, anExpressionResolver);
	};
	
	Data.prototype["remote"] = function(anExpression, aElement, aVarname, aDataContext, aProcessor, anExpressionResolver) {		
		var $__THIS__$ = this;		
		var url = anExpressionResolver.resolveText(anExpression, aDataContext);
		var option = this.getOptions(aElement, aDataContext, aProcessor, anExpressionResolver);
		var dataType = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-datatype") || "json";
		
		var ajaxSettings = {
		'url' : de.titus.core.Page.getInstance().buildUrl(url),
		'async' : false,
		'cache' : false,
		'dataType' : dataType
		};
		ajaxSettings = $.extend(ajaxSettings, option);
		ajaxSettings.success = function(newData) {
			var data = newData;
			if(dataType.toLowerCase() == "xml")
				data = de.titus.core.Converter.xmlToJson(newData);			
			$__THIS__$.addNewData(data, aVarname, aDataContext, aProcessor, anExpressionResolver);
		};
		
		$.ajax(ajaxSettings);
	};
	
	Data.prototype["url-parameter"] = function(anExpression, aElement, aVarname, aDataContext, aProcessor, anExpressionResolver) {
		var parameterName = anExpressionResolver.resolveText(anExpression, aDataContext);
		var value = de.titus.core.Page.getInstance().getUrl().getParameter(parameterName);
		this.addNewData(value, aVarname, aDataContext, aProcessor, anExpressionResolver);
	};
	
	Data.prototype.addNewData = function(aNewData, aVarname, aDataContext, aProcessor, anExpressionResolver) {
		if (Data.LOGGER.isDebugEnabled())
			Data.LOGGER.logDebug("execute addNewData(" + aNewData + ", " + aVarname + ", " + aDataContext + ", " + aProcessor + ", " + anExpressionResolver + ")");
		if (aVarname == undefined) {
			$.extend(true, aDataContext, aNewData);
		} else {
			aDataContext[aVarname] = aNewData;
		}
	};
	
	de.titus.jstl.functions.Data = Data;
});
