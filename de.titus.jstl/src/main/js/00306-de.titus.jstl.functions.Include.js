de.titus.core.Namespace.create("de.titus.jstl.functions.Include", function() {	
	de.titus.jstl.functions.Include = function(){}; 
	de.titus.jstl.functions.Include.prototype = new de.titus.jstl.IFunction("include");
	de.titus.jstl.functions.Include.prototype.constructor = de.titus.jstl.functions.Include;
	
	/****************************************************************
	 * static variables
	 ***************************************************************/
	de.titus.jstl.functions.Include.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Include");
	
	/****************************************************************
	 * functions
	 ***************************************************************/
	
	de.titus.jstl.functions.Include.prototype.run = function(aElement, aDataContext, aProcessor){
		if (de.titus.jstl.functions.Include.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Include.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.jstl.ExpressionResolver();
		
		var expression = aElement.attr( processor.config.attributePrefix + this.attributeName);
		if(expression != undefined){		
			this.internalProcessing(expression, aElement, aDataContext, processor, expressionResolver);
		}
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	de.titus.jstl.functions.Include.prototype.internalProcessing = function(anIncludeExpression, aElement, aDataContext, aProcessor, anExpressionResolver){
		var element = aElement;
		var url = anExpressionResolver.resolveText(anIncludeExpression, aDataContext);
		var includeMode = this.getIncludeMode(aElement, aDataContext, aProcessor, anExpressionResolver); 
		var options = this.getOptions(aElement, aDataContext, aProcessor, anExpressionResolver);
		
		var ajaxSettings = {
			'url' : url,
			'async' : false,
			'cache' : true,
			"dataType": "html"
			};
		ajaxSettings = $.extend(true,ajaxSettings, options);

		var this_ = this;
		ajaxSettings.success = function(template) {			
			this_.addHtml(element, template, includeMode);	
		};
		
		ajaxSettings.error = function(error){
			throw JSON.stringify(error);
		};
		$.ajax(ajaxSettings)
	};
	
	de.titus.jstl.functions.Include.prototype.getOptions= function(aElement, aDataContext, aProcessor, anExpressionResolver){
		var options = aElement.attr( aProcessor.config.attributePrefix + this.attributeName + "-options");
		if(options != undefined){
			options = anExpressionResolver.resolveText(options, aDataContext);
			options = anExpressionResolver.resolveExpression(options, aDataContext);
			return options || {};
		}	
		
		return {};
	};
	
	de.titus.jstl.functions.Include.prototype.getIncludeMode= function(aElement, aDataContext, aProcessor, anExpressionResolver){
		var mode = aElement.attr( aProcessor.config.attributePrefix + this.attributeName + "-mode");
		if(mode == undefined)
			return "replace";
		
		mode  = mode.toLowerCase(); 
		if(mode == "append" || mode == "replace" || mode == "prepend")
			return mode;
		
		return "replace";
	};
	
	de.titus.jstl.functions.Include.prototype.addHtml= function(aElement, aTemplate, aIncludeMode){
		if (de.titus.jstl.functions.Include.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Include.LOGGER.logDebug("execute addHtml(" + aElement + ", " + aTemplate + ", " + aIncludeMode+ ", " + aDomHelper+ ")");
		if(aIncludeMode == "replace")
			aElement.html(aTemplate);
		else if(aIncludeMode == "append")
			aElement.append(aTemplate);
		else if(aIncludeMode == "prepend")
			aElement.prepend(aTemplate);
		else
			aElement.html(aTemplate);
		
	};
	
});
