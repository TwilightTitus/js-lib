de.titus.core.Namespace.create("de.titus.jstl.functions.AttributeContent", function() {	
	de.titus.jstl.functions.AttributeContent = function(){}; 
	de.titus.jstl.functions.AttributeContent.prototype = new de.titus.jstl.IFunction();
	de.titus.jstl.functions.AttributeContent.prototype.constructor = de.titus.jstl.functions.AttributeContent;
	
	/****************************************************************
	 * static variables
	 ***************************************************************/
	de.titus.jstl.functions.AttributeContent.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.AttributeContent");

	/****************************************************************
	 * functions
	 ***************************************************************/
	
	de.titus.jstl.functions.AttributeContent.prototype.run = function(aElement, aDataContext, aProcessor){
		if (de.titus.jstl.functions.AttributeContent.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.AttributeContent.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
});
