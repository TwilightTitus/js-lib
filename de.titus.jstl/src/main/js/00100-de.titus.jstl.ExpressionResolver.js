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
