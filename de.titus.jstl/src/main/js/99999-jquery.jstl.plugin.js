(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jquery.jstl.plugin", function() {
		$.fn.jstl = function(aData) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstl(aData);
				});
			} else {
				var processor = this.data("de.titus.jstl.Processor");
				if (!processor) {
					var data = aData || {};
					processor = new de.titus.jstl.Processor(this, $.extend(true, {}, data.data), data.callback || data.success);
					// processor = new de.titus.jstl.Processor(this, data.data,
					// data.callback || data.success);
					this.data("de.titus.jstl.Processor", processor);
				} else if (aData) {
					var data = aData || {};
					if (data.data)
						// processor.context = data.data;
						processor.context = $.extend(true, {}, data.data);
					if (typeof data.callback === 'function')
						processor.callback = data.callback
				}
				processor.compute();
				return processor;
			}
		};

		$.fn.jstlAsync = function(aData) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				var result = [];
				this.each(function() {
					var value = $(this).jstlAsync(aData);
					if (value)
						result.push(value);
				});
				return result;
			} else {
				setTimeout($.fn.jstl.bind(this, aData), 1);
				return this;
			}
		};

		$(document).ready(function() {
			$("[jstl-autorun]").jstlAsync();
		});

	});
}(jQuery));
