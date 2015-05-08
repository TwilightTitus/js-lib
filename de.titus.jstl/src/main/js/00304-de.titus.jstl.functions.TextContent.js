de.titus.core.Namespace.create("de.titus.jstl.functions.TextContent", function() {	
	de.titus.jstl.functions.TextContent = function(){}; 
	de.titus.jstl.functions.TextContent.prototype = new de.titus.jstl.IFunction();
	de.titus.jstl.functions.TextContent.prototype.constructor = de.titus.jstl.functions.TextContent;
	
	de.titus.jstl.functions.TextContent.prototype.run = function(aElement, aDataContext, aProcessor){
		console.log( "hier");
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver;
		var domHelper = processor.domHelper || new de.titus.core.DomHelper();
		var childCount = domHelper.getChildCount(aElement);
		
		
		if(childCount == 0){
			console.log( "append text");
			var text = domHelper.getText(aElement);
			text = expressionResolver.resolveText(text, aDataContext);
			
			domHelper.setText(aElement, text, "replace");
		}
		return true;
	};
	
});
