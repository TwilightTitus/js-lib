(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Text", function() {
		var Text = de.titus.jstl.functions.Text = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Text"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Text.LOGGER.isDebugEnabled())
				    Text.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var ignore = aElement.attr("jstl-text-ignore");
			    if (!ignore) {
				    Text.normalize(aElement[0]);				    
				    var contenttype = aElement.attr("jstl-text-type") || "text";
				    aElement.contents().filter(function() {
					    return this.nodeType === 3 && this.textContent != undefined && this.textContent.trim() != "";
				    }).each(function() {
					    var text = this.textContent;
					    if (text) {
						    text = aProcessor.resolver.resolveText(text, aDataContext);
						    var contentFunction = Text.CONTENTTYPE[contenttype];
						    if (contentFunction)
							    contentFunction(this, text, aElement, aProcessor, aDataContext);
					    }
				    });
			    }
			    
			    aTaskChain.nextTask();
		    },
		    
		    normalize : function(aNode) {
			    if (!aNode)
				    return;
			    if (aNode.nodeType == 3) {
				    var text = aNode.textContent;
				    while (aNode.nextSibling && aNode.nextSibling.nodeType == 3) {
					    text += aNode.nextSibling.textContent;
					    aNode.parentNode.removeChild(aNode.nextSibling);
				    }
				    aNode.textContent = text;
			    } else {
				    Text.normalize(aNode.firstChild);
			    }
			    Text.normalize(aNode.nextSibling);
		    },
		    
		    CONTENTTYPE : {
		        "html" : function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
			        $(aNode).replaceWith($.parseHTML(aText));
		        },
		        "json" : function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
			        if (typeof aText === "string")
				        aNode.textContent = aText;
			        else
				        aNode.textContent = JSON.stringify(aText);
		        },
		        "text" : function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
			        var text = aText;
			        var addAsHtml = false;
			        
			        var trimLength = aBaseElement.attr("jstl-text-trim-length");
			        if (trimLength != undefined && trimLength != "") {
				        trimLength = aProcessor.resolver.resolveExpression(trimLength, aDataContext, "-1");
				        trimLength = parseInt(trimLength);
				        if (trimLength && trimLength > 0)
					        text = de.titus.core.StringUtils.trimTextLength(text, trimLength);
			        }
			        
			        var preventformat = aBaseElement.attr("jstl-text-prevent-format");
			        if (preventformat) {
				        preventformat = aProcessor.resolver.resolveExpression(preventformat, aDataContext, true) || true;
				        if (preventformat) {
					        text = de.titus.core.StringUtils.formatToHtml(text);
					        addAsHtml = true;
				        }
			        }
			        
			        if (addAsHtml)
				        $(aNode).replaceWith($.parseHTML(text));
			        else
				        aNode.textContent = text;
		        }
		    }
		};
		
		Text.CONTENTTYPE["text/html"] = Text.CONTENTTYPE["html"];
		Text.CONTENTTYPE["application/json"] = Text.CONTENTTYPE["json"];
		Text.CONTENTTYPE["text/plain"] = Text.CONTENTTYPE["text"];
	});
})($);