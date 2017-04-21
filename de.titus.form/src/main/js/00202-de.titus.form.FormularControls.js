(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.FormularControls", function() {
		var FormularControls = de.titus.form.FormularControls = function(aElement) {
			if (FormularControls.LOGGER.isDebugEnabled())
				FormularControls.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    controlPanel : aElement.find("[data-form-controls]"),
			    reset : undefined,
			    back : undefined,
			    next : undefined,
			    submit : undefined
			};

			this.init();
		};

		FormularControls.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.FormularControls");

		FormularControls.prototype.init = function() {
			if (FormularControls.LOGGER.isDebugEnabled())
				FormularControls.LOGGER.logDebug("init()");

			this.data.reset = new de.titus.form.utils.FormularControl(this.data.controlPanel.find("[data-form-control='reset']"), de.titus.form.Constants.EVENTS.ACTION_RESET);
			this.data.back = new de.titus.form.utils.FormularControl(this.data.controlPanel.find("[data-form-control='back']"), de.titus.form.Constants.EVENTS.ACTION_PAGE_BACK);
			this.data.next = new de.titus.form.utils.FormularControl(this.data.controlPanel.find("[data-form-control='next']"), de.titus.form.Constants.EVENTS.ACTION_PAGE_NEXT);
			this.data.submit = new de.titus.form.utils.FormularControl(this.data.controlPanel.find("[data-form-control='submit']"), de.titus.form.Constants.EVENTS.ACTION_SUBMIT);

			this.data.reset.show();
			this.data.back.hide();
			this.data.next.hide();
			this.data.submit.hide();

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED ], FormularControls.prototype.update.bind(this), "[data-form-page]");
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ de.titus.form.Constants.EVENTS.INITIALIZED, de.titus.form.Constants.EVENTS.PAGE_CHANGED, de.titus.form.Constants.EVENTS.PAGE_SUMMARY, de.titus.form.Constants.EVENTS.ACTION_SUMMARY, de.titus.form.Constants.EVENTS.ACTION_SUBMIT, de.titus.form.Constants.EVENTS.SUCCESSED ], FormularControls.prototype.update.bind(this));

		};

		FormularControls.prototype.update = function(aEvent) {
			if (FormularControls.LOGGER.isDebugEnabled())
				FormularControls.LOGGER.logDebug("update() -> " + aEvent.type);

			var type = aEvent.type;
			var formular = this.data.element.Formular();
			var pageController = this.data.element.formular_PageController();
			var currentPage = pageController.getCurrentPage() || {
				data : {
				    valid : false,
				    condition : false
				}
			};
			var state = formular.data.state;

			if (type == de.titus.form.Constants.EVENTS.INITIALIZED) {
				this.data.reset.show();
				this.data.back.hide();
				this.data.next.hide();
				this.data.submit.hide();
			} else if (type == de.titus.form.Constants.EVENTS.PAGE_CHANGED) {
				if (pageController.isFirstPage())
					this.data.back.hide();
				else
					this.data.back.show();

				if (currentPage.data.valid)
					this.data.next.show();
				
				this.data.submit.hide();
			} else if (type == de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED) {
				if (currentPage.data.valid)
					this.data.next.show();
			} else if (type == de.titus.form.Constants.EVENTS.PAGE_SUMMARY) {
				this.data.next.hide();
				this.data.submit.show();
			} else if (type == de.titus.form.Constants.EVENTS.ACTION_SUBMIT) {
				this.data.reset.hide();
				this.data.back.hide();
				this.data.next.hide();
				this.data.submit.hide();
			}
		};

		de.titus.core.jquery.Components.asComponent("formular_FormularControls", de.titus.form.FormularControls);
	});
})($);
