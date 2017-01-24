(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.ListFieldController", function() {
		var ListFieldController = function(aElement) {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			this.template = this.element.find("[" + de.titus.form.Setup.prefix + "-field-list-template]");
			this.content = this.element.find("[" + de.titus.form.Setup.prefix + "-field-list-content]");
			this.listFields = [];
			
			
			this.init();
		};
		ListFieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.ListFieldController");
		
		ListFieldController.prototype.init = function() {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("init()");
			this.element.find("[" + de.titus.form.Setup.prefix + "-field-list-add-action]").on("click", ListFieldController.prototype.addAction.bind(this));
		};
		
		ListFieldController.prototype.addAction = function(aEvent) {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("addAction()");
			
			var dataController = new de.titus.form.ListFieldDataController(this.element.FormularField().data.dataController);
			
			
			var newRow = this.template.clone();
			console.log(newRow);
			newRow.removeAttr(de.titus.form.Setup.prefix + "-field-list-template");
			newRow.attr(de.titus.form.Setup.prefix + "-field-list-row", "");
			
			this.content.append(newRow);
			newRow.find("[" + de.titus.form.Setup.prefix + "-field]").FormularField(dataController);
			this.listFields.push(dataController);
		};		

		ListFieldController.prototype.showField = function(aData) {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("showField()");
			
			this.element.show();
		};
		
		ListFieldController.prototype.hideField = function() {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("hideField()");
			
			this.element.hide()
		};
		
		ListFieldController.prototype.showSummary = function() {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("showSummary()");
						
		};
		
		ListFieldController.prototype.getValue = function() {
			var result = [];
			for(var i = 0; i < this.listFields.length; i++)
				result.push(this.listFields[i].internalDataController.getData());
			
			return result;
		};
		
		de.titus.form.ListFieldController = ListFieldController; 
		
		de.titus.form.Registry.registFieldController("list", function(aElement, aFieldname, aValueChangeListener) {
			return new ListFieldController(aElement, aFieldname, aValueChangeListener);
		});
	});
})();
