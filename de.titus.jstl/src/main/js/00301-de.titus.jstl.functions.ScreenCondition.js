(function($, GlobalSettings) {
	de.titus.core.Namespace.create("de.titus.jstl.functions.ScreenCondition", function() {
		var ScreenCondition = de.titus.jstl.functions.ScreenCondition = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.ScreenCondition"),

		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (ScreenCondition.LOGGER.isDebugEnabled())
				    ScreenCondition.LOGGER.logDebug("TASK");

			    if (typeof aElement.attr("jstl-screen-condition-init") === 'undefined') {
				    aElement.addClass("jstl-inactive");
				    de.titus.core.ScreenObserver.addHandler({
				        "condition" : aElement.attr("jstl-screen-condition"),
				        "activate" : (function(aContext, aScreenData) {
					        if (ScreenCondition.LOGGER.isDebugEnabled())
						        ScreenCondition.LOGGER.logDebug("run jstl screen condition (activate)");

					        this.jstl({
					            "data" : aContext,
					            "callback" : $.fn.removeClass.bind(this, "jstl-inactive")
					        });
				        }).bind(aElement, aContext),
				        "activate" : (function(aContext, aScreenData) {
					        if (ScreenCondition.LOGGER.isDebugEnabled())
						        ScreenCondition.LOGGER.logDebug("run jstl screen condition (deactivate)");

					        this.addClass("jstl-inactive");
				        }).bind(aElement),
				        "once" : true
				    });
				    aElement.attr("jstl-screen-condition-init", "");
				    aTaskChain.finish();
			    } else
				    aTaskChain.nextTask();
		    },

		};

		de.titus.jstl.TaskRegistry.append("screenCondition", de.titus.jstl.Constants.PHASE.INIT, "[jstl-screen-condition]", de.titus.jstl.functions.ScreenCondition.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
