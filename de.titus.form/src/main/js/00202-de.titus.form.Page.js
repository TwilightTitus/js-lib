(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Page", function() {
		var Page = de.titus.form.Page = function(aElement, aIndex) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formular : undefined,
			    name : aElement.attr("data-form-page"),
			    condition : undefined,
			    valid : undefined,
			    fields : []
			};
			
			setTimeout(Page.prototype.__init.bind(this), 1);
		};
		
		Page.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Page");
		
		Page.prototype.__init = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("init()");
			
			this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [
			        de.titus.form.Constants.EVENTS.CONDITION_MET, de.titus.form.Constants.EVENTS.CONDITION_NOT_MET
			], Page.prototype.__changeConditionState.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [
			        de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED, de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED
			], Page.prototype.__changeValidationState.bind(this), "[data-form-field]");
			
			this.data.fields = this.data.element.find("[data-form-field]").formular_Field();
			this.data.element.formular_Condition();
			
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.INITIALIZED);
		};
		
		Page.prototype.__changeConditionState = function(aEvent) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("__changeConditionState () for page -> " + aEvent.type);
			
			aEvent.preventDefault();
			aEvent.stopPropagation();
			
			var condition = false;
			if (aEvent.type == de.titus.form.Constants.EVENTS.CONDITION_MET)
				condition = true;
			
			if (this.data.condition != condition) {
				this.data.condition = condition;
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED);
			}
		};
		
		Page.prototype.__changeValidationState = function(aEvent) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("__changeValidationState () for page -> " + aEvent.type);
			
			aEvent.preventDefault();
			
			var valid = this.__allFieldsValid();
			if (this.data.valid != valid) {
				this.data.valid = valid;
				
				if (this.data.valid)
					this.data.element.formular_utils_SetValid();
				else
					this.data.element.formular_utils_SetInvalid();
				
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED);
			}
		};
		
		Page.prototype.__allFieldsValid = function() {
			for (var i = 0; i < this.data.fields.length; i++) {
				if (!this.data.fields[i].data.valid)
					return false;
			}
			
			return true;
		};
		
		Page.prototype.hide = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("hide ()");
			
			this.data.element.formular_utils_SetInactive();
			
		};
		
		Page.prototype.show = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("show ()");
			
			if (this.data.condition) {
				this.data.element.formular_utils_SetActive();
				for (var i = 0; i < this.data.fields.length; i++)
					this.data.fields[i].show();
			}
		};
		
		Page.prototype.summary = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("summary ()");
			
			if (this.data.condition) {
				for (var i = 0; i < this.data.fields.length; i++)
					this.data.fields[i].summary();

				this.data.element.formular_utils_SetActive();
			}
		};
		
		Page.prototype.getData = function(includeInvalidPage, includeInvalidField) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("getData()");
			
			var result = [];
			if (this.data.condition && (this.data.valid || includeInvalidPage)) {
				for (var i = 0; i < this.data.fields.length; i++) {
					var data = this.data.fields[i].getData(includeInvalidField);
					if (data != undefined)
						result.push(data);
				}
			}
			
			return result;
		};
		
		de.titus.core.jquery.Components.asComponent("formular_Page", de.titus.form.Page);
	});
})($);
