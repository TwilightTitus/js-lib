(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Include", function() {
		
		 var Include =  de.titus.jstl.functions.Include = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Include"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.data("jstlIncude");
			    if (expression) 
				    Include.__compute(expression, aElement, aDataContext, aProcessor);
			    
			    return aTaskChain.nextTask();
		    },
		    
		    __compute : function(anIncludeExpression, aElement, aDataContext, aProcessor) {
			    var url = aProcessor.resolve.resolveText(anIncludeExpression, aDataContext);
			    var disableCaching = url.indexOf("?") >= 0 || aElement.data("jstlIncludeCacheDisabled") != undefined;
			    var content = "";
			    if (!disableCaching)
				    content = Include.cache[url];
			    
			    var includeMode = Include.__mode(aElement, aDataContext, aProcessor);
			    if (content)
				    Include.__include(aElement, content, includeMode, aProcessor, aDataContext);
			    else {
				    var options = Include.__options(aElement, aDataContext, aProcessor);
				    var ajaxSettings = {
				        'url' : de.titus.core.Page.getInstance().buildUrl(url),
				        'async' : false,
				        'cache' : aElement.data("jstlIncludeAjaxCacheDisabled") == undefined,
				        "dataType" : "html"
				    };
				    ajaxSettings = $.extend(true, ajaxSettings, options);
				    ajaxSettings.success = function(template) {
					    var $template = $("<div/>").append(template);
					    Include.cache[url] = $template;
					    Include.__include(aElement, $template, includeMode, aProcessor, aDataContext);
				    };
				    
				    ajaxSettings.error = function(error) {
					    throw JSON.stringify(error);
				    };
				    $.ajax(ajaxSettings)
			    }
		    },
		    
		    __options : function(aElement, aDataContext, aProcessor) {
			    var options = aElement.data("jstlIncludeOptions");
			    if (options) {
				    options = aProcessor.resolver.resolveText(options, aDataContext);
				    options = aProcessor.resolver.resolveExpression(options, aDataContext);
				    return options || {};
			    }
			    
			    return {};
		    },
		    
		    __mode : function(aElement, aDataContext, aProcessor) {
			    var mode = aElement.data("jstlIcludeMode");
			    if (mode == undefined)
				    return "replace";
			    
			    mode = mode.toLowerCase();
			    if (mode == "append" || mode == "replace" || mode == "prepend")
				    return mode;
			    
			    return "replace";
		    },
		    
		    __include : function(aElement, aTemplate, aIncludeMode, aProcessor, aDataContext) {
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute __include(" + aElement + ", " + aTemplate + ", " + aIncludeMode + ")");
			    var content = aTemplate.clone();
			    aProcessor.compute(content, aDataContext);
			    
			    if (aIncludeMode == "replace") {
				    aElement.empty();
				    content.contents().appendTo(aElement);
			    } else if (aIncludeMode == "append")
				    content.contents().appendTo(aElement);
			    else if (aIncludeMode == "prepend")
				    content.contents().prependTo(aElement);
		    }
		
		};
	});
})($);
