(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.data.utils.FlatListModel", function() {
		var FlatListModel = de.titus.form.data.utils.FlatListModel = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.data.utils.FlatListModel"),

		    toModel : function(aData, aNamespace) {
			    if (FlatListModel.LOGGER.isDebugEnabled())
				    FlatListModel.LOGGER.logDebug([ "toModel(\"", aData, "\"" ]);
			    if (aData == undefined)
				    return;

			    var baseName = aNamespace || "";

			    if (typeof aData.$type === "string") {

				    if (aData.$type == "single-field") {

					    return aData.value;
				    } else
					    return FlatListModel.toModel(aData.value)
			    } else if (Array.isArray(aData)) {
				    var result = [];
				    for (var i = 0; i < aData.length; i++)
					    result.push(FlatListModel.toModel(aData[i]));
			    } else if (typeof aData === "object") {
				    var result = {};
				    for ( var name in aData)
					    result[name] = FlatListModel.toModel(aData[name]);
			    } else
				    return aData;

			    return result;
		    }
		};
	});

})($);
