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
de.titus.core.Namespace.create("de.titus.jstl.FunctionRegistry", function() {	
	de.titus.jstl.FunctionRegistry = function(){
		this.functions = new Array();
	};
	
	de.titus.jstl.FunctionRegistry.prototype.add = function(aFunction){
		this.functions.push(aFunction);
	};
	
	
	de.titus.jstl.FunctionRegistry.getInstance = function(){
		if(de.titus.jstl.FunctionRegistry.INSTANCE == undefined){
			de.titus.jstl.FunctionRegistry.INSTANCE = new de.titus.jstl.FunctionRegistry();
		}
		
		return de.titus.jstl.FunctionRegistry.INSTANCE;
	};
	
});
de.titus.core.Namespace.create("de.titus.jstl.FunctionResult", function() {	
	de.titus.jstl.FunctionResult = function(runNextFunction, processChilds){
		this.runNextFunction = runNextFunction || runNextFunction == undefined;
		this.processChilds = processChilds || processChilds == undefined;
	};	
});
de.titus.core.Namespace.create("de.titus.jstl.IFunction", function() {	
	de.titus.jstl.IFunction = function(theAttributeName){
		this.attributeName = theAttributeName;	
	};
	
	de.titus.jstl.IFunction.prototype.run = /*de.titus.jstl.FunctionResult*/ function(aElement, aDataContext, aProcessor){return true;};
	
});
(function() {
	de.titus.core.Namespace.create("de.titus.jstl.functions.If", function() {
		var If = function() {};
		If.prototype = new de.titus.jstl.IFunction("if");
		If.prototype.constructor = If;
		
		/***********************************************************************
		 * static variables
		 **********************************************************************/
		If.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.If");
		
		If.prototype.run = /* boolean */function(aElement, aDataContext, aProcessor) {
			if (If.LOGGER.isDebugEnabled())
				If.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			
			var processor = aProcessor || new de.titus.jstl.Processor();
			var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
			
			var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
			if (expression != undefined) {
				var expressionResult = expressionResolver.resolveExpression(expression, aDataContext, false);
				if (typeof expressionResult === "function")
					expressionResult = expressionResult(aElement, aDataContext, aProcessor);
				
				expressionResult = expressionResult == true || expressionResult == "true";
				if (!expressionResult) {
					aElement.remove();
					return new de.titus.jstl.FunctionResult(false, false);
				}
			}
			
			return new de.titus.jstl.FunctionResult(true, true);
		};
		
		de.titus.jstl.functions.If = If;
		
	});
})();
de.titus.core.Namespace.create("de.titus.jstl.functions.Choose", function() {
	var Choose = function() {};
	Choose.prototype = new de.titus.jstl.IFunction("choose");
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
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			
			this.processChilds(aElement, aDataContext, processor, expressionResolver);
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
		
		var expression = aElement.attr(aProcessor.config.attributePrefix + 'when');
		if (expression != undefined) {
			return aExpressionResolver.resolveExpression(expression, aDataContext, false);
		}
		return false;
	};
	
	Choose.prototype.processOtherwiseElement = function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
		if (Choose.LOGGER.isDebugEnabled())
			Choose.LOGGER.logDebug("execute processOtherwiseElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		var expression = aElement.attr(aProcessor.config.attributePrefix + 'otherwise');
		if (expression != undefined) {
			return true;
		}
		return false;
	};
	
	
	de.titus.jstl.functions.Choose = Choose;
});
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Foreach", function() {
		var Foreach = function() {
		};
		Foreach.prototype = new de.titus.jstl.IFunction("foreach");
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
			
			var processor = aProcessor || new de.titus.jstl.Processor();
			var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
			
			var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
			if (expression != undefined) {
				this.internalProcession(expression, aElement, aDataContext, processor, expressionResolver);
				return new de.titus.jstl.FunctionResult(false, false);
			}
			return new de.titus.jstl.FunctionResult(true, true);
		};
		
		Foreach.prototype.internalProcession = function(aExpression, aElement, aDataContext, aProcessor, anExpressionResolver) {
			if (Foreach.LOGGER.isDebugEnabled())
				Foreach.LOGGER.logDebug("execute processList(" + aElement + ", " + aDataContext + ", " + aProcessor + ", " + anExpressionResolver + ")");
			
			var tempalte = this.getRepeatableContent(aElement);
			aElement.empty();
			if (tempalte == undefined)
				return;
			
			var varName = this.getVarname(aElement, aProcessor);
			var statusName = this.getStatusName(aElement, aProcessor);
			var list = undefined;
			if (aExpression == "") {
				Foreach.LOGGER.logWarn("No list data specified. Using the data context!");
				list = aDataContext;
			} else
				list = anExpressionResolver.resolveExpression(aExpression, aDataContext, new Array());
			
			var breakCondition = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-break-condition");
			if (list != undefined && (typeof list === "array" || list.length != undefined)) {
				this.processList(list, tempalte, varName, statusName, breakCondition, aElement, aDataContext, aProcessor, anExpressionResolver);
			} else if (list != undefined) {
				this.processMap(list, tempalte, varName, statusName, breakCondition, aElement, aDataContext, aProcessor, anExpressionResolver);
			}
		};
		
		Foreach.prototype.processList = function(aListData, aTemplate, aVarname, aStatusName, aBreakCondition, aElement, aDataContext, aProcessor, anExpressionResolver) {
			if (aListData == undefined || aListData.length == undefined || aListData.length < 1)
				return;
			
			var startIndex = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-start-index") || 0;
			startIndex = anExpressionResolver.resolveExpression(startIndex, aDataContext, 0) || 0;
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
				if (aBreakCondition != undefined && this.processBreakCondition(newContext, aBreakCondition, aElement, aProcessor)) {
					return;
				}
				
				this.processNewContent(newContent, newContext, aElement, aProcessor);
				newContext[aVarname] = undefined;
				newContext[aStatusName] = undefined;
			}
		};
		
		Foreach.prototype.processMap = function(aMap, aTemplate, aVarname, aStatusName, aBreakCondition, aElement, aDataContext, aProcessor, anExpressionResolver) {
			var count = 0;
			for ( var name in aMap)
				count++;
			
			var i = 0;
			for ( var name in aMap) {
				var newContent = aTemplate.clone();
				var newContext = jQuery.extend({}, aDataContext);
				newContext[aVarname] = aMap[name];
				newContext[aStatusName] = {
				"index" : i,
				"number" : (i + 1),
				"key" : name,
				"count" : count,
				"data" : aMap,
				"context" : aDataContext
				};
				
				if (aBreakCondition != undefined && this.processBreakCondition(newContext, aBreakCondition, aElement, aProcessor)) {
					return;
				}
				
				i++;
				this.processNewContent(newContent, newContext, aElement, aProcessor);
				newContext[aVarname] = undefined;
				newContext[aStatusName] = undefined;
			}
		};
		
		Foreach.prototype.processBreakCondition = function(aContext, aBreakCondition, aElement, aProcessor) {
			var expressionResolver = aProcessor.expressionResolver || new de.titus.jstl.ExpressionResolver();
			var expressionResult = expressionResolver.resolveExpression(aBreakCondition, aContext, false);
			if (typeof expressionResult === "function")
				expressionResult = expressionResult(aElement, aContext, aProcessor);
			
			return expressionResult == true || expressionResult == "true";
		};
		
		Foreach.prototype.processNewContent = function(aNewContent, aNewContext, aElement, aProcessor) {
			aProcessor.compute(aNewContent, aNewContext);
			aElement.append(aNewContent.contents());
		};
		
		Foreach.prototype.getVarname = function(aElement, aProcessor) {
			var varname = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-var");
			if (varname == undefined)
				return "itemVar";
			
			return varname;
		};
		
		Foreach.prototype.getStatusName = function(aElement, aProcessor) {
			var statusName = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-status");
			if (statusName == undefined)
				return "statusVar";
			
			return statusName;
		};
		
		Foreach.prototype.getRepeatableContent = function(aElement) {
			return $("<div>").append(aElement.contents());
		};
		
		de.titus.jstl.functions.Foreach = Foreach;
	});
})($);
de.titus.core.Namespace.create("de.titus.jstl.functions.TextContent", function() {
	var TextContent = function() {};
	TextContent.prototype = new de.titus.jstl.IFunction();
	TextContent.prototype.constructor = TextContent;
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * static variables
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	TextContent.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.TextContent");
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * functions
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	TextContent.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (TextContent.LOGGER.isDebugEnabled())
			TextContent.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		var ignore = aElement.attr(processor.config.attributePrefix + "text-ignore");
		
		if (ignore != true || ignore != "true") {
			
			if(!aElement.is("pre"))
				this.normalize(aElement[0]);
			
			aElement.contents().filter(function() {
				return this.nodeType === 3 && this.textContent != undefined && this.textContent.trim() != "";
			}).each(function() {
				var contenttype = aElement.attr(processor.config.attributePrefix + "text-content-type") || "text";
				var node = this;
				var text = node.textContent;
				if(text)
					text = text.trim();

				text = expressionResolver.resolveText(text, aDataContext);
				var contentFunction = TextContent.CONTENTTYPE[contenttype];
				if (contentFunction)
					contentFunction(node, text, aElement, processor, aDataContext);
			});
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	TextContent.prototype.normalize = function(node) {
		if (!node) {
			return;
		}
		if (node.nodeType == 3) {
			while (node.nextSibling && node.nextSibling.nodeType == 3) {
				node.nodeValue += node.nextSibling.nodeValue;
				node.parentNode.removeChild(node.nextSibling);
			}
		} else {
			this.normalize(node.firstChild);
		}
		this.normalize(node.nextSibling);
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
		
		var trimLength = aBaseElement.attr(aProcessor.config.attributePrefix + "text-trim-length");
		if (trimLength != undefined && trimLength != "") {
			trimLength = aProcessor.expressionResolver.resolveExpression(trimLength, aDataContext, "-1");
			trimLength = parseInt(trimLength);
			if (trimLength && trimLength > 0)
				text = de.titus.core.StringUtils.trimTextLength(text, trimLength);
		}
		
		var preventformat = aBaseElement.attr(aProcessor.config.attributePrefix + "text-prevent-format");
		if (preventformat != undefined && preventformat != "false") {
			preventformat = preventformat == "" || aProcessor.expressionResolver.resolveExpression(preventformat, aDataContext, true) || true;
			if (preventformat == "true" || preventformat == true) {
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
	var AttributeContent = function() {};
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
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		if (aElement.length == 1) {
			var attributes = aElement[0].attributes || [];
			for (var i = 0; i< attributes.length; i++) {
				var name = attributes[i].name;				
				if (name.indexOf(processor.config.attributePrefix) != 0) {
					var value = attributes[i].value;
					if (value != undefined && value != null && value != "" && value != "null") {
						try {
							var newValue = expressionResolver.resolveText(value, aDataContext);
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
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	de.titus.jstl.functions.AttributeContent = AttributeContent;	
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Data", function() {
	var Data = function() {};
	Data.prototype = new de.titus.jstl.IFunction("data");
	Data.prototype.constructor = Data;
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * static variables
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	Data.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Data");
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * functions
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	
	Data.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (Data.LOGGER.isDebugEnabled())
			Data.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			this.internalProcessing(expression, aElement, aDataContext, processor, expressionResolver);
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	Data.prototype.internalProcessing = function(anExpression, aElement, aDataContext, aProcessor, anExpressionResolver) {
		var varname = this.getVarname(aElement, aDataContext, aProcessor, anExpressionResolver);
		var mode = this.getMode(aElement, aProcessor, anExpressionResolver);
		if (this[mode] != undefined && typeof this[mode] === "function")
			this[mode].call(this, anExpression, aElement, varname, aDataContext, aProcessor, anExpressionResolver);
		else
			this["direct"].call(this, anExpression, aElement, varname, aDataContext, aProcessor, anExpressionResolver);
	};
	
	Data.prototype.getOptions = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		var options = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-options");
		if (options != undefined) {
			options = anExpressionResolver.resolveText(options, aDataContext);
			options = anExpressionResolver.resolveExpression(options, aDataContext);
			return options || {};
		}
		
		return {};
	};
	
	Data.prototype.getMode = function(aElement, aProcessor, anExpressionResolver) {
		return aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-mode") || "direct";
	};
	
	Data.prototype.getVarname = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		return aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-var");
	};
	
	Data.prototype["direct"] = function(anExpression, aElement, aVarname, aDataContext, aProcessor, anExpressionResolver) {
		var newData = anExpressionResolver.resolveExpression(anExpression, aDataContext);
		this.addNewData(newData, aVarname, aDataContext, aProcessor, anExpressionResolver);
	};
	
	Data.prototype["remote"] = function(anExpression, aElement, aVarname, aDataContext, aProcessor, anExpressionResolver) {		
		var $__THIS__$ = this;		
		var url = anExpressionResolver.resolveText(anExpression, aDataContext);
		var option = this.getOptions(aElement, aDataContext, aProcessor, anExpressionResolver);
		var dataType = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-datatype") || "json";
		
		var ajaxSettings = {
		'url' : de.titus.core.Page.getInstance().buildUrl(url),
		'async' : false,
		'cache' : false,
		'dataType' : dataType
		};
		ajaxSettings = $.extend(ajaxSettings, option);
		ajaxSettings.success = function(newData) {
			var data = newData;
			if(dataType.toLowerCase() == "xml")
				data = de.titus.core.Converter.xmlToJson(newData);			
			$__THIS__$.addNewData(data, aVarname, aDataContext, aProcessor, anExpressionResolver);
		};
		
		$.ajax(ajaxSettings);
	};
	
	Data.prototype["url-parameter"] = function(anExpression, aElement, aVarname, aDataContext, aProcessor, anExpressionResolver) {
		var parameterName = anExpressionResolver.resolveText(anExpression, aDataContext);
		var value = de.titus.core.Page.getInstance().getUrl().getParameter(parameterName);
		this.addNewData(value, aVarname, aDataContext, aProcessor, anExpressionResolver);
	};
	
	Data.prototype.addNewData = function(aNewData, aVarname, aDataContext, aProcessor, anExpressionResolver) {
		if (Data.LOGGER.isDebugEnabled())
			Data.LOGGER.logDebug("execute addNewData(" + aNewData + ", " + aVarname + ", " + aDataContext + ", " + aProcessor + ", " + anExpressionResolver + ")");
		if (aVarname == undefined) {
			$.extend(true, aDataContext, aNewData);
		} else {
			aDataContext[aVarname] = aNewData;
		}
	};
	
	de.titus.jstl.functions.Data = Data;
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
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.jstl.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			this.internalProcessing(expression, aElement, aDataContext, processor, expressionResolver);
		}
		return new de.titus.jstl.FunctionResult(true, false);
	};
	
	Include.prototype.internalProcessing = function(anIncludeExpression, aElement, aDataContext, aProcessor, anExpressionResolver) {
		var url = anExpressionResolver.resolveText(anIncludeExpression, aDataContext);
		var disableCaching = url.indexOf("?") >= 0 || aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-cache-disabled") != undefined;
		var content = "";
		if (!disableCaching)
			content = this.cache[url];
		
		var includeMode = this.getIncludeMode(aElement, aDataContext, aProcessor, anExpressionResolver);
		if (content)
			this.addHtml(aElement, content, includeMode, aProcessor, aDataContext);
		else {
			var options = this.getOptions(aElement, aDataContext, aProcessor, anExpressionResolver);
			var ajaxSettings = {
			'url' : de.titus.core.Page.getInstance().buildUrl(url),
			'async' : false,
			'cache' : aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-ajax-cache-disabled") == undefined,
			"dataType" : "html"
			};
			ajaxSettings = $.extend(true, ajaxSettings, options);
			var $__THIS__$ = this;
			ajaxSettings.success = function(template) {
				var $template = $("<div/>").append(template);
				$__THIS__$.cache[url] = $template 
				$__THIS__$.addHtml(aElement, $template, includeMode, aProcessor, aDataContext);
			};
			
			ajaxSettings.error = function(error) {
				throw JSON.stringify(error);
			};
			$.ajax(ajaxSettings)
		}
	};
	
	Include.prototype.getOptions = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		var options = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-options");
		if (options != undefined) {
			options = anExpressionResolver.resolveText(options, aDataContext);
			options = anExpressionResolver.resolveExpression(options, aDataContext);
			return options || {};
		}
		
		return {};
	};
	
	Include.prototype.getIncludeMode = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		var mode = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-mode");
		if (mode == undefined)
			return "replace";
		
		mode = mode.toLowerCase();
		if (mode == "append" || mode == "replace" || mode == "prepend")
			return mode;
		
		return "replace";
	};
	
	Include.prototype.addHtml = function(aElement, aTemplate, aIncludeMode, aProcessor, aDataContext) {
		if (Include.LOGGER.isDebugEnabled())
			Include.LOGGER.logDebug("execute addHtml(" + aElement + ", " + aTemplate + ", " + aIncludeMode + ")");
		var content = aTemplate.clone();
		aProcessor.compute(content, aDataContext);
		
		if (aIncludeMode == "replace"){
			aElement.empty();
			content.contents().appendTo(aElement);
			//aElement.html(content.html());
		}
		else if (aIncludeMode == "append")
		{			
			content.contents().appendTo(aElement);
			//aElement.append(content.html());
		}
		else if (aIncludeMode == "prepend"){
			content.contents().prependTo(aElement);
			//aElement.prepend(content.html());
		}
		else
		{
			aElement.empty();
			content.contents().appendTo(aElement);
		}		
	};
	
	de.titus.jstl.functions.Include = Include;	
});
de.titus.core.Namespace.create("de.titus.jstl.functions.AddAttribute", function() {
	var AddAttribute = function() {};
	AddAttribute.prototype = new de.titus.jstl.IFunction("add-attribute");
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
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			
			var expressionResult = expressionResolver.resolveExpression(expression, aDataContext, false);
			
			if (expressionResult != undefined && typeof expressionResult === "function")
				expressionResult = expressionResult(aElement, aDataContext, aProcessor);			
			else if (expressionResult != undefined && typeof expressionResult === "array")
				this.processArray(expressionResult, aElement, aDataContext, processor);
			else
				this.processObject(expressionResult, aElement, aDataContext, processor);
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	AddAttribute.prototype.processArray = function(theDataArray, aElement, aDataContext, aProcessor) {
		for (var i = 0; i < theDataArray.length; i++) {
			this.processObject(theDataArray[i], aElement, aDataContext, aProcessor);
		}
	};
	
	AddAttribute.prototype.processObject = function(theData, aElement, aDataContext, aProcessor) {
		if (theData.name != undefined) {
			aElement.attr(theData.name, theData.value);
		} else {
			AddAttribute.LOGGER.logError("run processObject (" + theData + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ") -> No attribute name defined!");
		}
	};
	
	de.titus.jstl.functions.AddAttribute = AddAttribute;
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Databind", function() {
	var Databind = function() {};
	Databind.prototype = new de.titus.jstl.IFunction("databind");
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
		
		var expressionResolver = aProcessor.expressionResolver || new de.titus.core.ExpressionResolver();
		
		var varname = this.getVarname(aElement, aDataContext, aProcessor, expressionResolver);
		if (varname != undefined && varname.trim().length != 0) {
			var value = this.getValue(aElement, aDataContext, aProcessor, expressionResolver);
			if(value != undefined)
				aElement.data(varname, value);			
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	Databind.prototype.getVarname = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		return aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-name");
	};
	
	Databind.prototype.getValue = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		var valueString =  aElement.attr(aProcessor.config.attributePrefix + this.attributeName);
		
		return anExpressionResolver.resolveExpression(valueString, aDataContext, undefined);
	};
	
	de.titus.jstl.functions.Databind = Databind;
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Eventbind", function() {
	var Eventbind = function() {};
	Eventbind.prototype = new de.titus.jstl.IFunction("eventbind");
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
(function($) {
	de.titus.core.Namespace.create("de.titus.jstl.Processor", function() {
		
		/**
		 * <code>
		 * config: {
		 * "element": element,
		 * "data": dataContext,
		 * "expressionRegex": expressionRegex,
		 * "onLoad": function(){},
		 * "onSuccess":function(){},
		 * "onFail": function(){},
		 * "attributePrefix" : "jstl-" 
		 * }
		 * </code>
		 */
		var Processor = function(aConfig) {
			
			this.config = {
			"element" : undefined,
			"data" : {},
			"attributePrefix" : "jstl-",
			"expressionRegex" : undefined
			};
			
			this.config = $.extend(true, this.config, aConfig);
			var expressionRegex = this.config.element.attr(this.config.attributePrefix + "expression-regex");
			if (expressionRegex != undefined && expressionRegex != "")
				this.config.expressionRegex = expressionRegex;
			
			this.expressionResolver = new de.titus.core.ExpressionResolver(this.config.expressionRegex);
			
			this.onReadyEvent = new Array();
		};
		
		/***********************************************************************
		 * static variables
		 **********************************************************************/
		Processor.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.Processor");
		
		/***********************************************************************
		 * functions
		 **********************************************************************/
		
		Processor.prototype.compute = /* boolean */function(aElement, aDataContext) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute compute(" + (aElement != undefined ? aElement.prop("tagName") : aElement) + ", " + aDataContext + ")");
			if (aElement == undefined)
				return this.internalComputeRoot();
			
			if (!this.isElementProcessable(aElement)) {
				return true;
			}
			
			var events = this.getEvents(aElement) || {};
			return this.internalComputeElement(aElement, aDataContext, events, false);
		};
		
		Processor.prototype.internalComputeRoot = /* boolean */function() {
			
			var events = this.getEvents(this.config.element) || {};
			if (this.config.onLoad)
				events.onLoad = this.config.onLoad;
			if (this.config.onSuccess)
				events.onSuccess = this.config.onSuccess;
			if (this.config.onFail)
				events.onFail = this.config.onFail;
			
			this.config.element.trigger(de.titus.jstl.Constants.EVENTS.onStart,[this.config.data, this ]);
			return this.internalComputeElement(this.config.element, this.config.data, events, true);
		};
		
		Processor.prototype.internalComputeElement = function(aElement, aDataContext, theEvents, isRoot) {			
			var dataContext = aDataContext || this.config.data;
			dataContext.$element = aElement;			
			if (!isRoot) {
				var ignore = aElement.attr(this.config.attributePrefix + "ignore");
				if (ignore != undefined && ignore != "")
					ignore = de.titus.core.SpecialFunctions.doEvalWithContext(ignore, dataContext, false);
				
				if (ignore == "" || ignore == true || ignore == "true") {
					return true;
				}
				
				var async = aElement.attr(this.config.attributePrefix + "async");
				if (async != undefined && async != "")
					async = de.titus.core.SpecialFunctions.doEvalWithContext(async, dataContext, false);
				
				if (async == "" || async == true || async == "true") {
					//this.onReady((function(aElement, aDataContext){aElement.jstl({data:aDataContext})}).bind(null,aElement, aDataContext));	
					
					this.onReady((function(aElement, aDataContext){
						console.log(aElement, aDataContext);
						setTimeout($.fn.jstl.bind(aElement,{data:aDataContext}), 10);
					}).bind(null,aElement, dataContext));
					return true;
				}				
			}
			
			if (theEvents.onLoad != undefined && typeof theEvents.onLoad === "function")
				theEvents.onLoad(aElement, aDataContext, this);
			
			aElement.trigger(de.titus.jstl.Constants.EVENTS.onLoad,[aDataContext, this ]);			
			var processResult = true;
			var result = this.internalExecuteFunction(aElement, dataContext);
			if (result.processChilds) {
				
				var ignoreChilds = aElement.attr(this.config.attributePrefix + "ignore-childs");
				if (ignoreChilds != undefined && ignoreChilds != "")
					ignoreChilds = de.titus.core.SpecialFunctions.doEvalWithContext(ignoreChilds, aDataContext, true);
				else if(ignoreChilds == "")
					ignoreChilds = true;
				else {
					var childprocessing = aElement.attr(this.config.attributePrefix + "processor-child-processing");
					if (childprocessing != undefined && childprocessing != "")
						ignoreChilds = !de.titus.core.SpecialFunctions.doEvalWithContext(childprocessing, aDataContext, true);
					else
						ignoreChilds = false;
				}
				if (ignoreChilds != true && ignoreChilds != "true")
					this.internalComputeChilds(aElement, dataContext);
			}
			
			if (aElement.tagName() == "jstl" && aElement.contents().length > 0)
				aElement.replaceWith(aElement.contents());
			
			if (processResult) {
				if (theEvents.onSuccess != undefined && typeof theEvents.onSuccess === "function")
					theEvents.onSuccess(aElement, aDataContext, this);
				aElement.trigger(de.titus.jstl.Constants.EVENTS.onSuccess, aDataContext);
			} else if (theEvents.onFail != undefined && typeof theEvents.onFail === "function") {
				theEvents.onFail(aElement, aDataContext, this);
				aElement.trigger(de.titus.jstl.Constants.EVENTS.onFail, aDataContext);
			}
			
			if (isRoot) {
				var processor = this;
				$(document).ready(function() {processor.onReady();});
			}
			
			return processResult;
		};
		
		Processor.prototype.isElementProcessable = function(aElement) {
			var tagname = aElement.tagName();
			if (tagname != undefined) {
				if (tagname == "br")
					return false;
				
				return true;
			}
			return false;
		};
		
		Processor.prototype.internalExecuteFunction = /* boolean */function(aElement, aDataContext) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute internalExecuteFunction(" + aElement + ", " + aDataContext + ")");
			
			var functions = de.titus.jstl.FunctionRegistry.getInstance().functions;
			var result = new de.titus.jstl.FunctionResult();
			for (var i = 0; i < functions.length; i++) {
				var functionObject = functions[i];
				var executeFunction = this.isFunctionNeeded(functionObject, aElement);
				if (executeFunction) {
					var newResult = this.executeFunction(functionObject, aElement, aDataContext, result) || new de.titus.jstl.FunctionResult();
					result.runNextFunction = newResult.runNextFunction && result.runNextFunction;
					result.processChilds = newResult.processChilds && result.processChilds;
					if (!result.runNextFunction)
						return result;
				}
			}
			return result;
		};
		
		Processor.prototype.internalComputeChilds = /* boolean */function(aElement, aDataContext) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute internalComputeChilds(" + aElement + ", " + aDataContext + ")");
			
			var childs = aElement.children();
			if (childs == undefined)
				return true;
			
			var processor = this;
			var result = true;
			childs.each(function() {
				if (result && !processor.compute($(this), aDataContext))
					result = false;
			});
			
			return result;
			
		};
		
		Processor.prototype.getEvents = function(aElement) {
			var events = {};
			
			var onLoad = aElement.attr(this.config.attributePrefix + "load");
			var onSuccess = aElement.attr(this.config.attributePrefix + "success");
			var onFail = aElement.attr(this.config.attributePrefix + "fail");
			
			if (onLoad != null)
				events.onLoad = this.expressionResolver.resolveExpression(onLoad, {});
			if (onSuccess != null)
				events.onSuccess = this.expressionResolver.resolveExpression(onSuccess, {});
			if (onFail != null)
				events.onFail = this.expressionResolver.resolveExpression(onFail, {});
			
			return events;
		};
		
		Processor.prototype.isFunctionNeeded = function(aFunction, aElement) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute isFunctionNeeded(" + aFunction + ", " + aElement + ")");
			
			var executeFunction = true;
			if (aFunction.attributeName != undefined && aFunction.attributeName != "") {
				var expression = aElement.attr(this.config.attributePrefix + aFunction.attributeName);
				executeFunction = expression !== undefined;
			}
			
			return executeFunction;
		};
		
		Processor.prototype.executeFunction = function(aFunction, aElement, aDataContext, aCurrentFunctionResult) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute executeFunction(" + aFunction + ", " + aElement + ", " + aDataContext + ", " + aCurrentFunctionResult + ")");
			
			var result = aFunction.run(aElement, aDataContext, this);
			if (result != undefined) {
				aCurrentFunctionResult.runNextFunction = aCurrentFunctionResult.runNextFunction && result.runNextFunction;
				aCurrentFunctionResult.processChilds = aCurrentFunctionResult.processChilds && result.processChilds;
			}
			
			return aCurrentFunctionResult;
		};
		
		Processor.prototype.onReady = function(aFunction) {
			if (aFunction) {
				// this.onReadyEvent.push(aFunction);
				this.config.element.one(de.titus.jstl.Constants.EVENTS.onReady, function(anEvent) {
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
})(jQuery);
de.titus.core.Namespace.create("de.titus.jstl.Setup", function() {
	de.titus.jstl.Setup = function() {
	};
	
	
	
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.If());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Data());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Include());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Choose());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Foreach());	
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.AddAttribute());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Databind());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Eventbind());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.TextContent());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.AttributeContent());
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
	de.titus.core.Namespace.create("de.titus.jquery.jstl.plugin", function() {
		
		/**
		 * <code>
		 * config: {
		 * "data": dataContext,
		 * "onLoad": function(){},
		 * "onSuccess":function(){},
		 * "onFail": function(){},
		 * "attributePrefix" : "jstl-" 
		 * }
		 * </code>
		 */
		
		$.fn.jstl = function(/* config */aConfig) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstl(aConfig);
				});
			} else {
				var config = {
					"element" : this
				};
				config = $.extend(config, aConfig);
				var processor = new de.titus.jstl.Processor(config);
				processor.compute();
				return processor;
			}
		};
		
		$.fn.jstlAsync = function(/* config */aConfig) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstlAsync(aConfig);
				});
			} else {
				var config = $.extend({"element" : this}, aConfig);
				setTimeout((function(aConfig){
						var processor = new de.titus.jstl.Processor(aConfig);
						processor.compute();
					}).bind(null, config), 10);
				return this;
			}
		};
		
		$(document).ready(function() {
			$("[jstl-autorun]").jstlAsync();
		});
		
	});
}(jQuery));