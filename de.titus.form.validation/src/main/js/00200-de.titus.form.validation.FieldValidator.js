de.titus.core.Namespace.create("de.titus.form.validation.FieldValidator", function() {

	de.titus.form.validation.FieldValidator = function(aElement){
		this.element = aElement;
		this.name = aElement.attr("fv-fieldname");
		this.type = aElement.attr("fv-type");
		this.load = aElement.attr("fv-load");
		this.messageContainer = aElement.attr("fv-message-container");
		this.helpContainer = aElement.attr("fv-help-container");
		this.validationRule = aElement.attr("fv-validation-rule");
		this.validationRemote = aElement.attr("fv-validation-remote");
		this.form = undefined;
	};
	
	de.titus.form.validation.FieldValidator.prototype.init = function(aForm){
		this.form = aForm;
	};
	
	de.titus.form.validation.FieldValidator.prototype.doLoad = function(){};
	
	de.titus.form.validation.FieldValidator.prototype.isValid = function(){		
		return ;
	};
	
	de.titus.form.validation.FieldValidator.prototype.doValidRule = function(){		
		return true;
	};
	
	de.titus.form.validation.FieldValidator.prototype.doValidRemote = function(){		
		return ;
	};
	
	
});
