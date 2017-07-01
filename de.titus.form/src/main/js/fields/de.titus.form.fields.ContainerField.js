(function($, EventUtils, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.fields.ContainerField", function() {
		var ContainerField = de.titus.form.fields.ContainerField = function(aElement) {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    dataContext : undefined,
			    name : (aElement.attr("data-form-container-field") || "").trim(),
			    active : false,
			    required : (aElement.attr("data-form-required") !== undefined),
			    requiredOnActive : (aElement.attr("data-form-required") !== "on-condition-true"),
			    condition : undefined,
			    // always valid, because it's only a container
			    valid : undefined,
			    fields : []
			};

			this.data.element.formular_DataContext({
			    data : ContainerField.prototype.getData.bind(this),
			    scope : "$container"
			});
			this.hide();
			setTimeout(ContainerField.prototype.__init.bind(this), 1);
		};

		ContainerField.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.fields.ContainerField");

		ContainerField.prototype.__init = function() {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug("init()");

			this.data.dataContext = this.data.element.formular_findParentDataContext();
			EventUtils.handleEvent(this.data.element, [ EVENTTYPES.CONDITION_MET, EVENTTYPES.CONDITION_NOT_MET ], ContainerField.prototype.__changeConditionState.bind(this));
			EventUtils.handleEvent(this.data.element, [ EVENTTYPES.CONDITION_STATE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED, EVENTTYPES.FIELD_VALUE_CHANGED ], ContainerField.prototype.__changeValidationStateOfFields.bind(this), "*");

			this.data.fields = this.data.element.formular_field_utils_getSubFields();

			this.data.element.formular_Condition();

			EventUtils.triggerEvent(this.data.element, EVENTTYPES.INITIALIZED);
		};

		ContainerField.prototype.__changeConditionState = function(aEvent) {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug([ "__changeConditionState()  for \"", this.data.name, "\" -> ", aEvent ]);

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

		ContainerField.prototype.__changeValidationStateOfFields = function(aEvent) {
			this.data.valid = de.titus.form.utils.FormularUtils.isFieldsValid(this.data.fields);
			if (this.data.valid)
				this.data.element.formular_utils_SetValid();
			else
				this.data.element.formular_utils_SetInvalid();
		};

		ContainerField.prototype.hide = function() {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug("hide ()");

			this.data.active = false;
			this.data.element.formular_utils_SetInactive();
			for (var i = 0; i < this.data.fields.length; i++)
				this.data.fields[i].hide();

		};

		ContainerField.prototype.show = function() {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug("show ()");
			if (this.data.condition) {
				this.data.element.formular_utils_SetActive();
				for (var i = 0; i < this.data.fields.length; i++)
					this.data.fields[i].show();

				this.data.active = true;
			}
		};

		ContainerField.prototype.summary = function() {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug("summary ()");
			if (this.data.condition) {
				for (var i = 0; i < this.data.fields.length; i++)
					this.data.fields[i].summary();

				this.data.element.formular_utils_SetActive();
			}
		};

		ContainerField.prototype.getData = function(aFilter) {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug("getData(\"", aFilter, "\")");

			if (this.data.condition) {
				var result;
				if (this.data.active || (this.data.condition && this.data.valid))
					result = de.titus.form.utils.FormularUtils.toBaseModel(this.data.fields, aFilter);

				if (this.data.name)
					return {
					    name : this.data.name || "$container",
					    type : "container-field",
					    $type : "container-field",
					    value : result
					};
				else
					return result;
			}
		};
	});
})($, de.titus.form.utils.EventUtils, de.titus.form.Constants.EVENTS);
