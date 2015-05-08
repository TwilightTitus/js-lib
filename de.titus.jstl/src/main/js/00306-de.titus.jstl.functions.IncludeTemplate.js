de.titus.core.Namespace.create("de.titus.jstl.functions.IncludeTemplate", function() {	
	de.titus.jstl.functions.IncludeTemplate = function(){}; 
	de.titus.jstl.functions.IncludeTemplate.prototype = new de.titus.jstl.IFunction();
	de.titus.jstl.functions.IncludeTemplate.prototype.constructor = de.titus.jstl.functions.IncludeTemplate;
	
	de.titus.jstl.functions.IncludeTemplate.prototype.run = function(aElement, aDataContext, aProcessor){
		return true;
	};
	
});
