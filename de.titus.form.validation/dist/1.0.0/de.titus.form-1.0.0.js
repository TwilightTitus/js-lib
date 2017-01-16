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
		FORM_ACTION_CANCEL : "form-action-cancel",
		FORM_ACTION_SUBMIT : "form-action-submit",
		
		FORM_PAGE_INITIALIZED : "form-page-initalized",
		FORM_PAGE_CHANGED : "form-page-changed",
		FORM_PAGE_SHOW : "form-page-show",
		
		FORM_STEP_BACK : "form-step-back",
		FORM_STEP_NEXT : "form-step-next",
		FORM_STEP_FINISHED : "form-step-finished",
		
		FIELD_VALUE_CHANGED : "form-field-value-changed"
		
		};
		
		de.titus.form.Constants.STATE = {
		PAGES : "form-state-pages",
		SUMMARY : "form-state-summary",
		SUBMITED : "form-state-submited",
		};
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
			
			var initializeFunction = de.titus.form.Setup.fieldtypes[this.data.type] || de.titus.form.Setup.fieldtypes["default"];
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
			if (de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix);
			this.data.pages = [];
			this.data.dataController = new de.titus.form.DataController(de.titus.form.Formular.prototype.valueChanged.bind(this));
			this.data.stepControl = undefined;
			this.data.currentPage = 0;
			this.data.state = de.titus.form.Constants.STATE.PAGES;
			this.init();
		};
		
		de.titus.form.Formular.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Formular");
		
		de.titus.form.Formular.prototype.init = function() {
			if (de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("init()");
			
			this.data.stepPanel = new de.titus.form.StepPanel(this);
			this.data.stepControl = new de.titus.form.StepControl(this);
			this.initPages();
			
		};
		
		de.titus.form.Formular.prototype.initPages = function() {
			if (de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("initPages()");
			
			var pageElements = this.data.element.find("[" + de.titus.form.Setup.prefix + "-page" + "]");
			if (pageElements.length == 0) {
				var page = this.data.element.FormularPage(this.data.dataController);
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
			
			this.data.stepPanel.update();
			this.data.stepControl.update();
		};
		
		de.titus.form.Formular.prototype.valueChanged = function() {
			if (de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("valueChanged()");
		};
		
		de.titus.form.Formular.prototype.doValidate = function() {
			if (de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("doValidate()");
			
			for (var i = 0; i < this.data.pages.length; i++)
				if (this.data.pages[i].active && !this.data.pages[i].data.valid)
					return false;
			
			return true;
		};
		
		de.titus.form.Formular.prototype.showSummary = function() {
			if (de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("showSummary()");
			
			for (var i = 0; i < this.data.pages.length; i++)
				if (this.data.pages[i].data.activ)
					this.data.pages[i].showSummary();
			
			this.data.state = de.titus.form.Constants.STATE.SUMMARY;
			this.data.stepPanel.update();
			this.data.stepControl.update();
		};
		
		de.titus.form.Formular.prototype.currentPage = function() {
			if (de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("currentPage() -> current index: " + this.data.currentPage);
			
			return this.data.pages[this.data.currentPage];
		};
		
		de.titus.form.Formular.prototype.prevPage = function() {
			if (de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("prevPage()");
			
			if (this.data.state == de.titus.form.Constants.STATE.SUBMITED)
				return;
			else if (this.data.state == de.titus.form.Constants.STATE.SUMMARY) {
				this.data.state = de.titus.form.Constants.STATE.PAGES;
				for (var i = 0; i < this.data.pages.length; i++)
					if(i != this.data.currentPage)
						this.data.pages[i].hide();
				
				this.data.stepPanel.update();
				this.data.stepControl.update();
				
			} else if (this.data.currentPage > 0) {
				var page = de.titus.form.PageUtils.findPrevPage(this.data.pages, this.data.currentPage);
				this.data.currentPage = page.data.number - 1;
				this.data.state = de.titus.form.Constants.STATE.PAGES;
				this.data.stepPanel.update();
				this.data.stepControl.update();
			}
			
		};
		
		de.titus.form.Formular.prototype.nextPage = function() {
			if (de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("nextPage()");
			
			if (this.data.currentPage < (this.data.pages.length - 1)) {
				var page = de.titus.form.PageUtils.findNextPage(this.data.pages, this.data.currentPage);
				if (page != undefined) {
					this.data.state = de.titus.form.Constants.STATE.PAGES;
					this.data.currentPage = page.data.number - 1;
					this.data.stepPanel.update();
					this.data.stepControl.update();
					return;
				}
			}
			
			this.data.state = de.titus.form.Constants.STATE.SUMMARY;
			this.showSummary();
			this.data.stepPanel.update();
			this.data.stepControl.update();
		};
		
		de.titus.form.Formular.prototype.submit = function() {
			if (de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("submit()");
			
			this.data.state = de.titus.form.Constants.STATE.SUBMITED;
			this.data.stepPanel.update();
			this.data.stepControl.update();
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
	
	$(document).ready(function() {
		$('[data-form]').Formular();
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Page", function() {
		de.titus.form.Page = function(aElement, aDataController) {
			if(de.titus.form.Page.LOGGER.isDebugEnabled())
				de.titus.form.Page.LOGGER.logDebug("constructor");
			this.data = {};
			this.data.number = undefined;
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
			if(de.titus.form.Page.LOGGER.isDebugEnabled())
				de.titus.form.Page.LOGGER.logDebug("initFields()");
			
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
			if(de.titus.form.Page.LOGGER.isDebugEnabled())
				de.titus.form.Page.LOGGER.logDebug("checkCondition()");
			
			this.data.activ = true;
			return this.data.activ;
		};		
		
		de.titus.form.Page.prototype.show = function(){
			if(de.titus.form.Page.LOGGER.isDebugEnabled())
				de.titus.form.Page.LOGGER.logDebug("show()");
			
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
			
			if(!this.data.activ)
				return;
			
			this.show();
			for(var i = 0; i < this.data.fields.length; i++)
				if(this.data.fields[i].data.activ)
					this.data.fields[i].showSummary();
		};
		
		de.titus.form.Page.prototype.doValidate = function(){
			if(de.titus.form.Page.LOGGER.isDebugEnabled())
				de.titus.form.Page.LOGGER.logDebug("doValidate()");
			
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
			
			if (de.titus.form.StepControl.LOGGER.isDebugEnabled())
				console.log(this);
		};
		
		de.titus.form.StepControl.prototype.update = function() {
			if (this.data.form.data.state == de.titus.form.Constants.STATE.SUBMITED) {
				this.data.element.hide();
				return;
			} else if (this.data.form.doValidate()) {
				this.data.stepControlNext.prop("disabled", false);
				this.data.stepControlSummary.prop("disabled", false);
				this.data.stepControlSubmit.prop("disabled", false);
				
				if ((this.data.form.data.pages.length - 1) > this.data.form.data.currentPage) {
					this.data.stepControlNext.show();
					this.data.stepControlSummary.hide();
					this.data.stepControlSubmit.hide();
				} else if (this.data.form.data.state == de.titus.form.Constants.STATE.PAGES) {
					this.data.stepControlNext.hide();
					this.data.stepControlSummary.show();
					this.data.stepControlSubmit.hide();
				} else if (this.data.form.data.state == de.titus.form.Constants.STATE.SUMMARY) {
					this.data.stepControlNext.hide();
					this.data.stepControlSummary.hide();
					this.data.stepControlSubmit.show();
				}
			} else {
				this.data.stepControlNext.prop("disabled", true);
				this.data.stepControlSummary.prop("disabled", true);
				this.data.stepControlSubmit.prop("disabled", true);
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
				this.data.element.find("[" + de.titus.form.Setup.prefix + "-step='" + this.data.form.currentPage().data.step + "']").addClass("active");
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
			this.input = this.element.find("input");
			if (this.input != undefined && this.input.attr("type") != "file")
				this.input.on("click", this.valueChangeListener);
		};
		de.titus.form.FieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.FieldController");
		
		de.titus.form.FieldController.prototype.showField = function(aData) {
			if (de.titus.form.Field.LOGGER.isDebugEnabled())
				de.titus.form.Field.LOGGER.logDebug("showField()");
			
			this.element.show();
		};
		
		de.titus.form.FieldController.prototype.showSummary = function() {
			if (de.titus.form.Field.LOGGER.isDebugEnabled())
				de.titus.form.Field.LOGGER.logDebug("showSummary()");
			
		};
		
		de.titus.form.FieldController.prototype.hideField = function() {
			if (de.titus.form.Field.LOGGER.isDebugEnabled())
				de.titus.form.Field.LOGGER.logDebug("hideField()");
			
			this.element.hide()
		};
		
		de.titus.form.FieldController.prototype.setValid = function(isValid, aMessage) {
			if (de.titus.form.Field.LOGGER.isDebugEnabled())
				de.titus.form.Field.LOGGER.logDebug("setValid()");
			
			if (!isValid) {
				alert(this.fieldname + ": " + aMessage);
			}
		};
		
		de.titus.form.FieldController.prototype.getValue = function() {
			if (de.titus.form.Field.LOGGER.isDebugEnabled())
				de.titus.form.Field.LOGGER.logDebug("doConditionCheck()");
			
			return "test";
		};
		
		de.titus.form.Registry.registFieldController("default", function(aElement, aFieldname, aValueChangeListener) {
			return new de.titus.form.FieldController(aElement, aFieldname, aValueChangeListener);
		});
	});
})();
