de.titus.core.Namespace.create("de.titus.form.FormUtils", function() {
	
	de.titus.form.FormUtils.getFieldDependencies = function(aElement){
		var dependencyString = aElement.attr("form-field-dependency");
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
	
	de.titus.form.FormUtils.getMessage = function(aFieldname, aForm){
		var element = aForm.data.element.find("[form-message-for='" + aFieldname + "']");
		return new de.titus.form.Message({"element": element});		
	};
	
	de.titus.form.FormUtils.getValidator = function(aElement){
		var type = aElement.attr("form-valitation-type");
		if(type == undefined)
			return;
		
		var expression = aElement.attr("form-valitation");
		var message = aElement.attr("form-validation-message");
		var validatorType = de.titus.form.ValidatorRegistry.get(type);
		
		return new validatorType({
			"expression": expression,
			"message": message
		});
	};
	
	
});
