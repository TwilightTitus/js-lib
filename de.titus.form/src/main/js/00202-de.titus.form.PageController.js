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

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, de.titus.form.Constants.EVENTS.ACTION_PAGE_BACK, PageController.prototype.toPrevPage.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [de.titus.form.Constants.EVENTS.ACTION_PAGE_NEXT, de.titus.form.Constants.EVENTS.INITIALIZED], PageController.prototype.toNextPage.bind(this));

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

			var formular = this.data.element.Formular();
			var startIndex = this.data.currentPage - 1;
			if(formular.data.state == de.titus.form.Constants.STATE.SUMMARY)
				startIndex = this.data.pages.length - 1;			
			
			for (var i = startIndex; 0 <= i; i--) {
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

			//TODO REFACTORING TO EVENT SYSTEM
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
