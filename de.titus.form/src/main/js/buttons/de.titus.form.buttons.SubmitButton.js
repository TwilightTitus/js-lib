(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.buttons.SubmitButton", function() {
		var SubmitButton = de.titus.form.buttons.SubmitButton = function(aElement) {
			if (SubmitButton.LOGGER.isDebugEnabled())
				SubmitButton.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formularElement : de.titus.form.utils.FormularUtils.getFormularElement(aElement)
			};
			
			setTimeout(SubmitButton.prototype.__init.bind(this), 1);
		};
		
		SubmitButton.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.buttons.SubmitButton");
		
		SubmitButton.prototype.__init = function() {
			if (SubmitButton.LOGGER.isDebugEnabled())
				SubmitButton.LOGGER.logDebug("__init()");
			
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, "click", SubmitButton.prototype.execute.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.formularElement, [EVENTTYPES.PAGE_CHANGED], SubmitButton.prototype.update.bind(this));
			this.data.element.formular_utils_SetInactive();
		};
		
		SubmitButton.prototype.execute = function(aEvent) {
			aEvent.preventDefault();
			aEvent.stopPropagation();
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.ACTION_SUBMIT);
		};
		
		SubmitButton.prototype.update = function(aEvent) {
			if (SubmitButton.LOGGER.isDebugEnabled())
				SubmitButton.LOGGER.logDebug("update() -> " + aEvent.type);
			
			var pageController = this.data.formularElement.formular_PageController();
			var page = pageController.getCurrentPage();
			if (page.data.type == de.titus.form.Constants.TYPES.SUMMARY_PAGE)
				this.data.element.formular_utils_SetActive();
			else
				this.data.element.formular_utils_SetInactive();
		};
		
		de.titus.core.jquery.Components.asComponent("formular_buttons_SubmitButton", de.titus.form.buttons.SubmitButton);
	});
})($, de.titus.form.Constants.EVENTS);
