(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.StepControl", function() {
		var StepControl = function(aForm) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aForm.data.element.find("[" + de.titus.form.Setup.prefix + "-step-control" + "]");
			this.data.stepControlBack = undefined;
			this.data.stepControlNext = undefined;
			this.data.stepControlSummary = undefined;
			this.data.stepControlSubmit = undefined;
			this.data.form = aForm;
			this.init();
		};
		
		StepControl.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.StepControl");
		
		StepControl.prototype.init = function() {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("init()");
			
			this.data.stepControlBack = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-back" + "]");
			this.data.stepControlBack.hide();
			this.data.stepControlBack.on("click", StepControl.prototype.__StepBackHandle.bind(this));
			
			this.data.stepControlNext = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-next" + "]");
			this.data.stepControlNext.on("click", StepControl.prototype.__StepNextHandle.bind(this));
			
			this.data.stepControlSummary = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-summary" + "]");
			this.data.stepControlSummary.hide();
			this.data.stepControlSummary.on("click", StepControl.prototype.__StepSummaryHandle.bind(this));
			
			this.data.stepControlSubmit = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-submit" + "]");
			this.data.stepControlSubmit.hide();
			this.data.stepControlSubmit.on("click", StepControl.prototype.__StepSubmitHandle.bind(this));
		};
		
		StepControl.prototype.update = function() {
			if (this.data.form.data.state == de.titus.form.Constants.STATE.SUBMITED) {
				this.data.element.hide();
				return;
			} else {
							
				if ((this.data.form.data.pages.length - 1) > this.data.form.data.currentPage) {
					var page = this.data.form.getCurrentPage();
					if (page && page.doValidate())
						this.data.stepControlNext.show();
					else
						this.data.stepControlNext.hide();
					
					this.data.stepControlSummary.hide();
					this.data.stepControlSubmit.hide();
				} else if (this.data.form.data.state == de.titus.form.Constants.STATE.PAGES) {
					var page = this.data.form.getCurrentPage();
					this.data.stepControlNext.hide();
					if (page && page.doValidate())
						this.data.stepControlSummary.show();
					else
						this.data.stepControlSummary.hide();
					this.data.stepControlSubmit.hide();
				} else if (this.data.form.data.state == de.titus.form.Constants.STATE.SUMMARY) {
					this.data.stepControlNext.hide();
					this.data.stepControlSummary.hide();
					if(this.data.form.doValidate())
						this.data.stepControlSubmit.show();
					else
						this.data.stepControlSubmit.hide();
				}
			}
			
			if (this.data.form.data.currentPage > 0)
				this.data.stepControlBack.show();
			else
				this.data.stepControlBack.hide();
		};
		
		StepControl.prototype.__StepBackHandle = function(aEvent) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("__StepBackHandle()");
			
			if (this.data.form.data.currentPage > 0) {
				this.data.form.prevPage();
			}
		};
		
		StepControl.prototype.__StepNextHandle = function(aEvent) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("__StepNextHandle()");
			
			if ((this.data.form.data.pages.length - 1) > this.data.form.data.currentPage) {
				this.data.form.nextPage();
			}
		};
		
		StepControl.prototype.__StepSummaryHandle = function(aEvent) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("__StepSummaryHandle()");
			
			this.data.form.showSummary();
		};
		
		StepControl.prototype.__StepSubmitHandle = function(aEvent) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("__StepSubmitHandle()");
			
			this.data.form.submit();
		};
		
		de.titus.form.StepControl = StepControl;
	});
})($);
