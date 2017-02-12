de.titus.core.Namespace.create("de.titus.jstl.functions.Data", function() {
	de.titus.jstl.functions.Data = Data = {
	    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Data"),
	    
	    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
		    if (Data.LOGGER.isDebugEnabled())
			    Data.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		    
		    var expression = aElement.data(this.attributeName);
		    if (expression) {
			    var varname = aElement.data("jstlDataVar");
			    var mode = aElement.data("jstlDataMode") || "direct";
			    var data = Data.MODES[mode].call(this, anExpression, aElement, varname, aDataContext, aProcessor);
			    if (!aVarname)
				    aTaskChain.updateContext(aNewData, true);
			    else {
				    aTaskChain.context[aVarname] = aNewData;
			    }
		    }
		    
		    aTaskChain.nextTask();
	    },
	    
	    __options : function(aElement, aDataContext, aProcessor) {
		    var options = aElement.data("jstlDataOptions");
		    if (options) {
			    options = aProcessor.resolver.resolveText(options, aDataContext);
			    options = aProcessor.resolver.resolveExpression(options, aDataContext);
			    return options || {};
		    }
		    return {};
	    },
	    
	    MODES : {
	        "direct" : function(anExpression, aElement, aVarname, aDataContext, aProcessor) {
		        return aProcessor.resolver.resolveExpression(anExpression, aDataContext);
	        },
	        
	        "remote" : function(anExpression, aElement, aVarname, aDataContext, aProcessor) {
		        var url = aProcessor.resolver.resolveText(anExpression, aDataContext);
		        var option = this.__options(aElement, aDataContext, aProcessor);
		        var dataType = aElement.data("jstlDataDatatype") || "json";
		        
		        var ajaxSettings = {
		            'url' : de.titus.core.Page.getInstance().buildUrl(url),
		            'async' : false,
		            'cache' : false,
		            'dataType' : dataType
		        };
		        ajaxSettings = $.extend(ajaxSettings, option);
		        var result = undefined;
		        ajaxSettings.success = function(newData) {
			        result = newData;
			        if (dataType.toLowerCase() == "xml")
				        result = de.titus.core.Converter.xmlToJson(newData);
		        };
		        
		        $.ajax(ajaxSettings);
		        
		        return result;
	        },
	        
	        "url-parameter" : function(anExpression, aElement, aVarname, aDataContext, aProcessor) {
		        var parameterName = aProcessor.resolver.resolveText(anExpression, aDataContext);
		        return de.titus.core.Page.getInstance().getUrl().getParameter(parameterName);
	        }
	    }
	
	};
});
