de.titus.core.Namespace.create("de.titus.jstl.functions.Data", function() {	
	de.titus.jstl.functions.Data = function(){}; 
	de.titus.jstl.functions.Data.prototype = new de.titus.jstl.IFunction();
	de.titus.jstl.functions.Data.prototype.constructor = de.titus.jstl.functions.Data;
	
	de.titus.jstl.functions.Data.prototype.run = function(aElement, aDataContext, aProcessor){
		return true;
	};
	
});
