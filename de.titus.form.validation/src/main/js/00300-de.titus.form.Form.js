de.titus.core.Namespace.create("de.titus.form.Form", function() {

	de.titus.form.Form = function(aElement){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.constructor()");
		}
		this.init(aElement);
	};
	
	de.titus.form.Form.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Form");
	
	de.titus.form.Form.prototype.init = function(aElement){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.init()");
		}
		this.data = {
			element : aElement,
			fields: {},
			validAction: undefined
		};
		
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
				validators: de.titus.form.FormUtils.getValidators(field),
				dependencies: de.titus.form.FormUtils.getFieldDependencies(field),
				load: field.attr("form-load"),
				form: this
			};
			
			var fieldType = de.titus.form.FieldtypeRegistry.get(fieldData.type);
			this.data.fields[fieldData.name] = new fieldType(fieldData);			
		}
	};
	
	de.titus.form.Form.prototype.fireEvent = function(aEvent, aField){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.fireEvent()");
		}
		if(aEvent.toLowerCase() == "valid"){
			this.__onFieldValueChanged(aField);
		}
		else if(aEvent.toLowerCase() == "invalid"){
			this.__onFieldValueChanged(aField);
		}		
	};
	
	de.titus.form.Form.prototype.__onFieldValueChanged = function(aField){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.__onFieldValueChanged()");
		}
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
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.isValid");
		}
		var count = this.data.fields.length;
		for(var i = 0; i < count; i++){
			if(!fields[i].isValid())
				return false;			
		}
		return true;		
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
