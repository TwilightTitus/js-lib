(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.ExecuteChain", function() {
		var ExecuteChain = de.titus.jstl.ExecuteChain = function(aTaskChain, aCount) {
			this.count = aCount || 0;
			this.taskChain = aTaskChain;			
		};
		ExecuteChain.prototype.finish = function() {
			this.count--;
			if (this.count == 0)
				this.taskChain.nextTask();
		};
	});
})($, de.titus.jstl.GlobalSettings);
