(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.ValidationController", function() {
		var ValidationController = de.titus.form.ValidationController = function(aElement) {
			if (ValidationController.LOGGER.isDebugEnabled())
				ValidationController.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    formular : undefined,
			    field : undefined,
			    required : (aElement.attr("data-form-required") !== undefined),
			    expressionResolver : new de.titus.core.ExpressionResolver(),
			    validations : aElement.find("[data-form-validation]")
			};

			setTimeout(ValidationController.prototype.__init.bind(this), 1);
		};

		ValidationController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.ValidationController");

		ValidationController.prototype.__init = function() {
			if (ValidationController.LOGGER.isDebugEnabled())
				ValidationController.LOGGER.logDebug("__init()");

			this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);
			this.data.field = this.data.element.formular_field_utils_getAssociatedField();

			if (this.data.required || this.data.validations.length > 0) {
				de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.INITIALIZED, EVENTTYPES.CONDITION_STATE_CHANGED, EVENTTYPES.FIELD_VALUE_CHANGED ], ValidationController.prototype.__doValidate.bind(this));
				de.titus.form.utils.EventUtils.handleEvent(this.data.formular.data.element, [ EVENTTYPES.CONDITION_STATE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED ], ValidationController.prototype.__doValidate.bind(this));
			} else
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_VALID);
		};

		ValidationController.prototype.__doValidate = function(aEvent) {
			if (ValidationController.LOGGER.isDebugEnabled())
				ValidationController.LOGGER.logDebug("__doValidate() -> " + aEvent.type);

			var valid = true;
			aEvent.preventDefault();

			if (aEvent.type != EVENTTYPES.INITIALIZED && aEvent.type != EVENTTYPES.FIELD_VALUE_CHANGED)
				aEvent.stopPropagation();

			// IGNORE ValidationController_STATE_CHANGED ON SELF ELEMENT
			if (aEvent.currentTarget == this.data.element && aEvent.Type == EVENTTYPES.VALIDATION_STATE_CHANGED)
				return;
			// if (aEvent.type ==
			// EVENTTYPES.CONDITION_STATE_CHANGED &&
			// aEvent.currentTarget == this.data.element)
			// return;

			this.data.validations.formular_utils_SetInactive();

			var fieldData = this.data.field.getData(true);
			var valueEmpty = this.__valueEmpty(fieldData);

			if (valueEmpty)
				this.data.element.addClass("no-value");
			else
				this.data.element.removeClass("no-value");

			if (this.data.required && !this.data.field.data.condition)
				valid = false;
			else if (this.data.validations.length == 0)
				valid = !this.data.required || !valueEmpty;
			else if (this.data.validations.length > 0 && valueEmpty)
				valid = !this.data.required;
			else
				valid = this.__checkValidations(fieldData);

			if (valid)
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_VALID);
			else
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_INVALID);
		};

		ValidationController.prototype.__checkValidations = function(aFieldData) {
			if (ValidationController.LOGGER.isDebugEnabled())
				ValidationController.LOGGER.logDebug("__checkValidation()");

			var formularData = this.data.formular.getData("object", true);
			var data = {
			    value : aFieldData ? aFieldData.value : undefined,
			    form : formularData
			};

			var valid = true;
			this.data.validations.each(function() {
				var element = $(this);
				var validation = element.formular_Validation();
				if (!validation.validate(data)) {
					element.formular_utils_SetActive();
					valid = false;
				}
			});
			return valid;
		};

		ValidationController.prototype.__valueEmpty = function(aFieldData) {
			return aFieldData == undefined || aFieldData.value == undefined || (Array.isArray(aFieldData.value) && aFieldData.value.length == 0) || (typeof aFieldData.value === "string" && aFieldData.value.trim().length == 0);
		};

		de.titus.core.jquery.Components.asComponent("formular_ValidationController", de.titus.form.ValidationController);
	});
})($, de.titus.form.Constants.EVENTS);
