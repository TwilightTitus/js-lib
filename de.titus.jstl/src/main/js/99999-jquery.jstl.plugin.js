(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jquery.jstl.plugin", function() {		
		$.fn.jstl = function(aContext, aCallback) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstl(aContext, aCallback);
				});
			} else {
				var context = aContext;
				var callback = aCallback;
				if(typeof context === "function"){
					callback = context;
					context = undefined;
				}
				
				var processor = new de.titus.jstl.Processor(this, context);
				processor.compute(callback);
				return processor;
			}
		};
		
		$.fn.jstlAsync = function(aContext, aCallback) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstlAsync(aContext, aCallback);
				});
			} else {
				setTimeout((function(){this.jstl(aContext, aCallback)}).bind(this), 1);
				return this;
			}
		};
		
		$(document).ready(function() {
			$("[data-jstl-autorun]").jstlAsync();
		});
		
	});
}(jQuery));