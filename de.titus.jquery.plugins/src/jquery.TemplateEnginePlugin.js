de.titus.core.Namespace.create("de.titus.jquery.TemplateEnginePlugin", function(){
	(function($) {
		$.fn.doTemplating = function(/* settings */ theSettings) {
			var templateEngine = new de.titus.TemplateEngine( de.titus.jquery.DomHelper.getInstance(),this, theSettings);
			templateEngine.doTemplating();
		};

	}(jQuery));
});
