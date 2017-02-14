de.titus.core.Namespace.create("de.titus.jstl.Setup", function() {
	de.titus.jstl.Setup = function() {
	};
	
	
	de.titus.jstl.TaskRegistry.append("preprocessor", de.titus.jstl.functions.Preprocessor.TASK);
	de.titus.jstl.TaskRegistry.append("if", de.titus.jstl.functions.If.TASK);
	de.titus.jstl.TaskRegistry.append("data", de.titus.jstl.functions.Data.TASK);
	de.titus.jstl.TaskRegistry.append("include", de.titus.jstl.functions.Include.TASK);
	de.titus.jstl.TaskRegistry.append("choose", de.titus.jstl.functions.Choose.TASK);
	de.titus.jstl.TaskRegistry.append("foreach", de.titus.jstl.functions.Foreach.TASK);
	de.titus.jstl.TaskRegistry.append("add-attribute", de.titus.jstl.functions.AddAttribute.TASK);
	de.titus.jstl.TaskRegistry.append("databind", de.titus.jstl.functions.Databind.TASK);
	de.titus.jstl.TaskRegistry.append("eventbind", de.titus.jstl.functions.Eventbind.TASK);
	de.titus.jstl.TaskRegistry.append("text", de.titus.jstl.functions.Text.TASK);
	de.titus.jstl.TaskRegistry.append("attribute", de.titus.jstl.functions.Attribute.TASK);
	de.titus.jstl.TaskRegistry.append("children", de.titus.jstl.functions.Children.TASK);
	
});
