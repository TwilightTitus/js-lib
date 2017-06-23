(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.PageController", function() {
		var PageController = de.titus.form.PageController = function(aElement) {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    pages : [],
			    pageHandles : [],
			    currentHandle : undefined
			};

			setTimeout(PageController.prototype.__init.bind(this), 1);
		};

		PageController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.PageController");

		PageController.prototype.__init = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("__init()");

			var formularElement = this.data.element;
			this.data.pages = this.data.element.find("[data-form-page]").formular_Page();
			this.data.pageHandles = this.__initPageHandles();

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, EVENTTYPES.ACTION_PAGE_BACK, PageController.prototype.toPrevPage.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, EVENTTYPES.ACTION_PAGE_NEXT, PageController.prototype.toNextPage.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, EVENTTYPES.CONDITION_STATE_CHANGED, PageController.prototype.__checkCurrentPage.bind(this));
		};

		PageController.prototype.__initPageHandles = function() {
			var handles = [];
			var index = 0;
			var lastStep = de.titus.form.Constants.SPECIALSTEPS.START;
			for (var i = 0; i < this.data.pages.length; i++) {
				var page = this.data.pages[i];
				if (page.data.step != "")
					lastStep = page.data.step;
				else
					page.data.step = lastStep;

				page.hide();

				var handle = new de.titus.form.PageControlHandle(page, i, lastStep, this);

				handles.push(handle);
			}

			var show = function() {
				var pages = this.data.pageController.data.pages;
				for (var i = 0; i < pages.length; i++)
					pages[i].summary();

				de.titus.form.utils.EventUtils.triggerEvent(this.data.pageController.data.element, EVENTTYPES.PAGE_SUMMARY);
			};

			var hide = function() {
				var pages = this.data.pageController.data.pages;
				for (var i = 0; i < pages.length; i++)
					pages[i].hide();

			};

			var summaryHandle = new de.titus.form.PageControlHandle({
				data : {
					type: de.titus.form.Constants.TYPES.SUMMARY_PAGE,
				    valid : true,
				    condition : true
				}
			}, handles.length, de.titus.form.Constants.SPECIALSTEPS.SUMMARY, this);
			summaryHandle.show = show.bind(summaryHandle);
			summaryHandle.hide = hide.bind(summaryHandle);
			handles.push(summaryHandle);

			var submittedHandle = new de.titus.form.PageControlHandle({
				data : {
					type: de.titus.form.Constants.TYPES.SUBMITTED_PAGE,
				    valid : true,
				    condition : true
				}
			}, handles.length, de.titus.form.Constants.SPECIALSTEPS.SUBMITTED, this);
			submittedHandle.show = show.bind(submittedHandle);
			submittedHandle.hide = hide.bind(submittedHandle);
			handles.push(submittedHandle);

			return handles;
		};

		PageController.prototype.__checkCurrentPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("__checkCurrentPage()");
			if(!this.data.currentHandle && this.data.pageHandles[0].data.page.data.condition)
				this.__toPageHandle(this.data.pageHandles[0]);
				
		};

		PageController.prototype.isFirstPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("isFirstPage()");
			return this.data.currentHandle && this.data.currentHandle.data.index == 0;
		};

		PageController.prototype.getCurrentPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("getCurrentPage()");

			if (this.data.currentHandle)
				return this.data.currentHandle.data.page;
		};
		
		PageController.prototype.getNextPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("getNextPage()");

			return this.__getNextPageHandle().data.page;
		};

		PageController.prototype.hasNextPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("hasNextPage()");

			return this.__getNextPageHandle() != undefined;
		};

		PageController.prototype.__getNextPageHandle = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("__getNextPageHandle()");

			if (this.data.currentHandle && !this.data.currentHandle.data.page.data.valid)
				return this.data.currentHandle;
			else if (!this.data.currentHandle)
				return;
			else {
				for (var i = this.data.currentHandle.data.index + 1; i < this.data.pageHandles.length; i++) {
					var handle = this.data.pageHandles[i];
					if (handle.data.page.data.condition)
						return handle;
				}
				return this.data.currentHandle;
			}
		};

		PageController.prototype.__getPrevPageHandle = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("__getPrevPageHandle()");

			if (!this.data.currentHandle)
				return this.data.pageHandles[0];
			else {
				for (var i = this.data.currentHandle.data.index - 1; 0 <= i; i--) {
					var handle = this.data.pageHandles[i];
					if (handle.data.page.data.condition)
						return handle;
				}
				return this.data.currentHandle;
			}
		};

		PageController.prototype.__toPageHandle = function(aPageHandle) {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("__toPage()");

			if (aPageHandle) {
				if (this.data.currentHandle) {
					this.data.element.removeClass("step-" + this.data.currentHandle.data.step);
					this.data.currentHandle.hide();
				}

				this.data.currentHandle = aPageHandle;
				this.data.element.addClass("step-" + this.data.currentHandle.data.step);
				this.data.currentHandle.show();

				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.PAGE_CHANGED);
			}
		};

		PageController.prototype.toPrevPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("toPrevPage()");

			var page = this.__getPrevPageHandle();
			this.__toPageHandle(page);
		};

		PageController.prototype.toNextPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("toNextPage()");

			var page = this.__getNextPageHandle();
			if (page)
				this.__toPageHandle(page);
		};

		de.titus.core.jquery.Components.asComponent("formular_PageController", de.titus.form.PageController);
	});
})($, de.titus.form.Constants.EVENTS);
