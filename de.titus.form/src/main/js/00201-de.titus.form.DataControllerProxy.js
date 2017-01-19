(function() {
	"use strict";
	de.titus.core.Namespace.create("DataControllerProxy", function() {
		DataControllerProxy = function(aChangeListener, aDataController) {
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("constructor");
			
			this.dataController = aDataController;
			this.changeListener = aChangeListener;
		};
		
		DataControllerProxy.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("DataControllerProxy");
		
		DataControllerProxy.prototype.getData = function(){
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("getData()");
				
			return this.dataController.getData();
		};
		
		DataControllerProxy.prototype.changeValue = function(aName, aValue, aField){
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("changeValue()");			
			
			this.dataController.changeValue(aName, aValue, aField, this.changeListener);
		};	
		
		de.titus.form.DataControllerProxy = DataControllerProxy;
	});	
})();
