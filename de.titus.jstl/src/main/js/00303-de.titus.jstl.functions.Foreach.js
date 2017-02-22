(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Foreach", function() {
		var Foreach = de.titus.jstl.functions.Foreach = {
		    
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Foreach"),
		    
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Foreach.LOGGER.isDebugEnabled())
				    Foreach.LOGGER.logDebug("execute run(" + aElement + ", " + aContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.attr("jstl-foreach");
			    if (expression != undefined) {
				    aTaskChain.preventChilds();
				    Foreach.__compute(expression, aElement, aContext, aProcessor, aProcessor.resolver, aTaskChain);
			    } else
				    aTaskChain.nextTask();
		    },
		    
		    __compute : function(aExpression, aElement, aContext, aProcessor, anExpressionResolver, aTaskChain) {
			    if (Foreach.LOGGER.isDebugEnabled())
				    Foreach.LOGGER.logDebug("execute __compute(" + aElement + ", " + aContext + ", " + aProcessor + ", " + anExpressionResolver + ")");
			    
			    var tempalte = Foreach.__template(aElement);
			    if (tempalte == undefined)
				    return;
			    
			    aElement.empty();
			    
			    var varName = aElement.attr("jstl-foreach-var") || "itemVar";
			    var statusName = aElement.attr("jstl-foreach-status") || "statusVar";			    
			    var list = anExpressionResolver.resolveExpression(aExpression, aContext, undefined);
			    
			    if (aExpression == "")
				    Foreach.__count(tempalte, statusName, aElement, aContext, aProcessor, aTaskChain);
			    else if (Array.isArray(list))
				    Foreach.__list(list, tempalte, varName, statusName, aElement, aContext, aProcessor, aTaskChain);
			    else if (typeof list === "object")
				    Foreach.__map(list, tempalte, varName, statusName, aElement, aContext, aProcessor, aTaskChain);
		    },
		    __count : function(aTemplate, aStatusName, aElement, aContext, aProcessor, aTaskChain) {
			    var startIndex = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-start-index"), aContext, 0) || 0;
			    var count = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-count"));
			    var step = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-step") || 1);
			    var executeChain = {
			        count : count,
			        taskChain : aTaskChain,
			        finish : function() {
				        this.count--;
				        if (this.count == 0)
					        this.taskChain.nextTask();
			        }
			    };
			    
			    for (var i = startIndex; i < count; i += step) {
				    var template = aTemplate.clone();
				    var context = $.extend({}, aContext);
				    context[aStatusName] = {
				        "index" : i,
				        "count" : count,
				        "context" : aContext
				    };
				    executeChain.count++;
				    Foreach.__computeContent(template, context, aElement, aProcessor, executeChain);				    
			    }
		    },
		    
		    __list : function(aListData, aTemplate, aVarname, aStatusName, aElement, aContext, aProcessor, aTaskChain) {
			    var startIndex = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-start-index"), aContext, 0) || 0;
			    var breakCondition = aElement.attr("jstl-foreach-break-condition");
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
				    var context = $.extend({}, aContext);
				    context[aVarname] = aListData[i];
				    context[aStatusName] = {
				        "index" : i,
				        "number" : (i + 1),
				        "count" : aListData.length,
				        "data" : aListData,
				        "context" : aContext
				    };
				    if (breakCondition && Foreach.__break(context, breakCondition, aElement, aProcessor))
					    return executeChain.finish();
				    else {
					    executeChain.count++;
					    Foreach.__computeContent(template, context, aElement, aProcessor, executeChain);
				    }
			    }
			    executeChain.finish();
		    },
		    
		    __map : function(aMap, aTemplate, aVarname, aStatusName, aElement, aContext, aProcessor, aTaskChain) {
			    var breakCondition = aElement.attr("jstl-foreach-break-condition");
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
				    var context = $.extend({}, aContext);
				    context[aVarname] = aMap[name];
				    context[aStatusName] = {
				        "index" : i,
				        "number" : (i + 1),
				        "key" : name,
				        "data" : aMap,
				        "context" : aContext
				    };
				    
				    if (breakCondition && Foreach.__break(context, breakCondition, aElement, aProcessor))
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
		
		de.titus.jstl.TaskRegistry.append("foreach", de.titus.jstl.Constants.PHASE.MANIPULATION, "[jstl-foreach]", de.titus.jstl.functions.Foreach.TASK);
	});
})($);
