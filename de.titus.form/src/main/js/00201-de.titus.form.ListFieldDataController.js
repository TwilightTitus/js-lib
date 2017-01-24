(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.ListFieldDataController", function() {
		var ListFieldDataController = function(aDataController, aName) {
			if(ListFieldDataController.LOGGER.isDebugEnabled())
				ListFieldDataController.LOGGER.logDebug("constructor");
			this.name = aName;
			this.internalDataController = new de.titus.form.DataController();
			this.dataController = aDataController;
		};
		
		ListFieldDataController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.ListFieldDataController");
		
		ListFieldDataController.prototype.getData = function(aName){
			if(ListFieldDataController.LOGGER.isDebugEnabled())
				ListFieldDataController.LOGGER.logDebug("getData() -> aName: " + aName);
			
			if(aName != undefined){
				var data = this.dataController.getData();
				data = $.extend(data, this.internalDataController.getData());
				return data;
			}
			else {
				var value= this.internalDataController.getData(aName);
				if(value == undefined)
					return this.dataController.getData(aName);
				else
					return value;
			}			
		};
		
		ListFieldDataController.prototype.changeValue = function(aName, aValue, aField){
			if(ListFieldDataController.LOGGER.isDebugEnabled())
				ListFieldDataController.LOGGER.logDebug("changeValue()");			
			
			this.internalDataController.changeValue(aName, aValue, aField);
		};	
		
		de.titus.form.ListFieldDataController = ListFieldDataController;
	});	
})($);
