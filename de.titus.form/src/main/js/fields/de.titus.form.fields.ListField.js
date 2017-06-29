(function($, EventUtils, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.fields.ListField", function() {
		var ListField = de.titus.form.fields.ListField = function(aElement) {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    page : undefined,
			    formular : undefined,
			    name : (aElement.attr("data-form-list-field") || "").trim(),
			    template : aElement.find("[data-form-content-template]").detach(),
			    contentContainer : aElement.find("[data-form-content-container]"),
			    addButton: aElement.find("[data-form-list-field-action-add]"),
			    required : (aElement.attr("data-form-required") !== undefined),
			    condition : undefined,
			    // always valid, because it's only a container
			    valid : true,
			    items : []
			};

			this.hide();

			setTimeout(ListField.prototype.__init.bind(this), 1);
		};

		ListField.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.fields.ListField");

		ListField.prototype.__init = function() {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("init()");

			EventUtils.handleEvent(this.data.element, [ EVENTTYPES.CONDITION_MET, EVENTTYPES.CONDITION_NOT_MET ], ListField.prototype.__changeConditionState.bind(this));
			EventUtils.handleEvent(this.data.element, [ EVENTTYPES.CONDITION_STATE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED, EVENTTYPES.FIELD_VALUE_CHANGED ], ListField.prototype.__changeValidationStateOfFields.bind(this), "*");			

			this.data.element.formular_Condition();
			this.data.element.formular_ValidationController();
			
			EventUtils.handleEvent(this.data.addButton, [ "click" ], ListField.prototype.__addItem.bind(this));

			EventUtils.triggerEvent(this.data.element, EVENTTYPES.INITIALIZED);
		};

		ListField.prototype.__addItem = function(aEvent) {
			var item = {
			    id : ("item-" + de.titus.core.UUID()),
			    index : this.data.items.length,
			    element : this.data.template.clone(),
			    fields : []
			};
			item.element = this.data.template.clone();
			item.element.attr("id", item.id);
			item.element.attr("data-index", item.index);
			item.element.formular_utils_SetInitializing();

			this.data.items.push(item);
			item.element.appendTo(this.data.contentContainer);
			EventUtils.handleEvent(item.element.find("[data-form-list-field-action-remove]"), [ "click" ], ListField.prototype.__removeItem.bind(this));

			setTimeout(ListField.prototype.__initializeItem.bind(this, item), 1);
		};

		ListField.prototype.__initializeItem = function(aItem) {
			aItem.fields = aItem.element.formular_field_utils_getSubFields();

			aItem.element.formular_utils_SetInitialized();
		};

		ListField.prototype.__removeItem = function(aEvent) {
			
		};

		ListField.prototype.__changeConditionState = function(aEvent) {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug([ "__changeConditionState()  for \"", this.data.name, "\" -> ", aEvent ]);

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

		ListField.prototype.__changeValidationStateOfFields = function(aEvent) {
			// only a visible change!
			var valid = this.__isListItemsValid();
			if (valid)
				this.data.element.formular_utils_SetValid();
			else
				this.data.element.formular_utils_SetInvalid();

		};

		ListField.prototype.__isListItemsValid = function() {
			for (var i = 0; i < this.data.items.length; i++) {
				var item = this.data.items[i];
				if (!de.titus.form.utils.FormularUtils.isFieldsValid(item.fields))
					return false;
			}

			return true;
		};

		ListField.prototype.hide = function() {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("hide ()");

			this.data.element.formular_utils_SetInactive();
			for (var i = 0; i < this.data.items.length; i++) {
				var item = this.data.items[i];
				for (var j = 0; j < item.fields.length; j++)
					item.fields[j].hide();
			}
		};

		ListField.prototype.show = function() {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("show ()");
			if (this.data.condition) {
				this.data.element.formular_utils_SetActive();
				for (var i = 0; i < this.data.items.length; i++) {
					var item = this.data.items[i];
					for (var j = 0; j < item.fields.length; j++)
						item.fields[j].show();
				}
			}
		};

		ListField.prototype.summary = function() {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("summary ()");
			if (this.data.condition) {
				for (var i = 0; i < this.data.items.length; i++) {
					var item = this.data.items[i];
					for (var j = 0; j < item.fields.length; j++)
						item.fields[j].summary();
				}
				this.data.element.formular_utils_SetActive();
			}
		};

		ListField.prototype.getData = function(acceptInvalid) {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("getData()");

			if (this.data.condition && (this.data.valid || acceptInvalid)) {
				var items = [];

				for (var i = 0; i < this.data.items.length; i++) {
					var item = this.data.items[i];
					var data = {
						name : this.data.name,
					    $type : "list-field",
					    items : []
					};
					for (var j = 0; j < item.fields.length; j++) {
						var fieldData = item.fields[j].getData(acceptInvalid);
						if (fieldData)
							data.items.push(fieldData);
					}
					if (data.items.length > 0)
						items.push(data);
				}

				return items;
			}
		};
	});
})($, de.titus.form.utils.EventUtils, de.titus.form.Constants.EVENTS);
