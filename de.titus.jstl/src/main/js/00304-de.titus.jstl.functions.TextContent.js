de.titus.core.Namespace.create("de.titus.jstl.functions.TextContent", function() {
	de.titus.jstl.functions.TextContent = function() {
	};
	de.titus.jstl.functions.TextContent.prototype = new de.titus.jstl.IFunction();
	de.titus.jstl.functions.TextContent.prototype.constructor = de.titus.jstl.functions.TextContent;
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * static variables
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	de.titus.jstl.functions.TextContent.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.TextContent");
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * functions
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	de.titus.jstl.functions.TextContent.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (de.titus.jstl.functions.TextContent.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.TextContent.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		var ignore = aElement.attr(processor.config.attributePrefix + "text-ignore");
		
		if (ignore != true || ignore != "true") {
			
			if(!aElement.is("pre"))
				this.normalize(aElement[0]);
			
			aElement.contents().filter(function() {
				return this.nodeType === 3 && this.textContent != undefined && this.textContent.trim() != "";
			}).each(function() {
				var contenttype = aElement.attr(processor.config.attributePrefix + "text-content-type") || "text";
				var node = this;
				var text = node.textContent;
				if(text)
					text = text.trim();

				text = expressionResolver.resolveText(text, aDataContext);
				var contentFunction = de.titus.jstl.functions.TextContent.CONTENTTYPE[contenttype];
				if (contentFunction)
					contentFunction(node, text, aElement, processor, aDataContext);
			});
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	de.titus.jstl.functions.TextContent.prototype.normalize = function(node) {
		if (!node) {
			return;
		}
		if (node.nodeType == 3) {
			while (node.nextSibling && node.nextSibling.nodeType == 3) {
				node.nodeValue += node.nextSibling.nodeValue;
				node.parentNode.removeChild(node.nextSibling);
			}
		} else {
			this.normalize(node.firstChild);
		}
		this.normalize(node.nextSibling);
	}
	
	
	de.titus.jstl.functions.TextContent.CONTENTTYPE = {};
	de.titus.jstl.functions.TextContent.CONTENTTYPE["html"] = function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
		$(aNode).replaceWith($.parseHTML(aText));
	};
	de.titus.jstl.functions.TextContent.CONTENTTYPE["text/html"] = de.titus.jstl.functions.TextContent.CONTENTTYPE["html"];
	
	de.titus.jstl.functions.TextContent.CONTENTTYPE["json"] = function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
		if (typeof aText === "string")
			aNode.textContent = aText;
		else
			aNode.textContent = JSON.stringify(aText);
	};
	de.titus.jstl.functions.TextContent.CONTENTTYPE["application/json"] = de.titus.jstl.functions.TextContent.CONTENTTYPE["json"];
	
	de.titus.jstl.functions.TextContent.CONTENTTYPE["text"] = function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
		var text = aText;
		var addAsHtml = false;
		
		var trimLength = aBaseElement.attr(aProcessor.config.attributePrefix + "text-trim-length");
		if (trimLength != undefined && trimLength != "") {
			trimLength = aProcessor.expressionResolver.resolveExpression(trimLength, aDataContext, "-1");
			trimLength = parseInt(trimLength);
			if (trimLength && trimLength > 0)
				text = de.titus.core.StringUtils.trimTextLength(text, trimLength);
		}
		
		var preventformat = aBaseElement.attr(aProcessor.config.attributePrefix + "text-prevent-format");
		if (preventformat != undefined && preventformat != "false") {
			preventformat = preventformat == "" || aProcessor.expressionResolver.resolveExpression(preventformat, aDataContext, true) || true;
			if (preventformat == "true" || preventformat == true) {
				text = de.titus.core.StringUtils.formatToHtml(text);
				addAsHtml = true;
			}
		}
		
		if (addAsHtml)
			$(aNode).replaceWith($.parseHTML(text));
		else
			aNode.textContent = aText;
	};
	de.titus.jstl.functions.TextContent.CONTENTTYPE["text/plain"] = de.titus.jstl.functions.TextContent.CONTENTTYPE["text"];
});
