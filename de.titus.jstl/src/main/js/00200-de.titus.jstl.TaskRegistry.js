de.titus.core.Namespace.create("de.titus.jstl.TaskRegistry", function() {
	
	var TaskRegistry = {
		taskchain : undefined
	};
	
	TaskRegistry.append = function(aName, aFunction, aChain) {
		if (!aChain && !TaskRegistry.taskchain)
			TaskRegistry.taskchain = {
			    name : aName,
			    task : aFunction
			};
		else if (!aChain && TaskRegistry.taskchain)
			TaskRegistry.append(aName, aFunction, TaskRegistry.taskchain);
		else if (aChain.next)
			TaskRegistry.append(aName, aFunction, aChain.next);
		else
			aChain.next = {
			    name : aName,
			    task : aFunction
			};
	}

	de.titus.jstl.TaskRegistry = TaskRegistry;
});
