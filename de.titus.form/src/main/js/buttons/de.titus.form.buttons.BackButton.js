(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.buttons.BackButton", function() {
		var BackButton = de.titus.form.buttons.BackButton = function(aElement) {
			if (BackButton.LOGGER.isDebugEnabled())
				BackButton.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formularElement : de.titus.form.utils.FormularUtils.getFormularElement(aElement)
			};

			setTimeout(BackButton.prototype.__init.bind(this), 1);
		};

		BackButton.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.buttons.BackButton");

		BackButton.prototype.__init = function() {
			if (BackButton.LOGGER.isDebugEnabled())
				BackButton.LOGGER.logDebug("__init()");

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, "click", BackButton.prototype.execute.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.formularElement, [ EVENTTYPES.PAGE_CHANGED, EVENTTYPES.ACTION_SUBMIT ], BackButton.prototype.update.bind(this));
			this.data.element.formular_utils_SetInactive();
		};
		
		BackButton.prototype.execute = function(aEvent) {
			aEvent.preventDefault();
			aEvent.stopPropagation();
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.ACTION_PAGE_BACK);
		};

		BackButton.prototype.update = function(aEvent) {
			if (BackButton.LOGGER.isDebugEnabled())
				BackButton.LOGGER.logDebug("update() -> " + aEvent.type);

			if(aEvent.type == EVENTTYPES.ACTION_SUBMIT)
				this.data.element.formular_utils_SetInactive();
			else if(aEvent.type == EVENTTYPES.PAGE_CHANGED){
				var pageController = this.data.formularElement.formular_PageController();
				if(pageController.isFirstPage())
					this.data.element.formular_utils_SetInactive();
				else
					this.data.element.formular_utils_SetActive();
			}
		};

		de.titus.core.jquery.Components.asComponent("formular_buttons_BackButton", de.titus.form.buttons.BackButton);
	});
})($,de.titus.form.Constants.EVENTS);
