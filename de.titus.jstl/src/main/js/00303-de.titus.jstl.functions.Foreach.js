(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Foreach", function() {
		var Foreach = de.titus.jstl.functions.Foreach = {
		    
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Foreach"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Foreach.LOGGER.isDebugEnabled())
				    Foreach.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.data("jstlForeach");
			    if (expression != undefined) {
				    aTaskChain.preventChilds();
				    Foreach.__compute(expression, aElement, aDataContext, aProcessor, aProcessor.resolver, aTaskChain);				    
			    } else
				    aTaskChain.nextTask();
		    },
		    
		    __compute : function(aExpression, aElement, aDataContext, aProcessor, anExpressionResolver, aTaskChain) {
			    if (Foreach.LOGGER.isDebugEnabled())
				    Foreach.LOGGER.logDebug("execute __compute(" + aElement + ", " + aDataContext + ", " + aProcessor + ", " + anExpressionResolver + ")");
			    
			    var tempalte = Foreach.__template(aElement);
			    if (tempalte == undefined)
				    return;
			    
			    aElement.empty();
			    
			    var varName = aElement.data("jstlForeachVar") || "itemVar";
			    var statusName = aElement.data("jstlForeachStatus") || "statusVar";
			    var list = anExpressionResolver.resolveExpression(aExpression, aDataContext, undefined);
			    
			    var breakCondition = aElement.data("jstlForeachBreakCondition");
			    if (Array.isArray(list))
				    Foreach.__list(list, tempalte, varName, statusName, breakCondition, aElement, aDataContext, aProcessor, aTaskChain);
			    else if (typeof list === "object")
				    Foreach.__map(list, tempalte, varName, statusName, breakCondition, aElement, aDataContext, aProcessor, aTaskChain);
		    },
		    
		    __list : function(aListData, aTemplate, aVarname, aStatusName, aBreakCondition, aElement, aDataContext, aProcessor, aTaskChain) {
			    var startIndex = aProcessor.resolver.resolveExpression(aElement.data("jstlForeachStartIndex"), aDataContext, 0) || 0;
			    
			    var executeChain = {
			        count : 1,
			        taskChain : aTaskChain,
			        finish : function() {
				        this.count--;
				        if (this.count == 0)
					        this.taskChain.nextTask();
			        }
			    };
			    
			    for (var i = startIndex; i < aListData.length; i++) {
				    var template = aTemplate.clone();
				    var context = $.extend({}, aDataContext);
				    context[aVarname] = aListData[i];
				    context[aStatusName] = {
				        "index" : i,
				        "number" : (i + 1),
				        "count" : aListData.length,
				        "data" : aListData,
				        "context" : aDataContext
				    };
				    if (aBreakCondition != undefined && Foreach.__break(context, aBreakCondition, aElement, aProcessor))
					    return executeChain.finish();
				    else {
					    executeChain.count++;
					    Foreach.__computeContent(template, context, aElement, aProcessor, executeChain);
				    }
			    }
			    executeChain.finish();
		    },
		    
		    __map : function(aMap, aTemplate, aVarname, aStatusName, aBreakCondition, aElement, aDataContext, aProcessor, aTaskChain) {
			    
			    var executeChain = {
			        count : 1,
			        taskChain : aTaskChain,
			        finish : function() {
				        this.count--;
				        if (this.count == 0)
					        this.taskChain.nextTask();
			        }
			    };
			    var i = 0;
			    for ( var name in aMap) {
				    var content = aTemplate.clone();
				    var context = $.extend({}, aDataContext);
				    context[aVarname] = aMap[name];
				    context[aStatusName] = {
				        "index" : i,
				        "number" : (i + 1),
				        "key" : name,
				        "data" : aMap,
				        "context" : aDataContext
				    };
				    
				    if (aBreakCondition != undefined && Foreach.__break(context, aBreakCondition, aElement, aProcessor))
					    return executeChain.finish();
				    else {
					    executeChain.count++;
					    Foreach.__computeContent(content, context, aElement, aProcessor, executeChain);
					    i++;
				    }
			    }
			    executeChain.finish();
		    },
		    
		    __break : function(aContext, aBreakCondition, aElement, aProcessor) {
			    var expression = aProcessor.resolver.resolveExpression(aBreakCondition, aContext, false);
			    if (typeof expression === "function")
				    expression = expression(aElement, aContext, aProcessor);
			    
			    return expression == true || expression == "true";
		    },
		    
		    __computeContent : function(aContent, aContext, aElement, aProcessor, aExecuteChain) {
		    	aContent.appendTo(aElement);
			    aProcessor.compute(aContent, aContext, (function(aElement, aContent, aExecuteChain) {				    
				    aExecuteChain.finish();
			    }).bind({}, aElement, aContent, aExecuteChain));
		    },
		    
		    __template : function(aElement) {
			    var template = aElement.data("de.titus.jstl.functions.Foreach.Template");
			    if (template == undefined) {
				    template = $("<jstl/>").append(aElement.contents());
				    aElement.data("de.titus.jstl.functions.Foreach.Template", template);
			    }
			    return template;
		    }
		};
	});
})($);
