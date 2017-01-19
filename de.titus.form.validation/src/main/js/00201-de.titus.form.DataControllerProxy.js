(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DataControllerProxy", function() {
		de.titus.form.DataControllerProxy = function(aChangeListener, aDataController) {
			if(de.titus.form.DataControllerProxy.LOGGER.isDebugEnabled())
				de.titus.form.DataControllerProxy.LOGGER.logDebug("constructor");
			
			this.dataController = aDataController;
			this.changeListener = aChangeListener;
		};
		
		de.titus.form.DataControllerProxy.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataControllerProxy");
		
		de.titus.form.DataControllerProxy.prototype.getData = function(){
			if(de.titus.form.DataControllerProxy.LOGGER.isDebugEnabled())
				de.titus.form.DataControllerProxy.LOGGER.logDebug("getData()");
				
			return this.dataController.getData();
		};
		
		de.titus.form.DataControllerProxy.prototype.changeValue = function(aName, aValue, aField){
			if(de.titus.form.DataControllerProxy.LOGGER.isDebugEnabled())
				de.titus.form.DataControllerProxy.LOGGER.logDebug("changeValue()");			
			
			this.dataController.changeValue(aName, aValue, aField, this.changeListener);
		};				
	});	
})();
