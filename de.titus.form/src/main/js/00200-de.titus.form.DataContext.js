(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DataContext", function() {
		var DataContext = de.titus.form.DataContext = function(aElement, aOption) {
			this.data = {
			    element : aElement,
			    data : aOption.data,
			    scope : aOption.scope,
			    parentDataContext : undefined,
			    init : false
			}
		};

		DataContext.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataContext");

		DataContext.prototype.__getParentDataContext = function() {
			if (!this.data.init) {
				this.data.parentDataContext = this.data.element.formular_findParentDataContext();
				this.data.init = true;
			}

			return this.data.parentDataContext;
		};

		DataContext.prototype.getData = function(aFilter) {
			if (DataContext.LOGGER.isDebugEnabled())
				DataContext.LOGGER.logDebug("getData (\"", aFilter, "\")");

			var dataContext = this.__getParentDataContext() ? this.__getParentDataContext().getData(aFilter) : {};
			var data = typeof this.data.data === "function" ? this.data.data(aFilter) : this.data.data;
			if (data) {
				if (this.data.scope)
					dataContext[this.data.scope] = data;
				else
					$.extend(dataContext, data);
			}

			if (DataContext.LOGGER.isDebugEnabled())
				DataContext.LOGGER.logDebug([ "getData() -> nativ data: ", dataContext ]);

			return dataContext;

			if (!aFilter.modelType)
				return data;

			var modelType = aFilter.modelType.trim().toLowerCase();
			var result = {};
			for ( var name in data) {
				if (Array.isArray(data[name])) {
					var model = de.titus.form.utils.DataUtils[modelType](data[name]);
					if (Array.isArray(model))
						result[name] = model;
					else if (typeof model !== "undefined")
						result = $.extend(result, model);
				}
			}

			if (DataContext.LOGGER.isDebugEnabled())
				DataContext.LOGGER.logDebug([ "getData() -> model result: ", result ]);

			return result;
		};

		$.fn.formular_DataContext = function(aOption) {
			if (this.length == 1) {
				var dataContext = this.data("de.titus.form.DataContext");
				if (!dataContext || aOption) {
					dataContext = new de.titus.form.DataContext(this, aOption);
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
