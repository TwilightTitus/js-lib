(function($) {
	de.titus.core.Namespace.create("de.titus.form.Form", function() {
		"use strict";
		de.titus.form.Form = function(aElement, aSettings) {
			if (de.titus.form.Form.LOGGER.isDebugEnabled())
				de.titus.form.Form.LOGGER.logDebug("call de.titus.form.Form.prototype.constructor()");
			
			this.element = aElement;
			this.settings = $.extend({}, aSettings, de.titus.form.Form.LOGGER.DEFAULTSETTINGS);
			this.data = {

			};
			this.__init();
		};
		
		de.titus.form.Form.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Form");
		de.titus.form.Form.LOGGER.DEFAULTSETTINGS = {
			"prefix":"form-"
		};
		
		de.titus.form.Form.prototype.__init = function() {
			this.__buildFields();
		};
		
		de.titus.form.Form.prototype.__buildFields = function() {
			this.data.fields = new Array();
			this.data.fieldMap = {};
			
			this.element.find(this.settings.prefix + "field");
			
			
		};
		
		$.fn.Form = function() {
			if (this.length == undefined || this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).Form();
				});
			} else {
				var form = this.data("de.titus.form.Form");
				if (form == undefined) {
					form = new de.titus.form.Form(this);
					this.data("de.titus.form.Form", form);
				}
				return form;
			}
		};
	});
})(jQuery);
