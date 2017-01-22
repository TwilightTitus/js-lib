(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Field", function() {
		var Field = function(aElement, aDataController, aExpressionResolver) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix + "-field");
			this.data.type = aElement.attr(de.titus.form.Setup.prefix + "-field-type");
			this.data.expressionResolver = aExpressionResolver || new de.titus.core.ExpressionResolver();
			this.data.conditionHandle = new de.titus.form.Condition(this.data.element, this.data.dataController, this.data.expressionResolver);
			this.data.validationHandle = new de.titus.form.Validation(this.data.element, this.data.dataController, this.data.expressionResolver);
			this.data.messageHandle = new de.titus.form.Message(this.data.element, this.data.dataController, this.data.expressionResolver);
			this.data.firstCall = true;
			this.data.active = undefined;
			this.data.valid = false;
			
			this.init();
		};
		
		Field.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Field");
		
		Field.prototype.init = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("init()");
			
			var initializeFunction = de.titus.form.Setup.fieldtypes[this.data.type] || de.titus.form.Setup.fieldtypes["default"];
			if (initializeFunction == undefined || typeof initializeFunction !== "function")
				throw "The fieldtype \"" + this.data.type + "\" is not available!";

			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED, Field.prototype.doValueChange.bind(this));
			this.fieldController = initializeFunction(this.data.element);
		};
		
		Field.prototype.doConditionCheck = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doConditionCheck()");
			
			this.data.active = this.data.conditionHandle.doCheck();			
			if (this.data.active)
				this.fieldController.showField(this.data.dataController.getData(this.data.name), this.data.dataController.getData());
			else
				this.setInactiv();			
			
			if (this.data.active) {
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);
				this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
				this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);				
			} else {
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
				this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);
				this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
			}
			
			if(this.data.firstCall){
				this.data.firstCall = false;
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);				
			}
			
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doConditionCheck() -> result: " + this.data.active);
			
			this.data.messageHandle.showMessage();
			return this.data.active;
		};
		
		Field.prototype.setInactiv = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("setInactiv()");
			this.data.dataController.changeValue(this.data.name, undefined, this);
			this.fieldController.hideField();
		};
		
		Field.prototype.showSummary = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("showSummary()");
			
			if (!this.data.active)
				return;
			
			this.fieldController.showSummary();
		};
		
		Field.prototype.doValueChange = function(aEvent) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doValueChange() -> event type: " + (aEvent != undefined ? aEvent.type : ""));
			
			var value = this.fieldController.getValue();
			if (this.doValidate(value))
				this.data.dataController.changeValue(this.data.name, value, this);
			else
				this.data.dataController.changeValue(this.data.name, undefined, this);
			
			if (aEvent == undefined)
				this.data.element.trigger($.Event(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED));
			else if (aEvent.type != de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED) {
				aEvent.preventDefault();
				aEvent.stopPropagation();
				this.data.element.trigger($.Event(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED));
			}
			
			this.data.messageHandle.showMessage();
		};
		
		Field.prototype.doValidate = function(aValue) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doValidate() -> field: " + this.data.name);
			
			this.data.valid = this.data.validationHandle.doCheck(aValue);			
			if (this.data.valid) {
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALID);
				this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_INVALID);
				this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_VALID);
			} else {
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_INVALID);
				this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_VALID);
				this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_INVALID);
			}
			
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doValidate() -> field: " + this.data.name + " - result: " + this.data.valid);
			
			return this.data.valid;
		};
		
		de.titus.form.Field = Field;
		
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
	});
})();
