(function($, GlobalSettings) {
    "use strict";
    de.titus.core.Namespace.create("de.titus.jstl.functions.Children", function() {
	var Children = de.titus.jstl.functions.Children = {
	LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Children"),
	TASK : function(aElement, aContext, aProcessor, aTaskChain) {
	    if (Children.LOGGER.isDebugEnabled())
		Children.LOGGER.logDebug("TASK");

	    if (!aTaskChain.isPreventChilds()) {
		var ignoreChilds = aElement.attr("jstl-ignore-childs");
		if (ignoreChilds && ignoreChilds != "")
		    ignoreChilds = aProcessor.resolver.resolveExpression(ignoreChilds, aContext, true);

		if (ignoreChilds == "false" || ignoreChilds == true)
		    return aTaskChain.preventChilds().nextTask();

		var children = aElement.children();
		if (children.length == 0)
		    aTaskChain.nextTask();
		else {
		    aProcessor.compute($(children[0]), aTaskChain.context, Children.ElementChain.bind({},children,1, aTaskChain));
		}
	    } else
		aTaskChain.nextTask();
	},

	UpdateContext : function(aParentTaskChain, aTaskChain) {
	    aParentTaskChain.updateContext(aTaskChain.context, true);
	},

	ElementChain : function(theChildren, aIndex, aParentTaskChain, aElement, aContext, aProcessor) {
	    aParentTaskChain.updateContext(aContext, true);	    
	    if(aIndex < theChildren.length){		
		var next = $(theChildren[aIndex]);		
		aProcessor.compute(next, aParentTaskChain.context, Children.ElementChain.bind({},theChildren, aIndex + 1, aParentTaskChain));
	    } else
		aParentTaskChain.nextTask();
	}

	};

	de.titus.jstl.TaskRegistry.append("children", de.titus.jstl.Constants.PHASE.CHILDREN, undefined, de.titus.jstl.functions.Children.TASK);
    });
})($, de.titus.jstl.GlobalSettings);
