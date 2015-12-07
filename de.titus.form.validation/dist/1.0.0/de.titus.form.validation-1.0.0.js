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
		var dependencyString = aElement.attr("form-field-dependency");
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
	
	de.titus.form.FormUtils.getMessage = function(aFieldname, aForm){
		var element = aForm.data.element.find("[form-message-for='" + aFieldname + "']");
		return new de.titus.form.Message({"element": element});		
	};
	
	de.titus.form.FormUtils.getFieldValidatorTypes = function(aElement){
		var valitationTypes = aElement.attr("form-valitations");
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
			type: undefined,
			validators: undefined,
			message: undefined,
			dependencies: undefined,
			load: undefined,
			form: undefined,
			value: undefined,
			valid: {"valid": false, "message": ""}
		};
		$.extend(true, this.data, aData);
		this.data.element.data("de.titus.form.Field", this);
	};
		
	de.titus.form.Field.prototype.show = function(show){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.show()");
		}
		if(show)		
			this.data.element.show();
		else
			this.data.element.hide();
	};
	
	de.titus.form.Field.prototype.doLoad = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.doLoad()");
		}
	};
	
	de.titus.form.Field.prototype.readValue = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.readValue()");
		}
		return "";
	};
	
	de.titus.form.Field.prototype.isValid = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.isValid()");
		}
		
		return this.data.validData.valid;
	};
	
	de.titus.form.Field.prototype.__isInputValid = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.__isInputValid()");
		}
		if(this.data.validDataators != undefined && this.data.validDataators.length > 0){
			var count = this.data.validDataators.length;
			for(var i = 0; i < count; i++){
				var validator = this.data.validDataators[i];
				if(!validator.doValidate(this.data.value, this)){
					this.data.validData =  false;
					return this.data.validData;
				}				
			}
		}			
		this.data.validData = {"valid": true, "message": ""};
		
		return this.data.validData.valid;
	};
	
	de.titus.form.Field.prototype.__valueChangeEvent = function(){
		if(de.titus.form.Field.LOGGER.isDebugEnabled()){
			de.titus.form.Field.LOGGER.logDebug("call de.titus.form.Field.prototype.__valueChangeEvent()");
		}
		this.data.value = this.readValue();		
		if(this.__isInputValid().valid)
			this.data.form.fireEvent("valid", this);
		else
			this.data.form.fireEvent("invalid", this);
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
		
		this.changeEventTimeoutid = setTimeout(this.parent.__valueChangeEvent.bind(this), 500);
	};	
		
	de.titus.form.TextField.prototype.readValue = function(){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.TextField.prototype.readValue() -> " + this.data.inputElement.val());
		}
		return this.data.inputElement.val();
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
			validAction: undefined
		};
		
		var fields = this.data.element.find("[form-field]");		
		var count = fields.length;
		for(var i = 0; i < count; i++){
			var field = $(fields[i]);
			var fieldname = field.attr("form-field") || field.attr("id");
			
			var fieldData = {
				element: field,
				name:  fieldname,
				type: field.attr("form-type"),
				message: de.titus.form.FormUtils.getMessage(fieldname, this),
				validators: de.titus.form.FormUtils.getValidators(field),
				dependencies: de.titus.form.FormUtils.getFieldDependencies(field),
				load: field.attr("form-load"),
				form: this
			};
			
			var fieldType = de.titus.form.FieldtypeRegistry.get(fieldData.type);
			this.data.fields[fieldData.name] = new fieldType(fieldData);			
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
	
	de.titus.form.Form.prototype.isValid = function(){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.Form.prototype.isValid");
		}
		var count = this.data.fields.length;
		for(var i = 0; i < count; i++){
			if(!fields[i].isValid())
				return false;			
		}
		return true;		
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
de.titus.core.Namespace.create("de.titus.form.Message", function() {

	de.titus.form.Message = function(aData){
		this.data = {
			element: undefined
		};
		$.extend(true, this.data, aData);
		this.data.element.data("de.titus.form.Message", this);		
		this.init();
	};
	
	de.titus.form.Message.prototype.init = function(){
		
	};
	
	de.titus.form.Message.prototype.setMessage = function(aMessage){
		this.data.element.empty();
		this.data.element.html(aMessage);
		this.show(true);
	};
	
	de.titus.form.Message.prototype.doClear = function(){
		this.data.element.empty();
		this.show(false);
	};
		
	de.titus.form.Message.prototype.show = function(show){
		if(show)		
			this.data.element.show();
		else
			this.data.element.hide();
	};
	
	$.fn.FormMessage = function(){
		if(this.length > 1){
			return this.each(function(){return $(this).FormMessage();});
		}
		
		return this.data.element.data("de.titus.form.Message");
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
			expression: undefined,
			message: undefined
		};
		$.extend(true, this.data, aData);
		this.data.element.data("de.titus.form.Validator", this);
	};
	
	de.titus.form.Validator.prototype.doValidate = function(aValue, aField){
		if(de.titus.form.Validator.LOGGER.isDebugEnabled()){
			de.titus.form.Validator.LOGGER.logDebug("call de.titus.form.Validator.prototype.doValidate()");
		}
		return {"valid": false, "message": "is invalid"};		
	};
});
