(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.StepControl", function() {
		de.titus.form.StepControl = function(aForm) {
			if (de.titus.form.StepControl.LOGGER.isDebugEnabled())
				de.titus.form.StepControl.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aForm.data.element.find("[" + de.titus.form.Setup.prefix + "-step-control" + "]");
			this.data.stepControlBack = undefined;
			this.data.stepControlNext = undefined;
			this.data.stepControlFinish = undefined;
			this.data.stepControlSubmit = undefined;
			this.data.form = aForm;
			this.init();
		};
		
		de.titus.form.StepControl.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.StepControl");
		
		de.titus.form.StepControl.prototype.init = function() {
			if (de.titus.form.StepControl.LOGGER.isDebugEnabled())
				de.titus.form.StepControl.LOGGER.logDebug("init()");
			
			this.data.stepControlBack = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-back" + "]");
			this.data.stepControlBack.hide();
			this.data.stepControlBack.on("click", de.titus.form.StepControl.prototype.__StepBackHandle.bind(this));
			
			this.data.stepControlNext = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-next" + "]");
			this.data.stepControlNext.on("click", de.titus.form.StepControl.prototype.__StepNextHandle.bind(this));
			
			this.data.stepControlFinish = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-finish" + "]");
			this.data.stepControlFinish.hide();
			this.data.stepControlFinish.on("click", de.titus.form.StepControl.prototype.__StepFinishHandle.bind(this));
			
			this.data.stepControlSubmit = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-submit" + "]");
			this.data.stepControlSubmit.hide();
			this.data.stepControlSubmit.on("click", de.titus.form.StepControl.prototype.__StepSubmitHandle.bind(this));
			
			if (de.titus.form.StepControl.LOGGER.isDebugEnabled())
				console.log(this);
		};
		
		de.titus.form.StepControl.prototype.update = function() {
			if (this.data.form.doValidate()) {
				this.data.stepControlNext.prop("disabled", false);
				this.data.stepControlFinish.prop("disabled", false);
				this.data.stepControlSubmit.prop("disabled", false);
			} else {
				this.data.stepControlNext.prop("disabled", true);
				this.data.stepControlFinish.prop("disabled", true);
				this.data.stepControlSubmit.prop("disabled", true);
			}
		};
		
		de.titus.form.StepControl.prototype.__StepBackHandle = function(aEvent) {
			if (de.titus.form.StepControl.LOGGER.isDebugEnabled())
				de.titus.form.StepControl.LOGGER.logDebug("__StepBackHandle()");
			
			if (this.data.form.data.currentPage > 0) {
				this.data.form.prevPage();
			}
		};
		
		de.titus.form.StepControl.prototype.__StepNextHandle = function(aEvent) {
			if (de.titus.form.StepControl.LOGGER.isDebugEnabled())
				de.titus.form.StepControl.LOGGER.logDebug("__StepNextHandle()");
			
			if ((this.data.form.data.pages.length - 1) > this.data.form.data.currentPage) {
				this.data.form.nextPage();
			}
		};
		
		de.titus.form.StepControl.prototype.__StepFinishHandle = function(aEvent) {
			if (de.titus.form.StepControl.LOGGER.isDebugEnabled())
				de.titus.form.StepControl.LOGGER.logDebug("__StepFinishHandle()");
			
			this.data.form.showSummary();
		};
		
		de.titus.form.StepControl.prototype.__StepSubmitHandle = function(aEvent) {
			if (de.titus.form.StepControl.LOGGER.isDebugEnabled())
				de.titus.form.StepControl.LOGGER.logDebug("__StepSubmitHandle()");
			
			this.data.form.submit();
		};
	});
})($);
