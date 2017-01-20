(function() {
	de.titus.core.Namespace.create("template.FieldController", function() {
		template.FieldController = function(aElement, aFieldname, aValueChangeListener) {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			this.fieldname = aFieldname;
			this.valueChangeListener = aValueChangeListener;
		};
		template.FieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("template.FieldController");
				
		template.FieldController.prototype.showField = function(aValue, aData) {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("showField()");
			
			//make your field visible
			//aValue -> a Preseted value
			//aData -> the data object from all of the formular
			
			this.element.show();
		};
		
		template.FieldController.prototype.showSummary = function(isSummary) {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("showSummary() -> isSummary: " + isSummery);
			
			//show your field as summary
			//isSummary -> true = show field as non editable, false = show as editable field
		};
		
		template.FieldController.prototype.hideField = function() {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("hideField()");
			
			//hide this field
			
			this.element.hide()
		};
		
		template.FieldController.prototype.setValid = function(isValid) {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("setValid() -> " + isValid );
			
			//do something if you need
		};
		
		template.FieldController.prototype.getValue = function() {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("getValue() -> " + JSON.stringify(this.employee));
			
			//return field value
			
			return "[value]";
		};
		
		de.titus.form.Registry.registFieldController("[my-costum-field-type]", function(aElement, aFieldname, aValueChangeListener) {
			//registrate field type + function to create controller 
			return new template.FieldController(aElement, aFieldname, aValueChangeListener);
		});	

	});	
})($);
