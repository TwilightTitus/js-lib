(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Data", function() {
		var Data = de.titus.jstl.functions.Data = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Data"),

		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Data.LOGGER.isDebugEnabled())
				    Data.LOGGER.logDebug("TASK");

			    var expression = aElement.attr("jstl-data");
			    if (expression) {
				    var varname = aElement.attr("jstl-data-var");
				    var defaultValue = Data.__defaultvalue(aElement, expression, aDataContext, aProcessor)
				    var mode = aElement.attr("jstl-data-mode") || "direct";
				    Data.MODES[mode](expression, defaultValue, aElement, varname, aDataContext, aProcessor, aTaskChain);

			    } else
				    aTaskChain.nextTask();
		    },

		    __defaultvalue : function(aElement, anExpression, aDataContext, aProcessor) {
			    var defaultExpression = aElement.attr("jstl-data-default");
			    if (defaultExpression == undefined)
				    return anExpression;
			    else if (defaultExpression.trim() == "")
				    return undefined;
			    else {
				    return aProcessor.resolver.resolveExpression(defaultExpression, aDataContext, anExpression);
			    }
		    },

		    __options : function(aElement, aDataContext, aProcessor) {
			    var options = aElement.attr("jstl-data-options");
			    if (options) {
				    options = aProcessor.resolver.resolveText(options, aDataContext);
				    options = aProcessor.resolver.resolveExpression(options, aDataContext);
				    return options || {};
			    }
			    return {};
		    },
		    __updateContext : function(aVarname, aData, aTaskChain) {
			    if (aData) {
				    if (!aVarname)
					    aTaskChain.updateContext(aData, true);
				    else
					    aTaskChain.context[aVarname] = aData;
			    }
		    },

		    MODES : {
		        "direct" : function(anExpression, aDefault, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        var data = aProcessor.resolver.resolveExpression(anExpression, aDataContext, aDefault);
			        Data.__updateContext(aVarname, data, aTaskChain);
			        aTaskChain.nextTask();
		        },

		        "remote" : function(anExpression, aDefault, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        var url = aProcessor.resolver.resolveText(anExpression, aDataContext);
			        var option = Data.__options(aElement, aDataContext, aProcessor);
			        var datatype = (aElement.attr("jstl-data-datatype") || "json").toLowerCase();

			        var ajaxSettings = {
			            'url' : de.titus.core.Page.getInstance().buildUrl(url),
			            'async' : true,
			            'cache' : false,
			            'dataType' : datatype
			        };
			        ajaxSettings = $.extend(ajaxSettings, option);

			        $.ajax(ajaxSettings).done(Data.__remoteResponse.bind({}, aVarname, datatype, aTaskChain, ajaxSettings)).fail(Data.__remoteError.bind({}, aElement, aTaskChain, ajaxSettings));
		        },

		        "url-parameter" : function(anExpression, aDefault, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        var parameterName = aProcessor.resolver.resolveText(anExpression, aDataContext, anExpression);
			        var data = de.titus.core.Page.getInstance().getUrl().getParameter(parameterName);
			        if (data == undefined && aDefault != undefined)
				        data = aDefault;
			        Data.__updateContext(aVarname, data, aTaskChain);
			        aTaskChain.nextTask();
		        }
		    },
		    CONTENTYPE : {
		        "xml" : de.titus.core.Converter.xmlToJson,
		        "json" : function(aData) {
			        return aData
		        }
		    },

		    __remoteResponse : function(aVarname, aDatatype, aTaskChain, aRequest, aData, aState, aResponse) {
			    if (Data.LOGGER.isDebugEnabled())
				    Data.LOGGER.logDebug([ "add remote data \"", aData, "\ as var \"", aVarname, "\" as datatype \"", aDatatype, "\" -> (request: \"", aRequest, "\", response: \"", aResponse, "\")" ]);
			    var data = Data.CONTENTYPE[aDatatype](aData);
			    Data.__updateContext(aVarname, data, aTaskChain);
			    aTaskChain.nextTask();
		    },

		    __remoteError : function(aElement, aTaskChain, aRequest, aResponse, aState, aError) {
			    Data.LOGGER.logError([ "jstl-data error at element \"", aElement, "\" -> request: \"", aRequest, "\", response: \"", aResponse, "\", state: \"", aState, "\" error: \"", aError, "\"!" ]);
			    aTaskChain.finish();
		    }
		};

		de.titus.jstl.TaskRegistry.append("data", de.titus.jstl.Constants.PHASE.CONTEXT, "[jstl-data]", de.titus.jstl.functions.Data.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
