(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Constants", function() {
		de.titus.form.Constants.EVENTS = {
		    INITIALIZED : "form-initialized",
		    SUCCESSED : "form-successed",
		    FAILED : "form-failed",
		    
		    ACTION_RESET : "form-action-reset",
		    ACTION_SUBMIT : "form-action-submit",
		    ACTION_PAGE_BACK : "form-action-page-back",
		    ACTION_PAGE_NEXT : "form-action-page-next",
		    ACTION_SUMMARY : "form-action-page-summary",


		    PAGE_CHANGED : "form-page-changed",
		    PAGE_SHOW : "form-page-show",
		    PAGE_HIDE: "form-page-hide",
		    PAGE_SUMMARY : "form-page-summary",

		    FIELD_SHOW : "form-field-show",
		    FIELD_HIDE : "form-field-hide",
		    FIELD_SUMMARY : "form-field-SUMMARY",
		    FIELD_VALUE_CHANGED : "form-field-value-changed",
		    
		    VALIDATION_STATE_CHANGED: "form-validation-state-changed",
		    VALIDATION_VALID: "form-validation-valid",
		    VALIDATION_INVALID: "form-validation-invalid",
		    
		    CONDITION_STATE_CHANGED: "form-condition-state-changed",
		    CONDITION_MET: "form-condition-met",
		    CONDITION_NOT_MET: "form-condition-not-met"
		};

		de.titus.form.Constants.STATE = {
		    INPUT : "form-state-input",
		    SUMMARY : "form-state-summary",
		    SUBMITTED : "form-state-submitted",
		};

		de.titus.form.Constants.ATTRIBUTE = {
		    VALIDATION : "-validation",
		    VALIDATION_FAIL_ACTION : "-validation-fail-action",
		    CONDITION : "-condition",
		    MESSAGE : "-message"
		};

		de.titus.form.Constants.SPECIALSTEPS = {
			START : "form-step-start",
		    SUMMARY : "form-step-summary",
		    SUBMITTED : "form-step-submitted"
		};

	});
})();
