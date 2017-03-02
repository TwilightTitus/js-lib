/**
 * 
 */
(function($){
	de.titus.core.Namespace.create("de.titus.jquery.Typeahead", function(){
		var Typeahead = de.titus.jquery.Typeahead = function(){
			
		};	
		
		$.fn.de_titus_Typeahead = function(aData){
			if(this.length == 0)
				return;
			else if(this.length > 1){
				var result = [];
				this.each(function(){result.push($(this).de_titus_Typeahead(aData));});
				return result;
			}else{
				var component = this.data("de.titus.jquery.Typeahead");
				if(!component){
					component = new de.titus.jquery.Typeahead(this, aData);
					this.data("de.titus.jquery.Typeahead", component);
				}
				
				return component;
			}				
		};
	});	
})($);