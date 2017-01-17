(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Field", function() {
		de.titus.form.Field = function(aElement, aDataController) {
			if(de.titus.form.Field.LOGGER.isDebugEnabled())
				de.titus.form.Field.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix + "-field");
			this.data.type = aElement.attr(de.titus.form.Setup.prefix + "-field-type");
			this.data.activ = false;
			this.data.valid = false;
			
			
			this.init();
		};
	});
	
	de.titus.form.Field.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Field");
	
	de.titus.form.Field.prototype.init = function() {
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("init()");
		

		var initializeFunction = de.titus.form.Setup.fieldtypes[this.data.type] || de.titus.form.Setup.fieldtypes["default"];
		if (initializeFunction == undefined || typeof initializeFunction !== "function")
			throw "The fieldtype \"" + this.data.type + "\" is not available!";
		
		this.fieldController = initializeFunction(this.data.element, this.data.name, de.titus.form.Field.prototype.doValueChange.bind(this));		
		this.doValidate(this.fieldController.getValue());
	};
	
	de.titus.form.Field.prototype.doConditionCheck = function() {
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("doConditionCheck()");
		
		this.data.activ = false;		
		if (this.isConditionSatisfied()){
			this.fieldController.showField(this.data.dataController.data);
			this.data.activ = true;
		}
		else
			this.fieldController.hideField();
	};
	
	de.titus.form.Field.prototype.isConditionSatisfied = function() {
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("isConditionSatisfied()");
		
		// TODO
		return true; // if condition is satisfied
	};
	
	de.titus.form.Field.prototype.showSummary = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("showSummary()");
		
		if(!this.data.activ)
			return;
		
		this.fieldController.showSummary();
	};
	
	de.titus.form.Field.prototype.doValueChange = function(aEvent) {
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("doValueChange()");
		
		if (aEvent != undefined) {
			if (typeof aEvent.preventDefault === "function")
				aEvent.preventDefault();
			if (typeof aEvent.stopPropagation === "function")
				aEvent.stopPropagation();
		}
		
		var value = this.fieldController.getValue();
		if (this.doValidate(value))
			this.data.dataController.changeValue(this.data.name, value);
		else
			this.data.dataController.changeValue(this.data.name, null);
		
		this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
	};
	
	de.titus.form.Field.prototype.doValidate = function(aValue) {
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("isValid()");
		// TODO
		this.fieldController.setValid(true, "Not Valid!");
		
		this.data.valid = true;
		return this.data.valid;// if value valied!
	};
	
	$.fn.FormularField = function(aDataController) {
		if (this.length == undefined || this.length == 0)
			return;
		else if (this.length > 1) {
			var result = [];
			this.each(function() {
				result.push($(this).FormularField(aDataController));
			});
			return result;
		} else {
			var data = this.data("de.titus.form.Field");
			if (data == undefined) {
				data = new de.titus.form.Field(this, aDataController);
				this.data("de.titus.form.Field", data);
			}
			return data;
		}
	};
})();
