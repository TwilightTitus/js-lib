(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DataContext", function() {
		var DataContext = de.titus.form.DataContext = function(aElement, aGetData) {
			this.data = {
			    element : aElement,
			    getData : aGetData
			}
		};

		DataContext.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataContext");

		DataContext.prototype.getData = function(aFilter) {
			if (DataContext.LOGGER.isDebugEnabled())
				DataContext.LOGGER.logDebug("getData (\"", aFilter, "\")");

			var filter = $.extend({}, aFilter);
			filter.modelType = undefined;
			var data = this.data.getData(filter);
			if (DataContext.LOGGER.isDebugEnabled())
				DataContext.LOGGER.logDebug([ "getData() -> nativ data: ", data ]);

			if (!aFilter.modelType)
				return data;

			var modelType = aFilter.modelType.trim().toLowerCase();
			var result = {};
			for (name in data) {
				if (Array.isArray(data[name])) {
					var model = de.titus.form.utils.DataUtils[modelType](data[name]);
					if (Array.isArray(model))
						result[name] = model;
					else if (typeof model !== "undefined")
						$.extend(result, model);
				}
			}

			if (DataContext.LOGGER.isDebugEnabled())
				DataContext.LOGGER.logDebug([ "getData() -> model result: ", result ]);

			return result;
		};

		$.fn.formular_DataContext = function(aGetData) {
			if (this.length == 1) {
				var dataContext = this.data("de.titus.form.DataContext");
				if (!dataContext && typeof aGetData === "function") {
					dataContext = new de.titus.form.DataContext(this, aGetData);
					this.data("de.titus.form.DataContext", dataContext);
					this.attr("data-form-data-context", "")
				}

				return dataContext;
			}
		};

		$.fn.formular_findDataContext = function() {
			if (this.length == 1) {
				if (this.attr("data-form-data-context") != undefined || this.attr("data-form") != undefined)
					return this.formular_DataContext();
				else
					return this.parent().formular_findDataContext();
			}
		};

		$.fn.formular_findParentDataContext = function() {
			if (this.length == 1)
				return this.parent().formular_findDataContext();
		};
	});

})($);
