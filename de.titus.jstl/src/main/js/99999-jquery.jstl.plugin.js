(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jquery.jstl.plugin", function() {		
		$.fn.jstl = function(aContext) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstl(aContext);
				});
			} else {
				var processor = new de.titus.jstl.Processor(this, aContext);
				processor.compute();
				return processor;
			}
		};
		
		$.fn.jstlAsync = function(aContext) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstlAsync(aContext);
				});
			} else {
				setTimeout((function(aElement, aContext){
						var processor = new de.titus.jstl.Processor(aElement, aContext);
						processor.compute();
					}).bind(null, this, aContext), 10);
				return this;
			}
		};
		
		$(document).ready(function() {
			$("[data-jstl-autorun]").jstlAsync();
		});
		
	});
}(jQuery));