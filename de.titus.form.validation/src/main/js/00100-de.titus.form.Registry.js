de.titus.core.Namespace.create("de.titus.form.Registry", function() {

	de.titus.form.Registry.FIELDTYPES = {};	
	de.titus.form.Registry.VALIDATORTYPES = {};
	
	de.titus.form.Registry.registratFieldType = function(aTypeKey, Type){
		de.titus.form.Registry.FIELDTYPES[aTypeKey.toLowerCase()] = Type;
	};
	
	de.titus.form.Registry.getFieldType = function(aTypeKey){
		return de.titus.form.Registry.FIELDTYPES[aTypeKey.toLowerCase()];
	};
	
	de.titus.form.Registry.addValidatorType = function(aTypeKey, Type){
		de.titus.form.Registry.VALIDATORTYPES[aTypeKey.toLowerCase()] = Type;
	};
	
	de.titus.form.Registry.getValidatorType = function(aTypeKey){
		if(aTypeKey == undefined || aTypeKey == "")
			return;
		
		return de.titus.form.Registry.VALIDATORTYPES[aTypeKey.toLowerCase()];
	};	
});
