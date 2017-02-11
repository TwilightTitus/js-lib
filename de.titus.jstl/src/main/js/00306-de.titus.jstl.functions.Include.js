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
		
		
		var expression = aElement.data(this.attributeName);
		if (expression) {
			this.__compute(expression, aElement, aDataContext, aProcessor);
		}
		return new de.titus.jstl.FunctionResult(true, false);
	};
	
	Include.prototype.__compute = function(anIncludeExpression, aElement, aDataContext, aProcessor) {
		var url = aProcessor.resolve.resolveText(anIncludeExpression, aDataContext);
		var disableCaching = url.indexOf("?") >= 0 || aElement.data("jstlIncludeCacheDisabled") != undefined;
		var content = "";
		if (!disableCaching)
			content = this.cache[url];
		
		var includeMode = this.__mode(aElement, aDataContext, aProcessor);
		if (content)
			this.__include(aElement, content, includeMode, aProcessor, aDataContext);
		else {
			var options = this.__options(aElement, aDataContext, aProcessor);
			var ajaxSettings = {
			'url' : de.titus.core.Page.getInstance().buildUrl(url),
			'async' : false,
			'cache' : aElement.data("jstlIncludeAjaxCacheDisabled") == undefined,
			"dataType" : "html"
			};
			ajaxSettings = $.extend(true, ajaxSettings, options);
			var $__THIS__$ = this;
			ajaxSettings.success = function(template) {
				var $template = $("<div/>").append(template);
				$__THIS__$.cache[url] = $template 
				$__THIS__$.__include(aElement, $template, includeMode, aProcessor, aDataContext);
			};
			
			ajaxSettings.error = function(error) {
				throw JSON.stringify(error);
			};
			$.ajax(ajaxSettings)
		}
	};
	
	Include.prototype.__options = function(aElement, aDataContext, aProcessor) {
		var options = aElement.data("jstlIncludeOptions");
		if (options) {
			options = aProcessor.resolver.resolveText(options, aDataContext);
			options = aProcessor.resolver.resolveExpression(options, aDataContext);
			return options || {};
		}
		
		return {};
	};
	
	Include.prototype.__mode = function(aElement, aDataContext, aProcessor) {
		var mode = aElement.data("jstlIcludeMode");
		if (mode == undefined)
			return "replace";
		
		mode = mode.toLowerCase();
		if (mode == "append" || mode == "replace" || mode == "prepend")
			return mode;
		
		return "replace";
	};
	
	Include.prototype.__include = function(aElement, aTemplate, aIncludeMode, aProcessor, aDataContext) {
		if (Include.LOGGER.isDebugEnabled())
			Include.LOGGER.logDebug("execute __include(" + aElement + ", " + aTemplate + ", " + aIncludeMode + ")");
		var content = aTemplate.clone();
		aProcessor.compute(content, aDataContext);
		
		if (aIncludeMode == "replace"){
			aElement.empty();
			content.contents().appendTo(aElement);
		}
		else if (aIncludeMode == "append")
			content.contents().appendTo(aElement);
		else if (aIncludeMode == "prepend")
			content.contents().prependTo(aElement);
	};
	
	de.titus.jstl.functions.Include = Include;	
});
