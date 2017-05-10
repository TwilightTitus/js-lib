(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Formular", function() {
		var Formular = de.titus.form.Formular = function(aElement) {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    name : aElement.attr("data-form"),
			    state : de.titus.form.Constants.STATE.INPUT,
			    expressionResolver : new de.titus.core.ExpressionResolver()
			};
			setTimeout(Formular.prototype.__init.bind(this), 1);
		};

		Formular.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Formular");

		Formular.prototype.__init = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("init()");

			this.data.element.on(de.titus.form.Constants.EVENTS.ACTION_PAGE_BACK, (function() {
				this.data.state = de.titus.form.Constants.STATE.INPUT;
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.STATE_CHANGED);
			}).bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.ACTION_PAGE_NEXT, (function() {
				this.data.state = de.titus.form.Constants.STATE.INPUT;
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.STATE_CHANGED);
			}).bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.PAGE_SUMMARY, (function() {
				this.data.state = de.titus.form.Constants.STATE.SUMMARY;
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.STATE_CHANGED);
			}).bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.ACTION_SUBMIT, Formular.prototype.submit.bind(this));

			this.data.element.formular_StepPanel();
			this.data.element.formular_FormularControls();
			this.data.element.formular_PageController();
			this.data.element.find("[data-form-message]").formular_Message();

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.INITIALIZED);
			this.data.element.addClass("initialized");
		};

		Formular.prototype.getData = function(aModelType, includeInvalidPage, includeInvalidField) {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("getData (\"" + aModelType + "\")");

			var data = [];
			var pages = this.data.element.formular_PageController().data.pages;
			for (var i = 0; i < pages.length; i++) {
				var pageData = pages[i].getData(includeInvalidPage, includeInvalidField);
				if (pageData != undefined && pageData.length > 0)
					data = data.concat(pageData);
			}

			var modelType = (aModelType || "object").trim().toLowerCase();
			var result = de.titus.form.utils.DataUtils[modelType](data);
			
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("getData (\"" + aModelType + "\") -> " + JSON.stringify(result));
			
			return result;
		};

		Formular.prototype.submit = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("submit ()");

			
			this.data.state = de.titus.form.Constants.STATE.SUBMITTED;
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.STATE_CHANGED);
		};
	});

	de.titus.core.jquery.Components.asComponent("Formular", de.titus.form.Formular);

	$(document).ready(function() {
		$('[data-form]').Formular();
	});
})($);
