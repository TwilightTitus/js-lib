de.titus.core.Namespace.create("de.titus.jstl.functions.LoadData", function() {	
	de.titus.jstl.functions.LoadData = function(){}; 
	de.titus.jstl.functions.LoadData.prototype = new de.titus.jstl.IFunction();
	de.titus.jstl.functions.LoadData.prototype.constructor = de.titus.jstl.functions.LoadData;
	
	de.titus.jstl.functions.LoadData.prototype.run = function(aElement, aDataContext, aProcessor){
		return true;
	};
	
});
