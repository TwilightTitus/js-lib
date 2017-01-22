(function() {
	de.titus.core.Namespace.create("template.FieldController", function() {
		template.FieldController = function(aElement) {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			/*
			 * Every time if your field make a value change trigger the
			 * following jquery event on this.element:
			 * 
			 * this.element.tigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
			 */

		};
		template.FieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("template.FieldController");
		
		template.FieldController.prototype.showField = function(aValue, aData) {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("showField()");
			
			/*
			 * make your field visible aValue -> a Preseted value aData -> the
			 * data object from all of the formular
			 * 
			 * This function would be called every time, if your field need to display
			 */

			this.element.show();
		};
		
		template.FieldController.prototype.hideField = function() {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("hideField()");
			
			// hide this field
			
			this.element.hide()
		};
		
		template.FieldController.prototype.showSummary = function() {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("showSummary() -> isSummary: " + isSummery);
			
			// show your field as summary
		};
		
		template.FieldController.prototype.getValue = function() {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("getValue() -> " + JSON.stringify(this.employee));
			
			// return field value
			
			return "[value]";
		};
		
		de.titus.form.Registry.registFieldController("[my-costum-field-type]", function(aElement, aFieldname, aValueChangeListener) {
			// registrate field type + function to create the field controller
			return new template.FieldController(aElement, aFieldname, aValueChangeListener);
		});
		
	});
})($);
