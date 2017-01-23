(function() {
    "use strict";
    de.titus.core.Namespace.create("de.titus.form.DataController", function() {
	var DataController = function() {
	    if (DataController.LOGGER.isDebugEnabled())
		DataController.LOGGER.logDebug("constructor");

	    this.data = {};
	};

	DataController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataController");

	DataController.prototype.getData = function(aName) {
	    if (DataController.LOGGER.isDebugEnabled())
		DataController.LOGGER.logDebug("getData() -> aName: " + aName);

	    if (aName) {
		var names = aName.split(".");
		var data = this.data;
		for (var i = 0; i < (names.length - 1); i++) {
		    if (data[names[i]] != undefined) {
			data = data[names[i]];
		    }
		}
		return data;
	    } else
		return this.data;
	};

	DataController.prototype.changeValue = function(aName, aValue, aField) {
	    if (DataController.LOGGER.isDebugEnabled())
		DataController.LOGGER.logDebug("changeValue()");

	    var names = aName.split(".");
	    var data = this.data;
	    for (var i = 0; i < (names.length - 1); i++) {
		if (data[names[i]] == undefined) {
		    data[names[i]] = {};
		}
		data = data[names[i]];
	    }
	    data[names[names.length - 1]] = aValue;
	    
	    if (DataController.LOGGER.isDebugEnabled())
		DataController.LOGGER.logDebug("changeValue() -> data: " + JSON.stringify(this.data));
	};

	de.titus.form.DataController = DataController;
    });
})();
