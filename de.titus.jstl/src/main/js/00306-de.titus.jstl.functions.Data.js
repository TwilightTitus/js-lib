(function($) {
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
				    var mode = aElement.attr("jstl-data-mode") || "direct";
				    Data.MODES[mode](expression, aElement, varname, aDataContext, aProcessor, aTaskChain);
				    
			    } else
				    aTaskChain.nextTask();
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
		        "direct" : function(anExpression, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        var data = aProcessor.resolver.resolveExpression(anExpression, aDataContext, anExpression);
			        Data.__updateContext(aVarname, data, aTaskChain);
			        aTaskChain.nextTask();
		        },
		        
		        "remote" : function(anExpression, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        var url = aProcessor.resolver.resolveText(anExpression, aDataContext);
			        var option = Data.__options(aElement, aDataContext, aProcessor);
			        var dataType = aElement.attr("jstl-data-datatype") || "json";
			        
			        var ajaxSettings = {
			            'url' : de.titus.core.Page.getInstance().buildUrl(url),
			            'async' : true,
			            'cache' : false,
			            'dataType' : dataType
			        };
			        ajaxSettings = $.extend(ajaxSettings, option);
			        
			        $.ajax(ajaxSettings).done((function(aVarname,aTaskChain, newData) {
				        var data = newData;
				        if (dataType.toLowerCase() == "xml")
					        data = de.titus.core.Converter.xmlToJson(newData);
				        Data.__updateContext(aVarname, data, aTaskChain);
				        aTaskChain.nextTask();
			        }).bind({}, aVarname, aTaskChain));
		        },
		        
		        "url-parameter" : function(anExpression, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        var parameterName = aProcessor.resolver.resolveText(anExpression, aDataContext);
			        var data = de.titus.core.Page.getInstance().getUrl().getParameter(parameterName);
			        Data.__updateContext(aVarname, data, aTaskChain);
			        aTaskChain.nextTask();
		        }
		    }
		
		};
	});
})($);
