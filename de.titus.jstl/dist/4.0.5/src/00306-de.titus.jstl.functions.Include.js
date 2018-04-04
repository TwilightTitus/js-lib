(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Include", function() {

		let Include = de.titus.jstl.functions.Include = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Include"),
		    CACHE : {},
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute run(" + aElement + ", " + aContext + ", " + aProcessor + ")");

			    let expression = aElement.attr("jstl-include");
			    if (expression.length > 0)
				    Include.__compute(expression, aElement, aContext, aProcessor, aTaskChain);
			    else
				    aTaskChain.nextTask();
		    },

		    __cacheCallback : function(aElement, aProcessor, aContext, aTaskChain, aTemplate) {
			    Include.__include(aElement, aTemplate, aProcessor, aContext, aTaskChain);
		    },

		    __executeCacheCallback : function(aUrl, aTemplate) {
			    let cache = Include.CACHE[aUrl.hashCode()];
			    cache.onload = false;
			    cache.template = $("<jstl/>").append(aTemplate);
			    for (let i = 0; i < cache.callback.length; i++)
				    cache.callback[i](cache.template);
		    },

		    __compute : function(anIncludeExpression, aElement, aContext, aProcessor, aTaskChain) {
			    aElement.addClass("jstl-include-loading");
			    let url = aProcessor.resolver.resolveText(anIncludeExpression, aContext);
			    url = Include.__buildUrl(url);
			    let disableCaching = url.indexOf("?") >= 0 || typeof aElement.attr("jstl-include-cache-disabled") !== 'undefined';
			    let cache = undefined;
			    if (!disableCaching)
				    cache = Include.CACHE[url.hashCode()];

			    if (cache) {
				    if (cache.onload)
					    cache.callback.push(function(aTemplate) {
						    Include.__cacheCallback(aElement, aProcessor, aContext, aTaskChain, aTemplate);
					    });
				    else
					    Include.__include(aElement, cache.template, aProcessor, aContext, aTaskChain);
			    } else {
				    cache = Include.CACHE[url.hashCode()] = {
				        onload : true,
				        callback : [ function(aTemplate) {
					        Include.__cacheCallback(aElement, aProcessor, aContext, aTaskChain, aTemplate);
				        } ]
				    };
				    let ajaxSettings = $.extend({
				        'url' : url,
				        'async' : true,
				        'cache' : (typeof aElement.attr("jstl-include-ajax-cache-disabled") === 'undefined'),
				        "dataType" : "html"
				    }, Include.__options(aElement, aContext, aProcessor));

				    ajaxSettings.success = function(aTemplate) {
					    Include.__executeCacheCallback(url, aTemplate);
				    };
				    ajaxSettings.error = function(aResponse, aState, aError) {
					    Include.__remoteError(aElement, aTaskChain, ajaxSettings, aResponse, aState, aError);
				    };

				    $.ajax(ajaxSettings);
			    }
		    },
		    URLPATTERN : new RegExp("^((https?://)|/).*", "i"),

		    __buildUrl : function(aUrl) {
			    let url = aUrl;
			    if (!Include.URLPATTERN.test(aUrl))
				    url = GlobalSettings.DEFAULT_INCLUDE_BASEPATH + aUrl;
			    url = de.titus.core.Page.getInstance().buildUrl(url);
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute __buildUrl(\"" + aUrl + "\") -> result: " + url);

			    return url;
		    },

		    __options : function(aElement, aContext, aProcessor) {
			    let options = aElement.attr("jstl-include-options");
			    if (options) {
				    options = aProcessor.resolver.resolveText(options, aContext);
				    options = aProcessor.resolver.resolveExpression(options, aContext);
				    return options;
			    }
		    },

		    __mode : function(aElement, aContext, aProcessor) {
			    let mode = aElement.attr("jstl-include-mode");
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
				let template = aTemplate.clone();
				let includeMode = Include.__mode(aElement, aContext, aProcessor);

				if (includeMode == "replace") {
					aElement.empty();
					aElement.append(template.contents());
					aElement.removeClass("jstl-include-loading");
					aTaskChain.nextTask();
				} else if (includeMode == "append") {
					let wrapper = $("<div></div>");
					wrapper.append(template);
					aProcessor.compute(wrapper, aContext, (function(aElement, aTemplate, aTaskChain) {
						aElement.append(aTemplate.contents());
						aElement.removeClass("jstl-include-loading");
						aTaskChain.finish();
					}).bind({}, aElement, wrapper, aTaskChain));
				} else if (includeMode == "prepend"){
					let wrapper = $("<div></div>");
					wrapper.append(template);
					aProcessor.compute(wrapper, aContext, (function(aElement, aTemplate, aTaskChain) {
						aElement.prepend(template.contents());
						aElement.removeClass("jstl-include-loading");
						aTaskChain.finish();
					}).bind({}, aElement, wrapper, aTaskChain));					
				}				
			},

		    __remoteError : function(aElement, aTaskChain, aRequest, aResponse, aState, aError) {
			    Include.LOGGER.logError([ "jstl-include error at element \"", aElement, "\" -> request: \"", aRequest, "\", response: \"", aResponse, "\", state: \"", aState, "\" error: \"", aError, "\"!" ]);
			    aTaskChain.finish();
		    }
		};

		de.titus.jstl.TaskRegistry.append("include", de.titus.jstl.Constants.PHASE.MANIPULATION, "[jstl-include]", de.titus.jstl.functions.Include.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
