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
			'async' : true,
			'cache' : false
			};
		ajaxSettings = domHelper.mergeObjects(ajaxSettings, options);
		
		domHelper.doRemoteLoadHtml(ajaxSettings, function(template) {			
			domHelper.setHtml(element, template, includeMode);			
			domHelper.doOnReady(function(){
				var childs = domHelper.getChilds(element);
				for(var i = 0; i < childs.length; i++){
					var result = new de.titus.jstl.Processor(childs[i], context, domHelper,processor.config).compute();
				}
			});
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
