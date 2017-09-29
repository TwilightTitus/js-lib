de.titus.core.Namespace.create("de.titus.core.ExpressionResolver", function() {

	var ExpressionResolver = de.titus.core.ExpressionResolver = function(varRegex) {
		this.regex = new de.titus.core.regex.Regex(varRegex || de.titus.core.ExpressionResolver.TEXT_EXPRESSION_REGEX);
	};

	/**
	 * static variables
	 */
	// ExpressionResolver.TEXT_EXPRESSION_REGEX = "\\$\\{([^\\$\\{\\}]*)\\}";
	ExpressionResolver.TEXT_EXPRESSION_REGEX = "\\$\\{([^\\{\\}]+)\\}";

	/**
	 * @param aText
	 * @param aDataContext
	 * @param aDefaultValue
	 * 
	 * @returns
	 */
	ExpressionResolver.prototype.resolveText = function(aText, aDataContext, aDefaultValue) {
		var text = aText;
		var matcher = this.regex.parse(text);
		while (matcher.next()) {
			var expression = matcher.getMatch();
			var expressionResult = this.internalResolveExpression(matcher.getGroup(1), aDataContext, aDefaultValue);
			if (expressionResult != undefined)
				text = matcher.replaceAll(expressionResult, text);
		}
		return text;
	}

	/**
	 * functions
	 */

	/**
	 * @param aExpression
	 * @param aDataContext
	 * @param aDefaultValue
	 * 
	 * @returns
	 */
	ExpressionResolver.prototype.resolveExpression = function(aExpression, aDataContext, aDefaultValue) {
		var matcher = this.regex.parse(aExpression);
		if (matcher.next()) {
			return this.internalResolveExpression(matcher.getGroup(1), aDataContext, aDefaultValue);
		}

		return this.internalResolveExpression(aExpression, aDataContext, aDefaultValue);
	};

	/**
	 * @param aExpression
	 * @param aDataContext
	 * @param aDefaultValue
	 * 
	 * @returns
	 */
	ExpressionResolver.prototype.internalResolveExpression = function(aExpression, aDataContext, aDefaultValue) {
		try {
			return de.titus.core.SpecialFunctions.doEvalWithContext(aExpression, aDataContext, aDefaultValue);
		} catch (e) {
			return aDefaultValue;
		}
	};

	de.titus.core.ExpressionResolver.DEFAULT = new de.titus.core.ExpressionResolver();
});
