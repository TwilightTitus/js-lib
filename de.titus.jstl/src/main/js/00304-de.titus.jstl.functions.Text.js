(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Text", function() {
		let Text = de.titus.jstl.functions.Text = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Text"),

		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Text.LOGGER.isDebugEnabled())
				    Text.LOGGER.logDebug("execute run(" + aElement + ", " + aContext + ", " + aProcessor + ")");

			    let ignore = aElement.attr("jstl-text-ignore");
			    if (typeof ignore !== "undefined") {
				    // IE BUG
				    if (!de.titus.core.Page.getInstance().detectBrowser().other)
					    Text.normalize(aElement[0]);
				    let contenttype = aElement.attr("jstl-text-content-type") || "text";
				    aElement.contents().filter(function() {
					    return (this.nodeType === 3 || this.nodeType === 4) && this.textContent != undefined && this.textContent.trim() != "";
				    }).each(function() {
					    let text = this.textContent;
					    if (text) {
						    text = aProcessor.resolver.resolveText(text, aContext);
						    let contentFunction = Text.CONTENTTYPE[contenttype];
						    if (contentFunction)
							    contentFunction(this, text, aElement, aProcessor, aContext);
					    }
				    });
			    }

			    aTaskChain.nextTask();
		    },

		    normalize : function(aNode) {
			    if (!aNode)
				    return;
			    if (aNode.nodeType == 3) {
				    let text = aNode.textContent;
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
		        "html" : function(aNode, aText, aBaseElement, aProcessor, aContext) {
			        $(aNode).replaceWith($.parseHTML(aText));
		        },
		        "json" : function(aNode, aText, aBaseElement, aProcessor, aContext) {
			        if (typeof aText === "string")
				        aNode.textContent = aText;
			        else
				        aNode.textContent = JSON.stringify(aText);
		        },
		        "text" : function(aNode, aText, aBaseElement, aProcessor, aContext) {
			        let text = aText;
			        let addAsHtml = false;

			        let trimLength = aBaseElement.attr("jstl-text-trim-length");
			        if (trimLength != undefined && trimLength != "") {
				        trimLength = aProcessor.resolver.resolveExpression(trimLength, aContext, "-1");
				        trimLength = parseInt(trimLength);
				        if (trimLength && trimLength > 0)
					        text = de.titus.core.StringUtils.trimTextLength(text, trimLength);
			        }

			        let preventformat = aBaseElement.attr("jstl-text-prevent-format");
			        if (preventformat) {
				        preventformat = aProcessor.resolver.resolveExpression(preventformat, aContext, true) || true;
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

		de.titus.jstl.TaskRegistry.append("text", de.titus.jstl.Constants.PHASE.CONTENT, undefined, de.titus.jstl.functions.Text.TASK);
	});
})($);
