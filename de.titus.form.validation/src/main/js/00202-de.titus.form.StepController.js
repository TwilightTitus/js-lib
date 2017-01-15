(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.StepController", function() {
		de.titus.form.StepController = function(aElement, aForm) {
			if(de.titus.form.StepController.LOGGER.isDebugEnabled())
				de.titus.form.StepController.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.stepPanel = undefined;
			this.data.stepControl = undefined;
			this.data.stepControlBack = undefined;
			this.data.stepControlNext = undefined;
			this.data.stepControlFinish= undefined;
			this.data.form = aForm;		
			this.init();
		};
		
		de.titus.form.StepController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.StepController");
		
		de.titus.form.StepController.prototype.init = function() {
			if(de.titus.form.StepController.LOGGER.isDebugEnabled())
				de.titus.form.StepController.LOGGER.logDebug("init()");
			this.initStepPanel();
			this.initStepControls()
		};
		
		de.titus.form.StepController.prototype.initStepPanel = function() {
			this.data.stepPanel = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-panel" + "]");
			this.data.stepPanel.find("[" + de.titus.form.Setup.prefix + "-step='" + this.data.form.currentPage().data.step + "']").addClass("activ");
		};
		
		de.titus.form.StepController.prototype.initStepControls = function() {
			this.data.stepControl = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-control" + "]");			
			this.data.stepControlBack = this.data.stepControl.find("[" + de.titus.form.Setup.prefix + "-step-back" + "]");
			this.data.stepControlBack.hide();
			
			this.data.stepControlNext = this.data.stepControl.find("[" + de.titus.form.Setup.prefix + "-step-next" + "]");
			
			this.data.stepControlFinish = this.data.stepControl.find("[" + de.titus.form.Setup.prefix + "-step-finish" + "]");
			this.data.stepControlFinish.hide();			
		};
		
		$.fn.FormularStepController = function(aForm) {
			if (this.length == undefined || this.length == 0)
				return;
			else if (this.length > 1) {
				var result = [];
				this.each(function() {
					result.push($(this).FormularStepController(aForm));
				});
				return result;
			} else {
				var data = this.data("de.titus.form.StepController");
				if (data == undefined) {
					data = new de.titus.form.StepController(this, aForm);
					this.data("de.titus.form.StepController", data);
				}
				return data;
			}
		};
	});
})($);
