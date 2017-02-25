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
				    	var executeChain = new de.titus.jstl.ExecuteChain(aTaskChain, children.length);
					    for (var i = 0; i < children.length; i++)
						    aProcessor.compute($(children[i]), aContext, executeChain.finish.bind(executeChain));
				    }
			    } else
				    aTaskChain.nextTask();
		    }
		};
		
		de.titus.jstl.TaskRegistry.append("children", de.titus.jstl.Constants.PHASE.CHILDREN, undefined, de.titus.jstl.functions.Children.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
