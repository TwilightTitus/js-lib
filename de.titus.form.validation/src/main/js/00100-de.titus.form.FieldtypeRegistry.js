de.titus.core.Namespace.create("de.titus.form.FieldtypeRegistry", function() {

	de.titus.form.FieldtypeRegistry.FIELDTYPES = {};
	
	de.titus.form.FieldtypeRegistry.add = function(aTypeKey, Type){
		de.titus.form.FieldtypeRegistry.FIELDTYPES[aTypeKey.toLowerCase()] = Type;
	};
	
	de.titus.form.FieldtypeRegistry.get = function(aTypeKey){
		return de.titus.form.FieldtypeRegistry.FIELDTYPES[aTypeKey.toLowerCase()];
	};	
});
