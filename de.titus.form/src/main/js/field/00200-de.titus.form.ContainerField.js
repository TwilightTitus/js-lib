(function($, EventUtils, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.ContainerField", function() {
		var ContainerField = de.titus.form.ContainerField = function(aElement) {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug("constructor");
			
			this.data = {
			    element : aElement,
			    page : undefined,
			    formular : undefined,
			    name : (aElement.attr("data-form-container-field") || "").trim(),
			    required : (aElement.attr("data-form-required") !== undefined),
			    condition : undefined,
			    //always valid, because it's only a container
			    valid : true,
			    fields : []
			};
			
			this.hide();
			
			setTimeout(ContainerField.prototype.__init.bind(this), 1);
		};
		
		ContainerField.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.ContainerField");
		
		ContainerField.prototype.__init = function() {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug("init()");
			
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
			//only a visible change!
			var valid = de.titus.form.utils.FormularUtils.isFieldsValid(this.data.fields);
			if (valid)
				this.data.element.formular_utils_SetValid();
			else
				this.data.element.formular_utils_SetInvalid();
			
		}

		ContainerField.prototype.hide = function() {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug("hide ()");
			
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
		
		ContainerField.prototype.getData = function(acceptInvalid) {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug("getData()");
			
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
	});
})($, de.titus.form.utils.EventUtils, de.titus.form.Constants.EVENTS);
