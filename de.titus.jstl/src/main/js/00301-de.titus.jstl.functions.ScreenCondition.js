(function($, GlobalSettings) {
	de.titus.core.Namespace.create("de.titus.jstl.functions.ScreenCondition", function() {
		let ScreenCondition = de.titus.jstl.functions.ScreenCondition = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.ScreenCondition"),

		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (ScreenCondition.LOGGER.isDebugEnabled())
				    ScreenCondition.LOGGER.logDebug("TASK");

			    if (typeof aElement.attr("jstl-screen-condition-init") === 'undefined') {
				    aElement.addClass("jstl-screen-inactive");
				    de.titus.core.ScreenObserver.addHandler({
				        "condition" : aElement.attr("jstl-screen-condition"),
				        "activate" : function(aScreenData) {
					        if (ScreenCondition.LOGGER.isDebugEnabled())
						        ScreenCondition.LOGGER.logDebug("run jstl screen condition (activate)");
					        
					        if (!aElement.is(".jstl-ready")) {
					        	aElement.jstl({
						            "data" : aContext,
						            "callback" : function() {
						            	aElement.removeClass("jstl-screen-inactive");
						            	aElement.addClass("jstl-screen-active");
						            }
						        });
					        } else {
					        	aElement.removeClass("jstl-screen-inactive");
					        	aElement.addClass("jstl-screen-active");
					        }
				        },
				        "deactivate" : function(aScreenData) {
					        if (ScreenCondition.LOGGER.isDebugEnabled())
						        ScreenCondition.LOGGER.logDebug("run jstl screen condition (deactivate)");

					        aElement.removeClass("jstl-screen-active");
					        aElement.addClass("jstl-screen-inactive");
				        }
				    });
				    aElement.attr("jstl-screen-condition-init", "");
				    aTaskChain.finish();
			    } else
				    aTaskChain.nextTask();
		    }
		};

		de.titus.jstl.TaskRegistry.append("screenCondition", de.titus.jstl.Constants.PHASE.INIT, "[jstl-screen-condition]", de.titus.jstl.functions.ScreenCondition.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
