(function($, EventUtils, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.ContainerField", function() {
		var Field = de.titus.form.ContainerField = function(aElement) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    page : undefined,
			    formular : undefined,
			    name : (aElement.attr("data-form-container-field") || "").trim(),
			    required : (aElement.attr("data-form-required") !== undefined),
			    condition : undefined,
			    valid : undefined,
			    fields : []
			};

			this.hide();

			setTimeout(Field.prototype.__init.bind(this), 1);
		};

		Field.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.ContainerField");

		Field.prototype.__init = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("init()");

			EventUtils.handleEvent(this.data.element, [ EVENTTYPES.CONDITION_MET, EVENTTYPES.CONDITION_NOT_MET ], Field.prototype.__changeConditionState.bind(this));
			EventUtils.handleEvent(this.data.element, [ EVENTTYPES.VALIDATION_VALID, EVENTTYPES.VALIDATION_INVALID ], Field.prototype.__changeValidationState.bind(this));

			this.data.fields = this.data.element.formular_field_utils_getSubFields();

			this.data.element.formular_Condition();
			this.data.element.formular_ValidationController();

			EventUtils.triggerEvent(this.data.element, EVENTTYPES.INITIALIZED);
		};

		Field.prototype.__changeConditionState = function(aEvent) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug([ "__changeConditionState()  for \"", this.data.name, "\" -> ", aEvent ]);

			aEvent.preventDefault();
			aEvent.stopPropagation();

			var condition = false;
			if (aEvent.type == EVENTTYPES.CONDITION_MET)
				condition = true;

			if (this.data.condition != condition) {
				this.data.condition = condition;
				if (this.data.condition)
					this.show();
				else
					this.hide();

				EventUtils.triggerEvent(this.data.element, EVENTTYPES.CONDITION_STATE_CHANGED);
			}
		};

		Field.prototype.__changeValidationState = function(aEvent) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("__changeValidationState() for field \"" + this.data.name + "\" -> " + aEvent.type);

			aEvent.preventDefault();
			aEvent.stopPropagation();

			var valid = false;
			if (aEvent.type == EVENTTYPES.VALIDATION_VALID)
				valid = true;

			if (this.data.valid != valid) {
				if (Field.LOGGER.isDebugEnabled())
					Field.LOGGER.logDebug("__changeValidationState() for field \"" + this.data.name + "\" from " + this.data.valid + " -> " + valid);

				this.data.valid = valid;

				if (this.data.valid)
					this.data.element.formular_utils_SetValid();
				else
					this.data.element.formular_utils_SetInvalid();

				EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_STATE_CHANGED);
			}
		};

		Field.prototype.hide = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("hide ()");

			this.data.element.formular_utils_SetInactive();
			for (var i = 0; i < this.data.fields.length; i++)
				this.data.fields[i].hide();
		};

		Field.prototype.show = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("show ()");
			if (this.data.condition) {
				this.data.element.formular_utils_SetActive();
				for (var i = 0; i < this.data.fields.length; i++)
					this.data.fields[i].show();
			}
		};

		Field.prototype.summary = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("summary ()");
			if (this.data.condition) {
				for (var i = 0; i < this.data.fields.length; i++)
					this.data.fields[i].summary();

				this.data.element.formular_utils_SetActive();
			}
		};

		Field.prototype.getData = function(acceptInvalid) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("getData()");

			if (this.data.condition && (this.data.valid || acceptInvalid)) {
				var items = [];
				for (var i = 0; i < this.data.fields.length; i++) {
					var value = this.data.fields[i].getData(acceptInvalid);
					if (value)
						items.push(value);
				}

				return {
				    name : this.data.name,
				    $type : "container-field",
				    items : items
				};
			}
		};

		de.titus.core.jquery.Components.asComponent("formular_ContainerField", de.titus.form.ContainerField);
	});
})($, de.titus.form.utils.EventUtils, de.titus.form.Constants.EVENTS);
