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
			this.data.currentPage = 1;			
			this.init();
		};
		
		de.titus.form.Formular.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Formular");
		
		de.titus.form.Formular.prototype.init = function() {
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("init()");		
			
			this.initPages();
			this.data.element.FormularStepController(this);
		};

		de.titus.form.Formular.prototype.initPages = function() {
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("initPages()");
			
			var pageElements = this.data.element.find("[" + de.titus.form.Setup.prefix + "-page" + "]");
			if(pageElements.length == 0){
				var page = this.data.element.FormularPage(this.data.dataController);
				this.data.pages.push(page);
				page.show();
			}
			else {
				for(var i = 0; i < pageElements.length; i++){
					var page =$(pageElements[i]).FormularPage(this.data.dataController);
					this.data.pages.push(page);
					if(i > 0)
						page.hide();
					else
						page.show();
				}
			}		
		};
		
		de.titus.form.Formular.prototype.showSummary = function(){
			if(de.titus.form.Formular.LOGGER.isDebugEnabled())
				de.titus.form.Formular.LOGGER.logDebug("showSummary()");
			
			for(var i = 0; i < this.data.pages.length; i++)
				if(pages[i].active)
					pages[i].showSummary();
		};
		
		de.titus.form.Formular.prototype.currentPage = function(){
			return this.data.pages[this.data.currentPage - 1];
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
