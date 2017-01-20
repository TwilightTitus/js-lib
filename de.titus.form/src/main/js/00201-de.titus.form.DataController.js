(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DataController", function() {
		de.titus.form.DataController = function(aChangeListener) {
			if(de.titus.form.DataController.LOGGER.isDebugEnabled())
				de.titus.form.DataController.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.changeListener = aChangeListener;
		};
		
		de.titus.form.DataController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataController");
		
		de.titus.form.DataController.prototype.getData = function(aName){
			if(de.titus.form.DataController.LOGGER.isDebugEnabled())
				de.titus.form.DataController.LOGGER.logDebug("getData() -> aName: " + aName);
			if(aName)
				return this.data[aName];
			return this.data;
		};
		
		de.titus.form.DataController.prototype.changeValue = function(aName, aValue, aField, aCallback){
			if(de.titus.form.DataController.LOGGER.isDebugEnabled())
				de.titus.form.DataController.LOGGER.logDebug("changeValue()");
			
			if(aValue != this.data[aName] ){
				this.data[aName] = aValue;
			
				if(de.titus.form.DataController.LOGGER.isDebugEnabled())
					de.titus.form.DataController.LOGGER.logDebug("changeValue() -> new data: " + JSON.stringify(this.data));
			
				this.changeListener(aName, aValue, aField);
				if(aCallback != undefined)
					aCallback(aName, aValue, aField);
			}
			
		};				
	});	
})();
