(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.buttons.ResetButton", function() {
		var ResetButton = de.titus.form.buttons.ResetButton = function(aElement) {
			if (ResetButton.LOGGER.isDebugEnabled())
				ResetButton.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formularElement : de.titus.form.utils.FormularUtils.getFormularElement(aElement)
			};
			
			setTimeout(ResetButton.prototype.__init.bind(this), 1);
		};
		
		ResetButton.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.buttons.ResetButton");
		
		ResetButton.prototype.__init = function() {
			if (ResetButton.LOGGER.isDebugEnabled())
				ResetButton.LOGGER.logDebug("init()");
			
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, "click", ResetButton.prototype.execute.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.formularElement, [ EVENTTYPES.ACTION_SUBMIT ], ResetButton.prototype.update.bind(this));
			this.data.element.formular_utils_SetActive();
		};
		
		ResetButton.prototype.execute = function(aEvent) {
			aEvent.preventDefault();
			aEvent.stopPropagation();
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.ACTION_RESET);
		};
		
		ResetButton.prototype.update = function(aEvent) {
			if (ResetButton.LOGGER.isDebugEnabled())
				ResetButton.LOGGER.logDebug("update() -> " + aEvent.type);
			
			this.data.element.formular_utils_SetInactive();
		};
		
		de.titus.core.jquery.Components.asComponent("formular_buttons_ResetButton", de.titus.form.buttons.ResetButton);
	});
})($, de.titus.form.Constants.EVENTS);
