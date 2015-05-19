de.titus.core.Namespace.create("de.titus.jquery.jstl.plugin", function(){
	
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
	
	(function($) {
		$.fn.jstl = function(/* config */ aConfig) {
			var config = {"element": this,"domHelper": de.titus.jquery.DomHelper.getInstance()};
			config = $().extend(config, aConfig);
			new de.titus.jstl.Processor(config).compute();
		};
	}(jQuery));
});
