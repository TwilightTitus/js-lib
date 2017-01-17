(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DataControllerProxy", function() {
		de.titus.form.DataControllerProxy = function(aChangeListener, aDataController) {
			this.dataController = aDataController;
			this.changeListener = aChangeListener;
		};
		
		de.titus.form.DataControllerProxy.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataControllerProxy");
		
		de.titus.form.DataControllerProxy.prototype.changeValue = function(aName, aValue){
			if(de.titus.form.DataControllerProxy.LOGGER.isDebugEnabled())
				de.titus.form.DataControllerProxy.LOGGER.logDebug("changeValue()");			
			this.dataController.changeValue(aName, aValue);
			this.changeListener(aName, aValue);
		};				
	});	
})();
