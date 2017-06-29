(function($, EventUtils, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.fields.ListField", function() {
		var ListField = de.titus.form.fields.ListField = function(aElement) {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    dataContext : undefined,
			    name : (aElement.attr("data-form-list-field") || "").trim(),
			    template : aElement.find("[data-form-content-template]").detach(),
			    contentContainer : aElement.find("[data-form-content-container]"),
			    addButton : aElement.find("[data-form-list-field-action-add]"),
			    required : (aElement.attr("data-form-required") !== undefined),
			    condition : undefined,
			    // always valid, because it's only a container
			    valid : undefined,
			    items : []
			};

			this.hide();

			this.data.element.formular_DataContext((function(aFilter) {
				var data = this.data.dataContext.getData(aFilter);
				data.$list = this.getData(aFilter);
				return data;
			}).bind(this));

			setTimeout(ListField.prototype.__init.bind(this), 1);
		};

		ListField.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.fields.ListField");

		ListField.prototype.__init = function() {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("init()");

			this.data.dataContext = this.data.element.formular_findParentDataContext();
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
			    field : undefined
			};
			item.element = this.data.template.clone();
			item.element.attr("id", item.id);
			item.element.attr("data-index", item.index);
			if (item.element.attr("data-form-container-field") == undefined)
				item.element.attr("data-form-container-field", "");
			item.element.formular_utils_SetInitializing();

			this.data.items.push(item);
			item.element.appendTo(this.data.contentContainer);
			EventUtils.handleEvent(item.element.find("[data-form-list-field-action-remove]"), [ "click" ], ListField.prototype.__removeItem.bind(this));

			setTimeout(ListField.prototype.__initializeItem.bind(this, item), 1);
		};

		ListField.prototype.__initializeItem = function(aItem) {
			aItem.field = aItem.element.formular_Field();

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
			this.data.valid = this.__isListItemsValid();
			if (this.data.valid)
				this.data.element.formular_utils_SetValid();
			else
				this.data.element.formular_utils_SetInvalid();

		};

		ListField.prototype.__isListItemsValid = function() {
			for (var i = 0; i < this.data.items.length; i++) {
				var item = this.data.items[i];
				if (!item.field.data.valid)
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
				item.field.hide();
			}
		};

		ListField.prototype.show = function() {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("show ()");
			if (this.data.condition) {
				this.data.element.formular_utils_SetActive();
				for (var i = 0; i < this.data.items.length; i++) {
					var item = this.data.items[i];
					item.field.show();
				}
			}
		};

		ListField.prototype.summary = function() {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("summary ()");
			if (this.data.condition) {
				for (var i = 0; i < this.data.items.length; i++) {
					var item = this.data.items[i];
					item.field.summary();
				}
				this.data.element.formular_utils_SetActive();
			}
		};

		ListField.prototype.getData = function(aFilter) {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("getData(\"", aFilter, "\")");

			if (this.data.condition) {
				var items = [];

				for (var i = 0; i < this.data.items.length; i++) {
					var item = this.data.items[i];
					var fieldData = item.field.getData(aFilter);
					if (fieldData)
						items.push(fieldData);
				}

				return {
				    name : this.data.name,
				    type : "list-field",
				    $type : "list-field",
				    items : items
				};
			}
		};
	});
})($, de.titus.form.utils.EventUtils, de.titus.form.Constants.EVENTS);
