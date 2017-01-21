(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Validation", function() {
		var Validation = function(aElement, aDataController, aExpressionResolver) {
			if(Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.expressionResolver = aExpressionResolver;
			this.data.state = false;
		};
		
		Validation.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Validation");
		
		Validation.prototype.doCheck = function(aValue) {
			if(Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("doCheck()");
			
			this.data.state = true;
			var validationAttr = de.titus.form.Setup.prefix + de.titus.form.Constants.ATTRIBUTE.VALIDATION;
			var validationElements = this.data.element.find("[" + validationAttr + "]");
			validationElements.removeClass("active");
			var data = {
				value: aValue,
				data: this.data.dataController.getData()
			};			
			
			for(var i = 0; i < validationElements.length; i++){
				var element = $(validationElements[i]);
				var validation = element.attr(validationAttr);
				if(validation != undefined && validation.trim() != ""){
					if(Validation.LOGGER.isDebugEnabled())
						Validation.LOGGER.logDebug("doCheck() -> expression: " + validation);
					
					var validation = this.data.expressionResolver.resolveExpression(validation, data, false);
					if(typeof validation === "function")
						this.data.state = validation(data.value, data.data, this) || false;
					else
						this.data.state = validation === true;
					
					if(this.data.state == false){
						element.addClass("active");
						return this.data.state;
					}
				}
			}
			
			if(Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("doCheck() -> result: " + this.data.state);
					
			return this.data.state;					
		};
		
		de.titus.form.Validation = Validation;
	});	
})();
