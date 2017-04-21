(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Message", function() {
		var Message = function(aElement, aDataController, aExpressionResolver) {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("constructor");
			
			this.data = {
			element : aElement,
			dataController : aDataController,
			expressionResolver : aExpressionResolver
			};
		};
		
		Message.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Message");
		
		Message.prototype.showMessage = function() {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("showMessage()");
			
			var messageAttr = de.titus.form.Setup.prefix + de.titus.form.Constants.ATTRIBUTE.MESSAGE;
			var messages = this.data.element.find("[" + messageAttr + "]");
			messages.removeClass("active");
			var data = this.data.dataController.getData();
			
			for (var i = 0; i < messages.length; i++) {
				var element = $(messages[i]);
				var expression = element.attr(messageAttr);
				if (expression != undefined && expression.trim() != "") {
					if (Message.LOGGER.isDebugEnabled())
						Message.LOGGER.logDebug("showMessage() -> expression: \"" + expression + "\"; data: \"" + JSON.stringify(data) + "\"");
					
					var result = false;
					var result = this.data.expressionResolver.resolveExpression(expression, data, false);
					if (typeof result === "function")
						result = result(data.value, data.data, this) || false;
					else
						result = result === true;
					
					if (Message.LOGGER.isDebugEnabled())
						Message.LOGGER.logDebug("showMessage() -> expression: \"" + expression + "\"; result: \"" + result + "\"");
					
					if (result)
						element.addClass("active");
				}
			}
		};
		
		Message.prototype.doValidate = function(aValue) {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("doValidate()");
			
		};
		
		de.titus.form.Message = Message;
	});
})();
