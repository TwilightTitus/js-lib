de.titus.core.Namespace.create("de.titus.form.Field", function() {

	de.titus.form.Field = function(aData){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.constructor()");
		}
		if(aData != undefined)
			this.init(aData);
	};
	
	de.titus.form.Field.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Field");
	
	de.titus.form.Field.prototype.init = function(aData){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.init()");
		}
		this.data = {
			"element": undefined,
			"fieldname": undefined,
			"type": undefined,
			"validators": undefined,
			"dependents": undefined,
			"dependencies": undefined,
			"load": undefined,
			"form": undefined,
			"values": undefined,
			"validData": {"valid": false, "message": ""},
			"validateTimeout": 300
		};
		$.extend(true, this.data, aData);
		
		
		this.data.element.data("de.titus.form.Field", this);
		return;
	};
	
	de.titus.form.Field.prototype.getElement = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.getElement()");
		}
		return this.data.element;
	};
	
	de.titus.form.Field.prototype.getForm = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.getForm()");
		}
		return this.data.form;
	};
	
	de.titus.form.Field.prototype.getFieldname = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.getFieldname()");
		}
		return this.data.fieldname;
	};
	
	de.titus.form.Field.prototype.getValidators = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.getValidators()");
		}
		return this.data.validators;
	};
	
	de.titus.form.Field.prototype.getDependents = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.getDependents()");
		}
		return this.data.dependents;
	};
	
	de.titus.form.Field.prototype.getDependencies = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.getDependencies()");
		}
		return this.data.dependencies;
	};
	
	de.titus.form.Field.prototype.getValues = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.getValues()");
		}
		return this.data.values;
	};
		
	de.titus.form.Field.prototype.show = function(show){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.show()");
		}
		if(show)		
			this.data.element.show();
		else
			this.data.element.hide();
		return;
	};
	
	de.titus.form.Field.prototype.doLoad = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.doLoad()");
		}
		return;
	};
	
	de.titus.form.Field.prototype.readValues = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.readValue()");
		}
		return "";
	};
	
	de.titus.form.Field.prototype.doReset = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.doReset()");
		}
		this.data.values = [];
		this.data.form.clearMessage(this.data.fieldname);
		this.data.element.removeClass("form-invalid");
	};
	
	de.titus.form.Field.prototype.isValid = function(force){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.isValid()");
		}
		if(force)
			this.__isInputValid();
		
		return this.data.validData.valid;
	};
	
	de.titus.form.Field.prototype.__isInputValid = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.__isInputValid()");
		}
		this.__executeValidators();
		

		if(this.data.validData != undefined && !this.data.validData.valid){
			this.data.form.printMessage(this.data.validData.message, this.data.fieldname);
			this.data.element.addClass("form-invalid");
		}
		else{
			this.data.form.clearMessage(this.data.fieldname);
			this.data.element.removeClass("form-invalid");
		}
		return this.data.validData.valid;
	};
	
	de.titus.form.Field.prototype.__executeValidators = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.__executeValidators()");
		}
		if(this.data.validators != undefined && this.data.validators.length > 0){
			var count = this.data.validators.length;
			for(var i = 0; i < count; i++){
				var validator = this.data.validators[i];
				this.data.validData = validator.doValidate(this.data.values, this);
				if(!this.data.validData.valid)
					return;	
			}
		}			
		this.data.validData = {"valid": true, "message": ""};
		return;
	};
	
	de.titus.form.Field.prototype.__valueChangeEvent = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.__valueChangeEvent()");
		}
		this.data.values = this.readValues();		
		if(this.__isInputValid().valid)
			this.data.form.fireEvent("valid", this);
		else
			this.data.form.fireEvent("invalid", this);
		return;
	};
	
	$.fn.FormField = function(){
		if(this.length > 1){
			return this.each(function(){return $(this).FormField();});
		}
		
		return this.data("de.titus.form.Field");
	};	
});
