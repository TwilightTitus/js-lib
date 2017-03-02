/**
 * 
 */
(function($){
	de.titus.core.Namespace.create("de.titus.jquery.Typeahead", function(){
		var Typeahead = de.titus.jquery.Typeahead = function(aElement, aData){
			this.element = aElement;
			this.data = aData || {};
		};	
		
		de.titus.core.jquery.Components.asComponent("de.titus.Typeahead", Typeahead);
		$(document).ready(function(){
			$(".jstl-typeahead").de_titus_Typeahead();
		});
	});	
})($);