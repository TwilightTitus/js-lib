de.titus.core.Namespace.create("de.titus.form.FormUtils", function() {
	
	de.titus.form.FormUtils.getFieldDependencies = function(aElement){
		var dependencyString = aElement.attr("form-dependencies");
		if(dependencyString == undefined)
			return [];
				
		dependencyString = dependencyString.replace("[", "");
		dependencyString = dependencyString.replace("]", "");
		dependencyString = dependencyString.replace(" ", "");
		
		if(dependencyString == "")
			return [];
		else if(dependencyString.indexOf(",") != -1)
			return dependencyString.split(",")
		else
			return [dependencyString];	
	};
	
	de.titus.form.FormUtils.getMessageController = function(aField, aForm){
		var element = aForm.data.element.find("[form-message-for='" + aField.getFieldname() + "']");
		return new de.titus.form.MessageController({"element": element, "field": aField});		
	};
	
	de.titus.form.FormUtils.getFieldValidatorTypes = function(aElement){
		var valitationTypes = aElement.attr("form-validation");
		if(valitationTypes == undefined)
			return [];
				
		valitationTypes = valitationTypes.replace("[", "");
		valitationTypes = valitationTypes.replace("]", "");
		valitationTypes = valitationTypes.replace(" ", "");
		
		if(valitationTypes == "")
			return [];
		else if(valitationTypes.indexOf(",") != -1)
			return valitationTypes.split(",")
		else
			return [valitationTypes];	
	};
	
	de.titus.form.FormUtils.getValidators = function(aElement){
		var result = [];
		var types = de.titus.form.FormUtils.getFieldValidatorTypes(aElement);
		if(types == undefined)
			return result;
		
		var dependencies= aElement.attr("form-dependencies");
		if( dependencies != undefined && dependencies != ""){
			var validatorType = de.titus.form.ValidatorRegistry.get("dependencies");
			if(validatorType != undefined)
				result.push( new validatorType({"element": aElement}));
		}
		
		var required= (aElement.attr("required") != undefined) || (aElement.attr("form-required") != undefined) || (aElement.attr("form-validation-required") != undefined);
		if(required != undefined){
			var validatorType = de.titus.form.ValidatorRegistry.get("required");
			if(validatorType != undefined)
				result.push( new validatorType({"element": aElement}));
		}
		
		var count = types.length;
		for(var i = 0; i < count; i++){
			var validatorType = de.titus.form.ValidatorRegistry.get(types[i]);
			if(validatorType != undefined)
				result.push( new validatorType({"element": aElement}));
		}
		return result;
	};
	
	
});
