de.titus.core.Namespace.create("de.titus.jstl.functions.Data", function() {
	var Data = function() {};
	Data.prototype = new de.titus.jstl.IFunction("jstlData");
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
		
		var expression = aElement.data(this.attributeName);
		if (expression)
			this.__compute(expression, aElement, aDataContext, aProcessor);
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	Data.prototype.__compute = function(anExpression, aElement, aDataContext, aProcessor) {
		var varname = aElement.data("jstlDataVar");
		var mode = aElement.data("jstlDataMode") || "direct";
		this[mode].call(this, anExpression, aElement, varname, aDataContext, aProcessor);
	};
	
	Data.prototype.__options = function(aElement, aDataContext, aProcessor) {
		var options = aElement.data("jstlDataOptions");
		if (options) {
			options = aProcessor.resolver.resolveText(options, aDataContext);
			options = aProcessor.resolver.resolveExpression(options, aDataContext);
			return options || {};
		}		
		return {};
	};	
	
	Data.prototype["direct"] = function(anExpression, aElement, aVarname, aDataContext, aProcessor) {
		var newData = aProcessor.resolver.resolveExpression(anExpression, aDataContext);
		this.__data(newData, aVarname, aDataContext, aProcessor);
	};
	
	Data.prototype["remote"] = function(anExpression, aElement, aVarname, aDataContext, aProcessor) {		
		var url = aProcessor.resolver.resolveText(anExpression, aDataContext);
		var option = this.__options(aElement, aDataContext, aProcessor);
		var dataType = aElement.data("jstlDataDatatype") || "json";
		
		var ajaxSettings = {
		'url' : de.titus.core.Page.getInstance().buildUrl(url),
		'async' : false,
		'cache' : false,
		'dataType' : dataType
		};
		ajaxSettings = $.extend(ajaxSettings, option);
		var $__THIS__$ = this;
		ajaxSettings.success = function(newData) {
			var data = newData;
			if(dataType.toLowerCase() == "xml")
				data = de.titus.core.Converter.xmlToJson(newData);			
			$__THIS__$.__data(data, aVarname, aDataContext, aProcessor);
		};
		
		$.ajax(ajaxSettings);
	};
	
	Data.prototype["url-parameter"] = function(anExpression, aElement, aVarname, aDataContext, aProcessor) {
		var parameterName = aProcessor.resolver.resolveText(anExpression, aDataContext);
		var value = de.titus.core.Page.getInstance().getUrl().getParameter(parameterName);
		this.__data(value, aVarname, aDataContext, aProcessor);
	};
	
	Data.prototype.__data = function(aNewData, aVarname, aDataContext, aProcessor) {
		if (Data.LOGGER.isDebugEnabled())
			Data.LOGGER.logDebug("execute __data(" + aNewData + ", " + aVarname + ", " + aDataContext + ", " + aProcessor + ")");
		if (!aVarname)
			$.extend(true, aDataContext, aNewData);
		else
			aDataContext[aVarname] = aNewData;
	};
	
	de.titus.jstl.functions.Data = Data;
});
