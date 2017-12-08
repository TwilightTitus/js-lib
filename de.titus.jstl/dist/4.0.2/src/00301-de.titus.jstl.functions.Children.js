(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Children", function() {
		let Children = de.titus.jstl.functions.Children = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Children"),
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Children.LOGGER.isDebugEnabled())
				    Children.LOGGER.logDebug("TASK");

			    if (!aTaskChain.isPreventChilds()) {
				    let ignoreChilds = aElement.attr("jstl-ignore-childs");
				    if (typeof ignoreChilds !== 'undefined') {
					    if (ignoreChilds.length > 0)
						    ignoreChilds = aProcessor.resolver.resolveExpression(ignoreChilds, aContext, true);
					    else
						    ignoreChilds = true;

					    if (ignoreChilds)
						    return aTaskChain.preventChilds().nextTask();
				    }

				    let children = aElement.children();
				    if (children.length == 0)
					    aTaskChain.nextTask();
				    else {
					    setTimeout(function() {
						    Children.ElementChain(children, 0, aTaskChain, aElement, aContext, aProcessor);
					    }, 1);
				    }
			    } else
				    aTaskChain.nextTask();
		    },

		    UpdateContext : function(aParentTaskChain, aTaskChain) {
			    aParentTaskChain.updateContext(aTaskChain.context, true);
		    },

		    ElementChain : function(theChildren, aIndex, aParentTaskChain, aElement, aContext, aProcessor) {
			    aParentTaskChain.updateContext(aContext, true);
			    if (aIndex < theChildren.length) {
				    let next = $(theChildren[aIndex]);
				    if (next && next.length == 1)
					    aProcessor.compute(next, aParentTaskChain.context, function(aElement, aContext, aProcessor) {
						    Children.ElementChain(theChildren, aIndex + 1, aParentTaskChain, aElement, aContext, aProcessor);
					    });

			    } else
				    aParentTaskChain.nextTask();
		    }

		};

		de.titus.jstl.TaskRegistry.append("children", de.titus.jstl.Constants.PHASE.CHILDREN, undefined, de.titus.jstl.functions.Children.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
