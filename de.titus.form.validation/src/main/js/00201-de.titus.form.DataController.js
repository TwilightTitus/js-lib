(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DataController", function() {
		de.titus.form.DataController = function(aChangeListener) {
			this.data = {};
			this.changeListener = aChangeListener;
		};
		
		de.titus.form.DataController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataController");
		
		de.titus.form.DataController.prototype.changeValue = function(aName, aValue){
			if(de.titus.form.DataController.LOGGER.isDebugEnabled())
				de.titus.form.DataController.LOGGER.logDebug("changeValue()");
			
			if(aValue == undefined && this.data[aName] != undefined){
				this.data[aName] = null;
			}
			else{			
        		this.data[aName] = aValue;
			}
			
			if(de.titus.form.DataController.LOGGER.isDebugEnabled())
				de.titus.form.DataController.LOGGER.logDebug("changeValue() -> new data: " + JSON.stringify(this.data));
			
			this.changeListener(aName, aValue);
		};				
	});	
})();
