/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Frank Schüler
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

de.titus.core.Namespace.create("de.titus.jstl.Constants", function() {
	de.titus.jstl.Constants = {
		EVENTS : {
		onStart : "jstl-on-start",
		onLoad : "jstl-on-load",
		onSuccess : "jstl-on-success",
		onFail : "jstl-on-fail",
		onReady : "jstl-on-ready"
		}
	};	
});
de.titus.core.Namespace.create("de.titus.jstl.TaskRegistry", function() {
	
	var TaskRegistry = {
		taskchain : undefined
	};
	
	TaskRegistry.append = function(aName, aFunction, aChain) {
		if (!aChain && !TaskRegistry.taskchain)
			TaskRegistry.taskchain = {
			    name : aName,
			    task : aFunction
			};
		else if (!aChain && TaskRegistry.taskchain)
			TaskRegistry.append(aName, aFunction, TaskRegistry.taskchain);
		else if (aChain.next)
			TaskRegistry.append(aName, aFunction, aChain.next);
		else
			aChain.next = {
			    name : aName,
			    task : aFunction
			};
	}

	de.titus.jstl.TaskRegistry = TaskRegistry;
});
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.TaskChain", function() {
		var TaskChain = function(aElement, aContext, aProcessor, isRoot) {
			this.element = aElement;
			this.context = aContext;
			this.processor = aProcessor;
			this.root = isRoot;
			this.__preventChilds = false;
			this.__taskchain = de.titus.jstl.TaskRegistry.taskchain;
			this.__index = 0;
		};
		TaskChain.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.TaskChain");
		
		TaskChain.prototype.preventChilds = function() {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("preventChilds()");
			this.__preventChilds = true;
			return this;
		};
		
		TaskChain.prototype.isPreventChilds = function() {
			return this.__preventChilds;
		};
		
		TaskChain.prototype.updateContext = function(aContext, doMerge) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("updateContext()");
			if (doMerge)
				this.context = $.extend({}, this.context, aContext);
			else
				this.context = aContext;
		};
		
		TaskChain.prototype.nextTask = function(aContext, doMerge) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("nextTask( \"" + aContext + "\")");
			if (this.__taskchain) {
				var name = this.__taskchain.name;
				var task = this.__taskchain.task;
				this.__taskchain = this.__taskchain.next;
				if (aContext)
					this.updateContext(aContext, doMerge);
				if (TaskChain.LOGGER.isDebugEnabled())
					TaskChain.LOGGER.logDebug("nextTask() -> next task: \"" + name + "\"!");
				task.bind(null, this.element, this.context, this.processor, this).call();
			} else if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("nextTask() -> task chain is finished!");
		};
		
		de.titus.jstl.TaskChain = TaskChain;
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.TaskChain", function() {
		var TaskChain = function(aElement, aContext, aProcessor, isRoot) {
			this.element = aElement;
			this.context = aContext;
			this.processor = aProcessor;
			this.root = isRoot;
			this.__preventChilds = false;
			this.__taskchain = de.titus.jstl.TaskRegistry.taskchain;
			this.__index = 0;
		};
		TaskChain.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.TaskChain");
		
		TaskChain.prototype.preventChilds = function() {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("preventChilds()");
			this.__preventChilds = true;
			return this;
		};
		
		TaskChain.prototype.isPreventChilds = function() {
			return this.__preventChilds;
		};
		
		TaskChain.prototype.updateContext = function(aContext, doMerge) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("updateContext()");
			if (doMerge)
				this.context = $.extend({}, this.context, aContext);
			else
				this.context = aContext;
		};
		
		TaskChain.prototype.nextTask = function(aContext, doMerge) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("nextTask( \"" + aContext + "\")");
			if (this.__taskchain) {
				var name = this.__taskchain.name;
				var task = this.__taskchain.task;
				this.__taskchain = this.__taskchain.next;
				if (aContext)
					this.updateContext(aContext, doMerge);
				if (TaskChain.LOGGER.isDebugEnabled())
					TaskChain.LOGGER.logDebug("nextTask() -> next task: \"" + name + "\"!");
				task.bind(null, this.element, this.context, this.processor, this).call();
			} else if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("nextTask() -> task chain is finished!");
		};
		
		de.titus.jstl.TaskChain = TaskChain;
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Children", function() {
		var Children = de.titus.jstl.functions.Children = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Children"),
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Children.LOGGER.isDebugEnabled())
			    	Children.LOGGER.logDebug("TASK");
			    
			    
			    if (!aTaskChain.isPreventChilds())
			    	aElement.children().jstl(aContext);
			    
			    aTaskChain.nextTask();
		    }
		};
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.If", function() {
		var If = de.titus.jstl.functions.If = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.If"),
		    TASK : function(aElement, aDataContext, aProcessor, aExecuteChain) {
			    if (If.LOGGER.isDebugEnabled())
				    If.LOGGER.logDebug("TASK");
			    
			    var expression = aElement.data("jstlIf");
			    if (expression != undefined) {
				    var expression = aProcessor.resolver.resolveExpression(expression, aDataContext, false);
				    if (typeof expression === "function")
					    expression = expression(aElement, aDataContext, aProcessor);
				    
				    if (!(expression == true || expression == "true")) {
					    aElement.remove();
					    aExecuteChain.preventChilds();
				    } else
					    aExecuteChain.nextTask();
			    } else
				    aExecuteChain.nextTask();
		    }
		};
	});
})($);
(function($) {
	de.titus.core.Namespace.create("de.titus.jstl.functions.Preprocessor", function() {
		de.titus.jstl.functions.Preprocessor = Preprocessor = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Preprocessor"),
		    
		    STATICEVENTHANDLER : function(aExpression, aEvent, aDataContext, aProcessor) {
			    if (aExpression && aExpression != "") {
				    var eventAction = aProcessor.resolver.resolveExpression(aExpression, aDataContext);
				    if (typeof eventAction === "function")
					    eventAction(aDataContext.$element, aDataContext, aProcessor);
			    }
		    },
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Preprocessor.LOGGER.isDebugEnabled())
				    Preprocessor.LOGGER.logDebug("TASK");
			    
			    var element = aElement || this.element;
			    var tagname = element.tagName();
			    if (tagname != undefined && tagname == "br")
				    return aTaskChain.preventChilds();
			    
			    if (!aTaskChain.root) {
				    var ignore = element.data("jstlIgnore");
				    if (ignore && ignore != "") {
					    ignore = aProcessor.resolver.resolveExpression(ignore, dataContext, false);
					    if (ignore == "" || ignore == true || ignore == "true")
						    return aTaskChain.preventChilds();
				    }
				    
				    var async = element.data("jstlAsync");
				    if (async && async != "") {
					    async = aProcessor.resolver.resolveExpression(async, dataContext, false);
					    if (async == "" || async == true || async == "true") {
						    aProcessor.onReady(Processor.prototype.__compute.bind(this, element, aContext || this.context), 1);
						    return aTaskChain.preventChilds();
					    }
				    }
			    }
			    
			    var ignoreChilds = aElement.data("jstlIgnoreChilds");
			    if (ignoreChilds && ignoreChilds != "")
				    ignoreChilds = aProcessor.resolver.resolveExpression(ignoreChilds, executeChain.context, true);
			    
			    if (ignoreChilds == "" || ignoreChilds == true || ignoreChilds == "true")
			    	aTaskChain.preventChilds();
			    
			    Preprocessor.__appendEvents(aElement);
			    
			    aTaskChain.nextTask();
			    
		    },
		    
		    __appendEvents : function(aElement) {
			    if (aElement.data("jstlLoad"))
				    aElement.one(de.titus.jstl.Constants.EVENTS.onLoad, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.data("jstlLoad")));
			    if (aElement.data("jstlSuccess"))
				    aElement.one(de.titus.jstl.Constants.EVENTS.onSuccess, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.data("jstlSuccess")));
			    if (aElement.data("jstlFail"))
				    aElement.one(de.titus.jstl.Constants.EVENTS.onFail, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.data("jstlFail")));
		    }
		
		};
		
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Choose", function() {
		var Choose = de.titus.jstl.functions.Choose = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Choose"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.data("jstlChoose");
			    if (expression != undefined){
			    	Choose.__compute(aElement, aDataContext, aProcessor, aProcessor.resolver);
			    	aTaskChain.preventChilds();
			    }
			    
			    aTaskChain.nextTask();
		    },
		    
		    __compute : function(aChooseElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processChilds(" + aChooseElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
			    
			    var resolved = false;
			    aChooseElement.children().each(function() {
				    var child = $(this);
				    if (!resolved && Choose.__computeChild(aChooseElement, child, aDataContext, aProcessor, aExpressionResolver)) {
					    if (Choose.LOGGER.isTraceEnabled())
						    Choose.LOGGER.logTrace("compute child: " + child);
					    aProcessor.compute(child, aDataContext);
					    resolved = true;
				    } else {
					    if (Choose.LOGGER.isTraceEnabled())
						    Choose.LOGGER.logTrace("remove child: " + child);
					    child.remove();
				    }
			    });
		    },
		    
		    __computeChild : function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processChild(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
			    
			    if (Choose.__computeWhen(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver))
				    return true;
			    else if (Choose.__computeOtherwise(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver))
				    return true;
			    else
				    return false;
		    },
		    
		    __computeWhen : function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processWhenElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
			    
			    var expression = aElement.data("jstlWhen");
			    if (expression != undefined)
				    return aExpressionResolver.resolveExpression(expression, aDataContext, false);
			    return false;
		    },
		    
		    __computeOtherwise : function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processOtherwiseElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
			    
			    if (aElement.data("jstlOtherwise") != undefined)
				    return true;
			    return false;
		    }
		};
	});
})($);
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
				    Foreach.__compute(expression, aElement, aDataContext, aProcessor, aProcessor.resolver);
				    aTaskChain.preventChilds();
			    }
			    
				aTaskChain.nextTask();
		    },
		    
		    __compute : function(aExpression, aElement, aDataContext, aProcessor, anExpressionResolver) {
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
				    Foreach.__list(list, tempalte, varName, statusName, breakCondition, aElement, aDataContext, aProcessor);
			    else if (typeof list === "object")
				    Foreach.__map(list, tempalte, varName, statusName, breakCondition, aElement, aDataContext, aProcessor);
		    },
		    
		    __list : function(aListData, aTemplate, aVarname, aStatusName, aBreakCondition, aElement, aDataContext, aProcessor) {
			    var startIndex = aProcessor.resolver.resolveExpression(aElement.data("jstlForeachStartIndex"), aDataContext, 0) || 0;
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
					    return;
				    
				    Foreach.__computeContent(template, context, aElement, aProcessor);
			    }
		    },
		    
		    __map : function(aMap, aTemplate, aVarname, aStatusName, aBreakCondition, aElement, aDataContext, aProcessor) {
			    var i = 0;
			    for ( var name in aMap) {
				    var newContent = aTemplate.clone();
				    var newContext = $.extend({}, aDataContext);
				    newContext[aVarname] = aMap[name];
				    newContext[aStatusName] = {
				        "index" : i,
				        "number" : (i + 1),
				        "key" : name,
				        "data" : aMap,
				        "context" : aDataContext
				    };
				    
				    if (aBreakCondition != undefined && Foreach.__break(newContext, aBreakCondition, aElement, aProcessor))
					    return;
				    
				    Foreach.__computeContent(newContent, newContext, aElement, aProcessor);
				    i++;
			    }
		    },
		    
		    __break : function(aContext, aBreakCondition, aElement, aProcessor) {
			    var expression = aProcessor.resolver.resolveExpression(aBreakCondition, aContext, false);
			    if (typeof expression === "function")
				    expression = expression(aElement, aContext, aProcessor);
			    
			    return expression == true || expression == "true";
		    },
		    
		    __computeContent : function(aNewContent, aNewContext, aElement, aProcessor) {
			    aProcessor.compute(aNewContent, aNewContext);
			    aElement.append(aNewContent.contents());
		    },
		    
		    __template : function(aElement) {
			    var template = aElement.data("de.titus.jstl.functions.Foreach.Template");
			    if (template == undefined) {
				    template = $("<div>").append(aElement.contents());
				    aElement.data("de.titus.jstl.functions.Foreach.Template", template);
			    }
			    return template;
		    }
		};
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Text", function() {
		var Text = de.titus.jstl.functions.Text = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Text"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Text.LOGGER.isDebugEnabled())
				    Text.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var ignore = aElement.data("jstlTextIgnore");
			    if (!ignore) {
				    if (!aElement.is("pre"))
					    Text.normalize(aElement[0]);
				    
				    var contenttype = aElement.data("jstlTextType") || "text";
				    aElement.contents().filter(function() {
					    return this.nodeType === 3 && this.textContent != undefined && this.textContent.trim() != "";
				    }).each(function() {
					    var text = this.textContent;
					    if (text) {
						    text = aProcessor.resolver.resolveText(text, aDataContext);
						    var contentFunction = Text.CONTENTTYPE[contenttype];
						    if (contentFunction)
							    contentFunction(this, text, aElement, aProcessor, aDataContext);
					    }
				    });
			    }
			    
			    aTaskChain.nextTask();
		    },
		    
		    normalize : function(aNode) {
			    if (!aNode)
				    return;
			    if (aNode.nodeType == 3) {
				    while (aNode.nextSibling && aNode.nextSibling.nodeType == 3) {
					    aNode.nodeValue += aNode.nextSibling.nodeValue;
					    aNode.parentNode.removeChild(aNode.nextSibling);
				    }
			    } else {
				    Text.normalize(aNode.firstChild);
			    }
			    Text.normalize(aNode.nextSibling);
		    },
		    
		    CONTENTTYPE : {
		        "html" : function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
			        $(aNode).replaceWith($.parseHTML(aText));
		        },
		        "json" : function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
			        if (typeof aText === "string")
				        aNode.textContent = aText;
			        else
				        aNode.textContent = JSON.stringify(aText);
		        },
		        "text" : function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
			        var text = aText;
			        var addAsHtml = false;
			        
			        var trimLength = aBaseElement.data("jstlTextTrimLength");
			        if (trimLength != undefined && trimLength != "") {
				        trimLength = aProcessor.resolver.resolveExpression(trimLength, aDataContext, "-1");
				        trimLength = parseInt(trimLength);
				        if (trimLength && trimLength > 0)
					        text = de.titus.core.StringUtils.trimTextLength(text, trimLength);
			        }
			        
			        var preventformat = aBaseElement.data("jstlTextPreventFormat");
			        if (preventformat) {
				        preventformat = aProcessor.resolver.resolveExpression(preventformat, aDataContext, true) || true;
				        if (preventformat) {
					        text = de.titus.core.StringUtils.formatToHtml(text);
					        addAsHtml = true;
				        }
			        }
			        
			        if (addAsHtml)
				        $(aNode).replaceWith($.parseHTML(text));
			        else
				        aNode.textContent = text;
		        }
		    }
		};
		
		Text.CONTENTTYPE["text/html"] = Text.CONTENTTYPE["html"];
		Text.CONTENTTYPE["application/json"] = Text.CONTENTTYPE["json"];
		Text.CONTENTTYPE["text/plain"] = Text.CONTENTTYPE["text"];
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Attribute", function() {
		var Attribute = de.titus.jstl.functions.Attribute = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Attribute"),
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Attribute.LOGGER.isDebugEnabled())
				    Attribute.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var attributes = aElement[0].attributes || [];
			    for (var i = 0; i < attributes.length; i++) {
				    var name = attributes[i].name;
				    if (name.indexOf("data-jstl-") != 0) {
					    var value = attributes[i].value;
					    if (value != undefined && value != "") {
						    try {
							    var newValue = aProcessor.resolver.resolveText(value, aDataContext);
							    if (value != newValue) {
								    if (Attribute.LOGGER.isDebugEnabled()) {
									    Attribute.LOGGER.logDebug("Change attribute \"" + name + "\" from \"" + value + "\" to \"" + newValue + "\"!");
								    }
								    aElement.attr(name, newValue);
							    }
						    } catch (e) {
							    Attribute.LOGGER.logError("Can't process attribute\"" + name + "\" with value \"" + value + "\"!");
						    }
					    }
				    }
			    }
			    
			    aTaskChain.nextTask();
		    }
		}
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Data", function() {
		var Data = de.titus.jstl.functions.Data = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Data"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Data.LOGGER.isDebugEnabled())
				    Data.LOGGER.logDebug("TASK");
			    
			    var expression = aElement.data("jstlData");
			    if (expression) {
				    var varname = aElement.data("jstlDataVar");
				    var mode = aElement.data("jstlDataMode") || "direct";
				    var data = Data.MODES[mode].call(this, expression, aElement, varname, aDataContext, aProcessor);
				    if (data) {
					    if (!varname)
						    aTaskChain.updateContext(data, true);
					    else
						    aTaskChain.context[varname] = data;
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
			        return aProcessor.resolver.resolveExpression(anExpression, aDataContext, anExpression);
		        },
		        
		        "remote" : function(anExpression, aElement, aVarname, aDataContext, aProcessor) {
			        var url = aProcessor.resolver.resolveText(anExpression, aDataContext);
			        var option = Data.__options(aElement, aDataContext, aProcessor);
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
			        
			        var xhr = $.ajax(ajaxSettings);
			        
			        return result;
		        },
		        
		        "url-parameter" : function(anExpression, aElement, aVarname, aDataContext, aProcessor) {
			        var parameterName = aProcessor.resolver.resolveText(anExpression, aDataContext);
			        return de.titus.core.Page.getInstance().getUrl().getParameter(parameterName);
		        }
		    }
		
		};
	});
})($);
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
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.AddAttribute", function() {
		var AddAttribute = de.titus.jstl.functions.AddAttribute = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.AddAttribute"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (AddAttribute.LOGGER.isDebugEnabled())
				    AddAttribute.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.data("jstlAddAtribute");
			    if (expression) {
				    expression = aProcessor.resolver.resolveExpression(expression, aDataContext, false);
				    if (expression && typeof expression === "function")
					    expression = expression(aElement, aDataContext, aProcessor);
				    
				    if (expression && Array.isArray(expression))
					    AddAttribute.processArray(expression, aElement, aDataContext, aProcessor);
				    else if (expression && typeof expression === "object")
					    AddAttribute.processObject(expression, aElement, aDataContext, aProcessor);
			    }
			    
			    aTaskChain.nextTask();
		    },
		    
		    processArray : function(theDataArray, aElement, aDataContext, aProcessor) {
			    for (var i = 0; i < theDataArray.length; i++) {
				    AddAttribute.processObject(theDataArray[i], aElement, aDataContext, aProcessor);
			    }
		    },
		    
		    processObject : function(theData, aElement, aDataContext, aProcessor) {
			    if (theData.name)
				    aElement.attr(theData.name, theData.value);
			    else
				    AddAttribute.LOGGER.logError("run processObject (" + theData + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ") -> No attribute name defined!");
		    }
		
		};
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Databind", function() {
		var Databind = de.titus.jstl.functions.Databind = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Databind"),
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Databind.LOGGER.isDebugEnabled())
				    Databind.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var varname = aElement.data("jstlDatabindName");
			    if (varname && varname.trim() != "") {
				    var value = this.__value(aElement, aDataContext, aProcessor);
				    if (value != undefined)
					    aElement.data(varname, value);
			    }
			    
			    aTaskChain.nextTask();
		    },
		    
		    __value : function(aElement, aDataContext, aProcessor) {
			    return aProcessor.resolver.resolveExpression(aElement.data("jstlDatabind"), aDataContext, undefined);
		    }		
		};
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Eventbind", function() {
		var Eventbind = de.titus.jstl.functions.Eventbind = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Eventbind"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Eventbind.LOGGER.isDebugEnabled())
				    Eventbind.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    if (aElement.data("jstlEventbind"))
				    aElement.de_titus_core_EventBind(aDataContext);
			    
			    aTaskChain.nextTask();
		    }
		
		};
	});
})($);
(function($, SpecialFunctions) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.Processor", function() {
		var Processor = function(aElement, aContext) {
			this.element = aElement;
			this.context = aContext || {};
			this.resolver = new de.titus.core.ExpressionResolver(this.element.data("jstlExpressionRegex"));
		};
		
		Processor.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.Processor");
		Processor.STATICEVENTHANDLER = function(aExpression, aEvent, aDataContext, aProcessor) {
			if (aExpression && aExpression != "") {
				var eventAction = aProcessor.resolver.resolveExpression(aExpression, aDataContext);
				if (typeof eventAction === "function")
					eventAction(aDataContext.$element, aDataContext, aProcessor);
			}
		};
		
		Processor.prototype.compute = function(aElement, aContext, aCallback) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute compute(" + aElement + ", " + aContext + ")");
			
			if (!aElement)
				this.element.trigger(de.titus.jstl.Constants.EVENTS.onStart, [
				        this.context, this
				]);
			
			this.__computeElement(aElement, aContext, aCallback);
		};
		
		Processor.prototype.__computeElement = function(aElement, aDataContext) {
			var element = aElement || this.element;
			var dataContext = aDataContext || this.context;
			dataContext.$element = element;
			
			element.trigger(de.titus.jstl.Constants.EVENTS.onLoad, [
			        dataContext, this
			]);
			var taskChain = new de.titus.jstl.TaskChain(element, dataContext, this, !aElement);
			taskChain.nextTask();
			
			if (element.tagName() == "jstl" && element.contents().length > 0)
				element.replaceWith(element.contents());
			
			if (typeof aCallback === "function")
				aCallback(aElement, aDataContext, this);
			
			element.trigger(de.titus.jstl.Constants.EVENTS.onSuccess, [dataContext, this]);
			
			if (!aElement)
				this.onReady();
		};
		
		Processor.prototype.onReady = function(aFunction) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("onReady()");
			if (aFunction) {
				this.element.one(de.titus.jstl.Constants.EVENTS.onReady, function(anEvent) {
					aFunction(anEvent.delegateTarget, anEvent.data);
				});
				return this;
			} else
				$(document).ready((function(aProcessor){
					aProcessor.element.trigger(de.titus.jstl.Constants.EVENTS.onReady, [aProcessor]);
				}).bind(null, this));
				
		};
		
		de.titus.jstl.Processor = Processor;
	});
})(jQuery, de.titus.core.SpecialFunctions);
de.titus.core.Namespace.create("de.titus.jstl.Setup", function() {
	de.titus.jstl.Setup = function() {
	};
	
	
	de.titus.jstl.TaskRegistry.append("preprocessor", de.titus.jstl.functions.Preprocessor.TASK);
	de.titus.jstl.TaskRegistry.append("if", de.titus.jstl.functions.If.TASK);
	de.titus.jstl.TaskRegistry.append("data", de.titus.jstl.functions.Data.TASK);
	de.titus.jstl.TaskRegistry.append("include", de.titus.jstl.functions.Include.TASK);
	de.titus.jstl.TaskRegistry.append("choose", de.titus.jstl.functions.Choose.TASK);
	de.titus.jstl.TaskRegistry.append("foreach", de.titus.jstl.functions.Foreach.TASK);
	de.titus.jstl.TaskRegistry.append("add-attribute", de.titus.jstl.functions.AddAttribute.TASK);
	de.titus.jstl.TaskRegistry.append("databind", de.titus.jstl.functions.Databind.TASK);
	de.titus.jstl.TaskRegistry.append("eventbind", de.titus.jstl.functions.Eventbind.TASK);
	de.titus.jstl.TaskRegistry.append("text", de.titus.jstl.functions.Text.TASK);
	de.titus.jstl.TaskRegistry.append("attribute", de.titus.jstl.functions.Attribute.TASK);
	de.titus.jstl.TaskRegistry.append("children", de.titus.jstl.functions.Children.TASK);
	
});
de.titus.core.Namespace.create("de.titus.jstl.javascript.polyfills", function() {
//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Polyfill	


	if (!Array.from) {
	  Array.from = (function () {
	    var toStr = Object.prototype.toString;
	    var isCallable = function (fn) {
	      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
	    };
	    var toInteger = function (value) {
	      var number = Number(value);
	      if (isNaN(number)) { return 0; }
	      if (number === 0 || !isFinite(number)) { return number; }
	      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
	    };
	    var maxSafeInteger = Math.pow(2, 53) - 1;
	    var toLength = function (value) {
	      var len = toInteger(value);
	      return Math.min(Math.max(len, 0), maxSafeInteger);
	    };
	
	    // The length property of the from method is 1.
	    return function from(arrayLike/*, mapFn, thisArg */) {
	      // 1. Let C be the this value.
	      var C = this;
	
	      // 2. Let items be ToObject(arrayLike).
	      var items = Object(arrayLike);
	
	      // 3. ReturnIfAbrupt(items).
	      if (arrayLike == null) {
	        throw new TypeError("Array.from requires an array-like object - not null or undefined");
	      }
	
	      // 4. If mapfn is undefined, then let mapping be false.
	      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
	      var T;
	      if (typeof mapFn !== 'undefined') {
	        // 5. else
	        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
	        if (!isCallable(mapFn)) {
	          throw new TypeError('Array.from: when provided, the second argument must be a function');
	        }
	
	        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
	        if (arguments.length > 2) {
	          T = arguments[2];
	        }
	      }
	
	      // 10. Let lenValue be Get(items, "length").
	      // 11. Let len be ToLength(lenValue).
	      var len = toLength(items.length);
	
	      // 13. If IsConstructor(C) is true, then
	      // 13. a. Let A be the result of calling the [[Construct]] internal method 
	      // of C with an argument list containing the single item len.
	      // 14. a. Else, Let A be ArrayCreate(len).
	      var A = isCallable(C) ? Object(new C(len)) : new Array(len);
	
	      // 16. Let k be 0.
	      var k = 0;
	      // 17. Repeat, while k < len… (also steps a - h)
	      var kValue;
	      while (k < len) {
	        kValue = items[k];
	        if (mapFn) {
	          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
	        } else {
	          A[k] = kValue;
	        }
	        k += 1;
	      }
	      // 18. Let putStatus be Put(A, "length", len, true).
	      A.length = len;
	      // 20. Return A.
	      return A;
	    };
	  }());
	}

});(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jquery.jstl.plugin", function() {		
		$.fn.jstl = function(aContext, aCallback) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstl(aContext, aCallback);
				});
			} else {
				var context = aContext;
				var callback = aCallback;
				if(typeof context === "function"){
					callback = context;
					context = undefined;
				}
				
				var processor = new de.titus.jstl.Processor(this, context);
				processor.compute(callback);
				return processor;
			}
		};
		
		$.fn.jstlAsync = function(aContext, aCallback) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstlAsync(aContext, aCallback);
				});
			} else {
				setTimeout((function(){this.jstl(aContext, aCallback)}).bind(this), 1);
				return this;
			}
		};
		
		$(document).ready(function() {
			$("[data-jstl-autorun]").jstlAsync();
		});
		
	});
}(jQuery));