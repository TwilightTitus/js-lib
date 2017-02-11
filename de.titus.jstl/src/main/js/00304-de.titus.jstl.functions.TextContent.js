de.titus.core.Namespace.create("de.titus.jstl.functions.TextContent", function() {
	var TextContent = function() {
	};
	TextContent.prototype = new de.titus.jstl.IFunction();
	TextContent.prototype.constructor = TextContent;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	TextContent.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.TextContent");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	TextContent.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (TextContent.LOGGER.isDebugEnabled())
			TextContent.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var ignore = aElement.data("jstlTextIgnore");
		if (!ignore) {			
			if (!aElement.is("pre"))
				this.normalize(aElement[0]);
			
			var contenttype = aElement.data("jstlTextContentType") || "text";
			aElement.contents().filter(function() {
				return this.nodeType === 3 && this.textContent != undefined && this.textContent.trim() != "";
			}).each(function() {
				var text = this.textContent;
				if (text) {
					text = aProcessor.resolver.resolveText(text, aDataContext);
					var contentFunction = TextContent.CONTENTTYPE[contenttype];
					if (contentFunction)
						contentFunction(this, text, aElement, aProcessor, aDataContext);
				}
			});
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	TextContent.prototype.normalize = function(aNode) {
		if (!aNode)
			return;
		if (aNode.nodeType == 3) {
			while (aNode.nextSibling && aNode.nextSibling.nodeType == 3) {
				aNode.nodeValue += aNode.nextSibling.nodeValue;
				aNode.parentNode.removeChild(aNode.nextSibling);
			}
		} else {
			this.normalize(aNode.firstChild);
		}
		this.normalize(aNode.nextSibling);
	}

	TextContent.CONTENTTYPE = {};
	TextContent.CONTENTTYPE["html"] = function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
		$(aNode).replaceWith($.parseHTML(aText));
	};
	TextContent.CONTENTTYPE["text/html"] = TextContent.CONTENTTYPE["html"];
	
	TextContent.CONTENTTYPE["json"] = function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
		if (typeof aText === "string")
			aNode.textContent = aText;
		else
			aNode.textContent = JSON.stringify(aText);
	};
	TextContent.CONTENTTYPE["application/json"] = TextContent.CONTENTTYPE["json"];
	
	TextContent.CONTENTTYPE["text"] = function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
		var text = aText;
		var addAsHtml = false;
		
		var trimLength = aBaseElement.data("jstlTextTrimLength");
		if (trimLength != undefined && trimLength != "") {
			trimLength = aProcessor.resolver.resolveExpression(trimLength, aDataContext, "-1");
			trimLength = parseInt(trimLength);
			if (trimLength && trimLength > 0)
				text = de.titus.core.StringUtils.trimTextLength(text, trimLength);
		}
		
		var preventformat = aBaseElement.data("jstlTextPreventFormat");
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
	};
	TextContent.CONTENTTYPE["text/plain"] = TextContent.CONTENTTYPE["text"];
	
	de.titus.jstl.functions.TextContent = TextContent;
});
