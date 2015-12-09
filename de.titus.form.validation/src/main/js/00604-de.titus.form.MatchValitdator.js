de.titus.core.Namespace.create("de.titus.form.MatchValitdator", function() {

	de.titus.form.MatchValitdator = function(aData){
		if(de.titus.form.MatchValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.MatchValitdator.LOGGER.logDebug("call de.titus.form.MatchValitdator.prototype.constructor()");
		}
		this.init(aData);
	};
	
	de.titus.form.MatchValitdator.prototype = Object.create(de.titus.form.Validator.prototype);
	de.titus.form.MatchValitdator.prototype.constructor = de.titus.form.MatchValitdator;
	de.titus.form.MatchValitdator.prototype.parent = de.titus.form.Validator.prototype;
	
	de.titus.form.MatchValitdator.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.MatchValitdator");
	
	de.titus.form.MatchValitdator.prototype.init = function(aData){
		if(de.titus.form.MatchValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.MatchValitdator.LOGGER.logDebug("call de.titus.form.MatchValitdator.prototype.init()");
		}
		this.parent.init.call(this, aData);
		this.data.matches = this.__buildMatchList();
		
		this.data.validData = {"valid": false, "message": (this.data.element.attr("form-validation-match-message") || "invalid")};	
	};
	
	de.titus.form.MatchValitdator.prototype.__buildMatchList = function(){
		var matchString = this.data.element.attr("form-validation-match");
		if(matchString == undefined)
			return [];
				
		matchString = matchString.replace("[", "");
		matchString = matchString.replace("]", "");
		matchString = matchString.replace(" ", "");
		
		if(matchString == "")
			return [];
		else if(matchString.indexOf(",") != -1)
			return matchString.split(",")
		else
			return [matchString];	
	};
	
	de.titus.form.MatchValitdator.prototype.doValidate = function(aValue, aField){
		if(de.titus.form.MatchValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.MatchValitdator.LOGGER.logDebug("call de.titus.form.MatchValitdator.prototype.doValidate()");
		}
		this.data.validData.valid = this.__doValidateValue(aValue, aField);		
		return this.data.validData;		
	};
	
	de.titus.form.MatchValitdator.prototype.__doValidateValue = function(aValues, aField){
		if(de.titus.form.MatchValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.MatchValitdator.LOGGER.logDebug("call de.titus.form.MatchValitdator.prototype.__doValidateValue()");
		}
		var count = this.data.matches.length;
		for(var i = 0; i < count; i++){
			var field = aField.getForm().getField(this.data.matches[i]);
			if(field != undefined && !this.__doMatchValues(aValues, field.getValues()))
				return false;
		}
		return true;
	};
	
	de.titus.form.MatchValitdator.prototype.__doMatchValues = function(aValues1, aValues2){
		if(aValues1.length !=  aValues2.length)
			return false;
		
		var count = aValues1.length;
		for(var i = 0; i < count; i++){
			if(!this.__doContainValue(aValues1[i], aValues2)){
				return false;
			}
		}
		return true;
		
	};
	
	de.titus.form.MatchValitdator.prototype.__doContainValue = function(aValue, aValues){		
		var count = aValues.length;
		for(var i = 0; i < count; i++){
			if(aValues[i] == aValue){
				return true;
			}
		}
		return false;		
	};
	
	de.titus.form.ValidatorRegistry.add("match", de.titus.form.MatchValitdator);
});
