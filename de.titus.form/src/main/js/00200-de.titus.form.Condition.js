(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Condition", function() {
		de.titus.form.Condition = function(aElement, aDataController, aExpressionResolver) {
			if(de.titus.form.Condition.LOGGER.isDebugEnabled())
				de.titus.form.Condition.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.expressionResolver = aExpressionResolver;
			this.data.state = false;
		};
		
		de.titus.form.Condition.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Condition");
		
		de.titus.form.Condition.prototype.doCheck = function(aCallback, callOnlyByChange) {
			if(de.titus.form.Condition.LOGGER.isDebugEnabled())
				de.titus.form.Condition.LOGGER.logDebug("doCheck()");
				
			var state = false;
			var condition = this.data.element.attr(de.titus.form.Setup.prefix + de.titus.form.Constants.ATTRIBUTE.CONDITION);			
			if(condition != undefined && condition.trim() != ""){
				if(de.titus.form.Condition.LOGGER.isDebugEnabled())
					de.titus.form.Condition.LOGGER.logDebug("doCheck() -> condition: " + condition);
				
				var data = this.data.dataController.getData();
				if(de.titus.form.Condition.LOGGER.isDebugEnabled())
					de.titus.form.Condition.LOGGER.logDebug("doCheck() -> data: " + JSON.stringify(data));
				
				var condition = this.data.expressionResolver.resolveExpression(condition, data, false);
				if(typeof condition === "function")
					state = condition(data, this);
				else
					state = condition === true; 
			}
			else			
				state = true;	
			
			if(aCallback == undefined)
				this.data.state = state;
			else if(aCallback != undefined && callOnlyByChange && this.data.state != state){
				this.data.state = state;
				aCallback(this.data.state);
			}
			else if(aCallback != undefined && callOnlyByChange && this.data.state == state){
				this.data.state = state;
			}
			else{
				this.data.state = state;
				aCallback(this.data.state);
			}
			
			return this.data.state;					
		};		
	});	
})();
