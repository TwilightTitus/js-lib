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
		de.titus.form.Constants.EVENTS = {
		    INITIALIZED : "form-initialized",
		    SUCCESSED : "form-successed",
		    FAILED : "form-failed",
		    
		    ACTION_RESET : "form-action-reset",
		    ACTION_SUBMIT : "form-action-submit",
		    ACTION_PAGE_BACK : "form-action-page-back",
		    ACTION_PAGE_NEXT : "form-action-page-next",
		    ACTION_SUMMARY : "form-action-page-summary",


		    PAGE_CHANGED : "form-page-changed",
		    PAGE_SHOW : "form-page-show",
		    PAGE_HIDE: "form-page-hide",
		    PAGE_SUMMARY : "form-page-summary",

		    FIELD_SHOW : "form-field-show",
		    FIELD_HIDE : "form-field-hide",
		    FIELD_SUMMARY : "form-field-SUMMARY",
		    FIELD_VALUE_CHANGED : "form-field-value-changed",
		    
		    VALIDATION_STATE_CHANGED: "form-validation-state-changed",
		    VALIDATION_VALID: "form-validation-valid",
		    VALIDATION_INVALID: "form-validation-invalid",
		    
		    CONDITION_STATE_CHANGED: "form-condition-state-changed",
		    CONDITION_MET: "form-condition-met",
		    CONDITION_NOT_MET: "form-condition-not-met"
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
						EventUtils.LOGGER.logDebug("fire event event \"" + aEvent + "\"");
					this.trigger(aEvent, aData);
				}).bind(aElement, aEvent, aData), 1);
			},
			handleEvent : function(aElement, aEvent,  aCallback, aSelector){
				//TODO REFECTORING TO ONE SETTINGS PARAMETER OBJECT
				
				if (EventUtils.LOGGER.isDebugEnabled())
					EventUtils.LOGGER.logDebug("handleEvent(\"" + aEvent + "\")");
				
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
	
})($);(function($) {
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

			setTimeout(Condition.prototype.__init.bind(this), 1);
		};

		Condition.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Condition");

		Condition.prototype.__init = function() {
			if (Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("__init()");

			this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);

			if (this.data.expression != "") {
				de.titus.form.utils.EventUtils.handleEvent(this.data.formular.data.element, [ de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED, de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED ], Condition.prototype.__doCheck.bind(this));
			}

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ de.titus.form.Constants.EVENTS.INITIALIZED ], Condition.prototype.__doCheck.bind(this));
		};

		Condition.prototype.__doCheck = function(aEvent) {
			if (Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("__doCheck() -> expression: \"" + this.data.expression + "\"");

			aEvent.preventDefault();
			if (aEvent.type != de.titus.form.Constants.EVENTS.INITIALIZED)
				aEvent.stopPropagation();

			if (aEvent.currentTarget == this.data.element && (aEvent.type == de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED || aEvent.Type == de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED))
				; // IGNORE CONDTION_STATE_CHANGE AND VALIDATION_STATE_CHANGED
					// ON SELF
			else if (this.data.expression == "")
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.CONDITION_MET);
			else {
				var data = this.data.formular.getData("object", true, false);

				var result = this.data.expressionResolver.resolveExpression(this.data.expression, data, false);
				if (result)
					de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.CONDITION_MET);
				else
					de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.CONDITION_NOT_MET);
			}
		};

		de.titus.core.jquery.Components.asComponent("formular_Condition", de.titus.form.Condition);
	});
})($);
(function() {
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
			    condition : false,
			    valid : false,
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

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ de.titus.form.Constants.EVENTS.CONDITION_MET, de.titus.form.Constants.EVENTS.CONDITION_NOT_MET ], Field.prototype.__changeConditionState.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ de.titus.form.Constants.EVENTS.VALIDATION_VALID, de.titus.form.Constants.EVENTS.VALIDATION_INVALID ], Field.prototype.__changeValidationState.bind(this));

			this.data.element.formular_Condition();
			this.data.element.formular_Validation();

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.INITIALIZED);
		};

		Field.prototype.__changeConditionState = function(aEvent) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("__changeConditionState()  for \"" + this.data.name + "\" -> " + aEvent.type);

			aEvent.preventDefault();
			aEvent.stopPropagation();

			var condition = false;
			if (aEvent.type == de.titus.form.Constants.EVENTS.CONDITION_MET)
				condition = true;

			if (this.data.condition != condition) {
				this.data.condition = condition;
				if (this.data.condition)
					this.show();
				else
					this.hide();

				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED);
			}
		};

		Field.prototype.__changeValidationState = function(aEvent) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("__changeValidationState() for field \"" + this.data.name + "\" -> " + aEvent.type);

			aEvent.preventDefault();
			aEvent.stopPropagation();

			var valid = false;
			if (aEvent.type == de.titus.form.Constants.EVENTS.VALIDATION_VALID)
				valid = true;

			if (this.data.valid != valid) {
				if (Field.LOGGER.isDebugEnabled())
					Field.LOGGER.logDebug("__changeValidationState() for field \"" + this.data.name + "\" from " + this.data.valid  + " -> " + valid);
				
				this.data.valid = valid;
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED);
			}

			if (this.data.valid) {
				this.data.element.removeClass("invalid");
				this.data.element.addClass("valid");
			} else {
				this.data.element.removeClass("valid");
				this.data.element.addClass("invalid");
			}
		};

		Field.prototype.hide = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("hide ()");

			this.data.element.removeClass("active");
			this.data.element.addClass("inactive");

		};

		Field.prototype.show = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("show ()");

			this.data.element.removeClass("inactive");
			this.data.element.addClass("active");

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.FIELD_SHOW);
		};

		Field.prototype.summary = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("summary ()");

			this.data.element.removeClass("inactive");
			this.data.element.addClass("active");

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.FIELD_SUMMARY);
		};

		Field.prototype.getData = function(acceptInvalid) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("getData()");

			if (this.data.condition && (this.data.valid || acceptInvalid))
				return {
				    name : this.data.name,
				    type : this.data.type,
				    value : this.data.controller.getValue()
				};
		};

		de.titus.core.jquery.Components.asComponent("formular_Field", de.titus.form.Field);
	});
})();
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
			    formular : undefined,
			    field : undefined,
			    required : (aElement.attr("data-form-required") !== undefined),
			    expressionResolver : new de.titus.core.ExpressionResolver(),
			    validations : []
			};

			setTimeout(Validation.prototype.__init.bind(this), 1);
		};

		Validation.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Validation");

		Validation.prototype.__init = function() {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("__init()");

			this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);
			this.data.field = de.titus.form.utils.FormularUtils.getField(this.data.element);
			var validations = [];
			this.data.element.find("[data-form-validation]").each(function() {
				var element = $(this);
				element.addClass("inactive");

				var validation = {
				    element : element,
				    expression : (element.attr("data-form-validation") || "").trim()
				};

				validations.push(validation);
			});

			this.data.validations = validations;

			if (this.data.required || this.data.validations.length > 0) {
				de.titus.form.utils.EventUtils.handleEvent(this.data.element, [de.titus.form.Constants.EVENTS.INITIALIZED, de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED, de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED ], Validation.prototype.__doValidate.bind(this));
				de.titus.form.utils.EventUtils.handleEvent(this.data.formular.data.element, [ de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED, de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED ], Validation.prototype.__doValidate.bind(this));
			} else
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.VALIDATION_VALID);
		};

		Validation.prototype.__doValidate = function(aEvent) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("__doValidate() -> " + aEvent.type);

			var valid = true;
			aEvent.preventDefault();

			if (aEvent.type != de.titus.form.Constants.EVENTS.INITIALIZED && aEvent.type != de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED)
				aEvent.stopPropagation();

			// IGNORE VALIDATION_STATE_CHANGED ON SELF ELEMENT
			if (aEvent.currentTarget == this.data.element && aEvent.Type == de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED)
				return;
			if (aEvent.type == de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED && aEvent.currentTarget != this.data.element)
				return;
			
			var fieldData = this.data.field.getData(true);
			var valueEmpty = this.__valueEmpty(fieldData);
			
			if (this.data.required && !this.data.field.data.condition)
				valid = false;
			else if (this.data.validations.length == 0)
				valid = !this.data.required || !valueEmpty;
			else if (this.data.validations.length > 0 && valueEmpty)
				valid = !this.data.required;
			else
				valid = this.__checkValidation(fieldData);

			if (valid)
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.VALIDATION_VALID);
			else
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.VALIDATION_INVALID);
		};

		Validation.prototype.__checkValidation = function(aFieldData) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("__checkValidation()");

			var formularData = this.data.formular.getData("object", true);
			var data = {
			    value : aFieldData ? aFieldData.value : undefined,
			    form : formularData
			};
			
			var valid = true;
			for (var i = 0; i < this.data.validations.length; i++) {
				var validation = this.data.validations[i];
				var test = this.data.expressionResolver.resolveExpression(validation.expression, data, true)
					if (Validation.LOGGER.isDebugEnabled())
						Validation.LOGGER.logDebug("__checkValidation() -> rexpression: \"" + validation.expression + "\" -> " + test);
				if (test) {
					validation.element.removeClass("inactive");
					validation.element.addClass("active");
					valid = false;
				} else {
					validation.element.removeClass("active");
					validation.element.addClass("inactive");
				}
			}

			return valid;
		};
		
		Validation.prototype.__valueEmpty = function(aFieldData) {
			return aFieldData == undefined || aFieldData.value == undefined || (Array.isArray(aFieldData.value) && aFieldData.value.length == 0) || (typeof aFieldData.value === "string" && aFieldData.value.trim().length == 0);
		};

		de.titus.core.jquery.Components.asComponent("formular_Validation", de.titus.form.Validation);
	});
})();
(function() {
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

			this.data.element.on(de.titus.form.Constants.EVENTS.ACTION_PAGE_BACK, (function() {
				this.data.state = de.titus.form.Constants.STATE.INPUT;
			}).bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.ACTION_PAGE_NEXT, (function() {
				this.data.state = de.titus.form.Constants.STATE.INPUT;
			}).bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.ACTION_SUMMARY, (function() {
				this.data.state = de.titus.form.Constants.STATE.SUMMARY;
			}).bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.ACTION_SUBMIT, Formular.prototype.submit.bind(this));

			this.data.element.formular_StepPanel();
			this.data.element.formular_FormularControls();
			this.data.element.formular_PageController();
			this.data.element.find("[data-form-message]").formular_Message();

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.INITIALIZED);
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

		};
	});

	de.titus.core.jquery.Components.asComponent("Formular", de.titus.form.Formular);

	$(document).ready(function() {
		$('[data-form]').Formular();
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.FormularControls", function() {
		var FormularControls = de.titus.form.FormularControls = function(aElement) {
			if (FormularControls.LOGGER.isDebugEnabled())
				FormularControls.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    controlPanel : aElement.find("[data-form-controls]"),
			    reset : undefined,
			    back : undefined,
			    next : undefined,
			    submit : undefined
			};

			this.init();
		};

		FormularControls.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.FormularControls");

		FormularControls.prototype.init = function() {
			if (FormularControls.LOGGER.isDebugEnabled())
				FormularControls.LOGGER.logDebug("init()");

			this.data.reset = new de.titus.form.utils.FormularControl(this.data.controlPanel.find("[data-form-control='reset']"), de.titus.form.Constants.EVENTS.ACTION_RESET);
			this.data.back = new de.titus.form.utils.FormularControl(this.data.controlPanel.find("[data-form-control='back']"), de.titus.form.Constants.EVENTS.ACTION_PAGE_BACK);
			this.data.next = new de.titus.form.utils.FormularControl(this.data.controlPanel.find("[data-form-control='next']"), de.titus.form.Constants.EVENTS.ACTION_PAGE_NEXT);
			this.data.submit = new de.titus.form.utils.FormularControl(this.data.controlPanel.find("[data-form-control='submit']"), de.titus.form.Constants.EVENTS.ACTION_SUBMIT);

			this.data.reset.show();
			this.data.back.hide();
			this.data.next.hide();
			this.data.submit.hide();

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED ], FormularControls.prototype.update.bind(this), "[data-form-page]");
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ de.titus.form.Constants.EVENTS.INITIALIZED, de.titus.form.Constants.EVENTS.PAGE_CHANGED, de.titus.form.Constants.EVENTS.PAGE_SUMMARY, de.titus.form.Constants.EVENTS.ACTION_SUMMARY, de.titus.form.Constants.EVENTS.ACTION_SUBMIT, de.titus.form.Constants.EVENTS.SUCCESSED ], FormularControls.prototype.update.bind(this));

		};

		FormularControls.prototype.update = function(aEvent) {
			if (FormularControls.LOGGER.isDebugEnabled())
				FormularControls.LOGGER.logDebug("update() -> " + aEvent.type);

			var type = aEvent.type;
			var formular = this.data.element.Formular();
			var pageController = this.data.element.formular_PageController();
			var currentPage = pageController.getCurrentPage() || {
				data : {
				    valid : false,
				    condition : false
				}
			};
			var state = formular.data.state;

			if (type == de.titus.form.Constants.EVENTS.INITIALIZED) {
				this.data.reset.show();
				this.data.back.hide();
				this.data.next.hide();
				this.data.submit.hide();
			} else if (type == de.titus.form.Constants.EVENTS.PAGE_CHANGED) {
				if (pageController.isFirstPage())
					this.data.back.hide();
				else
					this.data.back.show();

				if (currentPage.data.valid)
					this.data.next.show();
				
				this.data.submit.hide();
			} else if (type == de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED) {
				if (currentPage.data.valid)
					this.data.next.show();
			} else if (type == de.titus.form.Constants.EVENTS.PAGE_SUMMARY) {
				this.data.next.hide();
				this.data.submit.show();
			} else if (type == de.titus.form.Constants.EVENTS.ACTION_SUBMIT) {
				this.data.reset.hide();
				this.data.back.hide();
				this.data.next.hide();
				this.data.submit.hide();
			}
		};

		de.titus.core.jquery.Components.asComponent("formular_FormularControls", de.titus.form.FormularControls);
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Page", function() {
		var Page = de.titus.form.Page = function(aElement, aIndex) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formular : undefined,
			    index : aIndex,
			    name : aElement.attr("data-form-page"),
			    condition : false,
			    valid : false,
			    fields : []
			};

			setTimeout(Page.prototype.__init.bind(this), 1);
		};

		Page.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Page");

		Page.prototype.__init = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("init()");

			this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ de.titus.form.Constants.EVENTS.CONDITION_MET, de.titus.form.Constants.EVENTS.CONDITION_NOT_MET ], Page.prototype.__changeConditionState.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED, de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED], Page.prototype.__changeValidationState.bind(this), "[data-form-field]");

			this.data.fields = this.data.element.find("[data-form-field]").formular_Field();
			this.data.element.formular_Condition();

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.INITIALIZED);
		};

		Page.prototype.__changeConditionState = function(aEvent) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("__changeConditionState () for page -> " + aEvent.type);

			aEvent.preventDefault();
			aEvent.stopPropagation();

			var condition = false;
			if (aEvent.type == de.titus.form.Constants.EVENTS.CONDITION_MET)
				condition = true;

			if (this.data.condition != condition) {
				this.data.condition = condition;
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED);
			}
		};

		Page.prototype.__changeValidationState = function(aEvent) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("__changeValidationState () for page -> " + aEvent.type);

			aEvent.preventDefault();

			var valid = this.__allFieldsValid();
			if (this.data.valid != valid) {
				this.data.valid = valid;
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.VALIDATION_STATE_CHANGED);
			}
			
			if (this.data.valid) {
				this.data.element.removeClass("invalid");
				this.data.element.addClass("valid");
			} else {
				this.data.element.removeClass("valid");
				this.data.element.addClass("invalid");
			}
		};
		
		Page.prototype.__allFieldsValid = function(){
			for (var i = 0; i < this.data.fields.length; i++) {
				if(!this.data.fields[i].data.valid)
					return false;
			}
			
			return true;
		};

		Page.prototype.hide = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("hide ()");

			this.data.element.removeClass("active");
			this.data.element.addClass("inactive");

		};

		Page.prototype.show = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("show ()");

			this.data.element.removeClass("inactive");
			this.data.element.addClass("active");
		};

		Page.prototype.summary = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("summary ()");

			this.data.element.removeClass("inactive");
			this.data.element.addClass("active");
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

		$.fn.formular_Page = function(aIndex) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				var pages = [];
				var index = 0;
				this.each(function() {
					pages.push($(this).formular_Condition(index++));
				});

				return pages;
			} else {
				var page = this.data("de.titus.form.Page");
				if (!page) {
					page = new de.titus.form.Page(this, aIndex);
					this.data("de.titus.form.Page", page);
				}
				return page;
			}
		};
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.PageController", function() {
		var PageController = de.titus.form.PageController = function(aElement) {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    pages : [],
			    currentPage : -1
			};

			setTimeout(PageController.prototype.__init.bind(this), 1);
		};

		PageController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.PageController");

		PageController.prototype.__init = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("__init()");

			var pages = [];
			var index = 0;
			var formularElement = this.data.element;
			var lastStep = de.titus.form.Constants.SPECIALSTEPS.START;
			this.data.element.find("[data-form-page]").each(function() {
				var element = $(this);
				var page = element.formular_Page(index++);
				var step = element.attr("data-form-step") || lastStep;
				page.data.step = step;

				page.hide();
				pages.push(page);
			});
			this.data.pages = pages;

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [de.titus.form.Constants.EVENTS.CONDITION_STATE_CHANGED], PageController.prototype.toNextPage.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, de.titus.form.Constants.EVENTS.ACTION_PAGE_BACK, PageController.prototype.toPrevPage.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, de.titus.form.Constants.EVENTS.ACTION_PAGE_NEXT, PageController.prototype.toNextPage.bind(this));

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.ACTION_PAGE_NEXT);
		};

		PageController.prototype.isFirstPage = function() {
			return this.data.currentPage <= 0;
		};

		PageController.prototype.getCurrentPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("getCurrentPage()");

			if (this.data.currentPage < 0)
				return;

			return this.data.pages[this.data.currentPage];
		};

		PageController.prototype.hasNextPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("hasNextPage()");

			return this.getNextPage() != undefined;
		};

		PageController.prototype.getNextPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("getNextPage()");

			var currentPage = this.getCurrentPage();
			if (currentPage && !currentPage.data.valid)
				return currentPage;

			for (var i = this.data.currentPage + 1; i < this.data.pages.length; i++) {
				var page = this.data.pages[i];
				if (page.data.condition)
					return page;
			}
		};

		PageController.prototype.getPrevPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("getPrevPage()");

			for (var i = this.data.currentPage - 1; 0 <= i; i--) {
				var page = this.data.pages[i];
				if (page.data.condition)
					return page;
			}
		};

		PageController.prototype.toPage = function(aPage) {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("toPage()");
			if (aPage) {

				this.data.element.removeClass("summary");

				var currentPage = this.getCurrentPage();
				if (currentPage)
					currentPage.hide();

				this.data.currentPage = aPage.data.index;
				aPage.show();
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.PAGE_CHANGED);

			}
		};

		PageController.prototype.toPrevPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("toPrevPage()");

			var page = this.getPrevPage();
			this.toPage(page);
		};

		PageController.prototype.toNextPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("toNextPage()");
			var page = this.getNextPage();
			if(page)
				this.toPage(page);
			else if(this.data.currentPage >= 0)
				this.toSummary();
		};

		PageController.prototype.toSummary = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("toSummary()");

			this.data.element.addClass("summary");

			for (var i = 0; i < this.data.pages.length; i++) {
				var page = this.data.pages[i];
				page.summary();
			}

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.PAGE_CHANGED);
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, de.titus.form.Constants.EVENTS.PAGE_SUMMARY);
		};

		de.titus.core.jquery.Components.asComponent("formular_PageController", de.titus.form.PageController);
	});
})($);
(function() {
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
				var step = {
				    index : index++,
				    id : element.attr("data-form-step").toLowerCase(),
				    element : element
				};
				steps.push(step);
			});

			this.data.steps = steps;

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ de.titus.form.Constants.EVENTS.PAGE_CHANGED, de.titus.form.Constants.EVENTS.INITIALIZED ], StepPanel.prototype.update.bind(this));
		};

		StepPanel.prototype.setStep = function(aId) {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("setStep(\"" + aId + "\")");
			var step = this.getStep(aId);
			if (step != undefined) {
				if (this.data.current) {
					this.data.current.element.removeClass("active");
					this.data.element.removeClass("step-" + this.data.current.element.id);
				}
				this.data.current = step;
				this.data.current.element.addClass("active");
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

		de.titus.core.jquery.Components.asComponent("formular_StepPanel", de.titus.form.StepPanel);
	});
})($);
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
