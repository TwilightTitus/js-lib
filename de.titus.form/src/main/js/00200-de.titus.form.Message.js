(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Message", function() {
		var Message = de.titus.form.Message = function(aElement) {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    formular : undefined,
			    expression : (aElement.attr("data-form-message") || "").trim(),
			    expressionResolver : new de.titus.core.ExpressionResolver()
			};

			setTimeout(Message.prototype.__init.bind(this), 1);
		};

		Message.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Message");

		Message.prototype.__init = function() {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("__init()");

			this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);

			if (this.data.expression != "") {
				de.titus.form.utils.EventUtils.handleEvent(this.data.formular.data.element, [ de.titus.form.Constants.EVENTS.INITIALIZED, de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED, de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED ], Message.prototype.__doCheck.bind(this));
			}

			setTimeout(Message.prototype.__doCheck.bind(this), 1);
		};

		Message.prototype.__doCheck = function() {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("__doCheck() -> expression: \"" + this.data.expression + "\"");


			var data = this.data.formular.getData("object", true, false);

			var result = this.data.expressionResolver.resolveExpression(this.data.expression, data, false);
			if (result) {
				this.data.element.removeClass("inactive");
				this.data.element.addClass("active");
			} else {
				this.data.element.removeClass("active");
				this.data.element.addClass("inactive");
			}
		};

		de.titus.core.jquery.Components.asComponent("formular_Message", de.titus.form.Message);
	});
})($);
