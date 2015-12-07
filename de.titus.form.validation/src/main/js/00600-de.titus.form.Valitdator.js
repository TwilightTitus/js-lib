de.titus.core.Namespace.create("de.titus.form.Validator", function() {

	de.titus.form.Validator = function(aData){
		this.data = {
			expression: undefined,
			message: undefined
		};
		$.extend(true, this.data, aData);
		this.data.element.data("de.titus.form.Validator", this);		
		this.init();
	};
	
	de.titus.form.Validator.prototype.init = function(){
		
	};
	
	de.titus.form.Validator.prototype.doValidate = function(aValue, aField){		
		return {"isValid": false, "message": "is invalid"};		
	};
});
