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
	
	de.titus.jstl.IFunction = function(){
		
	};
	
	de.titus.jstl.IFunction.prototype.run = function(){
		
	};
});
de.titus.core.Namespace.create("de.titus.jstl.TaskRegistry", function() {
	
	var TaskRegistry = {
		taskchain : undefined
	};
	
	TaskRegistry.append = function(aName, aFunction, aChain) {
		if (!aChain && !TaskRegistry.taskchain)
			TaskRegistry.taskchain = { name: aName, task : aFunction};
		else if (!aChain && TaskRegistry.taskchain)
			TaskRegistry.append(aName, aFunction, TaskRegistry.taskchain);
		else if (aChain.next)
			TaskRegistry.append(aName, aFunction, aChain.next);
		else
			aChain.next = {name: aName,	task : aFunction };		
	}

	de.titus.jstl.TaskRegistry = TaskRegistry;
});
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.ExecuteChain", function() {
		var ExecuteChain = function(aElement, aContext, aProcessor, isRoot) {
			this.element = aElement;
			this.context = aContext;
			this.processor = aProcessor;
			this.root = isRoot;
			this.__preventChilds = false;
			this.__taskchain = de.titus.jstl.TaskRegistry.taskchain;
			console.log(this.__taskchain);
		};
		ExecuteChain.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.ExecuteChain");
		
		ExecuteChain.prototype.preventChilds = function() {
			this.__preventChilds = true;
			return this;
		};
		
		ExecuteChain.prototype.isPreventChilds = function() {
			return this.__preventChilds;
		};
		
		ExecuteChain.prototype.updateContext = function(aContext, doMerge) {
			if (doMerge)
				this.context = $.extend({}, this.context, aContext);
			else
				this.context = aContext;
		};
		
		ExecuteChain.prototype.nextTask = function(aContext) {
			if (ExecuteChain.LOGGER.isDebugEnabled())
				ExecuteChain.LOGGER.logDebug("nextTask( \"" + aContext + "\")");
			if (this.__taskchain) {
				var name = this.__taskchain.name;
				var task = this.__taskchain.task;
				this.__taskchain = this.__taskchain.next;
				if (aContext)
					this.context = $.extend({}, this.context, aContext);
				if (ExecuteChain.LOGGER.isDebugEnabled())
					ExecuteChain.LOGGER.logDebug("nextTask() -> next task: " + name);
				task.bind(null, this.element, this.context, this.processor, this).call();
			}
			else if (ExecuteChain.LOGGER.isDebugEnabled())
				ExecuteChain.LOGGER.logDebug("nextTask() -> task chain is finished!");
		};
		
		de.titus.jstl.ExecuteChain = ExecuteChain;
	});
})($);
de.titus.core.Namespace.create("de.titus.jstl.FunctionResult", function() {	
	de.titus.jstl.FunctionResult = function(runNextFunction, processChilds){
		this.runNextFunction = runNextFunction || runNextFunction == undefined;
		this.processChilds = processChilds || processChilds == undefined;
	};	
});
(function($) {
	de.titus.core.Namespace.create("de.titus.jstl.functions.If", function() {
		de.titus.jstl.functions.If = If = {
		LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.If"),
		TASK : function(aElement, aDataContext, aProcessor, aExecuteChain) {
			if (If.LOGGER.isDebugEnabled())
				If.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			
			var expression = aElement.data(this.attributeName);
			if (expression != undefined) {
				var expression = aProcessor.resolver.resolveExpression(expression, aDataContext, false);
				if (typeof expression === "function")
					expression = expression(aElement, aDataContext, aProcessor);
				
				if (!(expression == true || expression == "true")) {
					aElement.remove();
					aExecuteChain.preventChilds();
				} else
					aExecuteChain.nextTask();
			}
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
		
		TASK : function(aElement, aDataContext, aProcessor, aExecuteChain) {
			if (Preprocessor.LOGGER.isDebugEnabled())
				Preprocessor.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			
			var element = aElement || this.element;
			var tagname = element.tagName();
			if (tagname != undefined && tagname == "br")
				return aExecuteChain.preventChilds();
			
			if (!aExecuteChain.root) {
				var ignore = element.data("jstlIgnore");
				if (ignore && ignore != "") {
					ignore = aProcessor.resolver.resolveExpression(ignore, dataContext, false);
					if (ignore == "" || ignore == true || ignore == "true")
						return aExecuteChain.preventChilds();
				}
				
				var async = element.data("jstlAsync");
				if (async && async != "") {
					async = aProcessor.resolver.resolveExpression(async, dataContext, false);
					if (async == "" || async == true || async == "true") {
						aProcessor.onReady(Processor.prototype.__compute.bind(this, element, aContext || this.context), 1);
						return aExecuteChain.preventChilds();
					}
				}
			}
			
			var ignoreChilds = aElement.data("jstlIgnoreChilds");
			if (ignoreChilds && ignoreChilds != "")
				ignoreChilds = aProcessor.resolver.resolveExpression(ignoreChilds, executeChain.context, true);
			
			if (ignoreChilds != true && ignoreChilds != "true")
				aExecuteChain.preventChilds();
			
			Preprocessor.__appendEvents(aElement);
			
			aExecuteChain.nextTask();
			
		},
		
		__appendEvents : function(aElement) {
			aElement.one(de.titus.jstl.Constants.EVENTS.onLoad, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.data("jstlLoad")));
			aElement.one(de.titus.jstl.Constants.EVENTS.onSuccess, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.data("jstlSuccess")));
			aElement.one(de.titus.jstl.Constants.EVENTS.onFail, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.data("jstlFail")));
		}
		
		};
		
	});
})($);
de.titus.core.Namespace.create("de.titus.jstl.functions.Choose", function() {
	var Choose = function() {};
	Choose.prototype = new de.titus.jstl.IFunction("jstlChoose");
	Choose.prototype.constructor = Choose;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	Choose.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Choose");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	Choose.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (Choose.LOGGER.isDebugEnabled())
			Choose.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var expression = aElement.data(this.attributeName);
		if (expression != undefined) {			
			this.processChilds(aElement, aDataContext, aProcessor, aProcessor.resolver);
			return new de.titus.jstl.FunctionResult(true, true);
		}		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	Choose.prototype.processChilds = function(aChooseElement, aDataContext, aProcessor, aExpressionResolver) {
		if (Choose.LOGGER.isDebugEnabled())
			Choose.LOGGER.logDebug("execute processChilds(" + aChooseElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		var childs = aChooseElement.children();
		var resolved = false;
		var $__THIS__$ = this;
		childs.each(function() {			
			var child = $(this);
			if (!resolved && $__THIS__$.processChild(aChooseElement, child, aDataContext, aProcessor, aExpressionResolver)) {
				if (Choose.LOGGER.isTraceEnabled())
					Choose.LOGGER.logTrace("compute child: " + child);
				resolved = true;
			} else {
				if (Choose.LOGGER.isTraceEnabled())
					Choose.LOGGER.logTrace("remove child: " + child);
				child.remove();
			}
		});
	};
	
	Choose.prototype.processChild = function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
		if (Choose.LOGGER.isDebugEnabled())
			Choose.LOGGER.logDebug("execute processChild(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		if (this.processWhenElement(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver)) {
			return true;
		} else if (this.processOtherwiseElement(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver)) {
			return true;
		} else {
			return false;
		}
	};
	
	Choose.prototype.processWhenElement = function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
		if (Choose.LOGGER.isDebugEnabled())
			Choose.LOGGER.logDebug("execute processWhenElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		var expression = aElement.data("jstlWhen");
		if (expression != undefined)
			return aExpressionResolver.resolveExpression(expression, aDataContext, false);
		return false;
	};
	
	Choose.prototype.processOtherwiseElement = function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
		if (Choose.LOGGER.isDebugEnabled())
			Choose.LOGGER.logDebug("execute processOtherwiseElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		var expression = aElement.data("jstlOtherwise");
		if (expression != undefined)
			return true;
		return false;
	};	
	
	de.titus.jstl.functions.Choose = Choose;
});
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Foreach", function() {
		var Foreach = function() {
		};
		Foreach.prototype = new de.titus.jstl.IFunction("jstlForeach");
		Foreach.prototype.constructor = Foreach;
		
		/***********************************************************************
		 * static variables
		 **********************************************************************/
		Foreach.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Foreach");
		
		/***********************************************************************
		 * functions
		 **********************************************************************/
		
		Foreach.prototype.run = function(aElement, aDataContext, aProcessor) {
			if (Foreach.LOGGER.isDebugEnabled())
				Foreach.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			
			var expression = aElement.data(this.attributeName);
			if (expression != undefined) {
				this.__compute(expression, aElement, aDataContext, aProcessor, aProcessor.resolver);
				return new de.titus.jstl.FunctionResult(false, false);
			}
			return new de.titus.jstl.FunctionResult(true, true);
		};
		
		Foreach.prototype.__compute = function(aExpression, aElement, aDataContext, aProcessor, anExpressionResolver) {
			if (Foreach.LOGGER.isDebugEnabled())
				Foreach.LOGGER.logDebug("execute __compute(" + aElement + ", " + aDataContext + ", " + aProcessor + ", " + anExpressionResolver + ")");
			
			var tempalte = this.__template(aElement);
			if (tempalte == undefined)
				return;

			aElement.empty();
			
			var varName = aElement.data("jstlForeachVar") || "itemVar";
			var statusName = aElement.data("jstlForeachStatus") || "statusVar";
			var list = anExpressionResolver.resolveExpression(aExpression, aDataContext, aDataContext);
			
			var breakCondition = aElement.data("jstlForeachBreakCondition");
			if (Array.isArray(list))
				this.__list(list, tempalte, varName, statusName, breakCondition, aElement, aDataContext, aProcessor);
			else if (typeof list === "object")
				this.__map(list, tempalte, varName, statusName, breakCondition, aElement, aDataContext, aProcessor);
		};
		
		Foreach.prototype.__list = function(aListData, aTemplate, aVarname, aStatusName, aBreakCondition, aElement, aDataContext, aProcessor) {						
			var startIndex = aProcessor.resolver.resolveExpression(aElement.data("jstlForeachStartIndex"), aDataContext, 0) || 0;
			for (var i = startIndex; i < aListData.length; i++) {
				var newContent = aTemplate.clone();
				var newContext = $.extend({}, aDataContext);
				newContext[aVarname] = aListData[i];
				newContext[aStatusName] = {
				"index" : i,
				"number" : (i + 1),
				"count" : aListData.length,
				"data" : aListData,
				"context" : aDataContext
				};
				if (aBreakCondition != undefined && this.__break(newContext, aBreakCondition, aElement, aProcessor)) {
					return;
				}
				
				this.__computeContent(newContent, newContext, aElement, aProcessor);
			}
		};
		
		Foreach.prototype.__map = function(aMap, aTemplate, aVarname, aStatusName, aBreakCondition, aElement, aDataContext, aProcessor) {			
			var i = 0;
			for ( var name in aMap) {
				var newContent = aTemplate.clone();
				var newContext = jQuery.extend({}, aDataContext);
				newContext[aVarname] = aMap[name];
				newContext[aStatusName] = {
				"index" : i,
				"number" : (i + 1),
				"key" : name,
				"data" : aMap,
				"context" : aDataContext
				};
				
				if (aBreakCondition != undefined && this.__break(newContext, aBreakCondition, aElement, aProcessor))
					return;				
				
				this.__computeContent(newContent, newContext, aElement, aProcessor);
				i++;
			}
		};
		
		Foreach.prototype.__break = function(aContext, aBreakCondition, aElement, aProcessor) {
			var expression = aProcessor.resolver.resolveExpression(aBreakCondition, aContext, false);
			if (typeof expression === "function")
				expression = expression(aElement, aContext, aProcessor);
			
			return expression == true || expression == "true";
		};
		
		Foreach.prototype.__computeContent = function(aNewContent, aNewContext, aElement, aProcessor) {
			aProcessor.compute(aNewContent, aNewContext);
			aElement.append(aNewContent.contents());
		};
		
		Foreach.prototype.__template = function(aElement) {			
			var template = aElement.data("de.titus.jstl.functions.Foreach.Template");
			if(template == undefined){
				template = $("<div>").append(aElement.contents());
				aElement.data("de.titus.jstl.functions.Foreach.Template", template);
			}
			return template;
		};
		
		de.titus.jstl.functions.Foreach = Foreach;
	});
})($);
de.titus.core.Namespace.create("de.titus.jstl.functions.TextContent", function() {
	var TextContent = function() {
	};
	TextContent.prototype = new de.titus.jstl.IFunction();
	TextContent.prototype.constructor = TextContent;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	TextContent.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.TextContent");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	TextContent.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (TextContent.LOGGER.isDebugEnabled())
			TextContent.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var ignore = aElement.data("jstlTextIgnore");
		if (!ignore) {			
			if (!aElement.is("pre"))
				this.normalize(aElement[0]);
			
			var contenttype = aElement.data("jstlTextContentType") || "text";
			aElement.contents().filter(function() {
				return this.nodeType === 3 && this.textContent != undefined && this.textContent.trim() != "";
			}).each(function() {
				var text = this.textContent;
				if (text) {
					text = aProcessor.resolver.resolveText(text, aDataContext);
					var contentFunction = TextContent.CONTENTTYPE[contenttype];
					if (contentFunction)
						contentFunction(this, text, aElement, aProcessor, aDataContext);
				}
			});
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	TextContent.prototype.normalize = function(aNode) {
		if (!aNode)
			return;
		if (aNode.nodeType == 3) {
			while (aNode.nextSibling && aNode.nextSibling.nodeType == 3) {
				aNode.nodeValue += aNode.nextSibling.nodeValue;
				aNode.parentNode.removeChild(aNode.nextSibling);
			}
		} else {
			this.normalize(aNode.firstChild);
		}
		this.normalize(aNode.nextSibling);
	}

	TextContent.CONTENTTYPE = {};
	TextContent.CONTENTTYPE["html"] = function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
		$(aNode).replaceWith($.parseHTML(aText));
	};
	TextContent.CONTENTTYPE["text/html"] = TextContent.CONTENTTYPE["html"];
	
	TextContent.CONTENTTYPE["json"] = function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
		if (typeof aText === "string")
			aNode.textContent = aText;
		else
			aNode.textContent = JSON.stringify(aText);
	};
	TextContent.CONTENTTYPE["application/json"] = TextContent.CONTENTTYPE["json"];
	
	TextContent.CONTENTTYPE["text"] = function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
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
	};
	TextContent.CONTENTTYPE["text/plain"] = TextContent.CONTENTTYPE["text"];
	
	de.titus.jstl.functions.TextContent = TextContent;
});
de.titus.core.Namespace.create("de.titus.jstl.functions.AttributeContent", function() {
	var AttributeContent = function() {
	};
	AttributeContent.prototype = new de.titus.jstl.IFunction();
	AttributeContent.prototype.constructor = AttributeContent;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	AttributeContent.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.AttributeContent");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	
	AttributeContent.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (AttributeContent.LOGGER.isDebugEnabled())
			AttributeContent.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var attributes = aElement[0].attributes || [];
		for (var i = 0; i < attributes.length; i++) {
			var name = attributes[i].name;
			if (name.indexOf("data-jstl-") != 0) {
				var value = attributes[i].value;
				if (value != undefined && value != "") {
					try {
						var newValue = aProcessor.resolver.resolveText(value, aDataContext);
						if (value != newValue) {
							if (AttributeContent.LOGGER.isDebugEnabled()) {
								AttributeContent.LOGGER.logDebug("Change attribute \"" + name + "\" from \"" + value + "\" to \"" + newValue + "\"!");
							}
							aElement.attr(name, newValue);
						}
					} catch (e) {
						AttributeContent.LOGGER.logError("Can't process attribute\"" + name + "\" with value \"" + value + "\"!");
					}
				}
			}
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	de.titus.jstl.functions.AttributeContent = AttributeContent;
});
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
				aTaskChain.updateContext(aNewData,true);
			else{
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
de.titus.core.Namespace.create("de.titus.jstl.functions.Include", function() {
	var Include = function() {
		this.cache = {};
	};
	Include.prototype = new de.titus.jstl.IFunction("include");
	Include.prototype.constructor = Include;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	Include.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Include");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	
	Include.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (Include.LOGGER.isDebugEnabled())
			Include.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		
		var expression = aElement.data(this.attributeName);
		if (expression) {
			this.__compute(expression, aElement, aDataContext, aProcessor);
		}
		return new de.titus.jstl.FunctionResult(true, false);
	};
	
	Include.prototype.__compute = function(anIncludeExpression, aElement, aDataContext, aProcessor) {
		var url = aProcessor.resolve.resolveText(anIncludeExpression, aDataContext);
		var disableCaching = url.indexOf("?") >= 0 || aElement.data("jstlIncludeCacheDisabled") != undefined;
		var content = "";
		if (!disableCaching)
			content = this.cache[url];
		
		var includeMode = this.__mode(aElement, aDataContext, aProcessor);
		if (content)
			this.__include(aElement, content, includeMode, aProcessor, aDataContext);
		else {
			var options = this.__options(aElement, aDataContext, aProcessor);
			var ajaxSettings = {
			'url' : de.titus.core.Page.getInstance().buildUrl(url),
			'async' : false,
			'cache' : aElement.data("jstlIncludeAjaxCacheDisabled") == undefined,
			"dataType" : "html"
			};
			ajaxSettings = $.extend(true, ajaxSettings, options);
			var $__THIS__$ = this;
			ajaxSettings.success = function(template) {
				var $template = $("<div/>").append(template);
				$__THIS__$.cache[url] = $template 
				$__THIS__$.__include(aElement, $template, includeMode, aProcessor, aDataContext);
			};
			
			ajaxSettings.error = function(error) {
				throw JSON.stringify(error);
			};
			$.ajax(ajaxSettings)
		}
	};
	
	Include.prototype.__options = function(aElement, aDataContext, aProcessor) {
		var options = aElement.data("jstlIncludeOptions");
		if (options) {
			options = aProcessor.resolver.resolveText(options, aDataContext);
			options = aProcessor.resolver.resolveExpression(options, aDataContext);
			return options || {};
		}
		
		return {};
	};
	
	Include.prototype.__mode = function(aElement, aDataContext, aProcessor) {
		var mode = aElement.data("jstlIcludeMode");
		if (mode == undefined)
			return "replace";
		
		mode = mode.toLowerCase();
		if (mode == "append" || mode == "replace" || mode == "prepend")
			return mode;
		
		return "replace";
	};
	
	Include.prototype.__include = function(aElement, aTemplate, aIncludeMode, aProcessor, aDataContext) {
		if (Include.LOGGER.isDebugEnabled())
			Include.LOGGER.logDebug("execute __include(" + aElement + ", " + aTemplate + ", " + aIncludeMode + ")");
		var content = aTemplate.clone();
		aProcessor.compute(content, aDataContext);
		
		if (aIncludeMode == "replace"){
			aElement.empty();
			content.contents().appendTo(aElement);
		}
		else if (aIncludeMode == "append")
			content.contents().appendTo(aElement);
		else if (aIncludeMode == "prepend")
			content.contents().prependTo(aElement);
	};
	
	de.titus.jstl.functions.Include = Include;	
});
de.titus.core.Namespace.create("de.titus.jstl.functions.AddAttribute", function() {
	var AddAttribute = function() {};
	AddAttribute.prototype = new de.titus.jstl.IFunction("jstlAddAttribute");
	AddAttribute.prototype.constructor = AddAttribute;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	AddAttribute.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.AddAttribute");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	
	AddAttribute.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (AddAttribute.LOGGER.isDebugEnabled())
			AddAttribute.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var expression = aElement.data(this.attributeName);
		if (expression) {			
			expression = aProcessor.resolver.resolveExpression(expression, aDataContext, false);			
			if (expression && typeof expression === "function")
				expression = expression(aElement, aDataContext, aProcessor);			
			
			if (expression && Array.isArray(expression))
				this.processArray(expression, aElement, aDataContext, aProcessor);
			else if (expression && typeof expression === "object")
				this.processObject(expression, aElement, aDataContext, aProcessor);
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	AddAttribute.prototype.processArray = function(theDataArray, aElement, aDataContext, aProcessor) {
		for (var i = 0; i < theDataArray.length; i++) {
			this.processObject(theDataArray[i], aElement, aDataContext, aProcessor);
		}
	};
	
	AddAttribute.prototype.processObject = function(theData, aElement, aDataContext, aProcessor) {
		if (theData.name)
			aElement.attr(theData.name, theData.value);
		else
			AddAttribute.LOGGER.logError("run processObject (" + theData + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ") -> No attribute name defined!");
	};
	
	de.titus.jstl.functions.AddAttribute = AddAttribute;
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Databind", function() {
	var Databind = function() {};
	Databind.prototype = new de.titus.jstl.IFunction("jstlDatabind");
	Databind.prototype.constructor = Databind;
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * static variables
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	Databind.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Databind");
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * functions
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	
	Databind.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (Databind.LOGGER.isDebugEnabled())
			Databind.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
				
		var varname = aElement.data("jstlDatabindName");
		if (varname && varname.trim() != "") {
			var value = this.__value(aElement, aDataContext, aProcessor);
			if(value != undefined)
				aElement.data(varname, value);			
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	
	Databind.prototype.__value = function(aElement, aDataContext, aProcessor) {
		return aProcessor.resolver.resolveExpression(aElement.data("jstlDatabind"), aDataContext, undefined);
	};
	
	de.titus.jstl.functions.Databind = Databind;
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Eventbind", function() {
	var Eventbind = function() {};
	Eventbind.prototype = new de.titus.jstl.IFunction("jstlEventbind");
	Eventbind.prototype.constructor = Eventbind;
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * static variables
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	Eventbind.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Eventbind");
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * functions
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	
	Eventbind.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (Eventbind.LOGGER.isDebugEnabled())
			Eventbind.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		aElement.de_titus_core_EventBind(aDataContext);
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	
	de.titus.jstl.functions.Eventbind = Eventbind;
});
(function($, SpecialFunctions) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.Processor", function() {		
		var Processor = function(aElement, aContext) {
			this.element = aElement;
			this.context = aContext || {};
			this.resolver = new de.titus.core.ExpressionResolver(this.element.data("jstlExpressionRegex"));
		};
		
		Processor.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.Processor");
		Processor.STATICEVENTHANDLER = function(aExpression, aEvent, aDataContext, aProcessor){			
			if(aExpression && aExpression != ""){
				var eventAction = aProcessor.resolver.resolveExpression(aExpression, aDataContext);
				if(typeof eventAction === "function")
					eventAction(aDataContext.$element, aDataContext, aProcessor);
			}
		};
		
		Processor.prototype.compute = function(aElement, aContext) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute compute(" + aElement + ", " + aContext + ")");
						
			if (!aElement)
				this.element.trigger(de.titus.jstl.Constants.EVENTS.onStart, [this.context, this]);
			
			this.__computeElement(aElement, aContext);
		};
		
		Processor.prototype.__computeElement = function(aElement, aDataContext) {
			var element = aElement || this.element;
			var dataContext = aDataContext || this.context;
			dataContext.$element = element;
			
			element.trigger(de.titus.jstl.Constants.EVENTS.onLoad, [dataContext, this]);
			var executeChain = new de.titus.jstl.ExecuteChain(element, dataContext, this, !aElement);
			executeChain.nextTask();
			
			if (executeChain.isPreventChilds())
					this.__computeChildren(element, executeChain.context);
			
			if (element.tagName() == "jstl" && element.contents().length > 0)
				element.replaceWith(element.contents());
			
			element.trigger(de.titus.jstl.Constants.EVENTS.onSuccess, [dataContext, this]);		
			
			if (!aElement)
				$(document).ready(Processor.prototype.onReady.bind(this));			
		};		
		
		Processor.prototype.__computeChildren = function(aElement, aContext) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute __computeChildren(" + aElement + ", " + aContext + ")");
			
			var children = aElement.children() || [];
			for(var i = 0; i < children.length; i++)
				this.compute($(children[i]), aContext);
		};		
		
		
		Processor.prototype.onReady = function(aFunction) {
			if (aFunction) {
				this.element.one(de.titus.jstl.Constants.EVENTS.onReady, function(anEvent) {
					aFunction(anEvent.delegateTarget, anEvent.data);
				});
				return this;
			} else {
				for (var i = 0; i < this.onReadyEvent.length; i++) {
					try {
						this.onReadyEvent[i](this.config.element, this);
					} catch (e) {
						Processor.LOGGER.logError("Error by process an on ready event! -> " + (e.message || e));
					}
				}
				
				this.config.element.trigger(de.titus.jstl.Constants.EVENTS.onReady, this);
			}
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
	/*
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Include());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Choose());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Foreach());	
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.AddAttribute());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Databind());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Eventbind());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.TextContent());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.AttributeContent());
	*/
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
		$.fn.jstl = function(aContext) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstl(aContext);
				});
			} else {
				var processor = new de.titus.jstl.Processor(this, aContext);
				processor.compute();
				return processor;
			}
		};
		
		$.fn.jstlAsync = function(aContext) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstlAsync(aContext);
				});
			} else {
				setTimeout((function(aElement, aContext){
						var processor = new de.titus.jstl.Processor(aElement, aContext);
						processor.compute();
					}).bind(null, this, aContext), 10);
				return this;
			}
		};
		
		$(document).ready(function() {
			$("[data-jstl-autorun]").jstlAsync();
		});
		
	});
}(jQuery));