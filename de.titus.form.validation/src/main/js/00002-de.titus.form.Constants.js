(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Constants", function() {
		de.titus.form.Constants.EVENTS = {
		FORM_INITIALIZED : "form-initialized",
		FORM_ACTION_CANCEL : "form-cancel",
		FORM_ACTION_SUBMIT : "form-submit",
		
		FORM_PAGE_INITIALIZED : "form-page-initalized",
		FORM_PAGE_CHANGED : "form-page-changed",
		FORM_PAGE_SHOW : "form-page-show",
		
		FORM_STEP_BACK : "form-step-back",
		FORM_STEP_NEXT : "form-step-next",
		FORM_STEP_SUMMARY : "form-step-summary",
		FORM_STEP_SUMMARY : "form-step-submit",
		
		FIELD_ACTIVE : "form-field-active",
		FIELD_INACTIVE : "form-field-inactive",
		FIELD_VALUE_CHANGED : "form-field-value-changed",
		FIELD_VALID : "form-field-valid",
		FIELD_INVALID : "form-field-invalid"		
		};
		
		de.titus.form.Constants.STATE = {
		PAGES : "form-state-pages",
		SUMMARY : "form-state-summary",
		SUBMITED : "form-state-submited",
		};
		
		de.titus.form.Constants.ATTRIBUTE ={
				VALIDATION : "-validation",
				VALIDATION_FAIL_ACTION : "-validation-fail-action",
				CONDITION : "-condition"
		}
	});
})();
