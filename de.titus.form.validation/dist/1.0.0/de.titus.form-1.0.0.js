/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Frank Schüler
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function(){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Setup", function(){
		de.titus.form.Setup = {
			prefix : "data-form",
			fieldtypes : {}
		};
	});	
})();(function(){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Constants", function(){
		de.titus.form.Constants.EVENTS = {
			FORM_INITIALIZED : "form-initialized",						
			FORM_ACTION_CANCEL : "form-action-cancel",
			FORM_ACTION_SUBMIT : "form-action-submit",
			
			FORM_PAGE_INITIALIZED : "form-page-initalized",
			FORM_PAGE_CHANGED : "form-page-changed",
			FORM_PAGE_SHOW : "form-page-show",
			FORM_PAGE_ACTION_BACK : "form-page-action-back",
			FORM_PAGE_ACTION_NEXT : "form-page-action-next",			
			
			
			FIELD_VALUE_CHANGED : "form-field-value-changed"			
			
		};
	});	
})();(function(){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Registry", function(){
		de.titus.form.Registry.registFieldController = function(aTypename, aFunction){
			de.titus.form.Setup.fieldtypes[aTypename] = aFunction;
		};
	});	
})();(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Field", function() {
		de.titus.form.Field = function(aElement, aDataController) {
			if(de.titus.form.Field.LOGGER.isDebugEnabled())
				de.titus.form.Field.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix + "-field");
			this.data.type = aElement.attr(de.titus.form.Setup.prefix + "-field-type");
			this.data.activ = false;
			this.data.valid = false;
			
			var initializeFunction = de.titus.form.Setup.fieldtypes[this.data.type] || de.titus.form.Setup.fieldtypes["testField"];
			if (initializeFunction == undefined || typeof initializeFunction !== "function")
				throw "The fieldtype \"" + this.data.type + "\" is not available!";
			
			this.fieldController = initializeFunction(this.data.element, this.data.name, de.titus.form.Field.prototype.doValueChange.bind(this));
		};
	});
	
	de.titus.form.Field.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Field");
	
	de.titus.form.Field.prototype.doConditionCheck = function() {
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("doConditionCheck()");
		
		this.data.activ = false;		
		if (this.isConditionSatisfied()){
			this.fieldController.showField(this.data.dataController.data);
			this.data.activ = true;
		}
		else
			this.fieldController.hideField();
	};
	
	de.titus.form.Field.prototype.isConditionSatisfied = function() {
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("isConditionSatisfied()");
		
		// TODO
		return true; // if condition is satisfied
	};
	
	de.titus.form.Field.prototype.showSummary = function(){
		if(!this.data.activ)
			return;
		
		this.fieldController.showSummary();
	};
	
	de.titus.form.Field.prototype.doValueChange = function(aEvent) {
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("doValueChange()");
		
		if (aEvent != undefined) {
			if (typeof aEvent.preventDefault === "function")
				aEvent.preventDefault();
			if (typeof aEvent.stopPropagation === "function")
				aEvent.stopPropagation();
		}
		
		var value = this.fieldController.getValue();
		if (this.doValidate(value))
			this.data.dataController.changeValue(this.data.name, value);
		else
			this.data.dataController.changeValue(this.data.name, null);
		
		this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
	};
	
	de.titus.form.Field.prototype.doValidate = function(aValue) {
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("isValid()");
		// TODO
		this.fieldController.setValid(true, "Not Valid!");
		
		this.data.valid = true;
		return this.data.valid;// if value valied!
	};
	
	$.fn.FormularField = function(aDataController) {
		if (this.length == undefined || this.length == 0)
			return;
		else if (this.length > 1) {
			var result = [];
			this.each(function() {
				result.push($(this).FormularField(aDataController));
			});
			return result;
		} else {
			var data = this.data("de.titus.form.Field");
			if (data == undefined) {
				data = new de.titus.form.Field(this, aDataController);
				this.data("de.titus.form.Field", data);
			}
			return data;
		}
	};
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DataController", function() {
		de.titus.form.DataController = function(aChangeListener) {
			this.data = {};
			this.changeListener = aChangeListener;
		};
		
		de.titus.form.DataController.prototype.changeValue = function(aName, aValue){
			if(aValue == undefined && this.data[aName] != undefined){
				this.data[aName] = null;
			}
			else{			
        		this.data[aName] = aValue;
			}
			
			this.changeListener(aName, aValue);
		};				
	});	
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Formular", function() {
		de.titus.form.Formular = function(aElement) {
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix);
			this.data.pages = [];
			this.data.dataController = new de.titus.form.DataController(function(){});			
			this.data.currentPage = 1;			
			this.init();
		};
		
		de.titus.form.Formular.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Formular");
		
		de.titus.form.Formular.prototype.init = function() {
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("init()");		
			
			this.initPages();
			this.data.element.FormularStepController(this);
		};

		de.titus.form.Formular.prototype.initPages = function() {
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("initPages()");
			
			var pageElements = this.data.element.find("[" + de.titus.form.Setup.prefix + "-page" + "]");
			if(pageElements.length == 0){
				var page = this.data.element.FormularPage(this.data.dataController);
				this.data.pages.push(page);
				page.show();
			}
			else {
				for(var i = 0; i < pageElements.length; i++){
					var page =$(pageElements[i]).FormularPage(this.data.dataController);
					this.data.pages.push(page);
					if(i > 0)
						page.hide();
					else
						page.show();
				}
			}		
		};
		
		de.titus.form.Formular.prototype.showSummary = function(){
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("showSummary()");
			
			for(var i = 0; i < this.data.pages.length; i++)
				if(pages[i].active)
					pages[i].showSummary();
		};
		
		de.titus.form.Formular.prototype.currentPage = function(){
			return this.data.pages[this.data.currentPage - 1];
		};
		
		de.titus.form.Formular.prototype.submit = function(){
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("submit()");
		};		
	});
	
	$.fn.Formular = function() {
		if (this.length == undefined || this.length == 0)
			return;
		else if (this.length > 1) {
			var result = [];
			this.each(function() {
				result.push($(this).Formular());
			});
			return result;
		} else {
			var data = this.data("de.titus.form.Formular");
			if (data == undefined) {
				data = new de.titus.form.Formular(this);
				this.data("de.titus.form.Formular", data);
			}
			return data;
		}
	};
})($);
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
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.StepController", function() {
		de.titus.form.StepController = function(aElement, aForm) {
			if(de.titus.form.StepController.LOGGER.isDebugEnabled())
				de.titus.form.StepController.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.stepPanel = undefined;
			this.data.stepControl = undefined;
			this.data.stepControlBack = undefined;
			this.data.stepControlNext = undefined;
			this.data.stepControlFinish= undefined;
			this.data.form = aForm;		
			this.init();
		};
		
		de.titus.form.StepController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.StepController");
		
		de.titus.form.StepController.prototype.init = function() {
			if(de.titus.form.StepController.LOGGER.isDebugEnabled())
				de.titus.form.StepController.LOGGER.logDebug("init()");
			this.initStepPanel();
			this.initStepControls()
		};
		
		de.titus.form.StepController.prototype.initStepPanel = function() {
			this.data.stepPanel = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-panel" + "]");
			this.data.stepPanel.find("[" + de.titus.form.Setup.prefix + "-step='" + this.data.form.currentPage().data.step + "']").addClass("activ");
		};
		
		de.titus.form.StepController.prototype.initStepControls = function() {
			this.data.stepControl = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-control" + "]");			
			this.data.stepControlBack = this.data.stepControl.find("[" + de.titus.form.Setup.prefix + "-step-back" + "]");
			this.data.stepControlBack.hide();
			
			this.data.stepControlNext = this.data.stepControl.find("[" + de.titus.form.Setup.prefix + "-step-next" + "]");
			
			this.data.stepControlFinish = this.data.stepControl.find("[" + de.titus.form.Setup.prefix + "-step-finish" + "]");
			this.data.stepControlFinish.hide();			
		};
		
		$.fn.FormularStepController = function(aForm) {
			if (this.length == undefined || this.length == 0)
				return;
			else if (this.length > 1) {
				var result = [];
				this.each(function() {
					result.push($(this).FormularStepController(aForm));
				});
				return result;
			} else {
				var data = this.data("de.titus.form.StepController");
				if (data == undefined) {
					data = new de.titus.form.StepController(this, aForm);
					this.data("de.titus.form.StepController", data);
				}
				return data;
			}
		};
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.FieldController", function() {
		de.titus.form.FieldController = function(aElement, aFieldname, aValueChangeListener) {
			this.element = aElement;
			this.fieldname = aFieldname;
			this.valueChangeListener = aValueChangeListener;
			this.element.text(this.fieldname);
			this.element.on("click", this.valueChangeListener);
		};
		
		de.titus.form.FieldController.prototype.showField = function(aData) {
			console.log("showField");
			this.element.show();
		};
		
		de.titus.form.FieldController.prototype.showSummary = function(){
			
		};
		
		de.titus.form.FieldController.prototype.hideField = function() {
			console.log("hideField");
			this.element.hide()
		};
		
		de.titus.form.FieldController.prototype.setValid = function(isValid, aMessage) {
			console.log("setValied");
			if (!isValid) {
				alert(this.fieldname + ": " + aMessage);
			}
			alert(this.fieldname);
		};
		
		de.titus.form.FieldController.prototype.getValue = function() {
			console.log("getValue");
			return "test";
		};
		
		de.titus.form.Registry.registFieldController("testField", 
			function(aElement, aFieldname, aValueChangeListener){
				return new de.titus.form.FieldController(aElement, aFieldname, aValueChangeListener);
			}
		);
	});
})();
