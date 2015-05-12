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

de.titus.core.Namespace.create("de.titus.jstl.ExpressionResolver", function() {
	
	de.titus.jstl.ExpressionResolver = function(aDomHelper) {
		this.domHelper = aDomHelper || new de.titus.core.DomHelper();
	};
	
	de.titus.jstl.ExpressionResolver.prototype.TEXT_EXPRESSION_REGEX = new de.titus.core.regex.Regex("\\$\\{([^\\$\\{\\}]*)\\}");
	
	de.titus.jstl.ExpressionResolver.prototype.resolveText = function(aText, aDataContext, aDefaultValue) {
		var text = aText;
		var matcher = this.TEXT_EXPRESSION_REGEX.parse(text);
		while (matcher.next()) {
			var expression = matcher.getMatch();
			var expressionResult = this.internalResolveExpression(matcher.getGroup(1), aDataContext, aDefaultValue);
			if (expressionResult != undefined)
				text = matcher.replaceAll(expressionResult, text);
		}
		return text;
	}
	
	de.titus.jstl.ExpressionResolver.prototype.resolveExpression = function(aExpression, aDataContext, aDefaultValue) {
		var matcher = this.TEXT_EXPRESSION_REGEX.parse(aExpression);
		if(matcher.next()){
			return this.internalResolveExpression(matcher.getGroup(1), aDataContext, aDefaultValue);
		}
		
		return this.internalResolveExpression(aExpression, aDataContext, aDefaultValue);
	};
	

	de.titus.jstl.ExpressionResolver.prototype.internalResolveExpression = function(aExpression, aDataContext, aDefaultValue) {
		try {
			var result = this.domHelper.doEvalWithContext(aExpression, aDataContext, aDefaultValue);			
			if (result == undefined)				
				return aDefaultValue;
		
			return result;
		} catch (e) {
			return undefined;
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
de.titus.core.Namespace.create("de.titus.jstl.IFunction", function() {	
	de.titus.jstl.IFunction = function(theAttributeName){
		this.attributeName = theAttributeName;	
	};
	
	de.titus.jstl.IFunction.prototype.run = /*boolean*/ function(aElement, aDataContext, aProcessor){return true;};
	
});
de.titus.core.Namespace.create("de.titus.jstl.functions.If", function() {	
	de.titus.jstl.functions.If = function(){};
	de.titus.jstl.functions.If.prototype = new de.titus.jstl.IFunction("if");
	de.titus.jstl.functions.If.prototype.constructor = de.titus.jstl.functions.If;
	
	de.titus.jstl.functions.If.prototype.run = /*boolean*/function(aElement, aDataContext, aProcessor){
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.jstl.ExpressionResolver();
		var domHelper = processor.domHelper || new de.titus.core.DomHelper();
		
		var expression = domHelper.getAttribute(aElement, processor.config.attributePrefix + this.attributeName);
		if(expression != undefined && expression.lenght != 0){
			
			var expressionResult = expressionResolver.resolveExpression(expression, aDataContext, false);			

			if(domHelper.isFunction(expressionResult))
				expressionResult = expressionResult(aElement, aDataContext, aProcessor);
			
			
			expressionResult = expressionResult == true;
			if(!expressionResult)
				domHelper.doRemove(aElement);
				
			return expressionResult;
		}
		
		return true;
	};
	
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Choose", function() {
	de.titus.jstl.functions.Choose = function() {
	};
	de.titus.jstl.functions.Choose.prototype = new de.titus.jstl.IFunction("choose");
	de.titus.jstl.functions.Choose.prototype.constructor = de.titus.jstl.functions.Choose;
	
	de.titus.jstl.functions.Choose.prototype.run = function(aElement, aDataContext, aProcessor) {
		console.log("call Choose.run");
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.jstl.ExpressionResolver();
		var domHelper = processor.domHelper || new de.titus.core.DomHelper();
		
		var expression = domHelper.getAttribute(aElement, processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			
			
			this.processChilds(aElement, aDataContext, processor, expressionResolver, domHelper);
			return false;
		}
		return true;
	};
	
	de.titus.jstl.functions.Choose.prototype.processChilds = function(aChooseElement, aDataContext, aProcessor, aExpressionResolver, aDomHelper) {
		console.log("call Choose.processChilds");
		var childs = aDomHelper.getChilds(aChooseElement);
		var resolved = false;
		for (var i = 0; i < childs.length; i++) {
			var child = aDomHelper.toDomObject(childs[i]);
			if(!resolved && this.processChild(aChooseElement, child, aDataContext, aProcessor, aExpressionResolver, aDomHelper)){
				console.log("call Choose.processChilds -> keep child");
				aProcessor.compute(child);
				resolved = true;
			}
			else{
				console.log("call Choose.processChilds -> remove child");
				aDomHelper.doRemove(child);
			}
		}
	};
	
	de.titus.jstl.functions.Choose.prototype.processChild = function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver, aDomHelper) {
		if (this.processWhenElement(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver, aDomHelper)) {
			return true;
		} else if (this.processOtherwiseElement(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver, aDomHelper)) {
			return true;
		} else {
			return false;
		}
	};
	
	de.titus.jstl.functions.Choose.prototype.processWhenElement = function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver, aDomHelper) {
		var expression = aDomHelper.getAttribute(aElement, aProcessor.config.attributePrefix + 'when')
		console.log("call Choose.processWhenElement -> expression:" +  expression);
		if (expression != undefined) {
			return aExpressionResolver.resolveExpression(expression, aDataContext, false);
		}
		return false;
	};
	
	de.titus.jstl.functions.Choose.prototype.processOtherwiseElement = function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver, aDomHelper) {
		var expression = aDomHelper.getAttribute(aElement, aProcessor.config.attributePrefix + 'otherwise');
		console.log("call Choose.processOtherwiseElement -> expression:" +  expression);
		if (expression != undefined) {
			return true;
		}
		return false;
	};
	
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Foreach", function() {	
	de.titus.jstl.functions.Foreach = function(){}; 
	de.titus.jstl.functions.Foreach.prototype = new de.titus.jstl.IFunction("foreach");
	de.titus.jstl.functions.Foreach.prototype.constructor = de.titus.jstl.functions.Foreach;
	
	de.titus.jstl.functions.Foreach.prototype.run = function(aElement, aDataContext, aProcessor){
		return true;
	};
	
});
de.titus.core.Namespace.create("de.titus.jstl.functions.TextContent", function() {	
	de.titus.jstl.functions.TextContent = function(){}; 
	de.titus.jstl.functions.TextContent.prototype = new de.titus.jstl.IFunction();
	de.titus.jstl.functions.TextContent.prototype.constructor = de.titus.jstl.functions.TextContent;
	
	de.titus.jstl.functions.TextContent.prototype.run = function(aElement, aDataContext, aProcessor){
		console.log( "call TextContent.run");
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver;
		var domHelper = processor.domHelper || new de.titus.core.DomHelper();
		var childCount = domHelper.getChildCount(aElement);
		
		
		if(childCount == 0){
			console.log( "TextContent.run -> append text");
			var text = domHelper.getText(aElement);
			text = expressionResolver.resolveText(text, aDataContext);
			
			domHelper.setText(aElement, text, "replace");
		}
		return true;
	};
	
});
de.titus.core.Namespace.create("de.titus.jstl.functions.AttributeContent", function() {	
	de.titus.jstl.functions.AttributeContent = function(){}; 
	de.titus.jstl.functions.AttributeContent.prototype = new de.titus.jstl.IFunction();
	de.titus.jstl.functions.AttributeContent.prototype.constructor = de.titus.jstl.functions.AttributeContent;
	
	de.titus.jstl.functions.AttributeContent.prototype.run = function(aElement, aDataContext, aProcessor){
		return true;
	};
	
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Data", function() {
	de.titus.jstl.functions.Data = function() {
	};
	de.titus.jstl.functions.Data.prototype = new de.titus.jstl.IFunction("data");
	de.titus.jstl.functions.Data.prototype.constructor = de.titus.jstl.functions.Data;
	
	de.titus.jstl.functions.Data.prototype.run = function(aElement, aDataContext, aProcessor) {
		console.log("call Data.run")
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.jstl.ExpressionResolver();
		var domHelper = processor.domHelper || new de.titus.core.DomHelper();
		
		var expression = domHelper.getAttribute(aElement, processor.config.attributePrefix + this.attributeName);
		if (expression != undefined && expression.lenght != 0) {
			this.internalProcessing(expression, aElement, aDataContext, processor, expressionResolver, domHelper);
		}
		console.log("end Data.run")
		return true;
	};
	
	de.titus.jstl.functions.Data.prototype.internalProcessing = function(anExpression, aElement, aDataContext, aProcessor, anExpressionResolver, aDomHelper) {
		var varname = this.getVarname(aElement, aDataContext, aProcessor, anExpressionResolver, aDomHelper);
		var mode = this.getMode(aElement, aProcessor, anExpressionResolver, aDomHelper);
		if (mode == "remote") {
			this.doRemote(anExpression, aElement, varname, aDataContext, aProcessor, anExpressionResolver, aDomHelper);
		} else {
			this.doDirect(anExpression, aElement, varname, aDataContext, aProcessor, anExpressionResolver, aDomHelper);
		}
	};
	
	de.titus.jstl.functions.Data.prototype.getOptions = function(aElement, aDataContext, aProcessor, anExpressionResolver, aDomHelper) {
		var options = aDomHelper.getAttribute(aElement, aProcessor.config.attributePrefix + this.attributeName + "-options");
		if (options != undefined) {
			options = anExpressionResolver.resolveText(options, aDataContext);
			options = anExpressionResolver.resolveExpression(options, aDataContext);
			return options || {};
		}
		
		return {};
	};
	
	de.titus.jstl.functions.Data.prototype.getMode = function(aElement, aProcessor, anExpressionResolver, aDomHelper) {
		var mode = aDomHelper.getAttribute(aElement, aProcessor.config.attributePrefix + this.attributeName + "-mode");
		if (mode == undefined)
			return "direct";
		
		mode = mode.toLowerCase();
		if (mode == "direct" || mode == "remote")
			return mode;
		
		return "direct";
	};
	
	de.titus.jstl.functions.Data.prototype.getVarname = function(aElement, aDataContext, aProcessor, anExpressionResolver, aDomHelper) {
		var varname = aDomHelper.getAttribute(aElement, aProcessor.config.attributePrefix + this.attributeName + "-var");
		return varname;
	};
	
	de.titus.jstl.functions.Data.prototype.doDirect = function(anExpression, aElement, aVarname, aDataContext, aProcessor, anExpressionResolver, aDomHelper) {
		var newData = anExpressionResolver.resolveExpression(anExpression, aDataContext);
		this.addNewData(newData, aVarname, aDataContext, aProcessor, anExpressionResolver, aDomHelper);
	};
	
	de.titus.jstl.functions.Data.prototype.doRemote = function(anExpression, aElement, aVarname, aDataContext, aProcessor, anExpressionResolver, aDomHelper) {
		var varname = aVarname;
		var dataContext = aDataContext;
		var processor = aProcessor;
		var expressionResolver = anExpressionResolver;
		var domHelper = aDomHelper;
		var this_ = this;
		
		var url = expressionResolver.resolveText(anExpression, dataContext);
		var option = this.getOptions(aElement, aDataContext, aProcessor, anExpressionResolver, aDomHelper);
		
		var ajaxSettings = {
			'url' : url,
			'async' : false,
			'cache' : false 
			};
		ajaxSettings = domHelper.mergeObjects(ajaxSettings, option);
		domHelper.doRemoteLoadJson(ajaxSettings, function(newData) {
			this_.addNewData(newData, varname, dataContext, processor, expressionResolver, domHelper);
		});
	};
	
	de.titus.jstl.functions.Data.prototype.addNewData = function(aNewData, aVarname, aDataContext, aProcessor, anExpressionResolver, aDomHelper) {
		if (aVarname == undefined) {
			aDomHelper.mergeObjects(aDataContext, aNewData);
		} else {
			aDataContext[aVarname] = aNewData;
		}
	};
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Include", function() {	
	de.titus.jstl.functions.Include = function(){}; 
	de.titus.jstl.functions.Include.prototype = new de.titus.jstl.IFunction("include");
	de.titus.jstl.functions.Include.prototype.constructor = de.titus.jstl.functions.Include;
	
	de.titus.jstl.functions.Include.prototype.run = function(aElement, aDataContext, aProcessor){
		console.log("call IncludeTemplate.run")
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.jstl.ExpressionResolver();		
		var domHelper = processor.domHelper || new de.titus.core.DomHelper();
		
		var expression = domHelper.getAttribute(aElement, processor.config.attributePrefix + this.attributeName);
		if(expression != undefined && expression.lenght != 0){		
			return this.internalProcessing(expression, aElement, aDataContext, processor, expressionResolver, domHelper);
		}
		return true;
	};
	
	de.titus.jstl.functions.Include.prototype.internalProcessing = function(anIncludeExpression, aElement, aDataContext, aProcessor, anExpressionResolver, aDomHelper){
		var element = aElement;
		var domHelper = aDomHelper;
		var processor = aProcessor;
		var context = aDataContext;
		var url = anExpressionResolver.resolveText(anIncludeExpression, aDataContext);
		var includeMode = this.getIncludeMode(aElement, aDataContext, aProcessor, anExpressionResolver, aDomHelper); 
		
		var options = this.getOptions(aElement, aDataContext, aProcessor, anExpressionResolver, aDomHelper);
		
		var ajaxSettings = {
			'url' : url,
			'async' : false,
			'cache' : true
			};
		ajaxSettings = domHelper.mergeObjects(ajaxSettings, options);
		
		domHelper.doRemoteLoadHtml(ajaxSettings, function(template) {			
			domHelper.setHtml(element, template, includeMode);			
//			domHelper.doOnReady(function(){
//				var childs = domHelper.getChilds(element);
//				for(var i = 0; i < childs.length; i++){
//					var result = new de.titus.jstl.Processor(childs[i], context, domHelper,processor.config).compute();
//				}
//			});
		});
		
		return true;
	};
	
	de.titus.jstl.functions.Include.prototype.getOptions= function(aElement, aDataContext, aProcessor, anExpressionResolver, aDomHelper){
		var options = aDomHelper.getAttribute(aElement, aProcessor.config.attributePrefix + this.attributeName + "-options");
		if(options != undefined){
			options = anExpressionResolver.resolveText(options, aDataContext);
			options = anExpressionResolver.resolveExpression(options, aDataContext);
			return options || {};
		}	
		
		return {};
	};
	
	de.titus.jstl.functions.Include.prototype.getIncludeMode= function(aElement, aDataContext, aProcessor, anExpressionResolver, aDomHelper){
		var mode = aDomHelper.getAttribute(aElement, aProcessor.config.attributePrefix + this.attributeName + "-mode");
		if(mode == undefined)
			return "append";
		
		mode  = mode.toLowerCase(); 
		if(mode == "append" || mode == "replace" || mode == "prepend")
			return mode;
		
		return "append";
	};
	
});
de.titus.core.Namespace.create("de.titus.jstl.Processor", function() {
	
	de.titus.jstl.Processor = function(aRootElement, aRootDataContext, aDomHelper, aConfig) {
		this.domHelper = aDomHelper || new de.titus.core.DomHelper();
		this.rootElement = this.domHelper.toDomObject(aRootElement);
		this.rootDataContext = aRootDataContext || {};
		this.expressionResolver = new de.titus.jstl.ExpressionResolver(this.domHelper);
		this.config = {"attributePrefix": "jstl-"};
		this.config = this.domHelper.mergeObjects(aConfig, this.config);
	};
	
	de.titus.jstl.Processor.prototype.compute = /* boolean */function(aElement, aDataContext) {
		if(aElement == undefined)
			return this.internalComputeRoot();
		
		return this.internalComputeElement(aElement, aDataContext);
	};
	
	de.titus.jstl.Processor.prototype.internalComputeRoot = /* boolean */function() {
		return this.internalComputeElement(this.rootElement, this.rootDataContext);
	};
	
	de.titus.jstl.Processor.prototype.internalComputeElement = /* boolean */function(aElement, aDataContext) {
		var dataContext = aDataContext || this.rootDataContext;
		return this.internalExecuteFunction(aElement, dataContext);
	};
	
	de.titus.jstl.Processor.prototype.internalExecuteFunction = /* boolean */function(aElement, aDataContext) {
		try {
			var functions = de.titus.jstl.FunctionRegistry.getInstance().functions;
			for (var i = 0; i < functions.length; i++) {
				var functionObject = functions[i];
				if(!functionObject.run(aElement, aDataContext, this))
					return true; //Vorzeitiger abbruch der Verarbeitung
			}
			
			return this.internalComputeChilds(aElement, aDataContext);
		} catch (e) {
			console.log (e)
			return false;
		}	
	};
	
	de.titus.jstl.Processor.prototype.internalComputeChilds = /* boolean */function(aElement, aDataContext) {
		var childs = this.domHelper.getChilds(aElement);
		if(childs == undefined)
			return true;
		else if(!this.domHelper.isArray(childs))
			return this.compute(childs, aDataContext);
		else
		{
			for(var i = 0; i < childs.length; i++){
				var newElement = this.domHelper.toDomObject(childs[i]);
				if(!this.compute(newElement, aDataContext))
					return false;
			}
		}
		return true;
	};
});
de.titus.core.Namespace.create("de.titus.jstl.Setup", function() {
	de.titus.jstl.Setup = function(){};
	
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.If());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Data());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Include());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Choose());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Foreach());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.TextContent());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.AttributeContent());
	
	
});
