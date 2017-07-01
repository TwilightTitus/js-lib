(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Condition", function() {
		var Condition = de.titus.form.Condition = function(aElement) {
			if (Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    formular : undefined,
			    dataContext : undefined,
			    expression : (aElement.attr("data-form-condition") || "").trim(),
			    expressionResolver : new de.titus.core.ExpressionResolver()
			};

			setTimeout(Condition.prototype.__init.bind(this), 1);
			// this.__init();
		};

		Condition.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Condition");

		Condition.prototype.__init = function() {
			if (Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("__init()");

			if (this.data.expression !== "") {
				this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);
				this.data.dataContext = this.data.element.formular_findDataContext();
				de.titus.form.utils.EventUtils.handleEvent(this.data.formular.data.element, [ EVENTTYPES.CONDITION_STATE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED, EVENTTYPES.FIELD_VALUE_CHANGED ], Condition.prototype.__doCheck.bind(this));
			}

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.INITIALIZED ], Condition.prototype.__doCheck.bind(this));
		};

		Condition.prototype.__doCheck = function(aEvent) {
			if (Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug([ "__doCheck(\"", aEvent, "\") -> expression: \"", this.data.expression, "\", element: \"", this.data.element, "\", this: \"", this, "\"" ]);

			aEvent.preventDefault();
			if (aEvent.type != EVENTTYPES.INITIALIZED && aEvent.type != EVENTTYPES.FIELD_VALUE_CHANGED)
				aEvent.stopPropagation();

			if (aEvent.currentTarget == this.data.element && (aEvent.type == EVENTTYPES.CONDITION_STATE_CHANGED || aEvent.Type == EVENTTYPES.VALIDATION_STATE_CHANGED))
				; // IGNORE CONDTION_STATE_CHANGE AND VALIDATION_STATE_CHANGED
			// ON SELF
			else if (this.data.expression === "")
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.CONDITION_MET);
			else {
				var data = this.data.dataContext.getData({
				    condition : true,
				    validate : false
				});

				data = de.titus.form.data.utils.DataUtils.toModel(data, "object");
				if (Condition.LOGGER.isDebugEnabled())
					Condition.LOGGER.logDebug([ "__doCheck() -> data: \"", data, "\", expression: \"", this.data.expression, "\"" ]);

				var result = this.data.expressionResolver.resolveExpression(this.data.expression, data, false);
				if (result)
					de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.CONDITION_MET);
				else
					de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.CONDITION_NOT_MET);
			}
		};

		de.titus.core.jquery.Components.asComponent("formular_Condition", de.titus.form.Condition);
	});
})($, de.titus.form.Constants.EVENTS);
