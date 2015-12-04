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
	
	de.titus.form.FormUtils.getValidator = function(aElement){
		var remoteString = aElement.attr("form-field-valitation-remote");
		if(remoteString != undefined && remoteString != ""){
			// TODO
		}
		else{
			var valueString = aElement.attr("form-field-valitation");
			
			// TODO
		}
	};
	
	
});
