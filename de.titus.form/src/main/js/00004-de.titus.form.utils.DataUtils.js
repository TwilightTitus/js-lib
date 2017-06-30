(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.utils.DataUtils", function() {
		var DataUtils = de.titus.form.utils.DataUtils = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.utils.DataUtils"),		   

		    "object" : function(theData) {
			    if (DataUtils.LOGGER.isDebugEnabled())
				    DataUtils.LOGGER.logDebug("data of fields to object: " + JSON.stringify(theData));

			    var result = {};

			    return result;
		    }
		};
	});

})($);
