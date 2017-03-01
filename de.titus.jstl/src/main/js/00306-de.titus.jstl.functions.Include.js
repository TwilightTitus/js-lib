(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Include", function() {
		
		var Include = de.titus.jstl.functions.Include = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Include"),
		    CACHE : {},
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute run(" + aElement + ", " + aContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.attr("jstl-include");
			    if (expression) {
				    Include.__compute(expression, aElement, aContext, aProcessor, aTaskChain);
			    } else
				    aTaskChain.nextTask();
		    },
		    
		    __cacheCallback : function(aElement, aProcessor, aContext, aTaskChain, aTemplate) {
			    Include.__include(aElement, aTemplate, aProcessor, aContext, aTaskChain);
		    },
		    
		    __executeCacheCallback : function(aUrl, aTemplate) {
			    Include.CACHE[aUrl].template = $("<jstl/>").append(aTemplate);
			    Include.CACHE[aUrl].onload = false;
			    var cache = Include.CACHE[aUrl];
			    for (var i = 0; i < cache.callback.length; i++)
				    cache.callback[i](cache.template);
		    },
		    
		    __compute : function(anIncludeExpression, aElement, aContext, aProcessor, aTaskChain) {
			    var url = aProcessor.resolver.resolveText(anIncludeExpression, aContext);
			    var disableCaching = url.indexOf("?") >= 0 || aElement.attr("jstl-include-cache-disabled") != undefined;
			    var cache = undefined;
			    if (!disableCaching)
				    cache = Include.CACHE[url];
			    
			   
			    if (cache) {
				    if (cache.onload)
					    cache.callback.push(Include.__cacheCallback.bind({}, aElement, aProcessor, aContext, aTaskChain));
				    else
					    Include.__include(aElement, cache.template, aProcessor, aContext, aTaskChain);
			    } else {
				    cache = Include.CACHE[url] = {
				        onload : true,
				        callback : [
					        Include.__cacheCallback.bind({}, aElement, aProcessor, aContext, aTaskChain)
				        ]
				    };
				    var options = Include.__options(aElement, aContext, aProcessor);
				    var ajaxSettings = {
				        'url' : Include.__buildUrl(url),
				        'async' : true,
				        'cache' : aElement.attr("jstl-include-ajax-cache-disabled") == undefined,
				        "dataType" : "html"
				    };
				    ajaxSettings = $.extend(true, ajaxSettings, options);
				    
				    $.ajax(ajaxSettings).done(Include.__executeCacheCallback.bind({}, ajaxSettings.url)).fail(function(error) {
					    throw JSON.stringify(error);
				    });
			    }
		    },
		    URLPATTERN : new RegExp("^((https?://)|/).*", "i"),
		    
		    __buildUrl : function(aUrl) {
			    var url = aUrl;
			    if (!Include.URLPATTERN.test(aUrl))
				    url = GlobalSettings.DEFAULT_INCLUDE_BASEPATH + aUrl;
			    url = de.titus.core.Page.getInstance().buildUrl(url);
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute __buildUrl(\"" + aUrl + "\") -> result: " + url);
			    
			    return url;
		    },
		    
		    __options : function(aElement, aContext, aProcessor) {
			    var options = aElement.attr("jstl-include-options");
			    if (options) {
				    options = aProcessor.resolver.resolveText(options, aContext);
				    options = aProcessor.resolver.resolveExpression(options, aContext);
				    return options || {};
			    }
			    
			    return {};
		    },
		    
		    __mode : function(aElement, aContext, aProcessor) {
			    var mode = aElement.attr("jstl-include-mode");
			    if (mode == undefined)
				    return "replace";
			    
			    mode = mode.toLowerCase();
			    if (mode == "append" || mode == "replace" || mode == "prepend")
				    return mode;
			    
			    return "replace";
		    },
		    
		    __include : function(aElement, aTemplate, aProcessor, aContext, aTaskChain) {
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute __include()");
			    var content = aTemplate.clone();
			    var includeMode = Include.__mode(aElement, aContext, aProcessor);
			    
			    if (includeMode == "replace") {
				    aElement.empty();
				    content.appendTo(aElement);
			    } else if (includeMode == "append")
				    content.appendTo(aElement);
			    else if (includeMode == "prepend")
				    content.prependTo(aElement);
			    
			    aTaskChain.nextTask();
		    }
		};
		
		de.titus.jstl.TaskRegistry.append("include", de.titus.jstl.Constants.PHASE.MANIPULATION, "[jstl-include]", de.titus.jstl.functions.Include.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
