(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Field", function() {
		de.titus.form.Field = function(aElement, aDataController, aExpressionResolver) {
			if(de.titus.form.Field.LOGGER.isDebugEnabled())
				de.titus.form.Field.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix + "-field");
			this.data.type = aElement.attr(de.titus.form.Setup.prefix + "-field-type");
			this.data.expressionResolver = aExpressionResolver || new de.titus.core.ExpressionResolver();
			this.data.conditionHandle = new de.titus.form.Condition(this.data.element,this.data.dataController,this.data.expressionResolver); 
			this.data.validationHandle = new de.titus.form.Validation(this.data.element,this.data.dataController,this.data.expressionResolver);
			this.data.active = undefined;
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
		
		var activ = this.data.conditionHandle.doCheck();
		if (this.data.active != activ && activ)
			this.fieldController.showField(this.data.dataController.data);
		else if (this.data.active != activ &&  !activ)
			this.setInactiv();
		else{
			//No Change
		}
		
		this.data.active = activ;
		
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("doConditionCheck() -> result: " + this.data.active);
		
		if(this.data.active){
			this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);
			this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
			this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);
		}
		else{
			this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
			this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);
			this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
		}
		
		return this.data.active;
	};
	
	de.titus.form.Field.prototype.setInactiv = function() {
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("setInactiv()");
		this.data.dataController.changeValue(this.data.name, null, this);
		this.fieldController.hideField();
	};
	
	de.titus.form.Field.prototype.showSummary = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("showSummary()");
		
		if(!this.data.active)
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
			this.data.dataController.changeValue(this.data.name, value, this);
		else
			this.data.dataController.changeValue(this.data.name, undefined, this);
		
		this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
	};
	
	de.titus.form.Field.prototype.doValidate = function(aValue) {
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("doValidate() -> field: " + this.data.name);		
		
		this.data.valid = this.data.validationHandle.doCheck(aValue);		
		this.fieldController.setValid(this.data.valid, "");
		
		if(this.data.valid){
			this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALID);
			this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_INVALID);
			this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_VALID);
		}
		else{
			this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_INVALID);
			this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_VALID);
			this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_INVALID);
		}
		
		
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("doValidate() -> field: " + this.data.name + " - result: " + this.data.valid);
		
		return this.data.valid;
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
