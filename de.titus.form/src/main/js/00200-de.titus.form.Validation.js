(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Validation", function() {
		var Validation = de.titus.form.Validation = function(aElement) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    formular : undefined,
			    field : undefined,
			    required : (aElement.attr("data-form-required") !== undefined),
			    expressionResolver : new de.titus.core.ExpressionResolver(),
			    validations : []
			};

			setTimeout(Validation.prototype.__init.bind(this), 1);
		};

		Validation.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Validation");

		Validation.prototype.__init = function() {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("__init()");

			this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);
			this.data.field = de.titus.form.utils.FormularUtils.getField(this.data.element);
			var validations = [];
			this.data.element.find("[data-form-validation]").each(function() {
				var element = $(this);
				element.addClass("inactive");

				var validation = {
				    element : element,
				    expression : (element.attr("data-form-validation") || "").trim()
				};

				validations.push(validation);
			});

			this.data.validations = validations;

			if (this.data.required || this.data.validations.length > 0) {
				de.titus.form.utils.EventUtils.handleEvent(this.data.element, [de.titus.form.Constants.EVENTS.INITIALIZED, de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED, de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED ], Validation.prototype.__doValidate.bind(this));
				de.titus.form.utils.EventUtils.handleEvent(this.data.formular.data.element, [ de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED, de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED ], Validation.prototype.__doValidate.bind(this));
			} else
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.VALIDATION_VALID);
		};

		Validation.prototype.__doValidate = function(aEvent) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("__doValidate() -> " + aEvent.type);

			var valid = true;
			aEvent.preventDefault();

			if (aEvent.type != de.titus.form.Constants.EVENTS.INITIALIZED && aEvent.type != de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED)
				aEvent.stopPropagation();

			// IGNORE VALIDATION_STATE_CHANGED ON SELF ELEMENT
			if (aEvent.currentTarget == this.data.element && aEvent.Type == de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED)
				return;
			if (aEvent.type == de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED && aEvent.currentTarget != this.data.element)
				return;
			
			var fieldData = this.data.field.getData(true);
			var valueEmpty = this.__valueEmpty(fieldData);
			
			if (this.data.required && !this.data.field.data.condition)
				valid = false;
			else if (this.data.validations.length == 0)
				valid = !this.data.required || !valueEmpty;
			else if (this.data.validations.length > 0 && valueEmpty)
				valid = !this.data.required;
			else
				valid = this.__checkValidation(fieldData);

			if (valid)
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.VALIDATION_VALID);
			else
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.VALIDATION_INVALID);
		};

		Validation.prototype.__checkValidation = function(aFieldData) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("__checkValidation()");

			var formularData = this.data.formular.getData("object", true);
			var data = {
			    value : aFieldData ? aFieldData.value : undefined,
			    form : formularData
			};
			
			var valid = true;
			for (var i = 0; i < this.data.validations.length; i++) {
				var validation = this.data.validations[i];
				var test = this.data.expressionResolver.resolveExpression(validation.expression, data, true)
					if (Validation.LOGGER.isDebugEnabled())
						Validation.LOGGER.logDebug("__checkValidation() -> rexpression: \"" + validation.expression + "\" -> " + test);
				if (test) {
					validation.element.removeClass("inactive");
					validation.element.addClass("active");
					valid = false;
				} else {
					validation.element.removeClass("active");
					validation.element.addClass("inactive");
				}
			}

			return valid;
		};
		
		Validation.prototype.__valueEmpty = function(aFieldData) {
			return aFieldData == undefined || aFieldData.value == undefined || (Array.isArray(aFieldData.value) && aFieldData.value.length == 0) || (typeof aFieldData.value === "string" && aFieldData.value.trim().length == 0);
		};

		de.titus.core.jquery.Components.asComponent("formular_Validation", de.titus.form.Validation);
	});
})();
