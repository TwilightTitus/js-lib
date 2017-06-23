(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Validation", function() {
		var Validation = de.titus.form.Validation = function(aElement) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    expression : (aElement.attr("data-form-Validation") || "").trim(),
			    expressionResolver : new de.titus.core.ExpressionResolver()
			};
		};

		Validation.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Validation");

		Validation.prototype.validate = function(aContext) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("validate() -> expression: " + this.data.expression);
			if (this.data.expression != "") {
				var valid = this.data.expressionResolver.resolveExpression(this.data.expression, aContext, false);
				return valid;
			}

			return true;
		};

		de.titus.core.jquery.Components.asComponent("formular_Validation", de.titus.form.Validation);
	});
})();
