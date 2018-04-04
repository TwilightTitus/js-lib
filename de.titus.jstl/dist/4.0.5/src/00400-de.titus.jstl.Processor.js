(function($, SpecialFunctions, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.Processor", function() {
		var Processor = function(aElement, aContext, aCallback) {
			this.element = aElement;
			this.parent = this.element.parent();
			this.context = aContext || {};
			this.callback = aCallback;
			this.resolver = new de.titus.core.ExpressionResolver(this.element.data("jstlExpressionRegex"));
		};

		Processor.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.Processor");

		Processor.prototype.compute = function(aElement, aContext, aCallback) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug([ "execute compute(\"", aElement, "\", \"", aContext, "\")" ]);
			if (!aElement) {
				this.element.removeClass("jstl-ready");
				this.element.addClass("jstl-running");
				this.element.trigger(de.titus.jstl.Constants.EVENTS.onStart, [ aContext, this ]);
				this.__computeElement(this.element, this.context, true, this.callback);
			} else
				this.__computeElement(aElement, aContext, false, aCallback);
		};

		Processor.prototype.__computeElement = function(aElement, aContext, isRoot, aCallback) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug(["__computeElement() -> root: ", isRoot, "\""]);

			let self = this;
			let taskChain = new de.titus.jstl.TaskChain(aElement, aContext, this, isRoot, function(aElement, aContext){ self.__computeFinished(isRoot, aCallback, aElement, aContext);});
			taskChain.nextTask();
		};

		Processor.prototype.__computeFinished = function(isRoot, aCallback, aElement, aContext) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("__computeFinished() -> is root: " + isRoot);

			if (typeof aCallback === "function")
				aCallback(aElement, aContext, this, isRoot);

			var tagName = aElement.tagName();
			if ((tagName == "x-jstl" || tagName == "jstl") && aElement.contents().length > 0)
				aElement.replaceWith(aElement.contents());

			if (isRoot) {
				this.context = aContext;
				this.onReady();
			}
		};

		Processor.prototype.onReady = function(aFunction) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("onReady()");

			if (aFunction) {
				this.element.one(de.titus.jstl.Constants.EVENTS.onReady, function(anEvent) {
					aFunction(anEvent.delegateTarget, anEvent.data);
				});
				return this;
			} else {
				let self = this;
				setTimeout(function() {
					self.element.removeClass("jstl-running");
					self.element.addClass("jstl-ready");
					self.element.trigger(de.titus.jstl.Constants.EVENTS.onReady, [ self ]);
				}, GlobalSettings.DEFAULT_TIMEOUT_VALUE * 10);
			}
		};

		de.titus.jstl.Processor = Processor;
	});
})(jQuery, de.titus.core.SpecialFunctions, de.titus.jstl.GlobalSettings);
