(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.ExecuteChain", function() {
		var ExecuteChain = function(aElement, aContext, aProcessor, isRoot) {
			this.element = aElement;
			this.context = aContext;
			this.processor = aProcessor;
			this.root = isRoot;
			this.__preventChilds = false;
			this.__taskchain = de.titus.jstl.TaskRegistry.taskchain;
		};
		ExecuteChain.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.ExecuteChain");
		
		ExecuteChain.prototype.preventChilds = function() {
			if (ExecuteChain.LOGGER.isDebugEnabled())
				ExecuteChain.LOGGER.logDebug("preventChilds()");
			this.__preventChilds = true;
			return this;
		};
		
		ExecuteChain.prototype.isPreventChilds = function() {
			return this.__preventChilds;
		};
		
		ExecuteChain.prototype.updateContext = function(aContext, doMerge) {
			if (ExecuteChain.LOGGER.isDebugEnabled())
				ExecuteChain.LOGGER.logDebug("updateContext()");
			if (doMerge)
				this.context = $.extend({}, this.context, aContext);
			else
				this.context = aContext;
		};
		
		ExecuteChain.prototype.nextTask = function(aContext, doMerge) {
			if (ExecuteChain.LOGGER.isDebugEnabled())
				ExecuteChain.LOGGER.logDebug("nextTask( \"" + aContext + "\")");
			if (this.__taskchain) {
				var name = this.__taskchain.name;
				var task = this.__taskchain.task;
				this.__taskchain = this.__taskchain.next;
				if (aContext)
					this.updateContext(aContext, doMerge);
				if (ExecuteChain.LOGGER.isDebugEnabled())
					ExecuteChain.LOGGER.logDebug("nextTask() -> next task: \"" + name + "\"!");
				task.bind(null, this.element, this.context, this.processor, this).call();
			} else if (ExecuteChain.LOGGER.isDebugEnabled())
				ExecuteChain.LOGGER.logDebug("nextTask() -> task chain is finished!");
		};
		
		de.titus.jstl.ExecuteChain = ExecuteChain;
	});
})($);
