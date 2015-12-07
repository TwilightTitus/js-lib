de.titus.core.Namespace.create("de.titus.form.ValidatorRegistry", function() {

	de.titus.form.ValidatorRegistry.VALIDATORTYPES = {};
	
	de.titus.form.ValidatorRegistry.add = function(aTypeKey, Type){
		de.titus.form.ValidatorRegistry.VALIDATORTYPES[aTypeKey.toLowerCase()] = Type;
	};
	
	de.titus.form.ValidatorRegistry.get = function(aTypeKey){
		if(aTypeKey == undefined || aTypeKey == "")
			return;
		
		return de.titus.form.ValidatorRegistry.VALIDATORTYPES[aTypeKey.toLowerCase()];
	};	
});