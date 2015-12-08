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
			messageController: {},
			submitButtons: [],
			validAction: undefined,
			validateTimeout: 10
		};
		
		var fields = this.data.element.find("[form-field]");		
		var count = fields.length;
		for(var i = 0; i < count; i++){
			this.__buildField($(fields[i]));			
		}
		
		//TODO nachberechung der Dependent Fields, also der Felder die von einem Feld abhängig sind

		var $__THIS__$ = this;
		this.data.element.find("[type='submit'],[form-submit]").each(function(){
			$__THIS__$.data.submitButtons.push($(this));
		});		
		
		if(this.data.element.attr("form-validate-on-start")!= undefined){
			setTimeout(function(){$__THIS__$.isValid(false, true)}, this.data.validateTimeout);//TODO force parameter Konfigurierbar machen
		}
		
	};
	
	de.titus.form.Form.prototype.__buildField = function(aElement){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.__buildField()");
		}
		var data = this.__buildFieldData(aElement);		
		var fieldType = de.titus.form.FieldtypeRegistry.get(data.type);
		var fieldInstance = new fieldType(data);
		this.data.fields[data.fieldname] = fieldInstance;
		this.data.messageController[data.fieldname] = de.titus.form.FormUtils.getMessageController(fieldInstance, this);
	};
	
	de.titus.form.Form.prototype.__buildFieldData = function(aElement){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.__buildFieldData()");
		}
		return {
			"element": aElement,
			"fieldname":  aElement.attr("form-field") || aElement.attr("id"),
			"type": aElement.attr("form-type"),
			"dependents": [],
			"validators": de.titus.form.FormUtils.getValidators(aElement),
			"dependencies": de.titus.form.FormUtils.getFieldDependencies(aElement),
			"load": aElement.attr("form-load"),
			"form": this
		};
	};
	
	de.titus.form.Form.prototype.printMessage = function(aMessage, aFieldname){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.printMessage()");
		}
		var messageController = this.data.messageController[aFieldname];
		if(messageController != undefined){
			messageController.setMessage(aMessage);
		}
	};
	
	de.titus.form.Form.prototype.clearMessage = function(aFieldname){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.clearMessage()");
		}
		var messageController = this.data.messageController[aFieldname];
		if(messageController != undefined){
			messageController.doClear();
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
		
		var $__THIS__$ = this;
		setTimeout(function(){$__THIS__$.isValid(false, true)}, this.data.validateTimeout);
	};
	
	de.titus.form.Form.prototype.__onFieldValueChanged = function(aField){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.__onFieldValueChanged()");
		}
		var isValid = aField.isValid();
		var dependents = aField.data.dependents;
		var count = dependents.length;
		for(var i = 0; i < count; i++){
			var dependents = dependents[i];
			var dependentField = this.data.fields[dependency];
			if(dependentField != undefined){
				dependentField.show(isValied);
			}			
		}
	};
	
	de.titus.form.Form.prototype.isValid = function(force, all){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.isValid()");
		}
		var valid = this.__validFields(force, all);
		if(valid)
			this.enableSubmitButtons(true);
		else 
			this.enableSubmitButtons(false);
	};
	
	de.titus.form.Form.prototype.__validFields = function(force, all){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.__validFields()");
		}
		var valid = true;
		var fieldname = undefined;
		for(fieldname in this.data.fields){
			var field = this.data.fields[fieldname];
			var fieldValid = field.isValid(force);
			valid = valid && fieldValid;
			if(!valid && !all)
				return valid;
		}
		return valid;
	};
	
	
	de.titus.form.Form.prototype.enableSubmitButtons = function(enable){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.enableSubmitButtons()");
		}
		var count = this.data.submitButtons.length;
		for(var i = 0; i < count; i++){
			var button = this.data.submitButtons[i];
			button.prop('disabled', !enable);
		}
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
