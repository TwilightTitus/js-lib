(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DataController", function() {
		var DataController = function(aChangeListener) {
			if (DataController.LOGGER.isDebugEnabled())
				DataController.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.changeListener = aChangeListener;
		};
		
		DataController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataController");
		
		DataController.prototype.getData = function(aName) {
			if (DataController.LOGGER.isDebugEnabled())
				DataController.LOGGER.logDebug("getData() -> aName: " + aName);
			
			if (aName)
				return this.data[aName];
			else
				return this.data;
		};
		
		DataController.prototype.changeValue = function(aName, aValue, aField, aCallback) {
			if (DataController.LOGGER.isDebugEnabled())
				DataController.LOGGER.logDebug("changeValue()");
			
			if (aValue != this.data[aName]) {
				this.data[aName] = aValue;
				
				if (DataController.LOGGER.isDebugEnabled())
					DataController.LOGGER.logDebug("changeValue() -> new data: " + JSON.stringify(this.data));
				
				this.changeListener(aName, aValue, aField);
				if (aCallback != undefined)
					aCallback(aName, aValue, aField);
			}
			
		};
		
		de.titus.form.DataController = DataController;
	});
})();
