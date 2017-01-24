(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.ContainerFieldController", function() {
		de.titus.form.ContainerFieldController = function(aElement) {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			
			this.init();
		};
		de.titus.form.ContainerFieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.ContainerFieldController");
		
		de.titus.form.ContainerFieldController.prototype.init = function() {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("init()");
			
		};		

		de.titus.form.ContainerFieldController.prototype.showField = function(aData) {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("showField()");
			
			this.element.show();
		};
		
		de.titus.form.ContainerFieldController.prototype.showSummary = function() {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("showSummary()");
						
		};
		
		de.titus.form.ContainerFieldController.prototype.hideField = function() {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("hideField()");
			
			this.element.hide()
		};
		
		de.titus.form.ContainerFieldController.prototype.getValue = function() {
			
		};
		
		de.titus.form.Registry.registFieldController("container", function(aElement, aFieldname, aValueChangeListener) {
			return new de.titus.form.ContainerFieldController(aElement, aFieldname, aValueChangeListener);
		});
	});
})();
