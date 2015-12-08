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

de.titus.core.Namespace.create("de.titus.form.FieldtypeRegistry", function() {

	de.titus.form.FieldtypeRegistry.FIELDTYPES = {};
	
	de.titus.form.FieldtypeRegistry.add = function(aTypeKey, Type){
		de.titus.form.FieldtypeRegistry.FIELDTYPES[aTypeKey.toLowerCase()] = Type;
	};
	
	de.titus.form.FieldtypeRegistry.get = function(aTypeKey){
		return de.titus.form.FieldtypeRegistry.FIELDTYPES[aTypeKey.toLowerCase()];
	};	
});
de.titus.core.Namespace.create("de.titus.form.FormUtils", function() {
	
	de.titus.form.FormUtils.getFieldDependencies = function(aElement){
		var dependencyString = aElement.attr("form-dependencies");
		if(dependencyString == undefined)
			return [];
				
		dependencyString = dependencyString.replace("[", "");
		dependencyString = dependencyString.replace("]", "");
		dependencyString = dependencyString.replace(" ", "");
		
		if(dependencyString == "")
			return [];
		else if(dependencyString.indexOf(",") != -1)
			return dependencyString.split(",")
		else
			return [dependencyString];	
	};
	
	de.titus.form.FormUtils.getMessageController = function(aField, aForm){
		var element = aForm.data.element.find("[form-message-for='" + aField.data.fieldname + "']");
		return new de.titus.form.MessageController({"element": element, "field": aField});		
	};
	
	de.titus.form.FormUtils.getFieldValidatorTypes = function(aElement){
		var valitationTypes = aElement.attr("form-validation");
		if(valitationTypes == undefined)
			return [];
				
		valitationTypes = valitationTypes.replace("[", "");
		valitationTypes = valitationTypes.replace("]", "");
		valitationTypes = valitationTypes.replace(" ", "");
		
		if(valitationTypes == "")
			return [];
		else if(valitationTypes.indexOf(",") != -1)
			return valitationTypes.split(",")
		else
			return [valitationTypes];	
	};
	
	de.titus.form.FormUtils.getValidators = function(aElement){
		var result = [];
		var types = de.titus.form.FormUtils.getFieldValidatorTypes(aElement);
		if(types == undefined)
			return result;
		
		var dependencies= aElement.attr("form-dependencies");
		if( dependencies != undefined && dependencies != ""){
			var validatorType = de.titus.form.ValidatorRegistry.get("dependencies");
			if(validatorType != undefined)
				result.push( new validatorType({"element": aElement}));
		}
		
		var required= (aElement.attr("required") != undefined) || (aElement.attr("form-required") != undefined) || (aElement.attr("form-validation-required") != undefined);
		if(required != undefined){
			var validatorType = de.titus.form.ValidatorRegistry.get("required");
			if(validatorType != undefined)
				result.push( new validatorType({"element": aElement}));
		}
		
		var count = types.length;
		for(var i = 0; i < count; i++){
			var validatorType = de.titus.form.ValidatorRegistry.get(types[i]);
			if(validatorType != undefined)
				result.push( new validatorType({"element": aElement}));
		}
		return result;
	};
	
	
});
de.titus.core.Namespace.create("de.titus.form.Field", function() {

	de.titus.form.Field = function(aData){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.constructor()");
		}
		if(aData != undefined)
			this.init(aData);
	};
	
	de.titus.form.Field.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Field");
	
	de.titus.form.Field.prototype.init = function(aData){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.init()");
		}
		this.data = {
			element: undefined,
			fieldname: undefined,
			type: undefined,
			validators: undefined,
			dependencies: undefined,
			load: undefined,
			form: undefined,
			values: undefined,
			validData: {"valid": false, "message": ""},
			validateTimeout: 300
		};
		$.extend(true, this.data, aData);		
		this.data.element.data("de.titus.form.Field", this);
		return;
	};
		
	de.titus.form.Field.prototype.show = function(show){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.show()");
		}
		if(show)		
			this.data.element.show();
		else
			this.data.element.hide();
		return;
	};
	
	de.titus.form.Field.prototype.doLoad = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.doLoad()");
		}
		return;
	};
	
	de.titus.form.Field.prototype.readValues = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.readValue()");
		}
		return "";
	};
	
	de.titus.form.Field.prototype.isValid = function(force){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.isValid()");
		}
		if(force)
			this.__isInputValid();
		
		return this.data.validData.valid;
	};
	
	de.titus.form.Field.prototype.__isInputValid = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.__isInputValid()");
		}
		this.__executeValidators();
		

		if(this.data.validData != undefined && !this.data.validData.valid)
			this.data.form.printMessage(this.data.validData.message, this.data.fieldname);
		else 
			this.data.form.clearMessage(this.data.fieldname);
		
		return this.data.validData.valid;
	};
	
	de.titus.form.Field.prototype.__executeValidators = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.__executeValidators()");
		}
		if(this.data.validators != undefined && this.data.validators.length > 0){
			var count = this.data.validators.length;
			for(var i = 0; i < count; i++){
				var validator = this.data.validators[i];
				this.data.validData = validator.doValidate(this.data.values, this);
				if(!this.data.validData.valid)
					return;	
			}
		}			
		this.data.validData = {"valid": true, "message": ""};
		return;
	};
	
	de.titus.form.Field.prototype.__valueChangeEvent = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.__valueChangeEvent()");
		}
		this.data.values = this.readValues();		
		if(this.__isInputValid().valid)
			this.data.form.fireEvent("valid", this);
		else
			this.data.form.fireEvent("invalid", this);
		return;
	};
	
	$.fn.FormField = function(){
		if(this.length > 1){
			return this.each(function(){return $(this).FormField();});
		}
		
		return this.data.element.data("de.titus.form.Field");
	};	
});
de.titus.core.Namespace.create("de.titus.form.TextField", function() {

	de.titus.form.TextField =  function(aData){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.TextField.prototype.constructor()");
		}
		this.init(aData);
	};	
	
	de.titus.form.TextField.prototype = Object.create(de.titus.form.Field.prototype);
	de.titus.form.TextField.prototype.constructor = de.titus.form.TextField;
	de.titus.form.TextField.prototype.parent = de.titus.form.Field.prototype;
	
	de.titus.form.TextField.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.TextField");
	
	de.titus.form.TextField.prototype.init = function(aData){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.TextField.prototype.init()");
		}
		this.parent.init.call(this, aData);
		if(this.data.element.is("input[type='text']"))
			this.data.inputElement = this.data.element;
		else
			this.data.inputElement = this.data.element.find("input[type='text']");
		
		var $__THIS__$ = this;
		this.data.inputElement.bind( "keyup", this.__valueChangeEvent.bind(this));
	};
	
	de.titus.form.TextField.prototype.__valueChangeEvent = function(){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.TextField.prototype.__valueChangeEvent()");
		}
		if(this.changeEventTimeoutid)
			clearTimeout(this.changeEventTimeoutid);
		
		this.changeEventTimeoutid = setTimeout(this.parent.__valueChangeEvent.bind(this), this.data.validateTimeout);
	};	
		
	de.titus.form.TextField.prototype.readValues = function(){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.TextField.prototype.readValue() -> " + this.data.inputElement.val());
		}
		var value = this.data.inputElement.val();
		if(value == undefined || value == "")
			return [];
		
		return [value];
	};
	
	de.titus.form.FieldtypeRegistry.add("text", de.titus.form.TextField);
});
de.titus.core.Namespace.create("de.titus.form.Form", function() {

	de.titus.form.Form = function(aElement){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.constructor()");
		}
		this.init(aElement);
	};
	
	de.titus.form.Form.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Form");
	
	de.titus.form.Form.prototype.init = function(aElement){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.init()");
		}
		this.data = {
			element : aElement,
			fields: {},
			messageController: {},
			submitButtons: [],
			validAction: undefined,
			validateTimeout: 10
		};
		
		var fields = this.data.element.find("[form-field]");		
		var count = fields.length;
		for(var i = 0; i < count; i++){
			this.__buildField($(fields[i]));			
		}

		var $__THIS__$ = this;
		this.data.element.find("[type='submit'],[form-submit]").each(function(){
			$__THIS__$.data.submitButtons.push($(this));
		});		
		
		if(this.data.element.attr("form-validate-on-start")!= undefined){
			setTimeout(function(){$__THIS__$.isValid(false, true)}, this.data.validateTimeout);
		}
		
	};
	
	de.titus.form.Form.prototype.__buildField = function(aElement){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.__buildField()");
		}
		var data = this.__buildFieldData(aElement);		
		var fieldType = de.titus.form.FieldtypeRegistry.get(data.type);
		var fieldInstance = new fieldType(data);
		this.data.fields[data.fieldname] = fieldInstance;
		this.data.messageController[data.fieldname] = de.titus.form.FormUtils.getMessageController(fieldInstance, this);
	};
	
	de.titus.form.Form.prototype.__buildFieldData = function(aElement){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.__buildFieldData()");
		}
		return {
			"element": aElement,
			"fieldname":  aElement.attr("form-field") || aElement.attr("id"),
			"type": aElement.attr("form-type"),				
			"validators": de.titus.form.FormUtils.getValidators(aElement),
			"dependencies": de.titus.form.FormUtils.getFieldDependencies(aElement),
			"load": aElement.attr("form-load"),
			"form": this
		};
	};
	
	de.titus.form.Form.prototype.printMessage = function(aMessage, aFieldname){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.printMessage()");
		}
		var messageController = this.data.messageController[aFieldname];
		if(messageController != undefined){
			messageController.setMessage(aMessage);
		}
	};
	
	de.titus.form.Form.prototype.clearMessage = function(aFieldname){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.clearMessage()");
		}
		var messageController = this.data.messageController[aFieldname];
		if(messageController != undefined){
			messageController.doClear();
		}
	};
	
	de.titus.form.Form.prototype.fireEvent = function(aEvent, aField){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.fireEvent()");
		}
		if(aEvent.toLowerCase() == "valid"){
			this.__onFieldValueChanged(aField);
		}
		else if(aEvent.toLowerCase() == "invalid"){
			this.__onFieldValueChanged(aField);
		}
		
		var $__THIS__$ = this;
		setTimeout(function(){$__THIS__$.isValid(false, true)}, this.data.validateTimeout);
	};
	
	de.titus.form.Form.prototype.__onFieldValueChanged = function(aField){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.__onFieldValueChanged()");
		}
		var isValid = aField.isValid();
		var dependencies = aField.data.dependencies;
		var count = dependencies.length;
		for(var i = 0; i < count; i++){
			var dependency = dependencies[i];
			var dependentField = this.data.fields[dependency];
			if(dependentField != undefined){
				dependentField.show(isValied);
			}			
		}
	};
	
	de.titus.form.Form.prototype.isValid = function(force, all){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.isValid()");
		}
		var valid = this.__validFields(force, all);
		if(valid)
			this.enableSubmitButtons(true);
		else 
			this.enableSubmitButtons(false);
	};
	
	de.titus.form.Form.prototype.__validFields = function(force, all){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.__validFields()");
		}
		var valid = true;
		var fieldname = undefined;
		for(fieldname in this.data.fields){
			var field = this.data.fields[fieldname];
			var fieldValid = field.isValid(force);
			valid = valid && fieldValid;
			if(!valid && !all)
				return valid;
		}
		return valid;
	};
	
	
	de.titus.form.Form.prototype.enableSubmitButtons = function(enable){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.enableSubmitButtons()");
		}
		var count = this.data.submitButtons.length;
		for(var i = 0; i < count; i++){
			var button = this.data.submitButtons[i];
			button.prop('disabled', !enable);
		}
	};
	
	$.fn.Form = function(){
		if(this.length > 1){
			return this.each(function(){return $(this).Form();});
		}
		
		var form = this.data("de.titus.form.Form");
		if(form == undefined){
			form = new de.titus.form.Form(this);
			this.data("de.titus.form.Form", form);
		}
		
		return form;
	};	
	
	
});
de.titus.core.Namespace.create("de.titus.form.MessageControllerController", function() {

	de.titus.form.MessageController = function(aData){
		if(de.titus.form.MessageController.LOGGER.isDebugEnabled()){
			de.titus.form.MessageController.LOGGER.logDebug("call de.titus.form.MessageController.prototype.constructor()");
		}
		this.init(aData);
	};
	de.titus.form.MessageController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.MessageController");
	
	de.titus.form.MessageController.prototype.init = function(aData){
		if(de.titus.form.MessageController.LOGGER.isDebugEnabled()){
			de.titus.form.MessageController.LOGGER.logDebug("call de.titus.form.MessageController.prototype.init()");
		}
		this.data = {
				element: undefined,
				field: undefined
			};
			$.extend(true, this.data, aData);
		};
	
	de.titus.form.MessageController.prototype.setMessage = function(aMessage){
		if(de.titus.form.MessageController.LOGGER.isDebugEnabled()){
			de.titus.form.MessageController.LOGGER.logDebug("call de.titus.form.MessageController.prototype.setMessage()");
		}
		this.data.element.empty();
		this.data.element.html(aMessage);
		this.show(true);
	};
	
	de.titus.form.MessageController.prototype.doClear = function(){
		if(de.titus.form.MessageController.LOGGER.isDebugEnabled()){
			de.titus.form.MessageController.LOGGER.logDebug("call de.titus.form.MessageController.prototype.doClear()");
		}
		this.data.element.empty();
		this.show(false);
	};
		
	de.titus.form.MessageController.prototype.show = function(show){
		if(de.titus.form.MessageController.LOGGER.isDebugEnabled()){
			de.titus.form.MessageController.LOGGER.logDebug("call de.titus.form.MessageController.prototype.show()");
		}
		if(show)		
			this.data.element.show();
		else
			this.data.element.hide();
	};
});
de.titus.core.Namespace.create("de.titus.form.ValidatorRegistry", function() {

	de.titus.form.ValidatorRegistry.VALIDATORTYPES = {};
	
	de.titus.form.ValidatorRegistry.add = function(aTypeKey, Type){
		de.titus.form.ValidatorRegistry.VALIDATORTYPES[aTypeKey.toLowerCase()] = Type;
	};
	
	de.titus.form.ValidatorRegistry.get = function(aTypeKey){
		if(aTypeKey == undefined || aTypeKey == "")
			return;
		
		return de.titus.form.ValidatorRegistry.VALIDATORTYPES[aTypeKey.toLowerCase()];
	};	
});de.titus.core.Namespace.create("de.titus.form.Validator", function() {

	de.titus.form.Validator = function(aData){
		if(de.titus.form.Validator.LOGGER.isDebugEnabled()){
			de.titus.form.Validator.LOGGER.logDebug("call de.titus.form.Validator.prototype.constructor()");
		}
		this.init(aData);
	};
	de.titus.form.Validator.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Validator");
	
	de.titus.form.Validator.prototype.init = function(aData){
		if(de.titus.form.Validator.LOGGER.isDebugEnabled()){
			de.titus.form.Validator.LOGGER.logDebug("call de.titus.form.Validator.prototype.init()");
		}
		this.data = {
			element: undefined
		};
		$.extend(true, this.data, aData);
	};
	
	de.titus.form.Validator.prototype.doValidate = function(aValues, aField){
		if(de.titus.form.Validator.LOGGER.isDebugEnabled()){
			de.titus.form.Validator.LOGGER.logDebug("call de.titus.form.Validator.prototype.doValidate()");
		}
		return {"valid": false, "message": "is invalid"};		
	};
});
de.titus.core.Namespace.create("de.titus.form.RequiredValitdator", function() {

	de.titus.form.RequiredValitdator = function(aData){
		if(de.titus.form.RequiredValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.RequiredValitdator.LOGGER.logDebug("call de.titus.form.RequiredValitdator.prototype.constructor()");
		}
		this.init(aData);
	};
	
	de.titus.form.RequiredValitdator.prototype = Object.create(de.titus.form.Validator.prototype);
	de.titus.form.RequiredValitdator.prototype.constructor = de.titus.form.RequiredValitdator;
	de.titus.form.RequiredValitdator.prototype.parent = de.titus.form.Validator.prototype;
	
	de.titus.form.RequiredValitdator.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.RequiredValitdator");
	
	de.titus.form.RequiredValitdator.prototype.init = function(aData){
		if(de.titus.form.RequiredValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.RequiredValitdator.LOGGER.logDebug("call de.titus.form.RequiredValitdator.prototype.init()");
		}
		this.parent.init.call(this, aData);
		this.data.validData = {"valid": false, "message": (this.data.element.attr("form-required-message") || this.data.element.attr("form-validation-required-message") || "invalid")};	
	};
	
	de.titus.form.RequiredValitdator.prototype.doValidate = function(aValue, aField){
		if(de.titus.form.RequiredValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.RequiredValitdator.LOGGER.logDebug("call de.titus.form.RequiredValitdator.prototype.doValidate()");
		}
		this.__doValidateValue(aValue);		
		return this.data.validData;		
	};
	
	de.titus.form.RequiredValitdator.prototype.__doValidateValue = function(aValues){
		if(de.titus.form.RequiredValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.RequiredValitdator.LOGGER.logDebug("call de.titus.form.RequiredValitdator.prototype.__doValidateValue()");
		}
		
		if(aValues == undefined || aValues.length == undefined || aValues.length == 0){
			this.data.validData.valid = false;
		}
		else{
			var count = aValues.length;
			for(var i = 0; i < count; i++){
				if(aValues[i] == ""){
					this.data.validData.valid = false;
					return;
				}
			}
			this.data.validData.valid = true;
		}
		return;
	};
	
	de.titus.form.ValidatorRegistry.add("required", de.titus.form.RequiredValitdator);
});
de.titus.core.Namespace.create("de.titus.form.DependencyValitdator", function() {

	de.titus.form.DependencyValitdator = function(aData){
		if(de.titus.form.DependencyValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.DependencyValitdator.LOGGER.logDebug("call de.titus.form.DependencyValitdator.prototype.constructor()");
		}
		this.init(aData);
	};
	
	de.titus.form.DependencyValitdator.prototype = Object.create(de.titus.form.Validator.prototype);
	de.titus.form.DependencyValitdator.prototype.constructor = de.titus.form.DependencyValitdator;
	de.titus.form.DependencyValitdator.prototype.parent = de.titus.form.Validator.prototype;
	
	de.titus.form.DependencyValitdator.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DependencyValitdator");
	
	de.titus.form.DependencyValitdator.prototype.init = function(aData){
		if(de.titus.form.DependencyValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.DependencyValitdator.LOGGER.logDebug("call de.titus.form.DependencyValitdator.prototype.init()");
		}
		this.parent.init.call(this, aData);
		this.data.validData = {"valid": false, "message": this.data.element.attr("form-dependencies-message")};	
	};
	
	de.titus.form.DependencyValitdator.prototype.doValidate = function(aValue, aField){
		if(de.titus.form.DependencyValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.DependencyValitdator.LOGGER.logDebug("call de.titus.form.DependencyValitdator.prototype.doValidate()");
		}
		var dependencies = aField.data.dependencies;
		var count = dependencies.length;
		for(var i = 0; i < count; i++){
			var dependentField = aField.data.form.data.fields[dependencies[i]];
			if(dependentField != undefined){
				var valid = dependentField.isValid();
				if(!valid){
					this.data.validData = false;
					aField.show(false);
					return;
				}
			}			
		}
		this.data.validData.valid = true;
		aField.show(true);
		return this.data.validData;		
	};
	
	
	
	de.titus.form.ValidatorRegistry.add("dependencies", de.titus.form.DependencyValitdator);
});
de.titus.core.Namespace.create("de.titus.form.RegexValitdator", function() {

	de.titus.form.RegexValitdator = function(aData){
		if(de.titus.form.RegexValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.RegexValitdator.LOGGER.logDebug("call de.titus.form.RegexValitdator.prototype.constructor()");
		}
		this.init(aData);
	};
	
	de.titus.form.RegexValitdator.prototype = Object.create(de.titus.form.Validator.prototype);
	de.titus.form.RegexValitdator.prototype.constructor = de.titus.form.RegexValitdator;
	de.titus.form.RegexValitdator.prototype.parent = de.titus.form.Validator.prototype;
	
	de.titus.form.RegexValitdator.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.RegexValitdator");
	
	de.titus.form.RegexValitdator.prototype.init = function(aData){
		if(de.titus.form.RegexValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.RegexValitdator.LOGGER.logDebug("call de.titus.form.RegexValitdator.prototype.init()");
		}
		this.parent.init.call(this, aData);
		this.data.regex = new de.titus.core.regex.Regex((this.data.element.attr("form-validation-regex") || ".*"));
		this.data.validData = {"valid": false, "message": (this.data.element.attr("form-validation-regex-message") || "invalid")};	
	};
	
	de.titus.form.RegexValitdator.prototype.doValidate = function(aValue, aField){
		if(de.titus.form.RegexValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.RegexValitdator.LOGGER.logDebug("call de.titus.form.RegexValitdator.prototype.doValidate()");
		}
		this.__doValidateValue(aValue);		
		return this.data.validData;		
	};
	
	de.titus.form.RegexValitdator.prototype.__doValidateValue = function(aValues){
		if(de.titus.form.RegexValitdator.LOGGER.isDebugEnabled()){
			de.titus.form.RegexValitdator.LOGGER.logDebug("call de.titus.form.RegexValitdator.prototype.__doValidateValue()");
		}

		if(aValues == undefined){
			this.data.validData.valid = false;
		}
		else{
			var count = aValues.length;
			for(var i = 0; i < count; i++){
				if(!this.data.regex.parse(aValues[i]).isMatching()){
					this.data.validData.valid = false;
					return;
				}
			}
			this.data.validData.valid = true;
		}
		return;
	};
	
	de.titus.form.ValidatorRegistry.add("regex", de.titus.form.RegexValitdator);
});
