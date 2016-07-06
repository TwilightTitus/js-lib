de.titus.core.Namespace.create("de.titus.jstl.ExpressionResolver", function() {
	
//	de.titus.jstl.ExpressionResolver = function(aDomHelper) {
//		this.domHelper = aDomHelper || de.titus.core.DomHelper.getInstance();
//	};
//	
//	/****************************************************************
//	 * static variables
//	 ***************************************************************/
//	de.titus.jstl.ExpressionResolver.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.ExpressionResolver");	
//	de.titus.jstl.ExpressionResolver.prototype.TEXT_EXPRESSION_REGEX = new de.titus.core.regex.Regex("\\$\\{([^\\$\\{\\}]*)\\}");
//	
//	/**
//	 * @param aText
//	 * @param aDataContext
//	 * @param aDefaultValue
//	 * 
//	 * @returns
//	 */	
//	de.titus.jstl.ExpressionResolver.prototype.resolveText = function(aText, aDataContext, aDefaultValue) {
//		if(de.titus.jstl.ExpressionResolver.LOGGER.isDebugEnabled())
//			de.titus.jstl.ExpressionResolver.LOGGER.logDebug("execute resolveText(" + aText + ", " + aDataContext + ", " +  aDefaultValue + ")");
//		var text = aText;
//		var matcher = this.TEXT_EXPRESSION_REGEX.parse(text);
//		while (matcher.next()) {
//			var expression = matcher.getMatch();
//			var expressionResult = this.internalResolveExpression(matcher.getGroup(1), aDataContext, aDefaultValue);
//			if (expressionResult != undefined)
//				text = matcher.replaceAll(expressionResult, text);
//		}
//		return text;
//	}
//	
//	/****************************************************************
//	 * functions
//	 ***************************************************************/
//	
//	/**
//	 * @param aExpression
//	 * @param aDataContext
//	 * @param aDefaultValue
//	 * 
//	 * @returns
//	 */
//	de.titus.jstl.ExpressionResolver.prototype.resolveExpression = function(aExpression, aDataContext, aDefaultValue) {
//		if(de.titus.jstl.ExpressionResolver.LOGGER.isDebugEnabled())
//			de.titus.jstl.ExpressionResolver.LOGGER.logDebug("execute resolveText(" + aExpression + ", " + aDataContext + ", " +  aDefaultValue + ")");
//		var matcher = this.TEXT_EXPRESSION_REGEX.parse(aExpression);
//		if(matcher.next()){
//			return this.internalResolveExpression(matcher.getGroup(1), aDataContext, aDefaultValue);
//		}
//		
//		return this.internalResolveExpression(aExpression, aDataContext, aDefaultValue);
//	};
//	
//
//	/**
//	 * @param aExpression
//	 * @param aDataContext
//	 * @param aDefaultValue
//	 * 
//	 * @returns
//	 */
//	de.titus.jstl.ExpressionResolver.prototype.internalResolveExpression = function(aExpression, aDataContext, aDefaultValue) {
//		try {
//			var result = this.domHelper.doEvalWithContext(aExpression, aDataContext, aDefaultValue);			
//			if (result == undefined)				
//				return aDefaultValue;
//		
//			return result;
//		} catch (e) {
//			return undefined;
//		}
//	};
	
});
