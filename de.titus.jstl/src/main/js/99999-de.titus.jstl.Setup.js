de.titus.core.Namespace.create("de.titus.jstl.Setup", function() {
	de.titus.jstl.Setup = function() {
	};
	
	
	de.titus.jstl.TaskRegistry.append("preprocessor", de.titus.jstl.functions.Preprocessor.TASK);
	de.titus.jstl.TaskRegistry.append("if", de.titus.jstl.functions.If.TASK);
	de.titus.jstl.TaskRegistry.append("data", de.titus.jstl.functions.Data.TASK);
	/*
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Include());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Choose());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Foreach());	
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.AddAttribute());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Databind());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Eventbind());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.TextContent());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.AttributeContent());
	*/
});
