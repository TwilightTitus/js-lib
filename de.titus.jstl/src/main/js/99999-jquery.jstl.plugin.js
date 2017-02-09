(function($) {
	de.titus.core.Namespace.create("de.titus.jquery.jstl.plugin", function() {
		
		/**
		 * <code>
		 * config: {
		 * "data": dataContext,
		 * "onLoad": function(){},
		 * "onSuccess":function(){},
		 * "onFail": function(){},
		 * "attributePrefix" : "jstl-" 
		 * }
		 * </code>
		 */
		
		$.fn.jstl = function(/* config */aConfig) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstl(aConfig);
				});
			} else {
				var config = {
					"element" : this
				};
				config = $.extend(config, aConfig);
				var processor = new de.titus.jstl.Processor(config);
				processor.compute();
				return processor;
			}
		};
		
		$.fn.jstlAsync = function(/* config */aConfig) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstlAsync(aConfig);
				});
			} else {
				var config = $.extend({"element" : this}, aConfig);
				setTimeout((function(aConfig){
						var processor = new de.titus.jstl.Processor(aConfig);
						processor.compute();
					}).bind(null, config), 10);
				return this;
			}
		};
		
		$(document).ready(function() {
			$("[jstl-autorun]").jstlAsync();
		});
		
	});
}(jQuery));