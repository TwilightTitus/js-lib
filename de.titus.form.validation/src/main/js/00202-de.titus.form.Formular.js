(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Formular", function() {
		de.titus.form.Formular = function(aElement) {
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix);
			this.data.pages = [];
			this.data.dataController = new de.titus.form.DataController(function(){});
			this.data.stepControl = undefined;
			this.data.currentPage = 0;			
			this.init();
		};
		
		de.titus.form.Formular.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Formular");
		
		de.titus.form.Formular.prototype.init = function() {
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("init()");		
			this.data.stepPanel = new de.titus.form.StepPanel(this);
			this.data.stepControl = new de.titus.form.StepControl(this);
			this.initPages();
			
		};

		de.titus.form.Formular.prototype.initPages = function() {
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("initPages()");
			
			var pageElements = this.data.element.find("[" + de.titus.form.Setup.prefix + "-page" + "]");
			if(pageElements.length == 0){
				var page = this.data.element.FormularPage(this.data.dataController);
				page.data.number = 1;
				this.data.pages.push(page);
				page.show();
			}
			else {
				for(var i = 0; i < pageElements.length; i++){
					var page =$(pageElements[i]).FormularPage(this.data.dataController);
					page.data.number = (i + 1);
					this.data.pages.push(page);
					if(i > 0)
						page.hide();
					else
						page.show();
				}
			}
			
			this.data.stepPanel.update();
			this.data.stepControl.update();
		};
		
		de.titus.form.Formular.prototype.doValidate = function(){
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("doValidate()");
			
			for(var i = 0; i < this.data.pages.length; i++)
				if(this.data.pages[i].active && !this.data.pages[i].data.valid)
					return false;
			
			return true;
		};
		
		de.titus.form.Formular.prototype.showSummary = function(){
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("showSummary()");
			
			for(var i = 0; i < this.data.pages.length; i++)
				if(this.data.pages[i].active)
					this.data.pages[i].showSummary();
		};
		
		de.titus.form.Formular.prototype.currentPage = function(){
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("currentPage() -> current index: " + this.data.currentPage);
			
			return this.data.pages[this.data.currentPage];
		};
		de.titus.form.Formular.prototype.prevPage = function(){
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("prevPage()");
			
			this.data.stepPanel.update();
		};
		
		de.titus.form.Formular.prototype.nextPage = function(){
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("nextPage()");
			
			if(this.data.currentPage < (this.data.pages.length - 1)){
				var page = de.titus.form.PageUtils.findNextPage(this.data.pages, this.data.currentPage);
				this.data.currentPage = page.data.number - 1;
				this.data.stepPanel.update();
			}
		};		
		
		de.titus.form.Formular.prototype.submit = function(){
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("submit()");
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