de.titus.core.Namespace.create("de.titus.form.Form", function() {

	de.titus.form.Form = function(aElement){
		this.data = {
			element : aElement,
			fields: {},
			validAction: undefined
		};
	};
	
	de.titus.form.Form.prototype.init = function(){
		var fields = this.data.element.find("[form-field-name]");
		var field = fields[i];
		var count = fields.length;
		for(var i = 0; i < count; i++){
			var fieldData = {
				element: field,
				name:  field.attr("form-field-name"),
				type: field.attr("form-field-type"),
				validator: de.titus.form.FormUtils.getValidator(field),
				dependencies: de.titus.form.FormUtils.getFieldDependencies(field),
				load: aElement.attr("form-field-load"),
				form: this
			};
			
			var fieldType = de.titus.form.FieldtypeRegistry.get(fieldData.type);
			fields[fieldData.name] = fieldType(fieldData);			
		}
	};
	
	de.titus.form.Form.prototype.fireEvent = function(aEvent, aField){
		if(aEvent.toLowerCase() == "isValid"){
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
