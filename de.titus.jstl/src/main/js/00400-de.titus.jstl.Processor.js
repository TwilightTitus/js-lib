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
		Processor.LOGGER.logDebug("execute compute(" + aElement + ", " + aContext + ")");
	    if (!aElement) {
		this.element.trigger(de.titus.jstl.Constants.EVENTS.onStart, [ aContext, this ]);
		//if(!this.element.is("body"))
		    this.element.detach();
		this.__computeElement(this.element, this.context, true, this.callback);
	    } else
		this.__computeElement(aElement, aContext, false, aCallback);
	};

	Processor.prototype.__computeElement = function(aElement, aContext, isRoot, aCallback) {
	    if (Processor.LOGGER.isDebugEnabled())
		Processor.LOGGER.logDebug("__computeElement() -> root: " + isRoot);

	    var taskChain = new de.titus.jstl.TaskChain(aElement, aContext, this, isRoot, Processor.prototype.__computeFinished.bind(this, aElement, aContext, isRoot, aCallback));
	    taskChain.nextTask();
	};

	Processor.prototype.__computeFinished = function(aElement, aContext, isRoot, aCallback) {
	    if (Processor.LOGGER.isDebugEnabled())
		Processor.LOGGER.logDebug("__computeFinished() -> is root: " + isRoot);

	    if (aElement.tagName() == "jstl" && aElement.contents().length > 0)
		aElement.replaceWith(aElement.contents());

	    if (typeof aCallback === "function")
		aCallback(aElement, aContext, this, isRoot);

	    aElement.trigger(de.titus.jstl.Constants.EVENTS.onSuccess, [ aContext, this ]);

	    if (isRoot)
		setTimeout(Processor.prototype.onReady.bind(this), GlobalSettings.DEFAULT_TIMEOUT_VALUE);
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
		//if(!this.element.is("body"))
		    this.parent.append(this.element);

		setTimeout((function(aProcessor) {
		    this.trigger(de.titus.jstl.Constants.EVENTS.onReady, [ aProcessor ]);
		}).bind(this.element, this), GlobalSettings.DEFAULT_TIMEOUT_VALUE * 10);
	    }
	};

	de.titus.jstl.Processor = Processor;
    });
})(jQuery, de.titus.core.SpecialFunctions, de.titus.jstl.GlobalSettings);
