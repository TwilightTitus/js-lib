(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Field", function() {
		var Field = de.titus.form.Field = function(aElement) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("constructor");
			
			this.data = {
			    element : aElement,
			    page : undefined,
			    formular : undefined,
			    name : (aElement.attr("data-form-field") || "").trim(),
			    type : (aElement.attr("data-form-field-type") || "default").trim(),
			    required : (aElement.attr("data-form-required") !== undefined),
			    condition : undefined,
			    valid : undefined,
			    controller : undefined
			};
			
			this.hide();
			
			setTimeout(Field.prototype.__init.bind(this), 1);
		};
		
		Field.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Field");
		
		Field.prototype.__init = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("init()");
			
			this.data.page = de.titus.form.utils.FormularUtils.getPage(this.data.element);
			this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);
			this.data.controller = de.titus.form.Registry.getFieldController(this.data.type, this.data.element);
			
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [
			        de.titus.form.Constants.EVENTS.CONDITION_MET, de.titus.form.Constants.EVENTS.CONDITION_NOT_MET
			], Field.prototype.__changeConditionState.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [
			        de.titus.form.Constants.EVENTS.VALIDATION_VALID, de.titus.form.Constants.EVENTS.VALIDATION_INVALID
			], Field.prototype.__changeValidationState.bind(this));
			
			this.data.element.formular_Condition();
			this.data.element.formular_ValidationController();
			
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.INITIALIZED);
		};
		
		Field.prototype.__changeConditionState = function(aEvent) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("__changeConditionState()  for \"" + this.data.name + "\" -> " + aEvent.type);
			
			aEvent.preventDefault();
			aEvent.stopPropagation();
			
			var condition = false;
			if (aEvent.type == de.titus.form.Constants.EVENTS.CONDITION_MET)
				condition = true;
			
			if (this.data.condition != condition) {
				this.data.condition = condition;
				if (this.data.condition)
					this.show();
				else
					this.hide();
				
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED);
			}
		};
		
		Field.prototype.__changeValidationState = function(aEvent) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("__changeValidationState() for field \"" + this.data.name + "\" -> " + aEvent.type);
			
			aEvent.preventDefault();
			aEvent.stopPropagation();
			
			var valid = false;
			if (aEvent.type == de.titus.form.Constants.EVENTS.VALIDATION_VALID)
				valid = true;
			
			if (this.data.valid != valid) {
				if (Field.LOGGER.isDebugEnabled())
					Field.LOGGER.logDebug("__changeValidationState() for field \"" + this.data.name + "\" from " + this.data.valid + " -> " + valid);
				
				this.data.valid = valid;
				
				if (this.data.valid)
					this.data.element.formular_utils_SetValid();
				else
					this.data.element.formular_utils_SetInvalid();
				
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED);
			}
		};
		
		Field.prototype.hide = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("hide ()");
			
			this.data.element.formular_utils_SetInactive();
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.FIELD_HIDE);
		};
		
		Field.prototype.show = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("show ()");
			
			this.data.element.formular_utils_SetActive();
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.FIELD_SHOW);
		};
		
		Field.prototype.summary = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("summary ()");

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.FIELD_SUMMARY);
			this.data.element.formular_utils_SetActive();
		};
		
		Field.prototype.getData = function(acceptInvalid) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("getData()");
			
			if (this.data.condition && (this.data.valid || acceptInvalid))
				return {
				    name : this.data.name,
				    type : this.data.type,
				    value : this.data.controller.getValue(),
				    items : []
				};
		};
		
		de.titus.core.jquery.Components.asComponent("formular_Field", de.titus.form.Field);
	});
})();
