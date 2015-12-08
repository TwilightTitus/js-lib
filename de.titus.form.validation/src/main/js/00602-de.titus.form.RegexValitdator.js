de.titus.core.Namespace.create("de.titus.form.RegexValitdator", function() {

	de.titus.form.RegexValitdator = function(aData){
		if(de.titus.form.RegexValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.RegexValitdator.LOGGER.logDebug("call de.titus.form.RegexValitdator.prototype.constructor()");
		}
		this.init(aData);
	};
	
	de.titus.form.RegexValitdator.prototype = Object.create(de.titus.form.Validator.prototype);
	de.titus.form.RegexValitdator.prototype.constructor = de.titus.form.RegexValitdator;
	de.titus.form.RegexValitdator.prototype.parent = de.titus.form.Validator.prototype;
	
	de.titus.form.RegexValitdator.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.RegexValitdator");
	
	de.titus.form.RegexValitdator.prototype.init = function(aData){
		if(de.titus.form.RegexValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.RegexValitdator.LOGGER.logDebug("call de.titus.form.RegexValitdator.prototype.init()");
		}
		this.parent.init.call(this, aData);
		this.data.regex = new de.titus.core.regex.Regex((this.data.element.attr("form-validation-regex") || ".*"));
		this.data.validData = {"valid": false, "message": (this.data.element.attr("form-validation-regex-message") || "invalid")};	
	};
	
	de.titus.form.RegexValitdator.prototype.doValidate = function(aValue, aField){
		if(de.titus.form.RegexValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.RegexValitdator.LOGGER.logDebug("call de.titus.form.RegexValitdator.prototype.doValidate()");
		}
		this.__doValidateValue(aValue);		
		return this.data.validData;		
	};
	
	de.titus.form.RegexValitdator.prototype.__doValidateValue = function(aValues){
		if(de.titus.form.RegexValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.RegexValitdator.LOGGER.logDebug("call de.titus.form.RegexValitdator.prototype.__doValidateValue()");
		}

		if(aValues == undefined){
			this.data.validData.valid = false;
		}
		else{
			var count = aValues.length;
			for(var i = 0; i < count; i++){
				if(!this.data.regex.parse(aValues[i]).isMatching()){
					this.data.validData.valid = false;
					return;
				}
			}
			this.data.validData.valid = true;
		}
		return;
	};
	
	de.titus.form.ValidatorRegistry.add("regex", de.titus.form.RegexValitdator);
});
