(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Page", function() {
		de.titus.form.Page = function(aElement, aDataController) {
			if(de.titus.form.Page.LOGGER.isDebugEnabled())
				de.titus.form.Page.LOGGER.logDebug("constructor");
			this.data = {};
			this.data.element = aElement;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix + "-page");
			this.data.step = aElement.attr(de.titus.form.Setup.prefix + "-step");
			this.data.dataController = aDataController;
			this.data.fields = {};
			this.data.activ = false;
			
			this.init();
		};
		
		de.titus.form.Page.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Page");
		
		de.titus.form.Page.prototype.init = function() {
			if(de.titus.form.Page.LOGGER.isDebugEnabled())
				de.titus.form.Page.LOGGER.logDebug("init()");
			this.initFields(this.data.element);
		};
		

		de.titus.form.Page.prototype.initFields = function(aElement) {
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("initFields()");
			
			if (aElement.attr(de.titus.form.Setup.prefix + "-field") != undefined) {
				var field = aElement.FormularField(this.data.dataController);
				this.data.fields[field.name] = field;				
			} else {
				var children = aElement.children();
				for (var i = 0; i < children.length; i++) {
					this.initFields($(children[i]));
				}
			}
		};
		
		
		de.titus.form.Page.prototype.checkCondition = function(){
			
			this.data.activ = true;
			return this.data.activ;
		};		
		
		de.titus.form.Page.prototype.show = function(){
			this.data.element.show();
		};
		
		de.titus.form.Page.prototype.hide = function(){
			this.data.element.hide();
		};
		
		de.titus.form.Page.prototype.showSummary = function(){
			if(!this.data.activ)
				return;
			
			this.show();
			for(var i = 0; i < this.data.fields.length; i++)
				if(this.data.fields[i].data.activ)
					this.data.fields[i].showSummary();
		};
		
		de.titus.form.Page.prototype.doValidate = function(){
			for(var i = 0; i < this.data.fields.length; i++)
				if(this.data.fields[i].data.activ && !this.data.fields[i].data.valid)
					return false;
			
			return true;
		};
		
		
		$.fn.FormularPage = function(aDataController) {
			if (this.length == undefined || this.length == 0)
				return;
			else if (this.length > 1) {
				var result = [];
				this.each(function() {
					result.push($(this).FormularPage(aDataController));
				});
				return result;
			} else {
				var data = this.data("de.titus.form.Page");
				if (data == undefined) {
					data = new de.titus.form.Page(this, aDataController);
					this.data("de.titus.form.Page", data);
				}
				return data;
			}
		};
	});
})($);
