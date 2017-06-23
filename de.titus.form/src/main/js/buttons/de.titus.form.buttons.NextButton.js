(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.buttons.NextButton", function() {
		var NextButton = de.titus.form.buttons.NextButton = function(aElement) {
			if (NextButton.LOGGER.isDebugEnabled())
				NextButton.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formularElement : de.titus.form.utils.FormularUtils.getFormularElement(aElement)
			};
			
			setTimeout(NextButton.prototype.__init.bind(this), 1);
		};
		
		NextButton.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.buttons.NextButton");
		
		NextButton.prototype.__init = function() {
			if (NextButton.LOGGER.isDebugEnabled())
				NextButton.LOGGER.logDebug("__init()");
			
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, "click", NextButton.prototype.execute.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.formularElement, [ EVENTTYPES.PAGE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED ], NextButton.prototype.update.bind(this), "[data-form-page]");
			this.data.element.formular_utils_SetInactive();
		};
		
		NextButton.prototype.execute = function(aEvent) {
			aEvent.preventDefault();
			aEvent.stopPropagation();
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.ACTION_PAGE_NEXT);
		};
		
		NextButton.prototype.update = function(aEvent) {
			if (NextButton.LOGGER.isDebugEnabled())
				NextButton.LOGGER.logDebug("update() -> " + aEvent.type);
			
			if (aEvent.type == EVENTTYPES.VALIDATION_STATE_CHANGED) {
				var pageController = this.data.formularElement.formular_PageController();
				var page = pageController.getCurrentPage();
				if (page && page.data.type == de.titus.form.Constants.TYPES.PAGE && page.data.condition && page.data.valid) {
					var nextPage = pageController.getNextPage();
					if (nextPage.data.type == de.titus.form.Constants.TYPES.PAGE)
						return this.data.element.formular_utils_SetActive();
				}
			}
			
			this.data.element.formular_utils_SetInactive();
		};
		
		de.titus.core.jquery.Components.asComponent("formular_buttons_NextButton", de.titus.form.buttons.NextButton);
	});
})($, de.titus.form.Constants.EVENTS);
