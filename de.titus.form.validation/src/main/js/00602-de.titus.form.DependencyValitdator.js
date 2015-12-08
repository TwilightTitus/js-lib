de.titus.core.Namespace.create("de.titus.form.DependencyValitdator", function() {

	de.titus.form.DependencyValitdator = function(aData){
		if(de.titus.form.DependencyValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.DependencyValitdator.LOGGER.logDebug("call de.titus.form.DependencyValitdator.prototype.constructor()");
		}
		this.init(aData);
	};
	
	de.titus.form.DependencyValitdator.prototype = Object.create(de.titus.form.Validator.prototype);
	de.titus.form.DependencyValitdator.prototype.constructor = de.titus.form.DependencyValitdator;
	de.titus.form.DependencyValitdator.prototype.parent = de.titus.form.Validator.prototype;
	
	de.titus.form.DependencyValitdator.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DependencyValitdator");
	
	de.titus.form.DependencyValitdator.prototype.init = function(aData){
		if(de.titus.form.DependencyValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.DependencyValitdator.LOGGER.logDebug("call de.titus.form.DependencyValitdator.prototype.init()");
		}
		this.parent.init.call(this, aData);
		this.data.validData = {"valid": false, "message": this.data.element.attr("form-dependencies-message")};	
	};
	
	de.titus.form.DependencyValitdator.prototype.doValidate = function(aValue, aField){
		if(de.titus.form.DependencyValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.DependencyValitdator.LOGGER.logDebug("call de.titus.form.DependencyValitdator.prototype.doValidate()");
		}
		var dependencies = aField.data.dependencies;
		var count = dependencies.length;
		for(var i = 0; i < count; i++){
			var dependentField = aField.data.form.data.fields[dependencies[i]];
			if(dependentField != undefined){
				var valid = dependentField.isValid();
				if(!valid){
					this.data.validData = false;
					aField.show(false);
					return;
				}
			}			
		}
		this.data.validData.valid = true;
		aField.show(true);
		return this.data.validData;		
	};
	
	
	
	de.titus.form.ValidatorRegistry.add("dependencies", de.titus.form.DependencyValitdator);
});
