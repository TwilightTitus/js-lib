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
})();(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Constants", function() {
		de.titus.form.Constants.EVENTS = {
		FORM_INITIALIZED : "form-initialized",
		FORM_ACTION_CANCEL : "form-cancel",
		FORM_ACTION_SUBMIT : "form-submit",
		
		FORM_PAGE_INITIALIZED : "form-page-initalized",
		FORM_PAGE_CHANGED : "form-page-changed",
		FORM_PAGE_SHOW : "form-page-show",
		
		FORM_STEP_BACK : "form-step-back",
		FORM_STEP_NEXT : "form-step-next",
		FORM_STEP_SUMMARY : "form-step-summary",
		FORM_STEP_SUMMARY : "form-step-submit",
		
		FIELD_ACTIVE : "form-field-active",
		FIELD_INACTIVE : "form-field-inactive",
		FIELD_VALUE_CHANGED : "form-field-value-changed",
		FIELD_VALID : "form-field-valid",
		FIELD_INVALID : "form-field-invalid"
		};
		
		de.titus.form.Constants.STATE = {
		PAGES : "form-state-pages",
		SUMMARY : "form-state-summary",
		SUBMITED : "form-state-submited",
		};
		
		de.titus.form.Constants.ATTRIBUTE = {
		VALIDATION : "-validation",
		VALIDATION_FAIL_ACTION : "-validation-fail-action",
		CONDITION : "-condition",
		MESSAGE : "-message"
		}
		
	});
})();
(function(){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Registry", function(){
		de.titus.form.Registry.registFieldController = function(aTypename, aFunction){
			de.titus.form.Setup.fieldtypes[aTypename] = aFunction;
		};
	});	
})();(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Condition", function() {
		var Condition = function(aElement, aDataController, aExpressionResolver) {
			if(Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.expressionResolver = aExpressionResolver;
			this.data.state = false;
		};
		
		Condition.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Condition");
		
		Condition.prototype.doCheck = function(aCallback, callOnlyByChange) {
			if(Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("doCheck()");
				
			var state = false;
			var condition = this.data.element.attr(de.titus.form.Setup.prefix + de.titus.form.Constants.ATTRIBUTE.CONDITION);			
			if(condition != undefined && condition.trim() != ""){
				if(Condition.LOGGER.isDebugEnabled())
					Condition.LOGGER.logDebug("doCheck() -> condition: " + condition);
				
				var data = this.data.dataController.getData();
				if(Condition.LOGGER.isDebugEnabled())
					Condition.LOGGER.logDebug("doCheck() -> data: " + JSON.stringify(data));
				
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
		
		de.titus.form.Condition = Condition
	});	
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Field", function() {
		var Field = function(aElement, aDataController, aExpressionResolver) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix + "-field");
			this.data.type = aElement.attr(de.titus.form.Setup.prefix + "-field-type");
			this.data.expressionResolver = aExpressionResolver || new de.titus.core.ExpressionResolver();
			this.data.conditionHandle = new de.titus.form.Condition(this.data.element, this.data.dataController, this.data.expressionResolver);
			this.data.validationHandle = new de.titus.form.Validation(this.data.element, this.data.dataController, this.data.expressionResolver);
			this.data.messageHandle = new de.titus.form.Message(this.data.element, this.data.dataController, this.data.expressionResolver);
			this.data.firstCall = true;
			this.data.active = undefined;
			this.data.valid = false;
			
			this.init();
		};
		
		Field.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Field");
		
		Field.prototype.init = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("init()");
			
			var initializeFunction = de.titus.form.Setup.fieldtypes[this.data.type] || de.titus.form.Setup.fieldtypes["default"];
			if (initializeFunction == undefined || typeof initializeFunction !== "function")
				throw "The fieldtype \"" + this.data.type + "\" is not available!";

			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED, Field.prototype.doValueChange.bind(this));
			this.fieldController = initializeFunction(this.data.element);
		};
		
		Field.prototype.doConditionCheck = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doConditionCheck()");
			
			this.data.active = this.data.conditionHandle.doCheck();			
			if (this.data.active)
				this.fieldController.showField(this.data.dataController.getData(this.data.name), this.data.dataController.getData());
			else
				this.setInactiv();			
			
			if (this.data.active) {
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);
				this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
				this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);				
			} else {
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
				this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);
				this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
			}
			
			if(this.data.firstCall){
				this.data.firstCall = false;
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);				
			}
			
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doConditionCheck() -> result: " + this.data.active);
			
			this.data.messageHandle.showMessage();
			return this.data.active;
		};
		
		Field.prototype.setInactiv = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("setInactiv()");
			this.data.dataController.changeValue(this.data.name, undefined, this);
			this.fieldController.hideField();
		};
		
		Field.prototype.showSummary = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("showSummary()");
			
			if (!this.data.active)
				return;
			
			this.fieldController.showSummary();
		};
		
		Field.prototype.doValueChange = function(aEvent) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doValueChange() -> event type: " + (aEvent != undefined ? aEvent.type : ""));
			
			var value = this.fieldController.getValue();
			if (this.doValidate(value))
				this.data.dataController.changeValue(this.data.name, value, this);
			else
				this.data.dataController.changeValue(this.data.name, undefined, this);
			
			if (aEvent == undefined)
				this.data.element.trigger($.Event(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED));
			else if (aEvent.type != de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED) {
				aEvent.preventDefault();
				aEvent.stopPropagation();
				this.data.element.trigger($.Event(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED));
			}
			
			this.data.messageHandle.showMessage();
		};
		
		Field.prototype.doValidate = function(aValue) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doValidate() -> field: " + this.data.name);
			
			this.data.valid = this.data.validationHandle.doCheck(aValue);			
			if (this.data.valid) {
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALID);
				this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_INVALID);
				this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_VALID);
			} else {
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_INVALID);
				this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_VALID);
				this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_INVALID);
			}
			
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doValidate() -> field: " + this.data.name + " - result: " + this.data.valid);
			
			return this.data.valid;
		};
		
		de.titus.form.Field = Field;
		
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
	});
})();
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
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Validation", function() {
		var Validation = function(aElement, aDataController, aExpressionResolver) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.expressionResolver = aExpressionResolver;
			this.data.state = false;
		};
		
		Validation.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Validation");
		
		Validation.prototype.doCheck = function(aValue) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("doCheck()");
			
			this.data.state = this.doValidate(aValue);
			
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("doCheck() -> " + this.data.state);
			return this.data.state;
		};
		
		Validation.prototype.doValidate = function(aValue) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("doValidate()");
			
			var validationAttr = de.titus.form.Setup.prefix + de.titus.form.Constants.ATTRIBUTE.VALIDATION;
			var validationElements = this.data.element.find("[" + validationAttr + "]");
			validationElements.removeClass("active");
			var data = {
			value : aValue,
			data : this.data.dataController.getData()
			};
			
			for (var i = 0; i < validationElements.length; i++) {
				var element = $(validationElements[i]);
				var validation = element.attr(validationAttr);
				if (validation != undefined && validation.trim() != "") {
					if (Validation.LOGGER.isDebugEnabled())
						Validation.LOGGER.logDebug("doCheck() -> expression: \"" + validation + "\"; data: \"" + JSON.stringify(data) + "\"");
					
					var result = false;
					var result = this.data.expressionResolver.resolveExpression(validation, data, false);
					if (typeof result === "function")
						result = result(data.value, data.data, this) || false;
					else
						result = result === true;
					
					if (Validation.LOGGER.isDebugEnabled())
						Validation.LOGGER.logDebug("doCheck() -> expression: \"" + validation + "\"; result: \"" + result + "\"");
					
					if (result) {
						element.addClass("active");
						return false;
					}
				}
			}
			
			return true;
		};
		
		de.titus.form.Validation = Validation;
	});
})();
(function() {
    "use strict";
    de.titus.core.Namespace.create("de.titus.form.DataController", function() {
	var DataController = function() {
	    if (DataController.LOGGER.isDebugEnabled())
		DataController.LOGGER.logDebug("constructor");

	    this.data = {};
	};

	DataController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataController");

	DataController.prototype.getData = function(aName) {
	    if (DataController.LOGGER.isDebugEnabled())
		DataController.LOGGER.logDebug("getData() -> aName: " + aName);

	    if (aName) {
		var names = aName.split(".");
		var data = this.data;
		for (var i = 0; i < (names.length - 1); i++) {
		    if (data[names[i]] != undefined) {
			data = data[names[i]];
		    }
		}
		return data;
	    } else
		return this.data;
	};

	DataController.prototype.changeValue = function(aName, aValue, aField) {
	    if (DataController.LOGGER.isDebugEnabled())
		DataController.LOGGER.logDebug("changeValue()");

	    var names = aName.split(".");
	    var data = this.data;
	    for (var i = 0; i < (names.length - 1); i++) {
		if (data[names[i]] == undefined) {
		    data[names[i]] = {};
		}
		data = data[names[i]];
	    }
	    data[names[names.length - 1]] = aValue;
	    
	    if (DataController.LOGGER.isDebugEnabled())
		DataController.LOGGER.logDebug("changeValue() -> data: " + JSON.stringify(this.data));
	};

	de.titus.form.DataController = DataController;
    });
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DataControllerProxy", function() {
		var DataControllerProxy = function(aChangeListener, aDataController) {
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("constructor");
			
			this.dataController = aDataController;
		};
		
		DataControllerProxy.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataControllerProxy");
		
		DataControllerProxy.prototype.getData = function(aName){
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("getData() -> aName: " + aName);
				
			return this.dataController.getData(aName);
		};
		
		DataControllerProxy.prototype.changeValue = function(aName, aValue, aField){
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("changeValue()");			
			
			this.dataController.changeValue(aName, aValue, aField);
		};	
		
		de.titus.form.DataControllerProxy = DataControllerProxy;
	});	
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Formular", function() {
		var Formular = function(aElement) {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix);
			this.data.pages = [];
			this.data.dataController = new de.titus.form.DataController();
			this.data.stepControl = undefined;
			this.data.currentPage = -1;
			this.data.state = de.titus.form.Constants.STATE.PAGES;
			this.expressionResolver = new de.titus.core.ExpressionResolver();
			this.init();
		};
		
		Formular.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Formular");
		
		Formular.prototype.init = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("init()");
			
			if (this.data.element.is("form"))
				this.data.element.on("submit", function(aEvent) {
					aEvent.preventDefault();
					aEvent.stopPropagation();
				});

			this.initAction();
			this.data.stepPanel = new de.titus.form.StepPanel(this);
			this.data.stepControl = new de.titus.form.StepControl(this);
			this.initEvents();
			this.initPages();
			
		};
		
		Formular.prototype.initAction = function() {
			var initAction = this.data.element.attr("data-form-init");
			if (initAction != undefined && initAction != "") {
				var data = this.expressionResolver.resolveExpression(initAction, this.data, undefined);
				if (typeof data === "function")
					data = data(this.data.element, this);
				
				if (typeof data === "object")
					this.data.dataController.data = data;
			}
		};
		
		Formular.prototype.initPages = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("initPages()");
			
			var pageElements = this.data.element.find("[" + de.titus.form.Setup.prefix + "-page" + "]");
			if (pageElements.length == 0) {
				var page = this.data.element.FormularPage(this.data.dataController, this.expressionResolver);
				page.data.number = 1;
				this.data.pages.push(page);
			} else {
				for (var i = 0; i < pageElements.length; i++) {
					var page = $(pageElements[i]).FormularPage(this.data.dataController);
					page.data.number = (i + 1);
					this.data.pages.push(page);
					page.hide();
				}
			}
			
			var page = de.titus.form.PageUtils.findNextPage(this.data.pages, -1);
			page.show();
			this.data.currentPage = page.data.number - 1;
			this.data.stepPanel.update();
			this.data.stepControl.update();
		};
		
		Formular.prototype.initEvents = function() {
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_ACTIVE, Formular.prototype.valueChanged.bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_INACTIVE, Formular.prototype.valueChanged.bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED, Formular.prototype.valueChanged.bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_VALID, Formular.prototype.valueChanged.bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_INVALID, Formular.prototype.valueChanged.bind(this));
		};
		
		Formular.prototype.valueChanged = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("valueChanged()");
			
			this.data.stepPanel.update();
			this.data.stepControl.update();
		};
		
		Formular.prototype.doValidate = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("doValidate()");
			
			for (var i = 0; i < this.data.pages.length; i++)
				if (this.data.pages[i].data.active && !this.data.pages[i].doValidate())
					return false;
			
			return true;
		};
		
		Formular.prototype.showSummary = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("showSummary()");
			
			for (var i = 0; i < this.data.pages.length; i++)
				if (this.data.pages[i].data.active)
					this.data.pages[i].showSummary();
			
			this.data.state = de.titus.form.Constants.STATE.SUMMARY;
			this.data.stepPanel.update();
			this.data.stepControl.update();
		};
		
		Formular.prototype.getCurrentPage = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("currentPage() -> current index: " + this.data.currentPage);
			
			return this.data.pages[this.data.currentPage];
		};
		
		Formular.prototype.prevPage = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("prevPage()");
			
			if (this.data.state == de.titus.form.Constants.STATE.SUBMITED)
				return;
			else if (this.data.state == de.titus.form.Constants.STATE.SUMMARY) {
				this.data.state = de.titus.form.Constants.STATE.PAGES;
				for (var i = 0; i < this.data.pages.length; i++)
					if (i != this.data.currentPage)
						this.data.pages[i].hide();
				
				this.data.pages[this.data.currentPage].show();
				
				this.data.stepPanel.update();
				this.data.stepControl.update();
				
			} else if (this.data.currentPage > 0) {
				this.data.pages[this.data.currentPage].hide();
				var page = de.titus.form.PageUtils.findPrevPage(this.data.pages, this.data.currentPage);
				this.data.currentPage = page.data.number - 1;
				this.data.pages[this.data.currentPage].show();
				this.data.state = de.titus.form.Constants.STATE.PAGES;
				this.data.stepPanel.update();
				this.data.stepControl.update();
			}
			
		};
		
		Formular.prototype.nextPage = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("nextPage()");
			
			if (this.data.currentPage < (this.data.pages.length - 1)) {
				if (!this.data.pages[this.data.currentPage].doValidate())
					return;
				
				var page = de.titus.form.PageUtils.findNextPage(this.data.pages, this.data.currentPage);
				if (page != undefined) {
					this.data.state = de.titus.form.Constants.STATE.PAGES;
					this.data.pages[this.data.currentPage].hide();
					this.data.currentPage = page.data.number - 1;
					this.data.pages[this.data.currentPage].show();
					this.data.stepPanel.update();
					this.data.stepControl.update();
					return;
				}
			} else {
				this.data.state = de.titus.form.Constants.STATE.SUMMARY;
				this.showSummary();
				this.data.stepPanel.update();
				this.data.stepControl.update();
			}
		};
		
		Formular.prototype.submit = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("submit()");
			
			this.data.state = de.titus.form.Constants.STATE.SUBMITED;
			this.data.stepPanel.update();
			this.data.stepControl.update();
			var data = this.data.dataController.getData();
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("submit() -> data: " + JSON.stringify(data));
			
			var action = this.data.element.attr("data-form-submit");
			if (action != undefined && action != "") {
				if (Formular.LOGGER.isDebugEnabled())
					Formular.LOGGER.logDebug("submit() -> use a submit action!");
				var data = this.expressionResolver.resolveExpression(action, data, undefined);
				if (typeof data === "function")
					data(form);
			} else {
				if (Formular.LOGGER.isDebugEnabled())
					Formular.LOGGER.logDebug("submit() -> use a default ajax!");
				
				var action = this.data.element.attr("action");
				var method = this.data.element.attr("method") || "post";
				var contentType = this.data.element.attr("enctype") || "application/json";
				
				var request = {
				"url" : action,
				"type" : method,
				"contentType" : contentType,
				"data" : contentType == "application/json" ? JSON.stringify(data) : data
				};
				// TODO Response processing
				$.ajax(request);
			}
		};
		
		de.titus.form.Formular = Formular;
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
			var data = this.data("Formular");
			if (data == undefined) {
				data = new de.titus.form.Formular(this);
				this.data("Formular", data);
			}
			return data;
		}
	};
	
	$(document).ready(function() {
		$('[data-form]').Formular();
	});
})($);
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
			this.data.dataController = aDataController;
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
			
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED, Page.prototype.valueChangeListener.bind(this));
			this.initFields(this.data.element);
		};
		
		Page.prototype.valueChangeListener = function(aEvent) {
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
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.PageUtils", function() {
		var PageUtils = {};		
		PageUtils.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.PageUtils");
		
		PageUtils.findPrevPage = function(thePages, aCurrentIndex){
			if(PageUtils.LOGGER.isDebugEnabled())
				PageUtils.LOGGER.logDebug("findPrevPage() -> aCurrentIndex: " + aCurrentIndex);
			
			for(var i = (aCurrentIndex - 1); i >= 0; i--){
				PageUtils.LOGGER.logDebug(i);
				var page = thePages[i];
				if(page.checkCondition())
					return page;
			}
			
			throw "Can't evaluate a previous page!";
		}
		
		PageUtils.findNextPage = function(thePages, aCurrentIndex){
			if(PageUtils.LOGGER.isDebugEnabled())
				PageUtils.LOGGER.logDebug("findNextPage() -> aCurrentIndex: " + aCurrentIndex );
			
			for(var i = (aCurrentIndex + 1); i < thePages.length; i++){
				PageUtils.LOGGER.logDebug(i);
				var page = thePages[i];
				if(page.checkCondition())
					return page;
			}
			
			throw "Can't evaluate a next page!";
		}
		de.titus.form.PageUtils = PageUtils;
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.StepControl", function() {
		var StepControl = function(aForm) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aForm.data.element.find("[" + de.titus.form.Setup.prefix + "-step-control" + "]");
			this.data.stepControlBack = undefined;
			this.data.stepControlNext = undefined;
			this.data.stepControlSummary = undefined;
			this.data.stepControlSubmit = undefined;
			this.data.form = aForm;
			this.init();
		};
		
		StepControl.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.StepControl");
		
		StepControl.prototype.init = function() {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("init()");
			
			this.data.stepControlBack = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-back" + "]");
			this.data.stepControlBack.hide();
			this.data.stepControlBack.on("click", StepControl.prototype.__StepBackHandle.bind(this));
			
			this.data.stepControlNext = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-next" + "]");
			this.data.stepControlNext.on("click", StepControl.prototype.__StepNextHandle.bind(this));
			
			this.data.stepControlSummary = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-summary" + "]");
			this.data.stepControlSummary.hide();
			this.data.stepControlSummary.on("click", StepControl.prototype.__StepSummaryHandle.bind(this));
			
			this.data.stepControlSubmit = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-submit" + "]");
			this.data.stepControlSubmit.hide();
			this.data.stepControlSubmit.on("click", StepControl.prototype.__StepSubmitHandle.bind(this));
		};
		
		StepControl.prototype.update = function() {
			if (this.data.form.data.state == de.titus.form.Constants.STATE.SUBMITED) {
				this.data.element.hide();
				return;
			} else {
							
				if ((this.data.form.data.pages.length - 1) > this.data.form.data.currentPage) {
					var page = this.data.form.getCurrentPage();
					if (page && page.doValidate())
						this.data.stepControlNext.show();
					else
						this.data.stepControlNext.hide();
					
					this.data.stepControlSummary.hide();
					this.data.stepControlSubmit.hide();
				} else if (this.data.form.data.state == de.titus.form.Constants.STATE.PAGES) {
					var page = this.data.form.getCurrentPage();
					this.data.stepControlNext.hide();
					if (page && page.doValidate())
						this.data.stepControlSummary.show();
					else
						this.data.stepControlSummary.hide();
					this.data.stepControlSubmit.hide();
				} else if (this.data.form.data.state == de.titus.form.Constants.STATE.SUMMARY) {
					this.data.stepControlNext.hide();
					this.data.stepControlSummary.hide();
					if(this.data.form.doValidate())
						this.data.stepControlSubmit.show();
					else
						this.data.stepControlSubmit.hide();
				}
			}
			
			if (this.data.form.data.currentPage > 0)
				this.data.stepControlBack.show();
			else
				this.data.stepControlBack.hide();
		};
		
		StepControl.prototype.__StepBackHandle = function(aEvent) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("__StepBackHandle()");
			
			if (this.data.form.data.currentPage > 0) {
				this.data.form.prevPage();
			}
		};
		
		StepControl.prototype.__StepNextHandle = function(aEvent) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("__StepNextHandle()");
			
			if ((this.data.form.data.pages.length - 1) > this.data.form.data.currentPage) {
				this.data.form.nextPage();
			}
		};
		
		StepControl.prototype.__StepSummaryHandle = function(aEvent) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("__StepSummaryHandle()");
			
			this.data.form.showSummary();
		};
		
		StepControl.prototype.__StepSubmitHandle = function(aEvent) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("__StepSubmitHandle()");
			
			this.data.form.submit();
		};
		
		de.titus.form.StepControl = StepControl;
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.StepPanel", function() {
		var StepPanel = function(aForm) {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aForm.data.element.find("[" + de.titus.form.Setup.prefix + "-step-panel" + "]");
			this.data.stepPanel = undefined;
			this.data.stepPanelSummaryState = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step='" + de.titus.form.Constants.STATE.SUMMARY + "']");
			this.data.stepPanelSubmitedState = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step='" + de.titus.form.Constants.STATE.SUBMITED + "']");
			this.data.form = aForm;
			this.init();
		};
		
		StepPanel.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.StepPanel");
		
		StepPanel.prototype.init = function() {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("init()");
			
		};
		
		StepPanel.prototype.update = function() {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("update()");
			this.data.element.find(".active").removeClass("active")

			if (this.data.form.data.state == de.titus.form.Constants.STATE.SUMMARY && this.data.stepPanelSummaryState != undefined)
				this.data.stepPanelSummaryState.addClass("active");
			else if (this.data.form.data.state == de.titus.form.Constants.STATE.SUBMITED && this.data.stepPanelSubmitedState != undefined)
				this.data.stepPanelSubmitedState.addClass("active");
			else {
				var page = this.data.form.getCurrentPage();
				if (page)
					this.data.element.find("[" + de.titus.form.Setup.prefix + "-step='" + page.data.step + "']").addClass("active");
			}
		};
		
		de.titus.form.StepPanel = StepPanel;
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.ContainerFieldController", function() {
		de.titus.form.ContainerFieldController = function(aElement, aFieldname, aValueChangeListener) {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			this.fieldname = aFieldname;
			this.valueChangeListener = aValueChangeListener;
			this.input = undefined;
			this.type = undefined;
			this.filedata = undefined;
			this.timeoutId == undefined;
			
			this.init();
		};
		de.titus.form.ContainerFieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.ContainerFieldController");
		
		de.titus.form.ContainerFieldController.prototype.init = function() {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("init()");
			
		};		

		de.titus.form.ContainerFieldController.prototype.showField = function(aData) {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("showField()");
			
			this.element.show();
		};
		
		de.titus.form.ContainerFieldController.prototype.showSummary = function() {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("showSummary()");
						
		};
		
		de.titus.form.ContainerFieldController.prototype.hideField = function() {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("hideField()");
			
			this.element.hide()
		};
		
		de.titus.form.ContainerFieldController.prototype.getValue = function() {
			
		};
		
		de.titus.form.Registry.registFieldController("container", function(aElement, aFieldname, aValueChangeListener) {
			return new de.titus.form.ContainerFieldController(aElement, aFieldname, aValueChangeListener);
		});
	});
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DefaultFieldController", function() {
		var DefaultFieldController = function(aElement) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			this.input = undefined;
			this.type = undefined;
			this.filedata = undefined;
			this.timeoutId == undefined;
			this.init();
		};
		DefaultFieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DefaultFieldController");
		
		DefaultFieldController.prototype.valueChanged = function(aEvent) {
			aEvent.preventDefault();
			this.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
		};
		
		DefaultFieldController.prototype.init = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("init()");
			
			if (this.element.find("select").length == 1) {
				this.type = "select";
				this.element.find("select").on("change", DefaultFieldController.prototype.valueChanged.bind(this));
			} else {
				if (this.element.find("input[type='radio']").length > 0) {
					this.type = "radio";
					this.element.find("input[type='radio']").on("change", DefaultFieldController.prototype.valueChanged.bind(this));
				}
				if (this.element.find("input[type='checkbox']").length > 0) {
					this.type = "checkbox";
					this.element.find("input[type='checkbox']").on("change", DefaultFieldController.prototype.valueChanged.bind(this));
				} else if (this.element.find("input[type='file']").length == 1) {
					this.type = "file";
					this.element.find("input[type='file']").on("change", DefaultFieldController.prototype.readFileData.bind(this));
				} else {
					this.type = "text";
					this.element.find("input, textarea").on("keyup change", (function(aEvent) {
						if (this.timeoutId != undefined) {
							window.clearTimeout(this.timeoutId);
						}
						
						this.timeoutId = window.setTimeout((function() {
							this.valueChanged(aEvent);
						}).bind(this), 300);
						
					}).bind(this));
				}
				
			}
			
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("init() -> detect type: " + this.type);
		};
		
		DefaultFieldController.prototype.readFileData = function(aEvent) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("readFileData()");
			
			var input = aEvent.target;
			var multiple = input.files.length > 1;
			if (multiple)
				this.fileData = [];
			else
				this.fileData = undefined;
			
			var $__THIS__$ = this;
			var reader = new FileReader();
			var count = input.files.length;
			reader.addEventListener("load", function() {
				if (DefaultFieldController.LOGGER.isDebugEnabled())
					DefaultFieldController.LOGGER.logDebug("readFileData() -> reader load event!");
				
				count--;
				if (multiple)
					$__THIS__$.fileData.push(reader.result);
				else
					$__THIS__$.fileData = reader.result;
				
				if (count == 0)
					$__THIS__$.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
			}, false);
			
			var textField = this.element.find("input[type='text'][readonly]");
			if (textField.length == 1)
				textField.val("");
			for (var i = 0; i < input.files.length; i++) {
				reader.readAsDataURL(input.files[i]);
				if (textField.length == 1)
					textField.val(textField.val() != "" ? textField.val() + ", " + input.files[i].name : input.files[i].name);
			}
		};
		
		DefaultFieldController.prototype.showField = function(aValue, aData) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("showField()");
			
			if (this.type == "select")
				this.element.find("select").prop("disabled", false);
			else
				this.element.find("input, textarea").prop("disabled", false);
			this.element.show();
		};
		
		DefaultFieldController.prototype.showSummary = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("showSummary()");
			
			if (this.type == "select")
				this.element.find("select").prop("disabled", true);
			else
				this.element.find("input, textarea").prop("disabled", true);
			
		};
		
		DefaultFieldController.prototype.hideField = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("hideField()");
			
			this.element.hide()
		};
		
		DefaultFieldController.prototype.getValue = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("getValue()");
			
			if (this.type == "select")
				return this.element.find("select").val();
			else if (this.type == "radio")
				return this.element.find("input:checked").val();
			else if (this.type == "checkbox") {
				var result = [];
				this.element.find("input:checked").each(function() {
					result.push($(this).val());
				});
				return result;
			} else if (this.type == "file")
				return this.fileData;
			else
				return this.element.find("input, textarea").first().val();
		};
		
		de.titus.form.Registry.registFieldController("default", function(aElement, aFieldname, aValueChangeListener) {
			return new DefaultFieldController(aElement, aFieldname, aValueChangeListener);
		});
		
		de.titus.form.DefaultFieldController = DefaultFieldController;
	});
})();
(function() {
	de.titus.core.Namespace.create("template.FieldController", function() {
		template.FieldController = function(aElement) {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			/*
			 * Every time if your field make a value change trigger the
			 * following jquery event on this.element:
			 * 
			 * this.element.tigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
			 */

		};
		template.FieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("template.FieldController");
		
		template.FieldController.prototype.showField = function(aValue, aData) {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("showField()");
			
			/*
			 * make your field visible aValue -> a Preseted value aData -> the
			 * data object from all of the formular
			 * 
			 * This function would be called every time, if your field need to display
			 */

			this.element.show();
		};
		
		template.FieldController.prototype.hideField = function() {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("hideField()");
			
			// hide this field
			
			this.element.hide()
		};
		
		template.FieldController.prototype.showSummary = function() {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("showSummary() -> isSummary: " + isSummery);
			
			// show your field as summary
		};
		
		template.FieldController.prototype.getValue = function() {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("getValue() -> " + JSON.stringify(this.employee));
			
			// return field value
			
			return "[value]";
		};
		
		de.titus.form.Registry.registFieldController("[my-costum-field-type]", function(aElement, aFieldname, aValueChangeListener) {
			// registrate field type + function to create the field controller
			return new template.FieldController(aElement, aFieldname, aValueChangeListener);
		});
		
	});
})($);
