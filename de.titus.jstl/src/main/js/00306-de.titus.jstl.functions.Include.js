de.titus.core.Namespace.create("de.titus.jstl.functions.Include", function() {
	var Include = function() {
		this.cache = {};
	};
	Include.prototype = new de.titus.jstl.IFunction("include");
	Include.prototype.constructor = Include;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	Include.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Include");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	
	Include.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (Include.LOGGER.isDebugEnabled())
			Include.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.jstl.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			this.internalProcessing(expression, aElement, aDataContext, processor, expressionResolver);
		}
		return new de.titus.jstl.FunctionResult(true, false);
	};
	
	Include.prototype.internalProcessing = function(anIncludeExpression, aElement, aDataContext, aProcessor, anExpressionResolver) {
		var url = anExpressionResolver.resolveText(anIncludeExpression, aDataContext);
		var disableCaching = url.indexOf("?") >= 0 || aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-cache-disabled") != undefined;
		var content = "";
		if (!disableCaching)
			content = this.cache[url];
		
		var includeMode = this.getIncludeMode(aElement, aDataContext, aProcessor, anExpressionResolver);
		if (content)
			this.addHtml(aElement, content, includeMode, aProcessor, aDataContext);
		else {
			var options = this.getOptions(aElement, aDataContext, aProcessor, anExpressionResolver);
			var ajaxSettings = {
			'url' : de.titus.core.Page.getInstance().buildUrl(url),
			'async' : false,
			'cache' : aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-ajax-cache-disabled") == undefined,
			"dataType" : "html"
			};
			ajaxSettings = $.extend(true, ajaxSettings, options);
			var $__THIS__$ = this;
			ajaxSettings.success = function(template) {
				var $template = $("<div/>").append(template);
				$__THIS__$.cache[url] = $template 
				$__THIS__$.addHtml(aElement, $template, includeMode, aProcessor, aDataContext);
			};
			
			ajaxSettings.error = function(error) {
				throw JSON.stringify(error);
			};
			$.ajax(ajaxSettings)
		}
	};
	
	Include.prototype.getOptions = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		var options = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-options");
		if (options != undefined) {
			options = anExpressionResolver.resolveText(options, aDataContext);
			options = anExpressionResolver.resolveExpression(options, aDataContext);
			return options || {};
		}
		
		return {};
	};
	
	Include.prototype.getIncludeMode = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		var mode = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-mode");
		if (mode == undefined)
			return "replace";
		
		mode = mode.toLowerCase();
		if (mode == "append" || mode == "replace" || mode == "prepend")
			return mode;
		
		return "replace";
	};
	
	Include.prototype.addHtml = function(aElement, aTemplate, aIncludeMode, aProcessor, aDataContext) {
		if (Include.LOGGER.isDebugEnabled())
			Include.LOGGER.logDebug("execute addHtml(" + aElement + ", " + aTemplate + ", " + aIncludeMode + ")");
		var content = aTemplate.clone();
		aProcessor.compute(content, aDataContext);
		
		if (aIncludeMode == "replace"){
			aElement.empty();
			content.contents().appendTo(aElement);
			//aElement.html(content.html());
		}
		else if (aIncludeMode == "append")
		{			
			content.contents().appendTo(aElement);
			//aElement.append(content.html());
		}
		else if (aIncludeMode == "prepend"){
			content.contents().prependTo(aElement);
			//aElement.prepend(content.html());
		}
		else
		{
			aElement.empty();
			content.contents().appendTo(aElement);
		}		
	};
	
	de.titus.jstl.functions.Include = Include;	
});
