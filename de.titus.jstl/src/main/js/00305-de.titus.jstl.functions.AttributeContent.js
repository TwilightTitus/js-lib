de.titus.core.Namespace.create("de.titus.jstl.functions.AttributeContent", function() {	
	de.titus.jstl.functions.AttributeContent = function(){}; 
	de.titus.jstl.functions.AttributeContent.prototype = new de.titus.jstl.IFunction();
	de.titus.jstl.functions.AttributeContent.prototype.constructor = de.titus.jstl.functions.AttributeContent;
	
	de.titus.jstl.functions.AttributeContent.prototype.run = function(aElement, aDataContext, aProcessor){
		return true;
	};
	
});
