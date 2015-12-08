de.titus.core.Namespace.create("de.titus.form.RequiredValitdator", function() {

	de.titus.form.RequiredValitdator = function(aData){
		if(de.titus.form.RequiredValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.RequiredValitdator.LOGGER.logDebug("call de.titus.form.RequiredValitdator.prototype.constructor()");
		}
		this.init(aData);
	};
	
	de.titus.form.RequiredValitdator.prototype = Object.create(de.titus.form.Validator.prototype);
	de.titus.form.RequiredValitdator.prototype.constructor = de.titus.form.RequiredValitdator;
	de.titus.form.RequiredValitdator.prototype.parent = de.titus.form.Validator.prototype;
	
	de.titus.form.RequiredValitdator.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.RequiredValitdator");
	
	de.titus.form.RequiredValitdator.prototype.init = function(aData){
		if(de.titus.form.RequiredValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.RequiredValitdator.LOGGER.logDebug("call de.titus.form.RequiredValitdator.prototype.init()");
		}
		this.parent.init.call(this, aData);
		this.data.validData = {"valid": false, "message": (this.data.element.attr("form-required-message") || this.data.element.attr("form-validation-required-message") || "invalid")};	
	};
	
	de.titus.form.RequiredValitdator.prototype.doValidate = function(aValue, aField){
		if(de.titus.form.RequiredValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.RequiredValitdator.LOGGER.logDebug("call de.titus.form.RequiredValitdator.prototype.doValidate()");
		}
		this.__doValidateValue(aValue);		
		return this.data.validData;		
	};
	
	de.titus.form.RequiredValitdator.prototype.__doValidateValue = function(aValues){
		if(de.titus.form.RequiredValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.RequiredValitdator.LOGGER.logDebug("call de.titus.form.RequiredValitdator.prototype.__doValidateValue()");
		}
		
		if(aValues == undefined || aValues.length == undefined || aValues.length == 0){
			this.data.validData.valid = false;
		}
		else{
			var count = aValues.length;
			for(var i = 0; i < count; i++){
				if(aValues[i] == ""){
					this.data.validData.valid = false;
					return;
				}
			}
			this.data.validData.valid = true;
		}
		return;
	};
	
	de.titus.form.ValidatorRegistry.add("required", de.titus.form.RequiredValitdator);
});
