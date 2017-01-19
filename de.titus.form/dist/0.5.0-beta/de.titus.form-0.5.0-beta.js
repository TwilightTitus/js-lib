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
		
		de.titus.form.Constants.ATTRIBUTE ={
				VALIDATION : "-validation",
				VALIDATION_FAIL_ACTION : "-validation-fail-action",
				CONDITION : "-condition"
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
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Field", function() {
		de.titus.form.Field = function(aElement, aDataController, aExpressionResolver) {
			if(de.titus.form.Field.LOGGER.isDebugEnabled())
				de.titus.form.Field.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix + "-field");
			this.data.type = aElement.attr(de.titus.form.Setup.prefix + "-field-type");
			this.data.expressionResolver = aExpressionResolver || new de.titus.core.ExpressionResolver();
			this.data.conditionHandle = new de.titus.form.Condition(this.data.element,this.data.dataController,this.data.expressionResolver); 
			this.data.validationHandle = new de.titus.form.Validation(this.data.element,this.data.dataController,this.data.expressionResolver);
			this.data.active = undefined;
			this.data.valid = false;
			
			this.init();
		};
	});
	
	de.titus.form.Field.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Field");
	
	de.titus.form.Field.prototype.init = function() {
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("init()");
		

		var initializeFunction = de.titus.form.Setup.fieldtypes[this.data.type] || de.titus.form.Setup.fieldtypes["default"];
		if (initializeFunction == undefined || typeof initializeFunction !== "function")
			throw "The fieldtype \"" + this.data.type + "\" is not available!";
		
		this.fieldController = initializeFunction(this.data.element, this.data.name, de.titus.form.Field.prototype.doValueChange.bind(this));		
		this.doValidate(this.fieldController.getValue());
	};
	
	de.titus.form.Field.prototype.doConditionCheck = function() {
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("doConditionCheck()");
		
		var activ = this.data.conditionHandle.doCheck();
		if (this.data.active != activ && activ)
			this.fieldController.showField(this.data.dataController.data);
		else if (this.data.active != activ &&  !activ)
			this.setInactiv();
		else{
			//No Change
		}
		
		this.data.active = activ;
		
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("doConditionCheck() -> result: " + this.data.active);
		
		if(this.data.active){
			this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);
			this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
			this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);
		}
		else{
			this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
			this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);
			this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
		}
		
		return this.data.active;
	};
	
	de.titus.form.Field.prototype.setInactiv = function() {
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("setInactiv()");
		this.data.dataController.changeValue(this.data.name, null, this);
		this.fieldController.hideField();
	};
	
	de.titus.form.Field.prototype.showSummary = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("showSummary()");
		
		if(!this.data.active)
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
			this.data.dataController.changeValue(this.data.name, value, this);
		else
			this.data.dataController.changeValue(this.data.name, undefined, this);
		
		this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
	};
	
	de.titus.form.Field.prototype.doValidate = function(aValue) {
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("doValidate() -> field: " + this.data.name);		
		
		this.data.valid = this.data.validationHandle.doCheck(aValue);		
		this.fieldController.setValid(this.data.valid, "");
		
		if(this.data.valid){
			this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALID);
			this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_INVALID);
			this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_VALID);
		}
		else{
			this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_INVALID);
			this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_VALID);
			this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_INVALID);
		}
		
		
		if(de.titus.form.Field.LOGGER.isDebugEnabled())
			de.titus.form.Field.LOGGER.logDebug("doValidate() -> field: " + this.data.name + " - result: " + this.data.valid);
		
		return this.data.valid;
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
	de.titus.core.Namespace.create("de.titus.form.Validation", function() {
		de.titus.form.Validation = function(aElement, aDataController, aExpressionResolver) {
			if(de.titus.form.Validation.LOGGER.isDebugEnabled())
				de.titus.form.Validation.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.expressionResolver = aExpressionResolver;
			this.data.state = false;
		};
		
		de.titus.form.Validation.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Validation");
		
		de.titus.form.Validation.prototype.doCheck = function(aValue) {
			if(de.titus.form.Validation.LOGGER.isDebugEnabled())
				de.titus.form.Validation.LOGGER.logDebug("doCheck()");
			
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
					if(de.titus.form.Validation.LOGGER.isDebugEnabled())
						de.titus.form.Validation.LOGGER.logDebug("doCheck() -> expression: " + validation);
					
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
			
			if(de.titus.form.Validation.LOGGER.isDebugEnabled())
				de.titus.form.Validation.LOGGER.logDebug("doCheck() -> result: " + this.data.state);
					
			return this.data.state;					
		};		
	});	
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DataController", function() {
		de.titus.form.DataController = function(aChangeListener) {
			if(de.titus.form.DataController.LOGGER.isDebugEnabled())
				de.titus.form.DataController.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.changeListener = aChangeListener;
		};
		
		de.titus.form.DataController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataController");
		
		de.titus.form.DataController.prototype.getData = function(){
			if(de.titus.form.DataController.LOGGER.isDebugEnabled())
				de.titus.form.DataController.LOGGER.logDebug("getData()");
			return this.data;
		};
		
		de.titus.form.DataController.prototype.changeValue = function(aName, aValue, aField, aCallback){
			if(de.titus.form.DataController.LOGGER.isDebugEnabled())
				de.titus.form.DataController.LOGGER.logDebug("changeValue()");
			
			if(aValue != this.data[aName] ){
				this.data[aName] = aValue;
			
				if(de.titus.form.DataController.LOGGER.isDebugEnabled())
					de.titus.form.DataController.LOGGER.logDebug("changeValue() -> new data: " + JSON.stringify(this.data));
			
				this.changeListener(aName, aValue, aField);
				if(aCallback != undefined)
					aCallback(aName, aValue, aField);
			}
			
		};				
	});	
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("DataControllerProxy", function() {
		DataControllerProxy = function(aChangeListener, aDataController) {
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("constructor");
			
			this.dataController = aDataController;
			this.changeListener = aChangeListener;
		};
		
		DataControllerProxy.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("DataControllerProxy");
		
		DataControllerProxy.prototype.getData = function(){
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("getData()");
				
			return this.dataController.getData();
		};
		
		DataControllerProxy.prototype.changeValue = function(aName, aValue, aField){
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("changeValue()");			
			
			this.dataController.changeValue(aName, aValue, aField, this.changeListener);
		};	
		
		de.titus.form.DataControllerProxy = DataControllerProxy;
	});	
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("Formular", function() {
		Formular = function(aElement) {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix);
			this.data.pages = [];
			this.data.dataController = new de.titus.form.DataController(Formular.prototype.valueChanged.bind(this));
			this.data.stepControl = undefined;
			this.data.currentPage = -1;
			this.data.state = de.titus.form.Constants.STATE.PAGES;
			this.expressionResolver = new de.titus.core.ExpressionResolver();
			this.init();
		};
		
		Formular.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("Formular");
		
		Formular.prototype.init = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("init()");
				
			if(this.data.element.is("form"))
				this.data.element.on("submit", function(aEvent){ aEvent.preventDefault(); aEvent.stopPropagation();});
					
			this.initAction();
			this.data.stepPanel = new de.titus.form.StepPanel(this);
			this.data.stepControl = new de.titus.form.StepControl(this);
			this.initPages();
			
		};
		
		Formular.prototype.initAction = function() {
			var initAction = this.data.element.attr("data-form-init");
			if(initAction != undefined && initAction != ""){
				var data = this.expressionResolver.resolveExpression(initAction, this.data, undefined);
				if(typeof data === "function")
					data = data(this.data.element, this);
				
				if(typeof data === "object")				
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
				page.show();
			} else {
				for (var i = 0; i < pageElements.length; i++) {
					var page = $(pageElements[i]).FormularPage(this.data.dataController);
					page.data.number = (i + 1);
					this.data.pages.push(page);
					if (i > 0)
						page.hide();
					else
						page.show();
				}
			}
			
			var page = de.titus.form.PageUtils.findNextPage(this.data.pages, -1);
			this.data.currentPage = page.data.number - 1;
			this.data.stepPanel.update();
			this.data.stepControl.update();
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
					if(i != this.data.currentPage)
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
				if(!this.data.pages[this.data.currentPage].doValidate())
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
			}else{			
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
			if(action != undefined && action != ""){
				if (Formular.LOGGER.isDebugEnabled())
					Formular.LOGGER.logDebug("submit() -> use a submit action!"); 
				var data = this.expressionResolver.resolveExpression(action, data, undefined);
				if(typeof data === "function")
					data(form);
			}else{
				if (Formular.LOGGER.isDebugEnabled())
					Formular.LOGGER.logDebug("submit() -> use a default ajax!");
				
				var action = this.data.element.attr("action");
				var method = this.data.element.attr("method") || "post";
				var contentType = this.data.element.attr("enctype") || "application/json";
				
				var request = {
					"url" : action,
					"type": method,
					"contentType": contentType,
					"data": contentType == "application/json"? JSON.stringify(data): data
				};
				//TODO Response processing
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
		de.titus.form.Page = function(aElement, aDataController, aExpressionResolver) {
			if(de.titus.form.Page.LOGGER.isDebugEnabled())
				de.titus.form.Page.LOGGER.logDebug("constructor");
			this.data = {};
			this.data.number = undefined;
			this.data.element = aElement;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix + "-page");
			this.data.step = aElement.attr(de.titus.form.Setup.prefix + "-step");
			this.data.expressionResolver = aExpressionResolver || new de.titus.core.ExpressionResolver();
			this.data.formDataController = aDataController;
			this.data.dataController = new de.titus.form.DataControllerProxy(de.titus.form.Page.prototype.valueChangeListener.bind(this), this.data.formDataController);
			this.data.conditionHandle = new de.titus.form.Condition(this.data.element,this.data.dataController,this.data.expressionResolver);
			this.data.fieldMap = {};
			this.data.fields = [];
			this.data.active = false;
			
			this.init();
		};
		
		de.titus.form.Page.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Page");
		
		de.titus.form.Page.prototype.init = function() {
			if(de.titus.form.Page.LOGGER.isDebugEnabled())
				de.titus.form.Page.LOGGER.logDebug("init()");
			this.initFields(this.data.element);
		};
		
		de.titus.form.Page.prototype.valueChangeListener = function(aName, aValue, aField) {
			this.data.formDataController.changeValue(aName, aValue, aField);
			for(var i = 0; i < this.data.fields.length; i++)
				this.data.fields[i].doConditionCheck();
		};
		

		de.titus.form.Page.prototype.initFields = function(aElement) {
			if(de.titus.form.Page.LOGGER.isDebugEnabled())
				de.titus.form.Page.LOGGER.logDebug("initFields()");
			
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
		
		
		de.titus.form.Page.prototype.checkCondition = function(){
			if(de.titus.form.Page.LOGGER.isDebugEnabled())
				de.titus.form.Page.LOGGER.logDebug("checkCondition()");
			
			this.data.active = this.data.conditionHandle.doCheck();
			if(!this.data.active)
				for(var i = 0; i < this.data.fields.length; i++)
					this.data.fields[i].setInactiv();
			
			return this.data.active;
		};		
		
		de.titus.form.Page.prototype.show = function(){
			if(de.titus.form.Page.LOGGER.isDebugEnabled())
				de.titus.form.Page.LOGGER.logDebug("show()");
			
			for(var i = 0; i < this.data.fields.length; i++)
				this.data.fields[i].doConditionCheck();
			
			this.data.element.show();
		};
		
		de.titus.form.Page.prototype.hide = function(){
			if(de.titus.form.Page.LOGGER.isDebugEnabled())
				de.titus.form.Page.LOGGER.logDebug("hide()");
			
			this.data.element.hide();
		};
		
		de.titus.form.Page.prototype.showSummary = function(){
			if(de.titus.form.Page.LOGGER.isDebugEnabled())
				de.titus.form.Page.LOGGER.logDebug("showSummary()");
			
			if(!this.data.active)
				return;
			
			this.show();
			for(var i = 0; i < this.data.fields.length; i++)
				if(this.data.fields[i].data.active)
					this.data.fields[i].showSummary();
		};
		
		de.titus.form.Page.prototype.doValidate = function(){
			if(de.titus.form.Page.LOGGER.isDebugEnabled())
				de.titus.form.Page.LOGGER.logDebug("doValidate()");
			
			for(var i = 0; i < this.data.fields.length; i++)
				if(this.data.fields[i].data.active && !this.data.fields[i].data.valid)
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
	de.titus.core.Namespace.create("de.titus.form.PageUtils", function() {
		de.titus.form.PageUtils.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.PageUtils");
		
		de.titus.form.PageUtils.findPrevPage = function(thePages, aCurrentIndex){
			if(de.titus.form.PageUtils.LOGGER.isDebugEnabled())
				de.titus.form.PageUtils.LOGGER.logDebug("findPrevPage() -> aCurrentIndex: " + aCurrentIndex);
			
			for(var i = (aCurrentIndex - 1); i >= 0; i--){
				de.titus.form.PageUtils.LOGGER.logDebug(i);
				var page = thePages[i];
				if(page.checkCondition())
					return page;
			}
			
			throw "Can't evaluate a previous page!";
		}
		
		de.titus.form.PageUtils.findNextPage = function(thePages, aCurrentIndex){
			if(de.titus.form.PageUtils.LOGGER.isDebugEnabled())
				de.titus.form.PageUtils.LOGGER.logDebug("findNextPage() -> aCurrentIndex: " + aCurrentIndex );
			
			for(var i = (aCurrentIndex + 1); i < thePages.length; i++){
				de.titus.form.PageUtils.LOGGER.logDebug(i);
				var page = thePages[i];
				if(page.checkCondition())
					return page;
			}
			
			throw "Can't evaluate a next page!";
		}
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.StepControl", function() {
		de.titus.form.StepControl = function(aForm) {
			if (de.titus.form.StepControl.LOGGER.isDebugEnabled())
				de.titus.form.StepControl.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aForm.data.element.find("[" + de.titus.form.Setup.prefix + "-step-control" + "]");
			this.data.stepControlBack = undefined;
			this.data.stepControlNext = undefined;
			this.data.stepControlSummary = undefined;
			this.data.stepControlSubmit = undefined;
			this.data.form = aForm;
			this.init();
		};
		
		de.titus.form.StepControl.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.StepControl");
		
		de.titus.form.StepControl.prototype.init = function() {
			if (de.titus.form.StepControl.LOGGER.isDebugEnabled())
				de.titus.form.StepControl.LOGGER.logDebug("init()");
			
			this.data.stepControlBack = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-back" + "]");
			this.data.stepControlBack.hide();
			this.data.stepControlBack.on("click", de.titus.form.StepControl.prototype.__StepBackHandle.bind(this));
			
			this.data.stepControlNext = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-next" + "]");
			this.data.stepControlNext.on("click", de.titus.form.StepControl.prototype.__StepNextHandle.bind(this));
			
			this.data.stepControlSummary = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-summary" + "]");
			this.data.stepControlSummary.hide();
			this.data.stepControlSummary.on("click", de.titus.form.StepControl.prototype.__StepSummaryHandle.bind(this));
			
			this.data.stepControlSubmit = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-submit" + "]");
			this.data.stepControlSubmit.hide();
			this.data.stepControlSubmit.on("click", de.titus.form.StepControl.prototype.__StepSubmitHandle.bind(this));
		};
		
		de.titus.form.StepControl.prototype.update = function() {
			if (this.data.form.data.state == de.titus.form.Constants.STATE.SUBMITED) {
				this.data.element.hide();
				return;
			} else {
				if ((this.data.form.data.pages.length - 1) > this.data.form.data.currentPage) {
					if (this.data.form.getCurrentPage().doValidate())
						this.data.stepControlNext.show();
					else
						this.data.stepControlNext.hide();
					
					this.data.stepControlSummary.hide();
					this.data.stepControlSubmit.hide();
				} else if (this.data.form.data.state == de.titus.form.Constants.STATE.PAGES) {
					this.data.stepControlNext.hide();
					if (this.data.form.getCurrentPage().doValidate())
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
		
		de.titus.form.StepControl.prototype.__StepBackHandle = function(aEvent) {
			if (de.titus.form.StepControl.LOGGER.isDebugEnabled())
				de.titus.form.StepControl.LOGGER.logDebug("__StepBackHandle()");
			
			if (this.data.form.data.currentPage > 0) {
				this.data.form.prevPage();
			}
		};
		
		de.titus.form.StepControl.prototype.__StepNextHandle = function(aEvent) {
			if (de.titus.form.StepControl.LOGGER.isDebugEnabled())
				de.titus.form.StepControl.LOGGER.logDebug("__StepNextHandle()");
			
			if ((this.data.form.data.pages.length - 1) > this.data.form.data.currentPage) {
				this.data.form.nextPage();
			}
		};
		
		de.titus.form.StepControl.prototype.__StepSummaryHandle = function(aEvent) {
			if (de.titus.form.StepControl.LOGGER.isDebugEnabled())
				de.titus.form.StepControl.LOGGER.logDebug("__StepSummaryHandle()");
			
			this.data.form.showSummary();
		};
		
		de.titus.form.StepControl.prototype.__StepSubmitHandle = function(aEvent) {
			if (de.titus.form.StepControl.LOGGER.isDebugEnabled())
				de.titus.form.StepControl.LOGGER.logDebug("__StepSubmitHandle()");
			
			this.data.form.submit();
		};
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.StepPanel", function() {
		de.titus.form.StepPanel = function(aForm) {
			if (de.titus.form.StepPanel.LOGGER.isDebugEnabled())
				de.titus.form.StepPanel.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aForm.data.element.find("[" + de.titus.form.Setup.prefix + "-step-panel" + "]");
			this.data.stepPanel = undefined;
			this.data.stepPanelSummaryState = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step='" + de.titus.form.Constants.STATE.SUMMARY + "']");
			this.data.stepPanelSubmitedState = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step='" + de.titus.form.Constants.STATE.SUBMITED + "']");
			this.data.form = aForm;
			this.init();
		};
		
		de.titus.form.StepPanel.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.StepPanel");
		
		de.titus.form.StepPanel.prototype.init = function() {
			if (de.titus.form.StepPanel.LOGGER.isDebugEnabled())
				de.titus.form.StepPanel.LOGGER.logDebug("init()");
			
		};
		
		de.titus.form.StepPanel.prototype.update = function() {
			if (de.titus.form.StepPanel.LOGGER.isDebugEnabled())
				de.titus.form.StepPanel.LOGGER.logDebug("update()");
			this.data.element.find(".active").removeClass("active")

			if (this.data.form.data.state == de.titus.form.Constants.STATE.SUMMARY && this.data.stepPanelSummaryState != undefined) 
				this.data.stepPanelSummaryState.addClass("active");
			 else if (this.data.form.data.state == de.titus.form.Constants.STATE.SUBMITED && this.data.stepPanelSubmitedState != undefined)
				this.data.stepPanelSubmitedState.addClass("active");
			 else
				this.data.element.find("[" + de.titus.form.Setup.prefix + "-step='" + this.data.form.getCurrentPage().data.step + "']").addClass("active");
		};
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
		
		de.titus.form.ContainerFieldController.prototype.setValid = function(isValid, aMessage) {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("setValid() -> " + isValid + " - \"" + aMessage + "\"");
			
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
	de.titus.core.Namespace.create("DefaultFieldController", function() {
		DefaultFieldController = function(aElement, aFieldname, aValueChangeListener) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			this.fieldname = aFieldname;
			this.valueChangeListener = aValueChangeListener;
			this.input = undefined;
			this.type = undefined;
			this.filedata = undefined;
			this.timeoutId == undefined;
			
			this.init();
		};
		DefaultFieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("DefaultFieldController");
		
		DefaultFieldController.prototype.init = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("init()");
			
			if (this.element.find("select").length == 1) {
				this.type = "select";
				this.element.find("select").on("change", this.valueChangeListener);
			} else {
				if (this.element.find("input[type='radio']").length > 0){
					this.type = "radio";
					this.element.find("input[type='radio']").on("change", this.valueChangeListener);
				}
				if (this.element.find("input[type='checkbox']").length > 0){
					this.type = "checkbox";
					this.element.find("input[type='checkbox']").on("change", this.valueChangeListener);
				}
				else if (this.element.find("input[type='file']").length == 1){
					this.type = "file";
					this.element.find("input[type='file']").on("change", DefaultFieldController.prototype.readFileData.bind(this));
				}
				else{
					this.type = "text";
					this.element.find("input, textarea").on("keyup change", (function(aEvent){
						if(this.timeoutId != undefined){
							window.clearTimeout(this.timeoutId);
						}
						
						this.timeoutId = window.setTimeout((function(){
							this.valueChangeListener(aEvent);
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
				
				if(count == 0)
					$__THIS__$.valueChangeListener(aEvent);
			}, false);
			
			var textField = this.element.find("input[type='text'][readonly]");
			if(textField.length == 1)
				textField.val("");
			for (var i = 0; i < input.files.length; i++){
				reader.readAsDataURL(input.files[i]);
				if(textField.length == 1)
					textField.val(textField.val() != "" ? textField.val() + ", " + input.files[i].name : input.files[i].name);				
			}
			
			
			
			
		};

		DefaultFieldController.prototype.showField = function(aData) {
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
		
		DefaultFieldController.prototype.setValid = function(isValid, aMessage) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("setValid() -> " + isValid + " - \"" + aMessage + "\"");
			
		};
		
		DefaultFieldController.prototype.getValue = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("getValue()");
			
			if (this.type == "select")
				return this.element.find("select").val();
			else if (this.type == "radio")
				return this.element.find("input:checked").val();
			else if (this.type == "checkbox"){
				var result = [];
				this.element.find("input:checked").each(function(){result.push($(this).val());});
				return result;
			}
			else if (this.type == "file")
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
