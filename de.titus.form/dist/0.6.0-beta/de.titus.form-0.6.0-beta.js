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
			fieldtypes : {}
		};
	});	
})();(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Constants", function() {
		de.titus.form.Constants.TYPES = {
		    PAGE : "page",
		    SUMMARY_PAGE : "summary-page",
		    SUBMITTED_PAGE : "submitted-page"
		};
		
		de.titus.form.Constants.EVENTS = {
		    INITIALIZED : "form-initialized",
		    SUCCESSED : "form-successed",
		    FAILED : "form-failed",
		    STATE_CHANGED : "form-state-changed",
		    
		    ACTION_RESET : "form-action-reset",
		    ACTION_SUBMIT : "form-action-submit",
		    ACTION_PAGE_BACK : "form-action-page-back",
		    ACTION_PAGE_NEXT : "form-action-page-next",
		    ACTION_SUMMARY : "form-action-page-summary",
		    
		    PAGE_INITIALIZED : "form-page-initialized",
		    PAGE_CHANGED : "form-page-changed",
		    PAGE_SHOW : "form-page-show",
		    PAGE_HIDE : "form-page-hide",
		    PAGE_SUMMARY : "form-page-summary",
		    
		    FIELD_SHOW : "form-field-show",
		    FIELD_HIDE : "form-field-hide",
		    FIELD_SUMMARY : "form-field-SUMMARY",
		    FIELD_VALUE_CHANGED : "form-field-value-changed",
		    
		    VALIDATION_STATE_CHANGED : "form-validation-state-changed",
		    VALIDATION_VALID : "form-validation-valid",
		    VALIDATION_INVALID : "form-validation-invalid",
		    
		    CONDITION_STATE_CHANGED : "form-condition-state-changed",
		    CONDITION_MET : "form-condition-met",
		    CONDITION_NOT_MET : "form-condition-not-met"
		};
		
		de.titus.form.Constants.STATE = {
		    INPUT : "form-state-input",
		    SUMMARY : "form-state-summary",
		    SUBMITTED : "form-state-submitted",
		};
		
		de.titus.form.Constants.ATTRIBUTE = {
		    VALIDATION : "-validation",
		    VALIDATION_FAIL_ACTION : "-validation-fail-action",
		    CONDITION : "-condition",
		    MESSAGE : "-message"
		};
		
		de.titus.form.Constants.SPECIALSTEPS = {
		    START : "form-step-start",
		    SUMMARY : "form-step-summary",
		    SUBMITTED : "form-step-submitted"
		};
		
	});
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Registry", function() {
		var Registry = de.titus.form.Registry = {
			LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Registry"),
			FIELDCONTROLLER : {},
			registFieldController : function(aTypename, aFunction) {
				if(Registry.LOGGER.isDebugEnabled())
					Registry.LOGGER.logDebug("registFieldController (\"" + aTypename + "\")");
				
				Registry.FIELDCONTROLLER[aTypename] = aFunction;
			},
			getFieldController : function(aTypename, aElement){
				if(Registry.LOGGER.isDebugEnabled())
					Registry.LOGGER.logDebug("getFieldController (\"" + aTypename + "\")");
				
				var initFunction = Registry.FIELDCONTROLLER[aTypename];	
				if(initFunction)
					return initFunction(aElement);
				else
					return Registry.FIELDCONTROLLER["default"](aElement);
			}
		};
	});
})();
(function($){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.utils.DataUtils", function() {
		var DataUtils = de.titus.form.utils.DataUtils = {
			LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.utils.DataUtils"),
			"object" : function(theData){
				if (DataUtils.LOGGER.isDebugEnabled())
					DataUtils.LOGGER.logDebug("data of fields to object: " + JSON.stringify(theData) );
				
				var result = {};
				for(var i = 0; i < theData.length; i++){
					var data = theData[i];
					DataUtils.__toSimpleObject(data, result);
				}
				
				if (DataUtils.LOGGER.isDebugEnabled())
					DataUtils.LOGGER.logDebug("data of fields to object: result: " + JSON.stringify(result) );
				
				return result;
			},
			"key-value" : function(theData){
				if (DataUtils.LOGGER.isDebugEnabled())
					DataUtils.LOGGER.logDebug("data of fields to key-value: " + JSON.stringify(theData) );
				
				var result = {};
				for(var i = 0; i < theData.length; i++){
					var data = theData[i];
					result[data.name] = data.value;
				}
				
				return result;
			},
			"list-model": function(theData){
				if (DataUtils.LOGGER.isDebugEnabled())
					DataUtils.LOGGER.logDebug("data of fields to list-model: " + JSON.stringify(theData) );
				
				return theDatas;
			},
			"data-model": function(theData){
				if (DataUtils.LOGGER.isDebugEnabled())
					DataUtils.LOGGER.logDebug("data of fields to data-model: " + JSON.stringify(theData) );
				
				var result = {};
				for(var i = 0; i < theData.length; i++){
					var data = theData[i];
					DataUtils.__toSimpleObject(data, result);
				}
				
				return result;
			},
			__toSimpleObject : function(aData, aContext) {
				var names = aData.name.split(".");
				var context = aContext;
				for (var i = 0; i < (names.length - 1); i++) {
					if (context[names[i]] == undefined)
						context[names] = {};
					context = context[names[i]];
				}
				context[names[names.length - 1]] = aData.value;
			},

			__toModelObject : function(aName, aData, aContext) {
				var names = aName.split(".");
				var context = aContext;
				context.items =  context.items || [];
				
				for (var i = 0; i < names.length; i++) {
					var name = names[i];
					var item = DataUtils.__getItem(aName, context.items);
					if(item == undefined)
						item = { name : name, type: "unkown", items : []};
					
					context = item;
				}
				
				context.type = aData.type;
				context.value = aData.value;				
			},
			__getItem : function(aName, theItems) {
				for(var i = 0; i < theItems.length; i++)
					if(theItems[i].name == aName)
						return theItems[i];
			}
			
		};
	});
	
})($);(function($){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.utils.EventUtils", function() {
		var EventUtils = de.titus.form.utils.EventUtils = {
			LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.utils.EventUtils"),
			triggerEvent : function(aElement, aEvent, aData){
				if (EventUtils.LOGGER.isDebugEnabled())
					EventUtils.LOGGER.logDebug("triggerEvent(\"" + aEvent + "\")");
				
				EventUtils.__checkOfUndefined(aEvent);
				
				setTimeout((function(aEvent, aData){
					if (EventUtils.LOGGER.isDebugEnabled())
						EventUtils.LOGGER.logDebug(["fire event event \"", aEvent, "\"\non ", this, "\nwith data \"" + aData + "\"!"]);
					this.trigger(aEvent, aData);
				}).bind(aElement, aEvent, aData), 1);
			},
			handleEvent : function(aElement, aEvent,  aCallback, aSelector){
				//TODO REFECTORING TO ONE SETTINGS PARAMETER OBJECT
				
				if (EventUtils.LOGGER.isDebugEnabled())
					EventUtils.LOGGER.logDebug(["handleEvent \"", aEvent, "\"\nat ", aElement, "\nwith selector ", aSelector]);
				
				EventUtils.__checkOfUndefined(aEvent);
				
				if(Array.isArray(aEvent))
					aElement.on(aEvent.join(" "), aSelector, aCallback);
				else
					aElement.on(aEvent, aSelector, aCallback);
			},
			__checkOfUndefined : function(aValue){
				if(Array.isArray(aValue))
					for(var i = 0; i < aValue.length; i++)
						if(aValue[i] == undefined)
							throw new Error("Error: undefined value at array index \"" + i + "\"");
				else
					if(aValue == undefined)
						throw new Error("Error: undefined value");
			}
			
		};
	});
	
})($);(function($){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.utils.FormularUtils", function() {
		var FormularUtils = de.titus.form.utils.FormularUtils = {
			LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.utils.FormularUtils"),
			
			getFormularElement : function(aElement){
				if (FormularUtils.LOGGER.isDebugEnabled())
					FormularUtils.LOGGER.logDebug("getFormularElement()");
				
				if(aElement.is("[data-form]"))
					return aElement;
				else{
					var parent = aElement.parents("[data-form]").first();
					if(parent.length == 1)
						return parent;
				}
				
			},
			getFormular : function(aElement){
				if (FormularUtils.LOGGER.isDebugEnabled())
					FormularUtils.LOGGER.logDebug("getFormular()");
				
				var formularElement = FormularUtils.getFormularElement(aElement);
				if(formularElement)
					return formularElement.Formular();
			},
			
			getPage : function(aElement){
				if (FormularUtils.LOGGER.isDebugEnabled())
					FormularUtils.LOGGER.logDebug("getPage()");
				
				if(aElement.is("[data-form-page]"))
					return aElement.formular_Page();
				else{
					var parent = aElement.parents("[data-form-page]").first();
					if(parent.length == 1)
						return parent.formular_Page();
				}
				
			},
			getField : function(aElement){
				if (FormularUtils.LOGGER.isDebugEnabled())
					FormularUtils.LOGGER.logDebug("getField()");
				
				if(aElement.is("[data-form-field]"))
					return aElement.formular_Field();
				else{
					var parent = aElement.parents("[data-form-field]").first();
					if(parent.length == 1)
						return parent.formular_Field();
				}
			}
		};
	});
	
})($);(function($){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.utils.JQueryFunctions", function() {
		
		$.fn.formular_utils_RemoveAddClass = function(aRemoveClass, anAddClass){
			if(this.length == 0) return;
			else if(this.length > 1){
				this.each(function(){$(this).formular_utils_RemoveAddClass(aRemoveClass, anAddClass);});
				return this;
			}
			else{
				this.removeClass(aRemoveClass);
				this.addClass(anAddClass);
			}
		};		
		
		$.fn.formular_utils_SetActive = function(){
			this.formular_utils_RemoveAddClass("inactive", "active");
		};
		
		$.fn.formular_utils_SetInactive = function(){
			this.formular_utils_RemoveAddClass("active", "inactive");
		};
		
		$.fn.formular_utils_SetValid = function(){
			this.formular_utils_RemoveAddClass("invalid", "valid");
		};
		
		$.fn.formular_utils_SetInvalid = function(){
			this.formular_utils_RemoveAddClass("valid", "invalid");
		};
		
	});	
})($);(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Condition", function() {
		var Condition = de.titus.form.Condition = function(aElement) {
			if (Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    formular : undefined,
			    expression : (aElement.attr("data-form-condition") || "").trim(),
			    expressionResolver : new de.titus.core.ExpressionResolver()
			};

			//setTimeout(Condition.prototype.__init.bind(this), 1);
			this.__init();
		};

		Condition.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Condition");

		Condition.prototype.__init = function() {
			if (Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("__init()");

			this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);

			if (this.data.expression != "") {
				de.titus.form.utils.EventUtils.handleEvent(this.data.formular.data.element, [EVENTTYPES.CONDITION_STATE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED, EVENTTYPES.FIELD_VALUE_CHANGED], Condition.prototype.__doCheck.bind(this));
			}
			
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.INITIALIZED ], Condition.prototype.__doCheck.bind(this));
		};

		Condition.prototype.__doCheck = function(aEvent) {
			if (Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("__doCheck() -> expression: \"" + this.data.expression + "\"");

			aEvent.preventDefault();
			if (aEvent.type != EVENTTYPES.INITIALIZED && aEvent.type != EVENTTYPES.VALUE_CHANGED)
				aEvent.stopPropagation();

			if (aEvent.currentTarget == this.data.element && (aEvent.type == EVENTTYPES.CONDITION_STATE_CHANGED || aEvent.Type == EVENTTYPES.VALIDATION_STATE_CHANGED))
				; // IGNORE CONDTION_STATE_CHANGE AND VALIDATION_STATE_CHANGED
					// ON SELF
			else if (this.data.expression == "")
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.CONDITION_MET);
			else {
				var data = this.data.formular.getData("object", true, false);

				var result = this.data.expressionResolver.resolveExpression(this.data.expression, data, false);
				if (result)
					de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.CONDITION_MET);
				else
					de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.CONDITION_NOT_MET);
			}
		};

		de.titus.core.jquery.Components.asComponent("formular_Condition", de.titus.form.Condition);
	});
})($, de.titus.form.Constants.EVENTS);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Field", function() {
		var Field = de.titus.form.Field = function(aElement) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    page : undefined,
			    formular : undefined,
			    name : (aElement.attr("data-form-field") || "").trim(),
			    type : (aElement.attr("data-form-field-type") || "default").trim(),
			    required : (aElement.attr("data-form-required") !== undefined),
			    condition : undefined,
			    valid : undefined,
			    controller : undefined
			};

			this.hide();

			setTimeout(Field.prototype.__init.bind(this), 1);
		};

		Field.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Field");

		Field.prototype.__init = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("init()");

			this.data.page = de.titus.form.utils.FormularUtils.getPage(this.data.element);
			this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);
			this.data.controller = de.titus.form.Registry.getFieldController(this.data.type, this.data.element);

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.CONDITION_MET, EVENTTYPES.CONDITION_NOT_MET ], Field.prototype.__changeConditionState.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.VALIDATION_VALID, EVENTTYPES.VALIDATION_INVALID ], Field.prototype.__changeValidationState.bind(this));

			this.data.element.formular_Condition();
			this.data.element.formular_ValidationController();

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.INITIALIZED);
		};

		Field.prototype.__changeConditionState = function(aEvent) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("__changeConditionState()  for \"" + this.data.name + "\" -> " + aEvent.type);

			aEvent.preventDefault();
			aEvent.stopPropagation();

			var condition = false;
			if (aEvent.type == EVENTTYPES.CONDITION_MET)
				condition = true;

			if (this.data.condition != condition) {
				this.data.condition = condition;
				if (this.data.condition)
					this.show();
				else
					this.hide();

				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.CONDITION_STATE_CHANGED);
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_STATE_CHANGED);
			}
		};

		Field.prototype.__changeValidationState = function(aEvent) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("__changeValidationState() for field \"" + this.data.name + "\" -> " + aEvent.type);

			aEvent.preventDefault();
			aEvent.stopPropagation();

			var valid = false;
			if (aEvent.type == EVENTTYPES.VALIDATION_VALID)
				valid = true;

			if (this.data.valid != valid) {
				if (Field.LOGGER.isDebugEnabled())
					Field.LOGGER.logDebug("__changeValidationState() for field \"" + this.data.name + "\" from " + this.data.valid + " -> " + valid);

				this.data.valid = valid;

				if (this.data.valid)
					this.data.element.formular_utils_SetValid();
				else
					this.data.element.formular_utils_SetInvalid();

				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_STATE_CHANGED);
			}
		};

		Field.prototype.hide = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("hide ()");

			this.data.element.formular_utils_SetInactive();
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.FIELD_HIDE);
		};

		Field.prototype.show = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("show ()");
			if (this.data.condition) {
				this.data.element.formular_utils_SetActive();
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.FIELD_SHOW);
			}
		};

		Field.prototype.summary = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("summary ()");
			if (this.data.condition) {
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.FIELD_SUMMARY);
				this.data.element.formular_utils_SetActive();
			}
		};

		Field.prototype.getData = function(acceptInvalid) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("getData()");

			if (this.data.condition && (this.data.valid || acceptInvalid))
				return {
				    name : this.data.name,
				    type : this.data.type,
				    value : this.data.controller.getValue(),
				    items : []
				};
		};

		de.titus.core.jquery.Components.asComponent("formular_Field", de.titus.form.Field);
	});
})($, de.titus.form.Constants.EVENTS);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Message", function() {
		var Message = de.titus.form.Message = function(aElement) {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    formular : undefined,
			    expression : (aElement.attr("data-form-message") || "").trim(),
			    expressionResolver : new de.titus.core.ExpressionResolver()
			};

			setTimeout(Message.prototype.__init.bind(this), 1);
		};

		Message.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Message");

		Message.prototype.__init = function() {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("__init()");

			this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);

			if (this.data.expression != "") {
				de.titus.form.utils.EventUtils.handleEvent(this.data.formular.data.element, [ de.titus.form.Constants.EVENTS.INITIALIZED, de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED, de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED ], Message.prototype.__doCheck.bind(this));
			}

			setTimeout(Message.prototype.__doCheck.bind(this), 1);
		};

		Message.prototype.__doCheck = function() {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("__doCheck() -> expression: \"" + this.data.expression + "\"");


			var data = this.data.formular.getData("object", true, false);

			var result = this.data.expressionResolver.resolveExpression(this.data.expression, data, false);
			if (result) {
				this.data.element.removeClass("inactive");
				this.data.element.addClass("active");
			} else {
				this.data.element.removeClass("active");
				this.data.element.addClass("inactive");
			}
		};

		de.titus.core.jquery.Components.asComponent("formular_Message", de.titus.form.Message);
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Validation", function() {
		var Validation = de.titus.form.Validation = function(aElement) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    expression : (aElement.attr("data-form-Validation") || "").trim(),
			    expressionResolver : new de.titus.core.ExpressionResolver()
			};
		};

		Validation.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Validation");

		Validation.prototype.validate = function(aContext) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("validate() -> expression: " + this.data.expression);
			if (this.data.expression != "") {
				var valid = this.data.expressionResolver.resolveExpression(this.data.expression, aContext, false);
				return valid;
			}

			return true;
		};

		de.titus.core.jquery.Components.asComponent("formular_Validation", de.titus.form.Validation);
	});
})();
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.ValidationController", function() {
		var ValidationController = de.titus.form.ValidationController = function(aElement) {
			if (ValidationController.LOGGER.isDebugEnabled())
				ValidationController.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    formular : undefined,
			    field : undefined,
			    required : (aElement.attr("data-form-required") !== undefined),
			    expressionResolver : new de.titus.core.ExpressionResolver(),
			    validations : aElement.find("[data-form-validation]")
			};

			setTimeout(ValidationController.prototype.__init.bind(this), 1);
		};

		ValidationController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.ValidationController");

		ValidationController.prototype.__init = function() {
			if (ValidationController.LOGGER.isDebugEnabled())
				ValidationController.LOGGER.logDebug("__init()");

			this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);
			this.data.field = de.titus.form.utils.FormularUtils.getField(this.data.element);

			if (this.data.required || this.data.validations.length > 0) {
				de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.INITIALIZED, EVENTTYPES.CONDITION_STATE_CHANGED, EVENTTYPES.FIELD_VALUE_CHANGED ], ValidationController.prototype.__doValidate.bind(this));
				de.titus.form.utils.EventUtils.handleEvent(this.data.formular.data.element, [ EVENTTYPES.CONDITION_STATE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED ], ValidationController.prototype.__doValidate.bind(this));
			} else
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_VALID);
		};

		ValidationController.prototype.__doValidate = function(aEvent) {
			if (ValidationController.LOGGER.isDebugEnabled())
				ValidationController.LOGGER.logDebug("__doValidate() -> " + aEvent.type);

			var valid = true;
			aEvent.preventDefault();

			if (aEvent.type != EVENTTYPES.INITIALIZED && aEvent.type != EVENTTYPES.FIELD_VALUE_CHANGED)
				aEvent.stopPropagation();

			// IGNORE ValidationController_STATE_CHANGED ON SELF ELEMENT
			if (aEvent.currentTarget == this.data.element && aEvent.Type == EVENTTYPES.VALIDATION_STATE_CHANGED)
				return;
			// if (aEvent.type ==
			// EVENTTYPES.CONDITION_STATE_CHANGED &&
			// aEvent.currentTarget == this.data.element)
			// return;

			this.data.validations.formular_utils_SetInactive();

			var fieldData = this.data.field.getData(true);
			var valueEmpty = this.__valueEmpty(fieldData);

			if (valueEmpty)
				this.data.element.addClass("no-value");
			else
				this.data.element.removeClass("no-value");

			if (this.data.required && !this.data.field.data.condition)
				valid = false;
			else if (this.data.validations.length == 0)
				valid = !this.data.required || !valueEmpty;
			else if (this.data.validations.length > 0 && valueEmpty)
				valid = !this.data.required;
			else
				valid = this.__checkValidations(fieldData);

			if (valid)
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_VALID);
			else
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_INVALID);
		};

		ValidationController.prototype.__checkValidations = function(aFieldData) {
			if (ValidationController.LOGGER.isDebugEnabled())
				ValidationController.LOGGER.logDebug("__checkValidation()");

			var formularData = this.data.formular.getData("object", true);
			var data = {
			    value : aFieldData ? aFieldData.value : undefined,
			    form : formularData
			};

			var valid = true;
			this.data.validations.each(function() {
				var element = $(this);
				var validation = element.formular_Validation();
				if (!validation.validate(data)) {
					element.formular_utils_SetActive();
					valid = false;
				}
			});
			return valid;
		};

		ValidationController.prototype.__valueEmpty = function(aFieldData) {
			return aFieldData == undefined || aFieldData.value == undefined || (Array.isArray(aFieldData.value) && aFieldData.value.length == 0) || (typeof aFieldData.value === "string" && aFieldData.value.trim().length == 0);
		};

		de.titus.core.jquery.Components.asComponent("formular_ValidationController", de.titus.form.ValidationController);
	});
})($, de.titus.form.Constants.EVENTS);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Formular", function() {
		var Formular = de.titus.form.Formular = function(aElement) {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    name : aElement.attr("data-form"),
			    state : de.titus.form.Constants.STATE.INPUT,
			    expressionResolver : new de.titus.core.ExpressionResolver()
			};
			setTimeout(Formular.prototype.__init.bind(this), 1);
		};

		Formular.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Formular");

		Formular.prototype.__init = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("init()");

			this.data.element.on(EVENTTYPES.ACTION_PAGE_BACK, (function() {
				this.data.state = de.titus.form.Constants.STATE.INPUT;
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.STATE_CHANGED);
			}).bind(this));
			this.data.element.on(EVENTTYPES.ACTION_PAGE_NEXT, (function() {
				this.data.state = de.titus.form.Constants.STATE.INPUT;
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.STATE_CHANGED);
			}).bind(this));
			this.data.element.on(EVENTTYPES.PAGE_SUMMARY, (function() {
				this.data.state = de.titus.form.Constants.STATE.SUMMARY;
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.STATE_CHANGED);
			}).bind(this));
			this.data.element.on(EVENTTYPES.ACTION_SUBMIT, Formular.prototype.submit.bind(this));

			this.data.element.formular_StepPanel();
			this.data.element.formular_FormularControls();
			this.data.element.formular_PageController();
			this.data.element.find("[data-form-message]").formular_Message();

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.INITIALIZED);
			this.data.element.addClass("initialized");
		};

		Formular.prototype.getData = function(aModelType, includeInvalidPage, includeInvalidField) {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("getData (\"" + aModelType + "\")");

			var data = [];
			var pages = this.data.element.formular_PageController().data.pages;
			for (var i = 0; i < pages.length; i++) {
				var pageData = pages[i].getData(includeInvalidPage, includeInvalidField);
				if (pageData != undefined && pageData.length > 0)
					data = data.concat(pageData);
			}

			var modelType = (aModelType || "object").trim().toLowerCase();
			var result = de.titus.form.utils.DataUtils[modelType](data);

			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("getData (\"" + aModelType + "\") -> " + JSON.stringify(result));

			return result;
		};

		Formular.prototype.submit = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("submit ()");

			this.data.state = de.titus.form.Constants.STATE.SUBMITTED;
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.STATE_CHANGED);
		};
	});

	de.titus.core.jquery.Components.asComponent("Formular", de.titus.form.Formular);

	$(document).ready(function() {
		$('[data-form]').Formular();
	});
})($, de.titus.form.Constants.EVENTS);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.FormularControls", function() {
		var FormularControls = de.titus.form.FormularControls = function(aElement) {
			if (FormularControls.LOGGER.isDebugEnabled())
				FormularControls.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement
			};

			this.init();
		};

		FormularControls.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.FormularControls");

		FormularControls.prototype.init = function() {
			if (FormularControls.LOGGER.isDebugEnabled())
				FormularControls.LOGGER.logDebug("init()");

			this.data.element.find("[data-form-button-reset]").formular_buttons_ResetButton();
			this.data.element.find("[data-form-button-back]").formular_buttons_BackButton();
			this.data.element.find("[data-form-button-next]").formular_buttons_NextButton();
			this.data.element.find("[data-form-button-summary]").formular_buttons_SummaryButton();
			this.data.element.find("[data-form-button-submit]").formular_buttons_SubmitButton();			
		};

		de.titus.core.jquery.Components.asComponent("formular_FormularControls", de.titus.form.FormularControls);
	});
})($,de.titus.form.Constants.EVENTS);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Page", function() {
		var Page = de.titus.form.Page = function(aElement, aIndex) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formular : undefined,
			    type : de.titus.form.Constants.TYPES.PAGE,
			    name : aElement.attr("data-form-page"),
			    step : (aElement.attr("data-form-step") || "").trim(),
			    condition : undefined,
			    valid : undefined,
			    fields : []
			};

			setTimeout(Page.prototype.__init.bind(this), 1);
		};

		Page.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Page");

		Page.prototype.__init = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("init()");

			this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.CONDITION_MET, EVENTTYPES.CONDITION_NOT_MET ], Page.prototype.__changeConditionState.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.CONDITION_STATE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED ], Page.prototype.__changeValidationState.bind(this), "[data-form-field]");

			this.data.fields = this.data.element.find("[data-form-field]").formular_Field();
			this.data.element.formular_Condition();


			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.PAGE_INITIALIZED);
		};

		Page.prototype.__changeConditionState = function(aEvent) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("__changeConditionState () for page {name: \"" + this.data.name + "\", step: \"" + this.data.step + "\"}  -> " + aEvent.type);

			aEvent.preventDefault();
			aEvent.stopPropagation();			

	
			var condition = false;
			if (aEvent.type == EVENTTYPES.CONDITION_MET)
				condition = true;			

			if (this.data.condition != condition) {
				this.data.condition = condition;
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.CONDITION_STATE_CHANGED);				
			}
		};

		Page.prototype.__changeValidationState = function(aEvent) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("__changeValidationState () for page {name: \"" + this.data.name + "\", step: \"" + this.data.step + "\"}  -> " + aEvent.type);

			aEvent.preventDefault();

			var valid = this.__allFieldsValid();
			if (this.data.valid != valid) {
				this.data.valid = valid;

				if (this.data.valid)
					this.data.element.formular_utils_SetValid();
				else
					this.data.element.formular_utils_SetInvalid();

				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_STATE_CHANGED);
			}
		};

		Page.prototype.__allFieldsValid = function() {
			for (var i = 0; i < this.data.fields.length; i++) {
				if (!this.data.fields[i].data.valid)
					return false;
			}

			return true;
		};

		Page.prototype.hide = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("hide ()");

			this.data.element.formular_utils_SetInactive();

		};

		Page.prototype.show = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("show ()");

			if (this.data.condition) {
				this.data.element.formular_utils_SetActive();
				for (var i = 0; i < this.data.fields.length; i++)
					this.data.fields[i].show();
			}
		};

		Page.prototype.summary = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("summary ()");

			if (this.data.condition) {
				for (var i = 0; i < this.data.fields.length; i++)
					this.data.fields[i].summary();

				this.data.element.formular_utils_SetActive();
			}
		};

		Page.prototype.getData = function(includeInvalidPage, includeInvalidField) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("getData()");

			var result = [];
			if (this.data.condition && (this.data.valid || includeInvalidPage)) {
				for (var i = 0; i < this.data.fields.length; i++) {
					var data = this.data.fields[i].getData(includeInvalidField);
					if (data != undefined)
						result.push(data);
				}
			}

			return result;
		};

		de.titus.core.jquery.Components.asComponent("formular_Page", de.titus.form.Page);
	});
})($, de.titus.form.Constants.EVENTS);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.PageControlHandle", function() {
		var PageControlHandle = de.titus.form.PageControlHandle = function(aPage, aIndex, aStep, aPageController) {
			if (PageControlHandle.LOGGER.isDebugEnabled())
				PageControlHandle.LOGGER.logDebug("constructor");
			this.data = {
			    index : aIndex,
			    page : aPage,
			    step : aStep,
			    pageController : aPageController
			};
		};
		
		PageControlHandle.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.PageControlHandle");
		
		PageControlHandle.prototype.hide = function() {
			if (PageControlHandle.LOGGER.isDebugEnabled())
				PageControlHandle.LOGGER.logDebug("hide ()");
			if (this.data.page && this.data.page.hide)
				this.data.page.hide();
			
		};
		
		PageControlHandle.prototype.show = function() {
			if (PageControlHandle.LOGGER.isDebugEnabled())
				PageControlHandle.LOGGER.logDebug("show ()");
			if (this.data.page && this.data.page.show)
				this.data.page.show();
		};
	});
})($);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.PageController", function() {
		var PageController = de.titus.form.PageController = function(aElement) {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    pages : [],
			    pageHandles : [],
			    currentHandle : undefined
			};

			setTimeout(PageController.prototype.__init.bind(this), 1);
		};

		PageController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.PageController");

		PageController.prototype.__init = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("__init()");

			var formularElement = this.data.element;
			this.data.pages = this.data.element.find("[data-form-page]").formular_Page();
			this.data.pageHandles = this.__initPageHandles();

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, EVENTTYPES.ACTION_PAGE_BACK, PageController.prototype.toPrevPage.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, EVENTTYPES.ACTION_PAGE_NEXT, PageController.prototype.toNextPage.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, EVENTTYPES.CONDITION_STATE_CHANGED, PageController.prototype.__checkCurrentPage.bind(this));
		};

		PageController.prototype.__initPageHandles = function() {
			var handles = [];
			var index = 0;
			var lastStep = de.titus.form.Constants.SPECIALSTEPS.START;
			for (var i = 0; i < this.data.pages.length; i++) {
				var page = this.data.pages[i];
				if (page.data.step != "")
					lastStep = page.data.step;
				else
					page.data.step = lastStep;

				page.hide();

				var handle = new de.titus.form.PageControlHandle(page, i, lastStep, this);

				handles.push(handle);
			}

			var show = function() {
				var pages = this.data.pageController.data.pages;
				for (var i = 0; i < pages.length; i++)
					pages[i].summary();

				de.titus.form.utils.EventUtils.triggerEvent(this.data.pageController.data.element, EVENTTYPES.PAGE_SUMMARY);
			};

			var hide = function() {
				var pages = this.data.pageController.data.pages;
				for (var i = 0; i < pages.length; i++)
					pages[i].hide();

			};

			var summaryHandle = new de.titus.form.PageControlHandle({
				data : {
					type: de.titus.form.Constants.TYPES.SUMMARY_PAGE,
				    valid : true,
				    condition : true
				}
			}, handles.length, de.titus.form.Constants.SPECIALSTEPS.SUMMARY, this);
			summaryHandle.show = show.bind(summaryHandle);
			summaryHandle.hide = hide.bind(summaryHandle);
			handles.push(summaryHandle);

			var submittedHandle = new de.titus.form.PageControlHandle({
				data : {
					type: de.titus.form.Constants.TYPES.SUBMITTED_PAGE,
				    valid : true,
				    condition : true
				}
			}, handles.length, de.titus.form.Constants.SPECIALSTEPS.SUBMITTED, this);
			submittedHandle.show = show.bind(submittedHandle);
			submittedHandle.hide = hide.bind(submittedHandle);
			handles.push(submittedHandle);

			return handles;
		};

		PageController.prototype.__checkCurrentPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("__checkCurrentPage()");
			if(!this.data.currentHandle && this.data.pageHandles[0].data.page.data.condition)
				this.__toPageHandle(this.data.pageHandles[0]);
				
		};

		PageController.prototype.isFirstPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("isFirstPage()");
			return this.data.currentHandle && this.data.currentHandle.data.index == 0;
		};

		PageController.prototype.getCurrentPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("getCurrentPage()");

			if (this.data.currentHandle)
				return this.data.currentHandle.data.page;
		};
		
		PageController.prototype.getNextPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("getNextPage()");

			return this.__getNextPageHandle().data.page;
		};

		PageController.prototype.hasNextPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("hasNextPage()");

			return this.__getNextPageHandle() != undefined;
		};

		PageController.prototype.__getNextPageHandle = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("__getNextPageHandle()");

			if (this.data.currentHandle && !this.data.currentHandle.data.page.data.valid)
				return this.data.currentHandle;
			else if (!this.data.currentHandle)
				return;
			else {
				for (var i = this.data.currentHandle.data.index + 1; i < this.data.pageHandles.length; i++) {
					var handle = this.data.pageHandles[i];
					if (handle.data.page.data.condition)
						return handle;
				}
				return this.data.currentHandle;
			}
		};

		PageController.prototype.__getPrevPageHandle = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("__getPrevPageHandle()");

			if (!this.data.currentHandle)
				return this.data.pageHandles[0];
			else {
				for (var i = this.data.currentHandle.data.index - 1; 0 <= i; i--) {
					var handle = this.data.pageHandles[i];
					if (handle.data.page.data.condition)
						return handle;
				}
				return this.data.currentHandle;
			}
		};

		PageController.prototype.__toPageHandle = function(aPageHandle) {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("__toPage()");

			if (aPageHandle) {
				if (this.data.currentHandle) {
					this.data.element.removeClass("step-" + this.data.currentHandle.data.step);
					this.data.currentHandle.hide();
				}

				this.data.currentHandle = aPageHandle;
				this.data.element.addClass("step-" + this.data.currentHandle.data.step);
				this.data.currentHandle.show();

				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.PAGE_CHANGED);
			}
		};

		PageController.prototype.toPrevPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("toPrevPage()");

			var page = this.__getPrevPageHandle();
			this.__toPageHandle(page);
		};

		PageController.prototype.toNextPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("toNextPage()");

			var page = this.__getNextPageHandle();
			if (page)
				this.__toPageHandle(page);
		};

		de.titus.core.jquery.Components.asComponent("formular_PageController", de.titus.form.PageController);
	});
})($, de.titus.form.Constants.EVENTS);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.StepPanel", function() {
		var StepPanel = de.titus.form.StepPanel = function(aElement) {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    panelElement : aElement.find("[data-form-step-panel]"),
			    steps : [],
			    current : undefined
			};

			setTimeout(StepPanel.prototype.__init.bind(this), 1);
		};

		StepPanel.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.StepPanel");

		StepPanel.prototype.__init = function() {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("init()");

			var steps = [];
			var index = 0;
			this.data.panelElement.find("[data-form-step]").each(function() {
				var element = $(this);
				element.formular_utils_SetInactive();
				var step = {
				    index : index++,
				    id : element.attr("data-form-step").toLowerCase(),
				    element : element
				};
				steps.push(step);
			});

			this.data.steps = steps;

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [EVENTTYPES.STATE_CHANGED, EVENTTYPES.PAGE_CHANGED ], StepPanel.prototype.update.bind(this));
		};
		
		StepPanel.prototype.update = function(aEvent) {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("update() -> " + aEvent.type);

			var formular = this.data.element.Formular();
			var pageController = this.data.element.formular_PageController();
			var state = formular.data.state;
			var stepId = de.titus.form.Constants.SPECIALSTEPS.START;

			if (state == de.titus.form.Constants.STATE.INPUT && pageController.getCurrentPage())
				stepId = pageController.getCurrentPage().data.step;
			else if (state == de.titus.form.Constants.STATE.SUMMARY)
				stepId = de.titus.form.Constants.SPECIALSTEPS.SUMMARY;
			else if (state == de.titus.form.Constants.STATE.SUBMITTED)
				stepId = de.titus.form.Constants.SPECIALSTEPS.SUBMITTED;

			this.setStep(stepId);
		};

		StepPanel.prototype.setStep = function(aId) {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("setStep(\"" + aId + "\")");
			var step = this.getStep(aId);
			if (step != undefined) {
				if (this.data.current) {
					this.data.current.element.formular_utils_SetInactive();
					this.data.element.removeClass("step-" + this.data.current.id);
				}
				this.data.current = step;
				this.data.current.element.formular_utils_SetActive();
				this.data.element.addClass("step-" + aId);
			}
		};

		StepPanel.prototype.getStep = function(aId) {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("getStep(\"" + aId + "\")");
			if (!aId)
				return;

			var id = aId.toLowerCase();
			for (var i = 0; i < this.data.steps.length; i++) {
				var step = this.data.steps[i];
				if (step.id == id)
					return step;
			}
		};

		de.titus.core.jquery.Components.asComponent("formular_StepPanel", de.titus.form.StepPanel);
	});
		
})($,de.titus.form.Constants.EVENTS);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DefaultFieldController", function() {
		var DefaultFieldController = de.titus.form.DefaultFieldController= function(aElement) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			this.input = undefined;
			this.type = undefined;
			this.filedata = undefined;
			this.timeoutId = undefined;
			setTimeout(DefaultFieldController.prototype.__init.bind(this), 1);
		};
		DefaultFieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DefaultFieldController");
		
		DefaultFieldController.prototype.valueChanged = function(aEvent) {
			aEvent.preventDefault();
			de.titus.form.utils.EventUtils.triggerEvent(this.element, de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
		};
		
		DefaultFieldController.prototype.__init = function() {
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
			
			de.titus.form.utils.EventUtils.handleEvent(this.element, de.titus.form.Constants.EVENTS.FIELD_SHOW, (function(){
				if (this.type == "select")
					this.element.find("select").prop("disabled", false);
				else
					this.element.find("input, textarea").prop("disabled", false);
			}).bind(this));
			
			de.titus.form.utils.EventUtils.handleEvent(this.element, de.titus.form.Constants.EVENTS.FIELD_SUMMARY, (function(){
				if (this.type == "select")
					this.element.find("select").prop("disabled", true);
				else
					this.element.find("input, textarea").prop("disabled", true);
			}).bind(this));
			
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
			reader.addEventListener("load", (function() {
				if (DefaultFieldController.LOGGER.isDebugEnabled())
					DefaultFieldController.LOGGER.logDebug("readFileData() -> reader load event!");
				
				count--;
				if (multiple)
					this.fileData.push(reader.result);
				else
					this.fileData = reader.result;
				
				if (count == 0)
					de.titus.form.utils.EventUtils.triggerEvent(this.element, de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
			}).bind(this), false);
			
			var textField = this.element.find("input[type='text'][readonly]");
			if (textField.length == 1)
				textField.val("");
			for (var i = 0; i < input.files.length; i++) {
				reader.readAsDataURL(input.files[i]);
				if (textField.length == 1)
					textField.val(textField.val() != "" ? textField.val() + ", " + input.files[i].name : input.files[i].name);
			}
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
		
		de.titus.form.Registry.registFieldController("default", function(aElement) {
			return new DefaultFieldController(aElement);
		});
	});
})();
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.buttons.BackButton", function() {
		var BackButton = de.titus.form.buttons.BackButton = function(aElement) {
			if (BackButton.LOGGER.isDebugEnabled())
				BackButton.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formularElement : de.titus.form.utils.FormularUtils.getFormularElement(aElement)
			};

			setTimeout(BackButton.prototype.__init.bind(this), 1);
		};

		BackButton.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.buttons.BackButton");

		BackButton.prototype.__init = function() {
			if (BackButton.LOGGER.isDebugEnabled())
				BackButton.LOGGER.logDebug("__init()");

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, "click", BackButton.prototype.execute.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.formularElement, [ EVENTTYPES.PAGE_CHANGED, EVENTTYPES.ACTION_SUBMIT ], BackButton.prototype.update.bind(this));
			this.data.element.formular_utils_SetInactive();
		};
		
		BackButton.prototype.execute = function(aEvent) {
			aEvent.preventDefault();
			aEvent.stopPropagation();
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.ACTION_PAGE_BACK);
		};

		BackButton.prototype.update = function(aEvent) {
			if (BackButton.LOGGER.isDebugEnabled())
				BackButton.LOGGER.logDebug("update() -> " + aEvent.type);

			if(aEvent.type == EVENTTYPES.ACTION_SUBMIT)
				this.data.element.formular_utils_SetInactive();
			else if(aEvent.type == EVENTTYPES.PAGE_CHANGED){
				var pageController = this.data.formularElement.formular_PageController();
				if(pageController.isFirstPage())
					this.data.element.formular_utils_SetInactive();
				else
					this.data.element.formular_utils_SetActive();
			}
		};

		de.titus.core.jquery.Components.asComponent("formular_buttons_BackButton", de.titus.form.buttons.BackButton);
	});
})($,de.titus.form.Constants.EVENTS);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.buttons.NextButton", function() {
		var NextButton = de.titus.form.buttons.NextButton = function(aElement) {
			if (NextButton.LOGGER.isDebugEnabled())
				NextButton.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formularElement : de.titus.form.utils.FormularUtils.getFormularElement(aElement)
			};
			
			setTimeout(NextButton.prototype.__init.bind(this), 1);
		};
		
		NextButton.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.buttons.NextButton");
		
		NextButton.prototype.__init = function() {
			if (NextButton.LOGGER.isDebugEnabled())
				NextButton.LOGGER.logDebug("__init()");
			
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, "click", NextButton.prototype.execute.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.formularElement, [ EVENTTYPES.PAGE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED ], NextButton.prototype.update.bind(this), "[data-form-page]");
			this.data.element.formular_utils_SetInactive();
		};
		
		NextButton.prototype.execute = function(aEvent) {
			aEvent.preventDefault();
			aEvent.stopPropagation();
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.ACTION_PAGE_NEXT);
		};
		
		NextButton.prototype.update = function(aEvent) {
			if (NextButton.LOGGER.isDebugEnabled())
				NextButton.LOGGER.logDebug("update() -> " + aEvent.type);
			
			if (aEvent.type == EVENTTYPES.VALIDATION_STATE_CHANGED) {
				var pageController = this.data.formularElement.formular_PageController();
				var page = pageController.getCurrentPage();
				if (page && page.data.type == de.titus.form.Constants.TYPES.PAGE && page.data.condition && page.data.valid) {
					var nextPage = pageController.getNextPage();
					if (nextPage.data.type == de.titus.form.Constants.TYPES.PAGE)
						return this.data.element.formular_utils_SetActive();
				}
			}
			
			this.data.element.formular_utils_SetInactive();
		};
		
		de.titus.core.jquery.Components.asComponent("formular_buttons_NextButton", de.titus.form.buttons.NextButton);
	});
})($, de.titus.form.Constants.EVENTS);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.buttons.ResetButton", function() {
		var ResetButton = de.titus.form.buttons.ResetButton = function(aElement) {
			if (ResetButton.LOGGER.isDebugEnabled())
				ResetButton.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formularElement : de.titus.form.utils.FormularUtils.getFormularElement(aElement)
			};

			setTimeout(ResetButton.prototype.__init.bind(this), 1);
		};

		ResetButton.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.buttons.ResetButton");

		ResetButton.prototype.__init = function() {
			if (ResetButton.LOGGER.isDebugEnabled())
				ResetButton.LOGGER.logDebug("init()");

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, "click", ResetButton.prototype.execute.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.formularElement, [ EVENTTYPES.PAGE_CHANGED, EVENTTYPES.STATE_CHANGED, EVENTTYPES.ACTION_SUBMIT ], ResetButton.prototype.update.bind(this));
			this.data.element.formular_utils_SetActive();
		};
		
		ResetButton.prototype.execute = function(aEvent) {
			aEvent.preventDefault();
			aEvent.stopPropagation();
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.ACTION_RESET);
		};

		ResetButton.prototype.update = function(aEvent) {
			if (ResetButton.LOGGER.isDebugEnabled())
				ResetButton.LOGGER.logDebug("update() -> " + aEvent.type);

			if(aEvent.type == EVENTTYPES.ACTION_SUBMIT)
				this.data.element.formular_utils_SetInactive();
			else
				this.data.element.formular_utils_SetActive();			
		};

		de.titus.core.jquery.Components.asComponent("formular_buttons_ResetButton", de.titus.form.buttons.ResetButton);
	});
})($,de.titus.form.Constants.EVENTS);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.buttons.SubmitButton", function() {
		var SubmitButton = de.titus.form.buttons.SubmitButton = function(aElement) {
			if (SubmitButton.LOGGER.isDebugEnabled())
				SubmitButton.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formularElement : de.titus.form.utils.FormularUtils.getFormularElement(aElement)
			};
			
			setTimeout(SubmitButton.prototype.__init.bind(this), 1);
		};
		
		SubmitButton.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.buttons.SubmitButton");
		
		SubmitButton.prototype.__init = function() {
			if (SubmitButton.LOGGER.isDebugEnabled())
				SubmitButton.LOGGER.logDebug("__init()");
			
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, "click", SubmitButton.prototype.execute.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.formularElement, [EVENTTYPES.PAGE_CHANGED], SubmitButton.prototype.update.bind(this));
			this.data.element.formular_utils_SetInactive();
		};
		
		SubmitButton.prototype.execute = function(aEvent) {
			aEvent.preventDefault();
			aEvent.stopPropagation();
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.ACTION_SUBMIT);
		};
		
		SubmitButton.prototype.update = function(aEvent) {
			if (SubmitButton.LOGGER.isDebugEnabled())
				SubmitButton.LOGGER.logDebug("update() -> " + aEvent.type);
			
			var pageController = this.data.formularElement.formular_PageController();
			var page = pageController.getCurrentPage();
			if (page.data.type == de.titus.form.Constants.TYPES.SUMMARY_PAGE)
				this.data.element.formular_utils_SetActive();
			else
				this.data.element.formular_utils_SetInactive();
		};
		
		de.titus.core.jquery.Components.asComponent("formular_buttons_SubmitButton", de.titus.form.buttons.SubmitButton);
	});
})($, de.titus.form.Constants.EVENTS);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.buttons.SummaryButton", function() {
		var SummaryButton = de.titus.form.buttons.SummaryButton = function(aElement) {
			if (SummaryButton.LOGGER.isDebugEnabled())
				SummaryButton.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formularElement : de.titus.form.utils.FormularUtils.getFormularElement(aElement)
			};
			
			setTimeout(SummaryButton.prototype.__init.bind(this), 1);
		};
		
		SummaryButton.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.buttons.SummaryButton");
		
		SummaryButton.prototype.__init = function() {
			if (SummaryButton.LOGGER.isDebugEnabled())
				SummaryButton.LOGGER.logDebug("__init()");
			
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, "click", SummaryButton.prototype.execute.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.formularElement, [ EVENTTYPES.PAGE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED ], SummaryButton.prototype.update.bind(this), "[data-form-page]");
			this.data.element.formular_utils_SetInactive();
		};
		
		SummaryButton.prototype.execute = function(aEvent) {
			aEvent.preventDefault();
			aEvent.stopPropagation();
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.ACTION_SUMMARY);
		};
		
		SummaryButton.prototype.update = function(aEvent) {
			if (SummaryButton.LOGGER.isDebugEnabled())
				SummaryButton.LOGGER.logDebug("update() -> " + aEvent.type);
			
			if (aEvent.type == EVENTTYPES.VALIDATION_STATE_CHANGED) {
				var pageController = this.data.formularElement.formular_PageController();
				var page = pageController.getCurrentPage();
				if (page && page.data.condition && page.data.valid) {
					var nextPage = pageController.getNextPage();
					if (nextPage.data.type == de.titus.form.Constants.TYPES.SUMMARY_PAGE)
						return this.data.element.formular_utils_SetActive();
				}
			}
			
			this.data.element.formular_utils_SetInactive();
		};
		
		de.titus.core.jquery.Components.asComponent("formular_buttons_SummaryButton", de.titus.form.buttons.SummaryButton);
	});
})($, de.titus.form.Constants.EVENTS);
