de.titus.core.Namespace.create("de.titus.jstl.functions.Choose", function() {
	de.titus.jstl.functions.Choose = function() {
	};
	de.titus.jstl.functions.Choose.prototype = new de.titus.jstl.IFunction("choose");
	de.titus.jstl.functions.Choose.prototype.constructor = de.titus.jstl.functions.Choose;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	de.titus.jstl.functions.Choose.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Choose");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	de.titus.jstl.functions.Choose.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (de.titus.jstl.functions.Choose.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Choose.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			
			this.processChilds(aElement, aDataContext, processor, expressionResolver);
			return new de.titus.jstl.FunctionResult(true, true);
		}
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	de.titus.jstl.functions.Choose.prototype.processChilds = function(aChooseElement, aDataContext, aProcessor, aExpressionResolver) {
		if (de.titus.jstl.functions.Choose.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Choose.LOGGER.logDebug("execute processChilds(" + aChooseElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		var childs = aChooseElement.children();
		var resolved = false;
		var $__THIS__$ = this;
		childs.each(function() {
			
			var child = $(this);
			if (!resolved && $__THIS__$.processChild(aChooseElement, child, aDataContext, aProcessor, aExpressionResolver)) {
				if (de.titus.jstl.functions.Choose.LOGGER.isTraceEnabled())
					de.titus.jstl.functions.Choose.LOGGER.logTrace("compute child: " + child);
				resolved = true;
			} else {
				if (de.titus.jstl.functions.Choose.LOGGER.isTraceEnabled())
					de.titus.jstl.functions.Choose.LOGGER.logTrace("remove child: " + child);
				child.remove();
			}
		});
	};
	
	de.titus.jstl.functions.Choose.prototype.processChild = function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
		if (de.titus.jstl.functions.Choose.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Choose.LOGGER.logDebug("execute processChild(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		if (this.processWhenElement(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver)) {
			return true;
		} else if (this.processOtherwiseElement(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver)) {
			return true;
		} else {
			return false;
		}
	};
	
	de.titus.jstl.functions.Choose.prototype.processWhenElement = function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
		if (de.titus.jstl.functions.Choose.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Choose.LOGGER.logDebug("execute processWhenElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		var expression = aElement.attr(aProcessor.config.attributePrefix + 'when');
		if (expression != undefined) {
			return aExpressionResolver.resolveExpression(expression, aDataContext, false);
		}
		return false;
	};
	
	de.titus.jstl.functions.Choose.prototype.processOtherwiseElement = function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
		if (de.titus.jstl.functions.Choose.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Choose.LOGGER.logDebug("execute processOtherwiseElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		var expression = aElement.attr(aProcessor.config.attributePrefix + 'otherwise');
		if (expression != undefined) {
			return true;
		}
		return false;
	};
	
});
