(function($){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.utils.EventUtils", function() {
		var EventUtils = de.titus.form.utils.EventUtils = {
			LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.utils.EventUtils"),
			triggerEvent : function(aElement, aEvent, aData){
				if (EventUtils.LOGGER.isDebugEnabled())
					EventUtils.LOGGER.logDebug("triggerEvent(\"" + aEvent + "\")");
				
				setTimeout((function(aEvent, aData){
					if (EventUtils.LOGGER.isDebugEnabled())
						EventUtils.LOGGER.logDebug("fire event event \"" + aEvent + "\"");
					this.trigger(aEvent, aData);
				}).bind(aElement, aEvent, aData), 1);
			},
			handleEvent : function(aElement, aEvent,  aCallback, aSelector){
				//TODO REFECTORING TO ONE SETTINGS PARAMETER OBJECT
				
				if (EventUtils.LOGGER.isDebugEnabled())
					EventUtils.LOGGER.logDebug("handleEvent(\"" + aEvent + "\")");
				if(Array.isArray(aEvent))
					aElement.on(aEvent.join(" "), aSelector, aCallback);
				else
					aElement.on(aEvent, aSelector, aCallback);
			}
		};
	});
	
})($);