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
	
	de.titus.form.FormUtils.getValidator = function(aElement){
		var type = aElement.attr("form-valitation-type");
		if(type == undefined)
			return;
		
		var expression = aElement.attr("form-valitation");
		var message = aElement.attr("form-validation-message");
		var validatorType = de.titus.form.ValidatorRegistry.get(type);
		
		return new validatorType({
			"expression": expression,
			"message": message
		});
	};
	
	
});
de.titus.core.Namespace.create("de.titus.form.Field", function() {

	de.titus.form.Field = function(aData){
		this.data = {
			element: undefined,
			type: undefined,
			validator: undefined,
			message: undefined,
			dependencies: undefined,
			load: undefined,
			form: undefined,
			value: undefined
		};
		$.extend(true, this.data, aData);
		this.data.element.data("de.titus.form.Field", this);
	};
	
	de.titus.form.Field.prototype.init = function(aData){

	};
		
	de.titus.form.Field.prototype.show = function(show){
		if(show)		
			this.data.element.show();
		else
			this.data.element.hide();
	};
	
	de.titus.form.Field.prototype.doLoad = function(){
	};
	
	de.titus.form.Field.prototype.readValue = function(){
		return "";
	};
	
	de.titus.form.Field.prototype.isValid = function(){		
		return this.data.validator.doValidate(this.data.value, this);
	};
	
	de.titus.form.Field.prototype.__valueChangeEvent = function(){
		this.data.value = this.readValue();		
		if(this.isValid())
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
		de.titus.form.Field.call(this, aData);
		this.data.inputElement = this.data.element.find("input");
	};		
	de.titus.form.TextField.prototype = Object.create(de.titus.form.Field.prototype);
	de.titus.form.TextField.prototype.constructor = de.titus.form.TextField;
	
	de.titus.form.TextField.prototype.init = function(){		
		
	};
	
	
	
	
		
	de.titus.form.TextField.prototype.readValue = function(){		
		return this.data.inputElement.val();
	};
	
	de.titus.form.FieldtypeRegistry.add("text", de.titus.form.TextField);
});
de.titus.core.Namespace.create("de.titus.form.Form", function() {

	de.titus.form.Form = function(aElement){
		this.data = {
			element : aElement,
			fields: {},
			validAction: undefined
		};
		this.init();
	};
	
	de.titus.form.Form.prototype.init = function(){
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
				validator: de.titus.form.FormUtils.getValidator(field),
				dependencies: de.titus.form.FormUtils.getFieldDependencies(field),
				load: field.attr("form-load"),
				form: this
			};
			
			var fieldType = de.titus.form.FieldtypeRegistry.get(fieldData.type);
			this.data.fields[fieldData.name] = new fieldType(fieldData);			
		}
	};
	
	de.titus.form.Form.prototype.fireEvent = function(aEvent, aField){
		if(aEvent.toLowerCase() == "valid"){
			this.__onFieldValueChanged(aField);
		}
		else if(aEvent.toLowerCase() == "invalid"){
			this.__onFieldValueChanged(aField);
		}		
	};
	
	de.titus.form.Form.prototype.__onFieldValueChanged = function(aField){
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
			return; //TODO default Validator
		
		return de.titus.form.ValidatorRegistry.VALIDATORTYPES[aTypeKey.toLowerCase()];
	};	
});de.titus.core.Namespace.create("de.titus.form.Validator", function() {

	de.titus.form.Validator = function(aData){
		this.data = {
			expression: undefined,
			message: undefined
		};
		$.extend(true, this.data, aData);
		this.data.element.data("de.titus.form.Validator", this);		
		this.init();
	};
	
	de.titus.form.Validator.prototype.init = function(){
		
	};
	
	de.titus.form.Validator.prototype.doValidate = function(aValue, aField){		
		return {"isValid": false, "message": "is invalid"};		
	};
});
