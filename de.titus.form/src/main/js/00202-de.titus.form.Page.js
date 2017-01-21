(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Page", function() {
		var Page = function(aElement, aDataController, aExpressionResolver) {
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("constructor");
			this.data = {};
			this.data.number = undefined;
			this.data.element = aElement;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix + "-page");
			this.data.step = aElement.attr(de.titus.form.Setup.prefix + "-step");
			this.data.expressionResolver = aExpressionResolver || new de.titus.core.ExpressionResolver();
			this.data.formDataController = aDataController;
			this.data.dataController = new de.titus.form.DataControllerProxy(Page.prototype.valueChangeListener.bind(this), this.data.formDataController);
			this.data.conditionHandle = new de.titus.form.Condition(this.data.element,this.data.dataController,this.data.expressionResolver);
			this.data.fieldMap = {};
			this.data.fields = [];
			this.data.active = false;
			
			this.init();
		};
		
		Page.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Page");
		
		Page.prototype.init = function() {
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("init()");
			this.initFields(this.data.element);
		};
		
		Page.prototype.valueChangeListener = function(aName, aValue, aField) {
			this.data.formDataController.changeValue(aName, aValue, aField);
			for(var i = 0; i < this.data.fields.length; i++)
				this.data.fields[i].doConditionCheck();
		};
		

		Page.prototype.initFields = function(aElement) {
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("initFields()");
			
			if (aElement.attr(de.titus.form.Setup.prefix + "-field") != undefined) {
				var field = aElement.FormularField(this.data.dataController, this.data.expressionResolver);
				this.data.fieldMap[field.name] = field;
				this.data.fields.push(field);
			} else {
				var children = aElement.children();
				for (var i = 0; i < children.length; i++) {
					this.initFields($(children[i]));
				}
			}
		};
		
		
		Page.prototype.checkCondition = function(){
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("checkCondition()");
			
			this.data.active = this.data.conditionHandle.doCheck();
			if(!this.data.active)
				for(var i = 0; i < this.data.fields.length; i++)
					this.data.fields[i].setInactiv();
			
			return this.data.active;
		};		
		
		Page.prototype.show = function(){
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("show()");
			
			for(var i = 0; i < this.data.fields.length; i++)
				this.data.fields[i].doConditionCheck();
			
			this.data.element.show();
		};
		
		Page.prototype.hide = function(){
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("hide()");
			
			this.data.element.hide();
		};
		
		Page.prototype.showSummary = function(){
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("showSummary()");
			
			if(!this.data.active)
				return;
			
			this.show();
			for(var i = 0; i < this.data.fields.length; i++)
				if(this.data.fields[i].data.active)
					this.data.fields[i].showSummary();
		};
		
		Page.prototype.doValidate = function(){
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("doValidate()");
			
			for(var i = 0; i < this.data.fields.length; i++)
				if(this.data.fields[i].data.active && !this.data.fields[i].data.valid)
					return false;
			
			return true;
		};
		
		de.titus.form.Page = Page;
		
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
					data = new Page(this, aDataController);
					this.data("de.titus.form.Page", data);
				}
				return data;
			}
		};
	});
})($);
