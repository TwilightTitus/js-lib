(function($){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.utils.FormularUtils", function() {
		var FormularUtils = de.titus.form.utils.FormularUtils = {
			LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.utils.FormularUtils"),
			
			getFormularElement : function(aElement){
				if (FormularUtils.LOGGER.isDebugEnabled())
					FormularUtils.LOGGER.logDebug("getFormularElement()");
				
				if(aElement.is("[data-form]"))
					return aElement;
				else{
					var parent = aElement.parents("[data-form]").first();
					if(parent.length == 1)
						return parent;
				}
				
			},
			getFormular : function(aElement){
				if (FormularUtils.LOGGER.isDebugEnabled())
					FormularUtils.LOGGER.logDebug("getFormular()");
				
				var formularElement = FormularUtils.getFormularElement(aElement);
				if(formularElement)
					return formularElement.Formular();
			},
			
			getPage : function(aElement){
				if (FormularUtils.LOGGER.isDebugEnabled())
					FormularUtils.LOGGER.logDebug("getPage()");
				
				if(aElement.is("[data-form-page]"))
					return aElement.formular_Page();
				else{
					var parent = aElement.parents("[data-form-page]").first();
					if(parent.length == 1)
						return parent.formular_Page();
				}
				
			},
			getField : function(aElement){
				if (FormularUtils.LOGGER.isDebugEnabled())
					FormularUtils.LOGGER.logDebug("getField()");
				
				if(aElement.is("[data-form-field]"))
					return aElement.formular_Field();
				else{
					var parent = aElement.parents("[data-form-field]").first();
					if(parent.length == 1)
						return parent.formular_Field();
				}
			}
		};
	});
	
})($);