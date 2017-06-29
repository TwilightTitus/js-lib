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

		DataContext.getData = function(includeInvalid, aModelType) {
			if (DataContext.LOGGER.isDebugEnabled())
				DataContext.LOGGER.logDebug("getData (\"" + includeInvalid + "\", \"" + aModelType + "\")");
			
			var data = this.data.getData(includeInvalid);
			
			if (DataContext.LOGGER.isDebugEnabled())
				DataContext.LOGGER.logDebug(["nativ data: ", data]);
			
			var modelType = (aModelType || "object").trim().toLowerCase();
			var result = de.titus.form.utils.DataUtils[modelType](data);
			
			if (DataContext.LOGGER.isDebugEnabled())
				DataContext.LOGGER.logDebug(["getData() -> ", result]);
			
			return result;
		};

		$.fn.formular_DataContext = function(aGetData) {
			if (this.length == 1) {
				var dataContext = this.data("de.titus.form.DataContext");
				if (!dataContext && typeof aGetData === "function") {
					dataContext = de.titus.form.DataContext(this, aGetData);
					this.data("de.titus.form.DataContext", dataContext);
					this.attr("data-form-data-context", "")
				}

				return dataContext;
			}
		};

		$.fn.formular_findDataContext = function() {
			if (this.length == 1) {
				if (this.attr("data-form-data-context") || this.attr("data-form"))
					return this.formular_DataContext();
				else
					return this.parent.formular_findDataContext();
			}
		};
		
		$.fn.formular_findParentDataContext = function() {
			return this.parent.formular_findDataContext();
		};
	});

})($);
