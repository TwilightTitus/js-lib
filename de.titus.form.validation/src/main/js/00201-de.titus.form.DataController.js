(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DataController", function() {
		de.titus.form.DataController = function(aChangeListener) {
			this.data = {};
			this.changeListener = aChangeListener;
		};
		
		de.titus.form.DataController.prototype.changeValue = function(aName, aValue){
			if(aValue == undefined && this.data[aName] != undefined){
				this.data[aName] = null;
			}
			else{			
        		this.data[aName] = aValue;
			}
			
			this.changeListener(aName, aValue);
		};				
	});	
})();
