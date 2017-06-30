(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.data.utils.DataUtils", function() {
		var DataUtils = de.titus.form.data.utils.DataUtils = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.data.utils.DataUtils"),

		    toModel : function(aData, aModel) {
			    return DataUtils[aModel.toLowerCase()](aData);
		    },

		    "object" : de.titus.form.data.utils.ObjectModel.toModel
		};
	});

})($);
