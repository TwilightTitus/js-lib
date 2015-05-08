de.titus.core.Namespace.create("de.titus.jstl.functions.Choose", function() {	
	de.titus.jstl.functions.Choose = function(){}; 
	de.titus.jstl.functions.Choose.prototype = new de.titus.jstl.IFunction("choose");
	de.titus.jstl.functions.Choose.prototype.constructor = de.titus.jstl.functions.Choose;
	
	de.titus.jstl.functions.Choose.prototype.run = function(aElement, aDataContext, aProcessor){
		return true;
	};
	
});
