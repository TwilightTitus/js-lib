(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Include", function() {
		
		var Include = de.titus.jstl.functions.Include = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Include"),
		    CACHE : {},
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.data("jstlInclude");
			    if (expression) {
				    Include.__compute(expression, aElement, aDataContext, aProcessor);
				    aTaskChain.preventChilds();
			    }
			    
			    return aTaskChain.nextTask();
		    },
		    
		    __cacheCallback : function(aElement, aIncludeMode, aProcessor, aContext, aTemplate) {
			    Include.__include(aElement, aTemplate, aIncludeMode, aProcessor, aContext);
		    },
		    
		    __executeCacheCallback : function(aUrl, aTemplate) {
			    Include.CACHE[aUrl].template = $("<div/>").append(aTemplate);
			    Include.CACHE[aUrl].onload = false;
			    setTimeout(function() {
				    var cache = Include.CACHE[aUrl];
				    for (var i = 0; i < cache.callback.length; i++)
					    cache.callback[i](cache.template);
			    }, 1);
		    },
		    
		    __compute : function(anIncludeExpression, aElement, aDataContext, aProcessor) {
			    var url = aProcessor.resolver.resolveText(anIncludeExpression, aDataContext);
			    var disableCaching = url.indexOf("?") >= 0 || aElement.data("jstlIncludeCacheDisabled") != undefined;
			    var cache = undefined;
			    if (!disableCaching)
				    cache = Include.CACHE[url];
			    
			    var includeMode = Include.__mode(aElement, aDataContext, aProcessor);
			    if (cache) {
				    if (cache.onload)
					    cache.callback.push(Include.__cacheCallback.bind(null, aElement, includeMode, aProcessor, aDataContext));
				    else
					    setTimeout(function() {
						    Include.__include(aElement, cache.template, includeMode, aProcessor, aDataContext);
					    }, 1);
			    } else {
				    cache = Include.CACHE[url] = {
				        onload : true,
				        callback : [
					        Include.__cacheCallback.bind(null, aElement, includeMode, aProcessor, aDataContext)
				        ]
				    };
				    var options = Include.__options(aElement, aDataContext, aProcessor);
				    var ajaxSettings = {
				        'url' : de.titus.core.Page.getInstance().buildUrl(url),
				        'async' : true,
				        'cache' : aElement.data("jstlIncludeAjaxCacheDisabled") == undefined,
				        "dataType" : "html"
				    };
				    ajaxSettings = $.extend(true, ajaxSettings, options);
				    
				    $.ajax(ajaxSettings)
				    	.done(Include.__executeCacheCallback.bind(null, ajaxSettings.url))
				    	.fail(function(error) {throw JSON.stringify(error);});
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
			    
			    content.jstl(aDataContext);
			    
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
