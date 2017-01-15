(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.FieldController", function() {
		de.titus.form.FieldController = function(aElement, aFieldname, aValueChangeListener) {
			this.element = aElement;
			this.fieldname = aFieldname;
			this.valueChangeListener = aValueChangeListener;
			this.element.text(this.fieldname);
			this.element.on("click", this.valueChangeListener);
		};
		
		de.titus.form.FieldController.prototype.showField = function(aData) {
			console.log("showField");
			this.element.show();
		};
		
		de.titus.form.FieldController.prototype.hideField = function() {
			console.log("hideField");
			this.element.hide()
		};
		
		de.titus.form.FieldController.prototype.setValied = function(isValied, aMessage) {
			console.log("setValied");
			if (!isValied) {
				alert(this.fieldname + ": " + aMessage);
			}
			alert(this.fieldname);
		};
		
		de.titus.form.FieldController.prototype.getValue = function() {
			console.log("getValue");
			return "test";
		};
		
		de.titus.form.Registry.registFieldController("testField", 
			function(aElement, aFieldname, aValueChangeListener){
				return new de.titus.form.FieldController(aElement, aFieldname, aValueChangeListener);
			}
		);
	});
})();
