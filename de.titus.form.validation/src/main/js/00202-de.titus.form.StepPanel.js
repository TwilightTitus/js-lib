(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.StepPanel", function() {
		de.titus.form.StepPanel = function(aForm) {
			if(de.titus.form.StepPanel.LOGGER.isDebugEnabled())
				de.titus.form.StepPanel.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aForm.data.element.find("[" + de.titus.form.Setup.prefix + "-step-panel" + "]");
			this.data.stepPanel = undefined;
			this.data.form = aForm;		
			this.init();
		};
		
		de.titus.form.StepPanel.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.StepPanel");
		
		de.titus.form.StepPanel.prototype.init = function() {
			if(de.titus.form.StepPanel.LOGGER.isDebugEnabled())
				de.titus.form.StepPanel.LOGGER.logDebug("init()");
			
		};
		
		de.titus.form.StepPanel.prototype.update = function(){
			if(de.titus.form.StepPanel.LOGGER.isDebugEnabled())
				de.titus.form.StepPanel.LOGGER.logDebug("update()");
							
			this.data.element.find("[" + de.titus.form.Setup.prefix + "-step='" + this.data.form.currentPage().data.step + "']").addClass("activ");
		};
	});
})($);
