(function($, GlobalSettings) {
    "use strict";
    de.titus.core.Namespace.create("de.titus.jstl.TaskChain", function() {
	var TaskChain = function(aElement, aContext, aProcessor, isRoot, aCallback) {
	    this.element = aElement;
	    this.context = aContext;
	    this.processor = aProcessor;
	    this.root = isRoot;
	    this.callback = aCallback;
	    this.__preventChilds = false;
	    this.__taskchain = de.titus.jstl.TaskRegistry.taskchain;
	    this.__currentTask = undefined;
	};
	TaskChain.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.TaskChain");

	TaskChain.prototype.skipToPhase = function(aPhase) {
	    if (TaskChain.LOGGER.isDebugEnabled())
		TaskChain.LOGGER.logDebug("skipToPhase()");

	    while (this.__taskchain && this.__taskchain.phase < aPhase)
		this.__taskchain = this.__taskchain.next;
	    
	    return this;
	};

	TaskChain.prototype.preventChilds = function() {
	    if (TaskChain.LOGGER.isDebugEnabled())
		TaskChain.LOGGER.logDebug("preventChilds()");
	    this.__preventChilds = true;
	    return this;
	};

	TaskChain.prototype.isPreventChilds = function() {
	    return this.__preventChilds;
	};

	TaskChain.prototype.updateContext = function(aContext, doMerge) {
	    if (TaskChain.LOGGER.isDebugEnabled())
		TaskChain.LOGGER.logDebug("updateContext()");
	    if (doMerge)
		this.context = $.extend(true, this.context, aContext);
	    else
		this.context = aContext;

	    return this;
	};

	TaskChain.prototype.nextTask = function(aContext, doMerge) {
	    if (TaskChain.LOGGER.isDebugEnabled())
		TaskChain.LOGGER.logDebug("nextTask( \"" + aContext + "\")");	    

	    if (aContext)
		this.updateContext(aContext, doMerge);

	    if (this.__taskchain) {
		var name = this.__taskchain.name;
		var task = this.__taskchain.task;
		var phase = this.__taskchain.phase;
		var selector = this.__taskchain.selector;
		this.__currentTask = this.__taskchain;
		this.__taskchain = this.__taskchain.next;

		if (TaskChain.LOGGER.isDebugEnabled())
		    TaskChain.LOGGER.logDebug("nextTask() -> next task: \"" + name + "\", phase: \"" + phase + "\", selector \"" + selector + "\"!");
		if (selector == undefined || this.element.is(selector))
		    task(this.element, this.__buildContext(), this.processor, this);
		else {
		    if (TaskChain.LOGGER.isDebugEnabled())
			TaskChain.LOGGER.logDebug("nextTask() -> skip task: \"" + name + "\", phase: \"" + phase + "\", selector \"" + selector + "\"!");
		    this.nextTask();
		}
	    } else {
		if (TaskChain.LOGGER.isDebugEnabled())
		    TaskChain.LOGGER.logDebug("nextTask() -> task chain is finished!");
		this.finish();
	    }

	    return this;
	};

	TaskChain.prototype.__buildContext = function() {
	    return $.extend({}, this.context, {
	    "$root" : this.processor.element,
	    "$element" : this.element
	    });
	};

	TaskChain.prototype.finish = function() {
	    if (TaskChain.LOGGER.isDebugEnabled())
		TaskChain.LOGGER.logDebug("finish()");

	    if (this.callback)
		this.callback(this.element, this.context, this.processor, this);	    

	    return this;
	};

	de.titus.jstl.TaskChain = TaskChain;
    });
})($, de.titus.jstl.GlobalSettings);
