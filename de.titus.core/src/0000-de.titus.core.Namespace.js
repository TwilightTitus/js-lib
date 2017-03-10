var de = de || {};
de.titus = de.titus || {};
de.titus.core = de.titus.core || {Version: "{version}"};
if (de.titus.core.Namespace == undefined) {
	de.titus.core.Namespace = {};
	/**
	 * creates a namespace and run the function, if the Namespace new
	 * 
	 * @param aNamespace
	 *            the namespace(requiered)
	 * @param aFunction
	 *            a function that be executed, if the namespace created (optional)
	 * 
	 * @returns boolean, true if the namespace created
	 */
	de.titus.core.Namespace.create = function(aNamespace, aFunction) {
		var namespaces = aNamespace.split(".");
		var currentNamespace = window || global;
		var namespaceCreated = false;
		for (var i = 0; i < namespaces.length; i++) {
			if (currentNamespace[namespaces[i]] == undefined) {
				currentNamespace[namespaces[i]] = {};
				namespaceCreated = true;
			}
			currentNamespace = currentNamespace[namespaces[i]];
		}
		if (namespaceCreated && aFunction != undefined) {
			aFunction();
		}
		
		return namespaceCreated;
	};
	
	/**
	 * exist the namespace?
	 * 
	 * @param aNamespace
	 *            the namespace(requiered)
	 * 
	 * @returns boolean, true if the namespace existing
	 */
	de.titus.core.Namespace.exist = function(aNamespace) {
		var namespaces = aNamespace.split(".");
		var currentNamespace = window;
		for (var i = 0; i < namespaces.length; i++) {
			if (currentNamespace[namespaces[i]] == undefined) {
				return false;
			}
			currentNamespace = currentNamespace[namespaces[i]];
		}
		return true;
	};
};