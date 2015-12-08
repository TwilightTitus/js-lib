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
			element: undefined,
			name: undefined,
			type: undefined,
			required: false,
			requiredMessage: undefined,
			validators: undefined,
			dependencies: undefined,
			load: undefined,
			form: undefined,
			value: undefined,
			validData: {"valid": false, "message": ""}
		};
		$.extend(true, this.data, aData);
		
		var required= this.data.element.attr("required") || this.data.element.attr("form-required");
		if(required != undefined && required != ""){
			this.data.required = true;
			this.data.requiredMessage = this.data.element.attr("form-required-message") || "required";
		}
		
		this.data.element.data("de.titus.form.Field", this);
	};
		
	de.titus.form.Field.prototype.show = function(show){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.show()");
		}
		if(show)		
			this.data.element.show();
		else
			this.data.element.hide();
	};
	
	de.titus.form.Field.prototype.doLoad = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.doLoad()");
		}
	};
	
	de.titus.form.Field.prototype.readValue = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.readValue()");
		}
		return "";
	};
	
	de.titus.form.Field.prototype.isValid = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.isValid()");
		}
		if(this.data.validData != undefined && !this.data.validData.valid)
			this.data.form.printMessage(this.data.validData.message, this.data.name);
		else 
			this.data.form.clearMessage();
		
		return this.data.validData.valid;
	};
	
	de.titus.form.Field.prototype.__isInputValid = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.__isInputValid()");
		}
		if(this.data.required && (this.data.value == undefined ||this.data.value == "" || (this.data.value.length != undefined && this.data.value.length == 0))){
			this.data.validData = {"valid": false, "message": this.data.requiredMessage};
		}
		else{		
			if(this.data.validDataators != undefined && this.data.validDataators.length > 0){
				var count = this.data.validDataators.length;
				for(var i = 0; i < count; i++){
					var validator = this.data.validDataators[i];
					if(!validator.doValidate(this.data.value, this)){
						this.data.validData =  false;
						return this.data.validData;
					}				
				}
			}			
			this.data.validData = {"valid": true, "message": ""};
		}
		return this.data.validData.valid;
	};
	
	de.titus.form.Field.prototype.__valueChangeEvent = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.__valueChangeEvent()");
		}
		this.data.value = this.readValue();		
		if(this.__isInputValid().valid)
			this.data.form.fireEvent("valid", this);
		else
			this.data.form.fireEvent("invalid", this);
	};
	
	$.fn.FormField = function(){
		if(this.length > 1){
			return this.each(function(){return $(this).FormField();});
		}
		
		return this.data.element.data("de.titus.form.Field");
	};	
});
