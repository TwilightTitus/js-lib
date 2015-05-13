de.titus.core.Namespace.create("de.titus.jstl.FunctionResult", function() {	
	de.titus.jstl.FunctionResult = function(runNextFunction, processChilds){
		this.runNextFunction = runNextFunction || true;
		this.processChilds = processChilds || true;
	};	
});
