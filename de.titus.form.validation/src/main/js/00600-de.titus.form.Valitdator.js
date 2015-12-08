de.titus.core.Namespace.create("de.titus.form.Validator", function() {

	de.titus.form.Validator = function(aData){
		if(de.titus.form.Validator.LOGGER.isDebugEnabled()){
			de.titus.form.Validator.LOGGER.logDebug("call de.titus.form.Validator.prototype.constructor()");
		}
		this.init(aData);
	};
	de.titus.form.Validator.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Validator");
	
	de.titus.form.Validator.prototype.init = function(aData){
		if(de.titus.form.Validator.LOGGER.isDebugEnabled()){
			de.titus.form.Validator.LOGGER.logDebug("call de.titus.form.Validator.prototype.init()");
		}
		this.data = {
			element: undefined
		};
		$.extend(true, this.data, aData);
	};
	
	de.titus.form.Validator.prototype.doValidate = function(aValues, aField){
		if(de.titus.form.Validator.LOGGER.isDebugEnabled()){
			de.titus.form.Validator.LOGGER.logDebug("call de.titus.form.Validator.prototype.doValidate()");
		}
		return {"valid": false, "message": "is invalid"};		
	};
});
