(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Page", function() {
		var Page = de.titus.form.Page = function(aElement, aIndex) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formular : undefined,
			    index : aIndex,
			    name : aElement.attr("data-form-page"),
			    condition : false,
			    valid : false,
			    fields : []
			};

			setTimeout(Page.prototype.__init.bind(this), 1);
		};

		Page.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Page");

		Page.prototype.__init = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("init()");

			this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ de.titus.form.Constants.EVENTS.CONDITION_MET, de.titus.form.Constants.EVENTS.CONDITION_NOT_MET ], Page.prototype.__changeConditionState.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED, de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED], Page.prototype.__changeValidationState.bind(this), "[data-form-field]");

			this.data.fields = this.data.element.find("[data-form-field]").formular_Field();
			this.data.element.formular_Condition();

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.INITIALIZED);
		};

		Page.prototype.__changeConditionState = function(aEvent) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("__changeConditionState () for page -> " + aEvent.type);

			aEvent.preventDefault();
			aEvent.stopPropagation();

			var condition = false;
			if (aEvent.type == de.titus.form.Constants.EVENTS.CONDITION_MET)
				condition = true;

			if (this.data.condition != condition) {
				this.data.condition = condition;
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED);
			}
		};

		Page.prototype.__changeValidationState = function(aEvent) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("__changeValidationState () for page -> " + aEvent.type);

			aEvent.preventDefault();

			var valid = this.__allFieldsValid();
			if (this.data.valid != valid) {
				this.data.valid = valid;
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED);
			}
			
			if (this.data.valid) {
				this.data.element.removeClass("invalid");
				this.data.element.addClass("valid");
			} else {
				this.data.element.removeClass("valid");
				this.data.element.addClass("invalid");
			}
		};
		
		Page.prototype.__allFieldsValid = function(){
			for (var i = 0; i < this.data.fields.length; i++) {
				if(!this.data.fields[i].data.valid)
					return false;
			}
			
			return true;
		};

		Page.prototype.hide = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("hide ()");

			this.data.element.removeClass("active");
			this.data.element.addClass("inactive");

		};

		Page.prototype.show = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("show ()");

			this.data.element.removeClass("inactive");
			this.data.element.addClass("active");
		};

		Page.prototype.summary = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("summary ()");

			this.data.element.removeClass("inactive");
			this.data.element.addClass("active");
		};

		Page.prototype.getData = function(includeInvalidPage, includeInvalidField) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("getData()");

			var result = [];
			if (this.data.condition && (this.data.valid || includeInvalidPage)) {
				for (var i = 0; i < this.data.fields.length; i++) {
					var data = this.data.fields[i].getData(includeInvalidField);
					if (data != undefined)
						result.push(data);
				}
			}

			return result;
		};

		$.fn.formular_Page = function(aIndex) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				var pages = [];
				var index = 0;
				this.each(function() {
					pages.push($(this).formular_Condition(index++));
				});

				return pages;
			} else {
				var page = this.data("de.titus.form.Page");
				if (!page) {
					page = new de.titus.form.Page(this, aIndex);
					this.data("de.titus.form.Page", page);
				}
				return page;
			}
		};
	});
})($);
