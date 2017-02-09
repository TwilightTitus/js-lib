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