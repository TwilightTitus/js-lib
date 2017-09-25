(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Data", function() {
		let Data = de.titus.jstl.functions.Data = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Data"),

		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Data.LOGGER.isDebugEnabled())
				    Data.LOGGER.logDebug("TASK");

			    let expression = aElement.attr("jstl-data");
			    if (typeof expression !== 'undefined') {
				    let varname = aElement.attr("jstl-data-var");
				    let defaultValue = Data.__defaultvalue(aElement, expression, aDataContext, aProcessor)
				    let mode = aElement.attr("jstl-data-mode") || "direct";
				    Data.MODES[mode](expression, defaultValue, aElement, varname, aDataContext, aProcessor, aTaskChain);

			    } else
				    aTaskChain.nextTask();
		    },

		    __defaultvalue : function(aElement, anExpression, aDataContext, aProcessor) {
			    let defaultExpression = aElement.attr("jstl-data-default");
			    if (typeof defaultExpression === 'undefined')
				    return anExpression;
			    else if (defaultExpression.length == 0)
				    return undefined;
			    else {
				    return aProcessor.resolver.resolveExpression(defaultExpression, aDataContext, anExpression);
			    }
		    },

		    __options : function(aElement, aDataContext, aProcessor) {
			    let options = aElement.attr("jstl-data-options");
			    if (options) {
				    options = aProcessor.resolver.resolveText(options, aDataContext);
				    options = aProcessor.resolver.resolveExpression(options, aDataContext);
				    return options;
			    }
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
			        let data = aProcessor.resolver.resolveExpression(anExpression, aDataContext, aDefault);
			        Data.__updateContext(aVarname, data, aTaskChain);
			        aTaskChain.nextTask();
		        },

		        "remote" : function(anExpression, aDefault, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        let url = aProcessor.resolver.resolveText(anExpression, aDataContext);
			        let option = Data.__options(aElement, aDataContext, aProcessor);
			        let datatype = (aElement.attr("jstl-data-datatype") || "json").toLowerCase();

			        let ajaxSettings = $.extend({
			            'url' : de.titus.core.Page.getInstance().buildUrl(url),
			            'async' : true,
			            'cache' : false,
			            'dataType' : datatype
			        }, option);
			        ajaxSettings.success = Data.__remoteResponse.bind(null, aVarname, datatype, aTaskChain, ajaxSettings);
			        ajaxSettings.error = Data.__remoteError.bind(null, aElement, aTaskChain, ajaxSettings);

			        $.ajax(ajaxSettings);
		        },

		        "url-parameter" : function(anExpression, aDefault, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
		        	let parameterName = aProcessor.resolver.resolveText(anExpression, aDataContext, anExpression);
		        	let data = de.titus.core.Page.getInstance().getUrl().getParameter(parameterName);
			        if (typeof data !== 'undefined')
			        	 Data.__updateContext(aVarname, data, aTaskChain);
			        else if(typeof aDefault !== 'undefined')
			        	 Data.__updateContext(aVarname, aDefault, aTaskChain);
			       
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
			  
			    Data.__updateContext(aVarname, Data.CONTENTYPE[aDatatype](aData), aTaskChain);
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
