(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.utils.FormularControl", function() {
		var FormularControl = de.titus.form.utils.FormularControl = function(aElement, aControlEvent){
			this.data = {
				element : aElement,
				event : aControlEvent
			};
			
			this.init();
		};
		
		FormularControl.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.utils.FormularControl");
		
		FormularControl.prototype.init = function(){
			if (FormularControl.LOGGER.isDebugEnabled())
				FormularControl.LOGGER.logDebug("init ()");
			
			if(this.data.element)
				this.data.element.on("click", (function(aEvent){
					if (FormularControl.LOGGER.isDebugEnabled())
						FormularControl.LOGGER.logDebug("fireEvent -> " + this.data.event);
					
					aEvent.preventDefault();
					de.titus.form.utils.EventUtils.triggerEvent(this.data.element, this.data.event);
				}).bind(this));
		};
		
		FormularControl.prototype.show = function(){
			if (FormularControl.LOGGER.isDebugEnabled())
				FormularControl.LOGGER.logDebug("show ()");
			
			if(this.data.element){
				this.data.element.removeClass("inactive");
				this.data.element.addClass("active");
			}
		};
		
		FormularControl.prototype.hide = function(){
			if (FormularControl.LOGGER.isDebugEnabled())
				FormularControl.LOGGER.logDebug("hide ()");
			
			if(this.data.element){
				this.data.element.removeClass("active");
				this.data.element.addClass("inactive");
			}
		};
	});
})($);

