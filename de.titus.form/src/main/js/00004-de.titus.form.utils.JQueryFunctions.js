(function($){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.utils.JQueryFunctions", function() {
		
		$.fn.formular_utils_RemoveAddClass = function(aRemoveClass, anAddClass){
			if(this.length == 0) return;
			else if(this.length > 1){
				this.each(function(){$(this).formular_utils_RemoveAddClass(aRemoveClass, anAddClass);});
				return this;
			}
			else{
				this.removeClass(aRemoveClass);
				this.addClass(anAddClass);
			}
		};		
		
		$.fn.formular_utils_SetActive = function(){
			this.formular_utils_RemoveAddClass("inactive", "active");
		};
		
		$.fn.formular_utils_SetInactive = function(){
			this.formular_utils_RemoveAddClass("active", "inactive");
		};
		
		$.fn.formular_utils_SetValid = function(){
			this.formular_utils_RemoveAddClass("invalid", "valid");
		};
		
		$.fn.formular_utils_SetInvalid = function(){
			this.formular_utils_RemoveAddClass("valid", "invalid");
		};
		
	});	
})($);