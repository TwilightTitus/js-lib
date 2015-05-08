de.titus.core.Namespace.create("de.titus.jstl.FunctionRegistry", function() {	
	de.titus.jstl.FunctionRegistry = function(){
		this.functions = new Array();
	};
	
	de.titus.jstl.FunctionRegistry.prototype.add = function(aFunction){
		this.functions.push(aFunction);
	};
	
	
	de.titus.jstl.FunctionRegistry.getInstance = function(){
		if(de.titus.jstl.FunctionRegistry.INSTANCE == undefined){
			de.titus.jstl.FunctionRegistry.INSTANCE = new de.titus.jstl.FunctionRegistry();
		}
		
		return de.titus.jstl.FunctionRegistry.INSTANCE;
	};
	
});
