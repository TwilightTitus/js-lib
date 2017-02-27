(function($, GlobalSettings) {
    "use strict";
    de.titus.core.Namespace.create("de.titus.jstl.ExecuteChain", function() {
	var ExecuteChain = de.titus.jstl.ExecuteChain = function(aTaskChain, aCount, aCallback) {
	    this.count = aCount || 0;
	    this.taskChain = aTaskChain;
	    this.callback = aCallback;
	};
	ExecuteChain.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.ExecuteChain");

	ExecuteChain.prototype.finish = function() {
	    if (ExecuteChain.LOGGER.isDebugEnabled())
		ExecuteChain.LOGGER.logDebug("count: " + this.count);
	    
	    this.count--;
	    if (this.count == 0){
		if (typeof this.callback === "function")
		    this.callback(this);
		this.taskChain.nextTask();
	    }
	};
    });
})($, de.titus.jstl.GlobalSettings);
