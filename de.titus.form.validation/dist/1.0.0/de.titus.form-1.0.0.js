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
			this.element = aElement;
			this.dataController = aDataController;
			this.name = aElement.attr(de.titus.form.Setup.prefix + "-field");
			this.type = aElement.attr(de.titus.form.Setup.prefix + "-field-type");
			
			var initializeFunction = de.titus.form.Setup.fieldtypes[this.type] || de.titus.form.Setup.fieldtypes["testField"];
			if (initializeFunction == undefined || typeof initializeFunction !== "function")
				throw "The fieldtype \"" + this.type + "\" is not available!";
			
			this.fieldController = initializeFunction(this.element, this.name, de.titus.form.Field.prototype.doValueChange.bind(this));
		};
	});
	
	de.titus.form.Field.prototype.doConditionCheck = function() {
		if (this.isConditionSatisfied())
			this.dataController.showField(this.dataController.data);
		else
			this.dataController.hideField();
	};
	
	de.titus.form.Field.prototype.isConditionSatisfied = function() {
		
		// TODO
		return true; // if condition is satisfied
	};
	
	de.titus.form.Field.prototype.doValueChange = function(aEvent) {
		console.log("doValueChange");
		console.log(aEvent);
		if (aEvent != undefined) {
			if (typeof aEvent.preventDefault === "function")
				aEvent.preventDefault();
			if (typeof aEvent.stopPropagation === "function")
				aEvent.stopPropagation();
		}
		
		var value = this.fieldController.getValue();
		if (this.isValid(value))
			this.dataController.changeValue(this.name, value);
		else
			this.dataController.changeValue(this.name, null);
		
		this.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
	};
	
	de.titus.form.Field.prototype.isValid = function(aValue) {
		console.log("isValid");
		// TODO
		this.fieldController.setValied(true, "Not Valid!");
		return true;// if value valied!
	};
	
	$.fn.FormField = function(aDataController) {
		if (this.length == undefined || this.length == 0)
			return;
		else if (this.length > 1) {
			var result = [];
			this.each(function() {
				result.push($(this).FormField(aDataController));
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
			this.element = aElement;
			this.name = aElement.attr(de.titus.form.Setup.prefix);
			this.pages = [];
			this.dataController = new de.titus.form.DataController(function(){});
			
			this.init();
		};
		
		de.titus.form.Formular.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Formular");
		
		de.titus.form.Formular.prototype.init = function() {
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("init()");
			this.pages.push({});
			this.initFields(this.element, this.pages[0]);
		};
		
		de.titus.form.Formular.prototype.initFields = function(aElement, aPage) {
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("initFields()");
			
			if (aElement.attr(de.titus.form.Setup.prefix + "-field") != undefined) {
				var field = aElement.FormField(this.dataController);
				aPage[field.name] = field;
			} else {
				var children = aElement.children();
				for (var i = 0; i < children.length; i++) {
					this.initFields($(children[i]), aPage);
				}
			}
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
		
		de.titus.form.FieldController.prototype.hideField = function() {
			console.log("hideField");
			this.element.hide()
		};
		
		de.titus.form.FieldController.prototype.setValied = function(isValied, aMessage) {
			console.log("setValied");
			if (!isValied) {
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
