de.titus.core.Namespace.create("de.titus.form.Form", function() {

	de.titus.form.Form = function(aElement){
		this.data = {
			element : aElement,
			fields: {},
			validAction: undefined
		};
		this.init();
	};
	
	de.titus.form.Form.prototype.init = function(){
		var fields = this.data.element.find("[form-field]");		
		var count = fields.length;
		for(var i = 0; i < count; i++){
			var field = $(fields[i]);
			var fieldname = field.attr("form-field") || field.attr("id");
			
			var fieldData = {
				element: field,
				name:  fieldname,
				type: field.attr("form-type"),
				message: de.titus.form.FormUtils.getMessage(fieldname, this),
				validator: de.titus.form.FormUtils.getValidator(field),
				dependencies: de.titus.form.FormUtils.getFieldDependencies(field),
				load: field.attr("form-load"),
				form: this
			};
			
			var fieldType = de.titus.form.FieldtypeRegistry.get(fieldData.type);
			this.data.fields[fieldData.name] = new fieldType(fieldData);			
		}
	};
	
	de.titus.form.Form.prototype.fireEvent = function(aEvent, aField){
		if(aEvent.toLowerCase() == "valid"){
			this.__onFieldValueChanged(aField);
		}
		else if(aEvent.toLowerCase() == "invalid"){
			this.__onFieldValueChanged(aField);
		}		
	};
	
	de.titus.form.Form.prototype.__onFieldValueChanged = function(aField){
		var isValid = aField.isValid();
		var dependencies = aField.data.dependencies;
		var count = dependencies.length;
		for(var i = 0; i < count; i++){
			var dependency = dependencies[i];
			var dependentField = this.data.fields[dependency];
			if(dependentField != undefined){
				dependentField.show(isValied);
			}			
		}		
	};
	
	de.titus.form.Form.prototype.isValid = function(){
		
	};
	
	$.fn.Form = function(){
		if(this.length > 1){
			return this.each(function(){return $(this).Form();});
		}
		
		var form = this.data("de.titus.form.Form");
		if(form == undefined){
			form = new de.titus.form.Form(this);
			this.data("de.titus.form.Form", form);
		}
		
		return form;
	};	
	
	
});
