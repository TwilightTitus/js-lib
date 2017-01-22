(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DataControllerProxy", function() {
		var DataControllerProxy = function(aChangeListener, aDataController) {
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("constructor");
			
			this.dataController = aDataController;
		};
		
		DataControllerProxy.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataControllerProxy");
		
		DataControllerProxy.prototype.getData = function(aName){
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("getData() -> aName: " + aName);
				
			return this.dataController.getData(aName);
		};
		
		DataControllerProxy.prototype.changeValue = function(aName, aValue, aField){
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("changeValue()");			
			
			this.dataController.changeValue(aName, aValue, aField);
		};	
		
		de.titus.form.DataControllerProxy = DataControllerProxy;
	});	
})();
