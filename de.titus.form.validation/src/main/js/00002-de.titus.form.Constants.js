(function(){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Constants", function(){
		de.titus.form.Constants.EVENTS = {
			FORM_INITIALIZED : "form-initialized",						
			FORM_ACTION_CANCEL : "form-action-cancel",
			FORM_ACTION_SUBMIT : "form-action-submit",
			
			FORM_PAGE_INITIALIZED : "form-page-initalized",
			FORM_PAGE_CHANGED : "form-page-changed",
			FORM_PAGE_SHOW : "form-page-show",
			FORM_PAGE_ACTION_BACK : "form-page-action-back",
			FORM_PAGE_ACTION_NEXT : "form-page-action-next",			
			
			
			FIELD_VALUE_CHANGED : "form-field-value-changed"			
			
		};
	});	
})();