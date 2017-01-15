(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Field", function() {
		de.titus.form.Field = function(aElement, aDataController) {
			this.element = aElement;
			this.dataController = aDataController;
			this.name = aElement.attr(de.titus.form.Setup.prefix + "-field");
			this.type = aElement.attr(de.titus.form.Setup.prefix + "-field-type");
			
			var initializeFunction = de.titus.form.Setup.fieldtypes[this.type] || de.titus.form.Setup.fieldtypes["testField"];
			if (initializeFunction == undefined || typeof initializeFunction !== "function")
				throw "The fieldtype \"" + this.type + "\" is not available!";
			
			this.fieldController = initializeFunction(this.element, this.name, de.titus.form.Field.prototype.doValueChange.bind(this));
		};
	});
	
	de.titus.form.Field.prototype.doConditionCheck = function() {
		if (this.isConditionSatisfied())
			this.dataController.showField(this.dataController.data);
		else
			this.dataController.hideField();
	};
	
	de.titus.form.Field.prototype.isConditionSatisfied = function() {
		
		// TODO
		return true; // if condition is satisfied
	};
	
	de.titus.form.Field.prototype.doValueChange = function(aEvent) {
		console.log("doValueChange");
		console.log(aEvent);
		if (aEvent != undefined) {
			if (typeof aEvent.preventDefault === "function")
				aEvent.preventDefault();
			if (typeof aEvent.stopPropagation === "function")
				aEvent.stopPropagation();
		}
		
		var value = this.fieldController.getValue();
		if (this.isValid(value))
			this.dataController.changeValue(this.name, value);
		else
			this.dataController.changeValue(this.name, null);
		
		this.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
	};
	
	de.titus.form.Field.prototype.isValid = function(aValue) {
		console.log("isValid");
		// TODO
		this.fieldController.setValied(true, "Not Valid!");
		return true;// if value valied!
	};
	
	$.fn.FormField = function(aDataController) {
		if (this.length == undefined || this.length == 0)
			return;
		else if (this.length > 1) {
			var result = [];
			this.each(function() {
				result.push($(this).FormField(aDataController));
			});
			return result;
		} else {
			var data = this.data("de.titus.form.Field");
			if (data == undefined) {
				data = new de.titus.form.Field(this, aDataController);
				this.data("de.titus.form.Field", data);
			}
			return data;
		}
	};
})();
