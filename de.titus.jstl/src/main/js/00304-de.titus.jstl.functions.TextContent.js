de.titus.core.Namespace.create("de.titus.jstl.functions.TextContent", function() {
	var TextContent = function() {};
	TextContent.prototype = new de.titus.jstl.IFunction();
	TextContent.prototype.constructor = TextContent;
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * static variables
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	TextContent.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.TextContent");
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * functions
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	TextContent.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (TextContent.LOGGER.isDebugEnabled())
			TextContent.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.resolver || new de.titus.core.ExpressionResolver();
		var ignore = aElement.data("jstlTextIgnore");
		
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
				var contentFunction = TextContent.CONTENTTYPE[contenttype];
				if (contentFunction)
					contentFunction(node, text, aElement, processor, aDataContext);
			});
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	TextContent.prototype.normalize = function(node) {
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
		
		var trimLength = aBaseElement.attr(aProcessor.config.attributePrefix + "text-trim-length");
		if (trimLength != undefined && trimLength != "") {
			trimLength = aprocessor.resolver.resolveExpression(trimLength, aDataContext, "-1");
			trimLength = parseInt(trimLength);
			if (trimLength && trimLength > 0)
				text = de.titus.core.StringUtils.trimTextLength(text, trimLength);
		}
		
		var preventformat = aBaseElement.attr(aProcessor.config.attributePrefix + "text-prevent-format");
		if (preventformat != undefined && preventformat != "false") {
			preventformat = preventformat == "" || aprocessor.resolver.resolveExpression(preventformat, aDataContext, true) || true;
			if (preventformat == "true" || preventformat == true) {
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
