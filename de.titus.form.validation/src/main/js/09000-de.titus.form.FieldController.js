(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.FieldController", function() {
		de.titus.form.FieldController = function(aElement, aFieldname, aValueChangeListener) {
			this.element = aElement;
			this.fieldname = aFieldname;
			this.valueChangeListener = aValueChangeListener;
			this.input = this.element.find("input");
			if (this.input != undefined && this.input.attr("type") != "file")
				this.input.on("click", this.valueChangeListener);
		};
		de.titus.form.FieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.FieldController");
		
		de.titus.form.FieldController.prototype.showField = function(aData) {
			if (de.titus.form.Field.LOGGER.isDebugEnabled())
				de.titus.form.Field.LOGGER.logDebug("showField()");
			
			this.element.show();
		};
		
		de.titus.form.FieldController.prototype.showSummary = function() {
			if (de.titus.form.Field.LOGGER.isDebugEnabled())
				de.titus.form.Field.LOGGER.logDebug("showSummary()");
			
		};
		
		de.titus.form.FieldController.prototype.hideField = function() {
			if (de.titus.form.Field.LOGGER.isDebugEnabled())
				de.titus.form.Field.LOGGER.logDebug("hideField()");
			
			this.element.hide()
		};
		
		de.titus.form.FieldController.prototype.setValid = function(isValid, aMessage) {
			if (de.titus.form.Field.LOGGER.isDebugEnabled())
				de.titus.form.Field.LOGGER.logDebug("setValid()");
			
			if (!isValid) {
				alert(this.fieldname + ": " + aMessage);
			}
		};
		
		de.titus.form.FieldController.prototype.getValue = function() {
			if (de.titus.form.Field.LOGGER.isDebugEnabled())
				de.titus.form.Field.LOGGER.logDebug("doConditionCheck()");
			
			return "test";
		};
		
		de.titus.form.Registry.registFieldController("default", function(aElement, aFieldname, aValueChangeListener) {
			return new de.titus.form.FieldController(aElement, aFieldname, aValueChangeListener);
		});
	});
})();
