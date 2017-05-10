(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Condition", function() {
		var Condition = de.titus.form.Condition = function(aElement) {
			if (Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    formular : undefined,
			    expression : (aElement.attr("data-form-condition") || "").trim(),
			    expressionResolver : new de.titus.core.ExpressionResolver()
			};

			setTimeout(Condition.prototype.__init.bind(this), 1);
		};

		Condition.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Condition");

		Condition.prototype.__init = function() {
			if (Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("__init()");

			this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);

			if (this.data.expression != "") {
				de.titus.form.utils.EventUtils.handleEvent(this.data.formular.data.element, [ de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED, de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED, de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED], Condition.prototype.__doCheck.bind(this));
			}

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ de.titus.form.Constants.EVENTS.INITIALIZED ], Condition.prototype.__doCheck.bind(this));
		};

		Condition.prototype.__doCheck = function(aEvent) {
			if (Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("__doCheck() -> expression: \"" + this.data.expression + "\"");

			aEvent.preventDefault();
			if (aEvent.type != de.titus.form.Constants.EVENTS.INITIALIZED && aEvent.type != de.titus.form.Constants.EVENTS.VALUE_CHANGED)
				aEvent.stopPropagation();

			if (aEvent.currentTarget == this.data.element && (aEvent.type == de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED || aEvent.Type == de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED))
				; // IGNORE CONDTION_STATE_CHANGE AND VALIDATION_STATE_CHANGED
					// ON SELF
			else if (this.data.expression == "")
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.CONDITION_MET);
			else {
				var data = this.data.formular.getData("object", true, false);

				var result = this.data.expressionResolver.resolveExpression(this.data.expression, data, false);
				if (result)
					de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.CONDITION_MET);
				else
					de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.CONDITION_NOT_MET);
			}
		};

		de.titus.core.jquery.Components.asComponent("formular_Condition", de.titus.form.Condition);
	});
})($);
