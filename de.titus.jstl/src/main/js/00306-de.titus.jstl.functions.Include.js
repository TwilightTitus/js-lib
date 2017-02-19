(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Include", function() {
		
		var Include = de.titus.jstl.functions.Include = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Include"),
		    CACHE : {},
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute run(" + aElement + ", " + aContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.data("jstlInclude");
			    if (expression) {
				    //aTaskChain.preventChilds();
				    Include.__compute(expression, aElement, aContext, aProcessor, aTaskChain);				    
			    } else
				    aTaskChain.nextTask();
		    },
		    
		    __cacheCallback : function(aElement, aIncludeMode, aProcessor, aContext, aTaskChain, aTemplate) {
			    Include.__include(aElement, aTemplate, aIncludeMode, aProcessor, aContext, aTaskChain);
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
		    
		    __compute : function(anIncludeExpression, aElement, aContext, aProcessor, aTaskChain) {
			    var url = aProcessor.resolver.resolveText(anIncludeExpression, aContext);
			    var disableCaching = url.indexOf("?") >= 0 || aElement.data("jstlIncludeCacheDisabled") != undefined;
			    var cache = undefined;
			    if (!disableCaching)
				    cache = Include.CACHE[url];
			    
			    var includeMode = Include.__mode(aElement, aContext, aProcessor);
			    if (cache) {
				    if (cache.onload)
					    cache.callback.push(Include.__cacheCallback.bind({}, aElement, includeMode, aProcessor, aContext, aTaskChain));
				    else
					    setTimeout(Include.__include.bind({}, aElement, cache.template, includeMode, aProcessor, aContext, aTaskChain, aTaskChain), 1);
			    } else {
				    cache = Include.CACHE[url] = {
				        onload : true,
				        callback : [
					        Include.__cacheCallback.bind({}, aElement, includeMode, aProcessor, aContext, aTaskChain)
				        ]
				    };
				    var options = Include.__options(aElement, aContext, aProcessor);
				    var ajaxSettings = {
				        'url' : de.titus.core.Page.getInstance().buildUrl(url),
				        'async' : true,
				        'cache' : aElement.data("jstlIncludeAjaxCacheDisabled") == undefined,
				        "dataType" : "html"
				    };
				    ajaxSettings = $.extend(true, ajaxSettings, options);
				    
				    $.ajax(ajaxSettings).done(Include.__executeCacheCallback.bind(null, ajaxSettings.url)).fail(function(error) {
					    throw JSON.stringify(error);
				    });
			    }
		    },
		    
		    __options : function(aElement, aContext, aProcessor) {
			    var options = aElement.data("jstlIncludeOptions");
			    if (options) {
				    options = aProcessor.resolver.resolveText(options, aContext);
				    options = aProcessor.resolver.resolveExpression(options, aContext);
				    return options || {};
			    }
			    
			    return {};
		    },
		    
		    __mode : function(aElement, aContext, aProcessor) {
			    var mode = aElement.data("jstlIcludeMode");
			    if (mode == undefined)
				    return "replace";
			    
			    mode = mode.toLowerCase();
			    if (mode == "append" || mode == "replace" || mode == "prepend")
				    return mode;
			    
			    return "replace";
		    },
		    
		    __include : function(aElement, aTemplate, aIncludeMode, aProcessor, aContext, aTaskChain) {
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute __include()");
			    var content = aTemplate.clone();
			    Include.__includeFinished(aElement, aIncludeMode, aTaskChain, content)
			    //aProcessor.compute(content, aContext, Include.__includeFinished.bind({}, aElement, aIncludeMode, aTaskChain));
		    },
		    
		    __includeFinished : function(aElement, aIncludeMode, aTaskChain, aContent) {
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("__includeFinished()");
			    if (aIncludeMode == "replace") {
				    aElement.empty();
				    aContent.appendTo(aElement);
			    } else if (aIncludeMode == "append")
				    aContent.appendTo(aElement);
			    else if (aIncludeMode == "prepend")
				    aContent.prependTo(aElement);
			    
			    aTaskChain.nextTask();
		    }
		
		};
	});
})($);
