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
