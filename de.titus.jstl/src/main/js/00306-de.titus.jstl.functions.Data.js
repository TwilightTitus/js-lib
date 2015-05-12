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
