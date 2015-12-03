de.titus.core.Namespace.create("de.titus.form.validation.TypeRegistry", function() {

	de.titus.form.validation.TypeRegistry.TYPEREGISTRATION = {};
	
	de.titus.form.validation.TypeRegistry.add = function(aTypeKey, Type){
		de.titus.form.validation.TypeRegistry.TYPEREGISTRATION[aTypeKey] = Type;
	};
	
	de.titus.form.validation.TypeRegistry.get = function(aTypeKey){
		return de.titus.form.validation.TypeRegistry.TYPEREGISTRATION[aTypeKey];
	};
	
	de.titus.form.validation.TypeRegistry.newInstance = function(aTypeKey, aElement){
		return de.titus.form.validation.TypeRegistry.TYPEREGISTRATION[aTypeKey](aElement);
	};
	
});
