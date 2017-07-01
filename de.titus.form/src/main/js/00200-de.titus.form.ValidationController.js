(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.ValidationController", function() {
		var ValidationController = de.titus.form.ValidationController = function(aElement) {
			if (ValidationController.LOGGER.isDebugEnabled())
				ValidationController.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    formular : undefined,
			    dataContext : undefined,
			    field : undefined,
			    expressionResolver : new de.titus.core.ExpressionResolver(),
			    validations : aElement.find("[data-form-validation]"),
			    timeoutId : undefined
			};

			setTimeout(ValidationController.prototype.__init.bind(this), 1);
			// this.__init();
		};

		ValidationController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.ValidationController");

		ValidationController.prototype.__init = function() {
			if (ValidationController.LOGGER.isDebugEnabled())
				ValidationController.LOGGER.logDebug("__init()");

			this.data.field = this.data.element.formular_field_utils_getAssociatedField();
			this.data.dataContext = this.data.element.formular_findDataContext();

			if (this.data.field.data.required || this.data.validations.length > 0) {
				var formularElement = de.titus.form.utils.FormularUtils.getFormularElement(this.data.element);
				de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.INITIALIZED, EVENTTYPES.CONDITION_STATE_CHANGED, EVENTTYPES.FIELD_VALUE_CHANGED ], ValidationController.prototype.__doLazyValidate.bind(this));
				de.titus.form.utils.EventUtils.handleEvent(formularElement, [ EVENTTYPES.CONDITION_STATE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED ], ValidationController.prototype.__doLazyValidate.bind(this));
			} else
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_VALID);
		};

		ValidationController.prototype.__doLazyValidate = function(aEvent) {
			if (this.data.timeoutId)
				clearTimeout(this.data.timeoutId);

			this.data.timeoutId = setTimeout(ValidationController.prototype.__doValidate.bind(this, aEvent), 300);
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

			var fieldData = this.data.field.getData({
			    condition : false,
			    validate : true
			});
			var hasValue = !this.__valueEmpty(fieldData);

			if (hasValue)
				this.data.element.removeClass("no-value");
			else
				this.data.element.addClass("no-value");

			var condition = this.data.field.data.condition;
			var required = this.data.field.data.required;
			var requiredOnActive = this.data.field.requiredOnActive;
			var hasValidations = this.data.validations.length > 0;

			if ((required && !condition) || requiredOnActive)
				valid = true;
			else if (required) {
				if (condition && hasValue && hasValidations)
					valid = this.__checkValidations(fieldData);
				else if (condition && hasValue && !hasValidations)
					valid = true;
				else
					valid = false;
			} else {
				if (hasValue && condition && hasValidations)
					valid = this.__checkValidations(fieldData);
				else
					valid = true;
			}

			if (valid)
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_VALID);
			else
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_INVALID);
		};

		ValidationController.prototype.__checkValidations = function(aFieldData) {
			if (ValidationController.LOGGER.isDebugEnabled())
				ValidationController.LOGGER.logDebug([ "__checkValidation(\"", aFieldData, "\")" ]);

			var data = this.data.dataContext.getData({
			    condition : false,
			    validate : true
			});
			data.$value = aFieldData ? aFieldData.value : undefined;

			data = de.titus.form.data.utils.DataUtils.toModel(data, "object");
			if (ValidationController.LOGGER.isDebugEnabled())
				ValidationController.LOGGER.logDebug([ "__checkValidation() -> dataContext: \"", data, "\"" ]);

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
			return aFieldData === undefined || aFieldData.value === undefined || (Array.isArray(aFieldData.value) && aFieldData.value.length === 0) || (typeof aFieldData.value === "string" && aFieldData.value.trim().length === 0);
		};

		de.titus.core.jquery.Components.asComponent("formular_ValidationController", de.titus.form.ValidationController);
	});
})($, de.titus.form.Constants.EVENTS);
