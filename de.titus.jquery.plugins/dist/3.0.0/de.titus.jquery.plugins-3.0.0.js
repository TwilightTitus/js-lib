/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Frank Schüler
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


var de = de || {};
de.titus = de.titus || {};
de.titus.core = de.titus.core || {};
if (de.titus.core.Namespace == undefined) {
	de.titus.core.Namespace = {};
	/**
	 * creates a namespace and run the function, if the Namespace new
	 * 
	 * @param aNamespace
	 *            the namespace(requiered)
	 * @param aFunction
	 *            a function that be executed, if the namespace created (optional)
	 * 
	 * @returns boolean, true if the namespace created
	 */
	de.titus.core.Namespace.create = function(aNamespace, aFunction) {
		var namespaces = aNamespace.split(".");
		var currentNamespace = window;
		var namespaceCreated = false;
		for (var i = 0; i < namespaces.length; i++) {
			if (currentNamespace[namespaces[i]] == undefined) {
				currentNamespace[namespaces[i]] = {};
				namespaceCreated = true;
			}
			currentNamespace = currentNamespace[namespaces[i]];
		}
		if (namespaceCreated && aFunction != undefined) {
			aFunction();
		}
		
		return namespaceCreated;
	};
	
	/**
	 * exist the namespace?
	 * 
	 * @param aNamespace
	 *            the namespace(requiered)
	 * 
	 * @returns boolean, true if the namespace existing
	 */
	de.titus.core.Namespace.exist = function(aNamespace) {
		var namespaces = aNamespace.split(".");
		var currentNamespace = window;
		for (var i = 0; i < namespaces.length; i++) {
			if (currentNamespace[namespaces[i]] == undefined) {
				return false;
			}
			currentNamespace = currentNamespace[namespaces[i]];
		}
		return true;
	};
};de.titus.core.Namespace.create("de.titus.core.SpecialFunctions", function() {
	
	de.titus.core.SpecialFunctions = {};
	
	de.titus.core.SpecialFunctions.doEval = function(aStatement, aContext, aCallback) {
		if (aCallback) {
			de.titus.core.SpecialFunctions.doEvalWithContext(aStatement, (aContext || {}), undefined, aCallback);
		} else {
			if (aStatement != undefined && typeof aStatement !== "string")
				return aStatement;
			else if (aStatement != undefined) {
				var result = undefined;
				var runContext = aContext || {};
				with (runContext) {
					eval("result = " + aStatement + ";");
				}
				return result;
			}
			
			return undefined;
		}
	};
	
	
	/**
	 * 
	 * @param aStatement
	 * @param aContext
	 * @param aDefault
	 * @param aCallback
	 * @returns
	 */
	de.titus.core.SpecialFunctions.doEvalWithContext = function(aStatement, aContext, aDefault, aCallback) {
		if (aCallback && typeof aCallback === "function") {
			window.setTimeout(function() {
				var result = de.titus.core.SpecialFunctions.doEvalWithContext(aStatement, aContext, aDefault, undefined);
				aCallback(result, aContext);
			}, 1);
			
		} else
			try {
				var result = de.titus.core.SpecialFunctions.doEval(aStatement, aContext);
				if(result == undefined)
					return aDefault;
				return result;
			} catch (e) {
				return aDefault;
			}
	};
	
});
(function($) {
	$.fn.tagName = $.fn.tagName || function() {
		if (this.length == undefined || this.length == 0)
			return undefined;
		else if (this.length > 1) {
			return this.each(function() {
				return $(this).tagName();
			});
		} else {
			var tagname = this.prop("tagName");
			if(tagname != undefined && tagname != "")
				return tagname.toLowerCase();
			
			return undefined;				
		}
	};
})(jQuery);
(function($){
	if($.fn.Selector == undefined){
		$.fn.Selector = function() {
			var pathes = [];
			
			this.each(function() {
				var element = $(this);
				if(element[0].id != undefined && element[0].id != "")
					pathes.push("#" + element[0].id);
				else {
					var path;
					while (element.length) {
						var realNode = element.get(0), name = realNode.localName;
						if (!name) {
							break;
						}
						
						name = name.toLowerCase();
						var parent = element.parent();
						var sameTagSiblings = parent.children(name);
						
						if (sameTagSiblings.length > 1) {
							allSiblings = parent.children();
							var index = allSiblings.index(realNode) + 1;
							if (index > 0) {
								name += ':nth-child(' + index + ')';
							}
						}
						
						path = name + (path ? ' > ' + path : '');
						element = parent;
					}			
					pathes.push(path);
				}
			});
			
			return pathes.join(',');
		};
	};
})($);
(function() {
    "use strict";
    de.titus.core.Namespace.create("de.titus.core.ArrayUtils", function() {
	var ArrayUtils = de.titus.core.ArrayUtils = {
	    
	}
    });
})($);
(function() {
    "use strict";
    de.titus.core.Namespace.create("de.titus.core.PagingUtils", function() {
	var  PagingUtils = de.titus.core.PagingUtils = {
	pagerData : function(aPage, aPages, aSize) {
	    var half = Math.round(aPages / 2);
	    var result = {
	    firstPage : 1,
	    startPage : 1,
	    endPage : aSize,
	    lastPage: aPages,
	    current : aPage,
	    pageCount : aPages
	    };
	    if (aSize > aPages)
		result.endPage = aPages;
	    else if (aPage + half > aPages) {
		result.endPage = aPages;
		result.startPage = (end - aSize) + 1;
	    } else if (aPage - half > 1) {
		result.endPage = (aPage + half);
		result.startPage = (end - aSize) + 1;
	    }
	    result.count = result.endPage - result.startPage;
	    return result;
	},

	pageArray : function(aPage, aSize, aArray) {
	    return aArray.slice((aPage - 1) * aSize, aSize);
	}

	}
    });
})($);
de.titus.core.Namespace.create("de.titus.core.regex.Matcher", function() {
	de.titus.core.regex.Matcher = function(/* RegExp */aRegExp, /* String */aText) {
		this.internalRegex = aRegExp;
		this.processingText = aText;
		this.currentMatch = undefined;
	}

	de.titus.core.regex.Matcher.prototype.isMatching = /* boolean */function() {
		return this.internalRegex.test(this.processingText);
	};
	
	de.titus.core.regex.Matcher.prototype.next = /* boolean */function() {
		this.currentMatch = this.internalRegex.exec(this.processingText);
		if (this.currentMatch != undefined) {
			this.processingText = this.processingText.replace(this.currentMatch[0], "");
			return true;
		}
		return false;
	};
	
	de.titus.core.regex.Matcher.prototype.getMatch = /* String */function() {
		if (this.currentMatch != undefined)
			return this.currentMatch[0];
		return undefined;
	};
	
	de.titus.core.regex.Matcher.prototype.getGroup = /* String */function(/* int */aGroupId) {
		if (this.currentMatch != undefined)
			return this.currentMatch[aGroupId];
		return undefined;
	};
	
	de.titus.core.regex.Matcher.prototype.replaceAll = /*String*/ function(/* String */aReplaceValue, /* String */aText) {
		if (this.currentMatch != undefined)
			return aText.replace(this.currentMatch[0], aReplaceValue);
		return aText;
	};
});

de.titus.core.Namespace.create("de.titus.core.regex.Regex", function() {
	
	de.titus.core.regex.Regex = function(/* String */aRegex, /* String */aOptions) {
		this.internalRegex = new RegExp(aRegex, aOptions);
	};
	
	de.titus.core.regex.Regex.prototype.parse = /* de.titus.core.regex.Matcher */function(/* String */aText) {
		return new de.titus.core.regex.Matcher(this.internalRegex, aText);
	};
});
de.titus.core.Namespace.create("de.titus.core.ExpressionResolver", function() {
	
	de.titus.core.ExpressionResolver = function(varRegex) {
		this.regex = new de.titus.core.regex.Regex(varRegex || de.titus.core.ExpressionResolver.TEXT_EXPRESSION_REGEX);
	};
	
	/**
	 * static variables
	 */
	de.titus.core.ExpressionResolver.TEXT_EXPRESSION_REGEX = "\\$\\{([^\\$\\{\\}]*)\\}";
	
	/**
	 * @param aText
	 * @param aDataContext
	 * @param aDefaultValue
	 * 
	 * @returns
	 */
	de.titus.core.ExpressionResolver.prototype.resolveText = function(aText, aDataContext, aDefaultValue) {
		var text = aText;
		var matcher = this.regex.parse(text);
		while (matcher.next()) {
			var expression = matcher.getMatch();
			var expressionResult = this.internalResolveExpression(matcher.getGroup(1), aDataContext, aDefaultValue);
			if (expressionResult != undefined)
				text = matcher.replaceAll(expressionResult, text);
		}
		return text;
	}

	/**
	 * functions
	 */
	
	/**
	 * @param aExpression
	 * @param aDataContext
	 * @param aDefaultValue
	 * 
	 * @returns
	 */
	de.titus.core.ExpressionResolver.prototype.resolveExpression = function(aExpression, aDataContext, aDefaultValue) {
		var matcher = this.regex.parse(aExpression);
		if (matcher.next()) {
			return this.internalResolveExpression(matcher.getGroup(1), aDataContext, aDefaultValue);
		}
		
		return this.internalResolveExpression(aExpression, aDataContext, aDefaultValue);
	};
	
	/**
	 * @param aExpression
	 * @param aDataContext
	 * @param aDefaultValue
	 * 
	 * @returns
	 */
	de.titus.core.ExpressionResolver.prototype.internalResolveExpression = function(aExpression, aDataContext, aDefaultValue) {
		try {
			return de.titus.core.SpecialFunctions.doEvalWithContext(aExpression, aDataContext, aDefaultValue);			
		} catch (e) {
			return aDefaultValue;
		}
	};
	
});
(function($) {
	de.titus.core.Namespace.create("de.titus.core.URL", function() {
		de.titus.core.URL = function(aProtocol, aDomain, aPort, aPath, theParameter, aMarker) {
			
			var protocol = aProtocol;
			var domain = aDomain;
			var port = aPort;
			var path = aPath;
			var parameters = theParameter;
			var marker = aMarker

			this.getMarker = function() {
				return marker;
			}

			this.setMarker = function(aMarker) {
				marker = aMarker;
			}

			this.getProtocol = function() {
				if (protocol == undefined) {
					protocol = "http";
				}
				return protocol;
			};
			
			this.setProtocol = function(aProtocol) {
				protokoll = aProtocol;
			};
			
			this.getDomain = function() {
				return domain;
			};
			
			this.setDomain = function(aDomain) {
				domain = aDomain;
			};
			
			this.getPath = function() {
				return path;
			};
			
			this.setPath = function(aPath) {
				path = aPath;
			};
			
			this.getPort = function() {
				if (port == undefined) {
					port = 80;
				}
				return port;
			};
			
			this.setPort = function(aPort) {
				
				port = aPort;
			};
			
			this.getParameters = function() {
				return parameters;
			};
			
			this.setParameters = function(theParameter) {
				parameters = theParameter;
			};
		};
		
		de.titus.core.URL.prototype.getParameter = function(aKey) {
			var value = this.getParameters()[aKey];
			if (value == undefined)
				return undefined;
			if (value.length > 1)
				return value;
			else
				return value[0];
		};
		
		de.titus.core.URL.prototype.getParameters = function(aKey) {
			return this.getParameters()[aKey];
		};
		
		de.titus.core.URL.prototype.addParameter = function(aKey, aValue, append) {
			if (this.getParameters()[aKey] == undefined) {
				this.getParameters()[aKey] = [];
			}
			if (!append && aValue == undefined) {
				this.getParameters()[aKey] = undefined;
			} else if (!append && aValue != undefined && aValue.length != undefined) {
				this.getParameters()[aKey] = aValue;
			} else if (append && aValue != undefined && aValue.length != undefined) {
				$.merge(this.getParameters()[aKey], aValue);
			} else if (!append && aValue != undefined) {
				this.getParameters()[aKey] = [ aValue ];
			} else if (append && aValue != undefined) {
				this.getParameters()[aKey].push(aValue);
			}
		};
		
		de.titus.core.URL.prototype.getQueryString = function() {
			if (this.getParameters() != undefined) {
				var parameters = this.getParameters();
				var result = "?";
				var isFirstParameter = true;
				for ( var propertyName in parameters) {
					if (!isFirstParameter) {
						result = result + "&";
					} else {
						isFirstParameter = false;
					}
					var parameterValues = parameters[propertyName];
					if (parameterValues.length == undefined) {
						result = result + encodeURIComponent(propertyName) + "=" + encodeURIComponent(parameterValues);
					} else {
						for (j = 0; j < parameterValues.length; j++) {
							if (j > 0) {
								result = result + "&";
							}
							result = result + encodeURIComponent(propertyName) + "=" + encodeURIComponent(parameterValues[j]);
						}
					}
				}
				return result;
			} else {
				return "";
			}
		};
		
		de.titus.core.URL.prototype.asString = function() {
			var result = this.getProtocol() + "://" + this.getDomain() + ":" + this.getPort();
			
			if (this.getPath() != undefined)
				result = result + this.getPath();
			
			if (this.getMarker() != undefined)
				result = result + "#" + this.getMarker();
			
			result = result + this.getQueryString();
			
			return result;
		};
		
		de.titus.core.URL.prototype.toString = function() {
			return this.asString();
		};
		
		de.titus.core.URL.fromString = function(aUrlString) {
			var tempUrl = aUrlString;
			var protocol = "http";
			var host;
			var port = 80;
			var path = "/";
			var marker = "";
			var parameterString;
			var splitIndex = -1;
			var parameter = {};
			
			var regex = new RegExp("\\?([^#]*)");
			var match = regex.exec(tempUrl);
			if (match != undefined)
				parameterString = match[1];
			
			var regex = new RegExp("#([^\\?#]*)");
			var match = regex.exec(tempUrl);
			if (match != undefined)
				marker = decodeURIComponent(match[1]);
			
			splitIndex = tempUrl.indexOf("://");
			if (splitIndex > 0) {
				protocol = tempUrl.substr(0, splitIndex);
				tempUrl = tempUrl.substr(splitIndex + 3);
			}
			
			var regex = new RegExp("([^\/:\\?#]*)");
			var match = regex.exec(tempUrl);
			if (match != undefined)
				host = match[1];
			
			var regex = new RegExp(":([^\\/\\?#]*)");
			var match = regex.exec(tempUrl);
			if (match != undefined) {
				port = match[1];
			} else if (protocol.toLowerCase() == "https")
				port = 443;
			else if (protocol.toLowerCase() == "ftp")
				port = 21;
			else if (protocol.toLowerCase() == "ftps")
				port = 21;
			
			var regex = new RegExp("(/[^\\?#]*)");
			var match = regex.exec(tempUrl);
			if (match != undefined) {
				path = match[1];
			}
			
			var regex = new RegExp("([^&\\?#=]*)=([^&\\?#=]*)");
			if (parameterString != undefined && "" != parameterString) {
				var parameterEntries = parameterString.split("&");
				for (i = 0; i < parameterEntries.length; i++) {
					var match = regex.exec(parameterEntries[i]);
					var pName = decodeURIComponent(match[1]);
					var pValue = decodeURIComponent(match[2]);
					parameter[pName] ? parameter[pName].push(pValue) : parameter[pName] = [ pValue ];
				}
			}
			
			return new de.titus.core.URL(protocol, host, port, path, parameter, marker);
			
		};
		de.titus.core.URL.getCurrentUrl = function() {
			if (de.titus.core.URL.STATIC__CURRENTURL == undefined) {
				de.titus.core.URL.STATIC__CURRENTURL = de.titus.core.URL.fromString(location.href);
			}
			
			return de.titus.core.URL.STATIC__CURRENTURL;
		};
	});
})($);
(function($) {
	de.titus.core.Namespace.create("de.titus.core.Page", function() {
		
		de.titus.core.Page = function() {
			this.baseTagValue = undefined;
			this.hasBaseTag = false;
			var baseTag = $('base');
			if (baseTag != undefined) {
				this.baseTagValue = baseTag.attr("href");
				this.hasBaseTag = true;
			}
			this.files = {};
			this.data = {};
		};
		
		// KONSTANTEN
		de.titus.core.Page.CSSTEMPLATE = '<link rel="stylesheet" type="text/css"/>';
		de.titus.core.Page.JSTEMPLATE = '<script type="text/javascript"></script>';
		
		de.titus.core.Page.prototype.addJsFile = function(aUrl, aFunction, forceFunction) {
			if ($.isArray(aUrl)) {
				return this.addJsFiles(aUrl, aFunction, forceFunction);
			}
			if (this.files[aUrl] == undefined) {
				this.files[aUrl] = true;
				var jsScript = $(de.titus.core.Page.JSTEMPLATE).clone();
				jsScript.attr("src", aUrl);
				$("head").append(jsScript);
				
				if (aFunction != undefined)
					aFunction();
			} else if (forceFunction && aFunction != undefined) {
				aFunction();
			}
		};
		
		de.titus.core.Page.prototype.addJsFiles = function(aUrls, aFunction, forceFunction) {
			if ($.isArray(aUrls)) {
				var url = aUrls.shift();
				if (aUrls.length != 0) {
					var $__THIS__$ = this;
					this.addJsFile(url, function() {
						$__THIS__$.addJsFiles(aUrls, aFunction, forceFunction)
					}, true);
				} else
					this.addJsFile(url, aFunction, forceFunction);
			} else {
				this.addJsFile(aUrls, aFunction, forceFunction);
			}
		};
		
		de.titus.core.Page.prototype.addCssFile = function(aUrl) {
			if ($.isArray(aUrl)) {
				this.addCssFiles(aUrl);
				return;
			}
			
			if (this.files[aUrl] == undefined) {
				this.files[aUrl] = true;
				var cssScript = $(de.titus.core.Page.CSSTEMPLATE).clone();
				cssScript.attr("href", aUrl);
				$("head").append(cssScript);
			}
		};
		
		de.titus.core.Page.prototype.addCssFiles = function(aUrls) {
			if ($.isArray(aUrls)) {
				for (i = 0; i < aUrls.length; i++) {
					this.addCssFile(aUrls[i]);
				}
			}
		};
		
		de.titus.core.Page.prototype.getUrl = function() {
			return de.titus.core.URL.getCurrentUrl();
		};
		
		de.titus.core.Page.prototype.buildUrl = function(aUrl) {
			var browser = this.detectBrowser();
			if (browser.ie && browser.ie < 11) {
				var tempUrl = aUrl.toLowerCase().trim();
				if (this.hasBaseTag && !tempUrl.indexOf("http:") == 0 && !tempUrl.indexOf("https:") == 0 && !tempUrl.indexOf("ftp:") == 0 && !tempUrl.indexOf("ftps:") == 0 && !tempUrl.indexOf("mailto:") == 0 && !tempUrl.indexOf("notes:") == 0 && !tempUrl.indexOf("/") == 0) {
					return this.baseTagValue + aUrl;
				}
			}
			return aUrl;
		};
		
		de.titus.core.Page.prototype.detectBrowser = function() {
			/* http://stackoverflow.com/a/21712356/2120330 */
			var result = {
			"ie" : false,
			"edge": false,
			"other" : false
			};
			var ua = window.navigator.userAgent;			
			if (ua.indexOf('MSIE ') > 0)
				result.ie = 8;
			else if (ua.indexOf("Trident/7.0") > 0)
				result.ie = 11;
			else if (ua.indexOf("Trident/6.0") > 0)
				result.ie = 10;
			else if (ua.indexOf("Trident/5.0") > 0)
				result.ie = 9;	
			else if (ua.indexOf('Edge/') > 0)
				result.edge = 1;	
			else
				result.other = true;
			
			return result;
		};
		
		de.titus.core.Page.prototype.setData = function(aKey, aValue) {
			this.data[aKey] = aValue;
		};
		
		de.titus.core.Page.prototype.getData = function(aKey) {
			return this.data[aKey];
		};
		
		de.titus.core.Page.getInstance = function() {
			if (de.titus.core.Page.INSTANCE == undefined) {
				de.titus.core.Page.INSTANCE = new de.titus.core.Page();
			}
			
			return de.titus.core.Page.INSTANCE;
		};
		
		if ($.fn.de_titus_core_Page == undefined) {
			$.fn.de_titus_core_Page = de.titus.core.Page.getInstance;
		}
		;
	});
})($);
de.titus.core.Namespace.create("de.titus.core.UUID", function() {
	de.titus.core.UUID = function(customSpacer) {
		var spacer = customSpacer || "-";
		var template = 'xxxxxxxx' + spacer + 'xxxx' + spacer + '4xxx' + spacer + 'yxxx' + spacer + 'xxxxxxxxxxxx';
		return template.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0
			var v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};
});(function($) {
	de.titus.core.Namespace.create("de.titus.core.StringUtils", function() {
		de.titus.core.StringUtils = {};
		de.titus.core.StringUtils.DEFAULTS = {};
		de.titus.core.StringUtils.DEFAULTS.formatToHtml = {
		"tabsize" : 4,
		"tabchar" : "&nbsp;",
		"newlineTag" : "<br/>"
		};
		
		de.titus.core.StringUtils.DEFAULTS.trimTextLength = {
			"postfix" : "..."
		};
		
		de.titus.core.StringUtils.trimTextLength = function(aText, maxLength, theSettings) {
			if (aText == undefined || typeof aText !== "string" || aText == "")
				return aText;
			
			var settings = $.extend({}, theSettings, de.titus.core.StringUtils.DEFAULTS.trimTextLength);
			
			if (aText.length > maxLength) {
				var end = maxLength - settings.postfix.length;
				if ((aText.length - end) > 0)
					return aText.substring(0, end) + settings.postfix;
			}
			return aText;
		};
		
		de.titus.core.StringUtils.formatToHtml = function(aText, theSettings) {
			if (aText == undefined || typeof aText !== "string" || aText == "")
				return aText;
			
			var settings = $.extend({}, theSettings, de.titus.core.StringUtils.DEFAULTS.formatToHtml);
			var text = aText.replace(new RegExp("\n\r", "g"), "\n");
			var text = aText.replace(new RegExp("\r", "g"), "\n");
			var lines = text.split("\n");
			var text = "";
			for (var i = 0; i < lines.length; i++) {
				if (i != 0)
					text = text + settings.newlineTag;
				text = text + de.titus.core.StringUtils.preventTabs(lines[i], settings.tabsize, settings.tabchar);
			}
			return text;
		};
		
		de.titus.core.StringUtils.getTabStopMap = function(tabSize, tabString) {
			var tabstopMap = [];
			for (var i = 0; i <= tabSize; i++) {
				if (i == 0)
					tabstopMap[0] = "";
				else
					tabstopMap[i] = tabstopMap[i - 1] + tabString;
			}
			
			return tabstopMap;
		};
		
		de.titus.core.StringUtils.preventTabs = function(aText, theTabStops, theTabStopChar) {
			var tabstopMap = de.titus.core.StringUtils.getTabStopMap(theTabStops, theTabStopChar);
			var tabStops = theTabStops;
			var text = "";
			var tabs = aText.split("\t");
			for (var i = 0; i < tabs.length; i++) {
				if (tabs[i].length != 0 && i != 0) {
					var size = text.length;
					var tabSize = size % tabStops;
					text = text + tabstopMap[theTabStops - tabSize] + tabs[i];
				} else if (tabs[i].length == 0 && i != 0)
					text = text + tabstopMap[theTabStops];
				else
					text = text + tabs[i];
			}
			
			return text;
		};
		
		// This is the function.
		de.titus.core.StringUtils.format = function(aText, args) {
			var objects = arguments;
			return aText.replace(de.titus.core.StringUtils.format.VARREGEX, function(item) {
				var index = parseInt(item.substring(1, item.length - 1)) + 1;
				var replace;
				if (index > 0 && index < objects.length ) {
					replace = objects[index];
					if(typeof replace !== "string")
						replace = JSON.stringify(replace);
				} else if (index === -1) {
					replace = "{";
				} else if (index === -2) {
					replace = "}";
				} else {
					replace = "";
				}
				return replace;
			});
		};
		de.titus.core.StringUtils.format.VARREGEX = new RegExp("{-?[0-9]+}", "g");
		
		$.fn.de_titus_core_StringUtils = de.titus.core.StringUtils;
	});
})($);
(function($) {
	de.titus.core.Namespace.create("de.titus.core.EventBind", function() {
		"use strict";
		de.titus.core.EventBind = function(anElement, aContext) {
			if (anElement.data(de.titus.core.EventBind.STATE.FINISHED) == undefined) {
				
				var eventType = anElement.attr("event-type");
				if (eventType == undefined || eventType.trim().length == 0) {
					anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.FAIL);
					return this;
				}
				
				var action = anElement.attr("event-action");
				if (action == undefined || action.trim().length == 0) {
					anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.FAIL);
					return this;
				}
				
				var data = undefined;
				var eventData = anElement.attr("event-data");
				if (eventData != undefined && eventData.trim().length > 0){
					data = de.titus.core.EventBind.EXPRESSIONRESOLVER.resolveExpression(eventData, aContext , {});
				}
				else if(aContext != undefined){
					data = $().extend({}, aContext);
				}
				else {
					data = {};
				}
				
				anElement.on(eventType, null, data, de.titus.core.EventBind.$$__execute__$$);
				anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.READY);
				return this;
			}
		};
		
		de.titus.core.EventBind.EXPRESSIONRESOLVER = new de.titus.core.ExpressionResolver();
		de.titus.core.EventBind.STATE = {
			FINISHED : "$$EventBind.FINISHED$$"
		};
		de.titus.core.EventBind.FINISHEDSTATE = {
		FAIL : "fail",
		READY : "ready"
		};
		
		de.titus.core.EventBind.$$__execute__$$ = function(anEvent) {
			var element = $(this);
			if (element.attr("event-prevent-default") != undefined)
				anEvent.preventDefault();
			if (element.attr("event-stop-propagation") != undefined)
				anEvent.stopPropagation();
			
			var action = element.attr("event-action");
			action = de.titus.core.EventBind.EXPRESSIONRESOLVER.resolveExpression(action, anEvent.data, undefined);
			if (typeof action === "function"){
				var args = Array.from(arguments);
				if(args != undefined && args.length >= 1 && anEvent.data != undefined){
					args.splice(1,0,anEvent.data);
				}
				action.apply(action, args);
			}
			
			return !anEvent.isDefaultPrevented();
		};
		
		$.fn.de_titus_core_EventBind = function(aContext) {
			if (this.length == 1)
				return de.titus.core.EventBind(this, aContext);
			else if (this.length >= 1) {
				return this.each(function() {
					return $(this).de_titus_core_EventBind(aContext);
				});
			}
		};
		
		$(document).ready(function() {
			var hasAutorun = $("[event-autorun]");
			if (hasAutorun != undefined && hasAutorun.length != 0) {
				$("[event-autorun]").de_titus_core_EventBind();
				$("[event-autorun]").find("[event-type]").de_titus_core_EventBind();
				
				var observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {
						for (var i = 0; i < mutation.addedNodes.length; i++) {
							if (mutation.addedNodes[i].nodetype != Node.TEXT_NODE) {
								$(mutation.addedNodes[i]).find("[event-type]").de_titus_core_EventBind();
							}
						}
					});
				});
				
				// configuration of the observer:
				var config = {
				attributes : false,
				childList : true,
				subtree : true,
				characterData : false
				};
				
				// pass in the target node, as well as the observer options
				observer.observe(document.querySelector("[event-autorun]"), config);
			}
		});
	});
})($, document);
(function($) {
    "use strict";
    de.titus.core.Namespace.create("de.titus.core.Converter", function() {
	de.titus.core.Converter.xmlToJson = function(aNode) {
	    // Create the return object
	    var obj = {};
	    if (aNode.nodeType == 1 || aNode.nodeType == 9) { // element
		// do attributes
		if (aNode.attributes != undefined && aNode.attributes.length > 0) {
		    var attributes = {};
		    for (var j = 0; j < aNode.attributes.length; j++) {
			var attribute = aNode.attributes.item(j);
			attributes[attribute.nodeName] = attribute.nodeValue;
		    }
		    obj["@attributes"] = attributes;
		}
	    } else if (aNode.nodeType == 3 || aNode.nodeType == 4) // text
		return aNode.textContent.trim();

	    // do children
	    if (aNode.hasChildNodes()) {
		var textContent = undefined;
		var hasChildren = false;
		for (var i = 0; i < aNode.childNodes.length; i++) {
		    var item = aNode.childNodes.item(i);
		    if (item.nodeType == 1) {
			hasChildren = true;
			var nodeName = item.nodeName;
			if (typeof (obj[nodeName]) == "undefined") {
			    obj[nodeName] = de.titus.core.Converter.xmlToJson(item);
			} else {
			    if (typeof (obj[nodeName].push) == "undefined") {
				var old = obj[nodeName];
				obj[nodeName] = [];
				obj[nodeName].push(old);
			    }
			    obj[nodeName].push(de.titus.core.Converter.xmlToJson(item));
			}
		    } else if (item.nodeType == 3 || item.nodeType == 4)
			if (item.textContent != "")
			    textContent = (textContent ? textContent + item.textContent : item.textContent);
		}

		if (textContent) {
		    if (obj["@attributes"] == undefined && !hasChildren)
			obj = textContent.trim();
		    else
			obj.text = textContent.trim();
		}	    
	    }
	    return obj;
	};

    });
})($);

/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Frank Schüler
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

de.titus.core.Namespace.create("de.titus.logging.LogLevel", function() {
	
	de.titus.logging.LogLevel = function(aOrder, aTitle){
		this.order = aOrder;
		this.title = aTitle;
	};
	
	de.titus.logging.LogLevel.prototype.isIncluded = function(aLogLevel){
		return this.order >= aLogLevel.order;
	};
	
	de.titus.logging.LogLevel.getLogLevel = function(aLogLevelName){
		if(aLogLevelName == undefined)
			return de.titus.logging.LogLevel.NOLOG;
		
		var levelName = aLogLevelName.toUpperCase();
		return de.titus.logging.LogLevel[levelName];
	};
	
	de.titus.logging.LogLevel.NOLOG = new de.titus.logging.LogLevel(0, "NOLOG");
	de.titus.logging.LogLevel.ERROR = new de.titus.logging.LogLevel(1, "ERROR");
	de.titus.logging.LogLevel.WARN 	= new de.titus.logging.LogLevel(2, "WARN");
	de.titus.logging.LogLevel.INFO 	= new de.titus.logging.LogLevel(3, "INFO");
	de.titus.logging.LogLevel.DEBUG = new de.titus.logging.LogLevel(4, "DEBUG");
	de.titus.logging.LogLevel.TRACE = new de.titus.logging.LogLevel(5, "TRACE");	
});
de.titus.core.Namespace.create("de.titus.logging.LogAppender", function() {
	
	de.titus.logging.LogAppender = function() {
	};
	
	de.titus.logging.LogAppender.prototype.formatedDateString = function(aDate){
		if(aDate == undefined)
			return "";
		
		var dateString = "";
		
		dateString += aDate.getFullYear() + ".";
		if(aDate.getMonth() < 10) dateString += "0" + aDate.getMonth();
		else dateString += aDate.getMonth();
		dateString += ".";
		if(aDate.getDate() < 10) dateString += "0" + aDate.getDate();
		else dateString += aDate.getDate();		
		dateString +=  " ";
		if(aDate.getHours() < 10) dateString += "0" + aDate.getHours();
		else dateString += aDate.getHours();
		dateString += ":";
		if(aDate.getMinutes() < 10) dateString += "0" + aDate.getMinutes();
		else dateString += aDate.getMinutes();
		dateString += ":";
		if(aDate.getSeconds() < 10) dateString += "0" + aDate.getSeconds();
		else dateString += aDate.getSeconds();
		dateString += ":";
		if(aDate.getMilliseconds() < 10) dateString += "00" + aDate.getMilliseconds();
		if(aDate.getMilliseconds() < 100) dateString += "0" + aDate.getMilliseconds();
		else dateString += aDate.getMilliseconds();
		
		return dateString;
	};

	
	/*This need to be Implemented*/
	de.titus.logging.LogAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel){};
	
	
});

de.titus.core.Namespace.create("de.titus.logging.Logger", function() {
	
	de.titus.logging.Logger = function(aName, aLogLevel, aLogAppenders) {
		this.name = aName;
		this.logLevel = aLogLevel;
		this.logAppenders = aLogAppenders;
	};
	
	de.titus.logging.Logger.prototype.isErrorEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.ERROR);
	};
	de.titus.logging.Logger.prototype.isWarnEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.WARN);
	};
	de.titus.logging.Logger.prototype.isInfoEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.INFO);
	};
	de.titus.logging.Logger.prototype.isDebugEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.DEBUG);
	};
	de.titus.logging.Logger.prototype.isTraceEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.TRACE);
	};
	
	de.titus.logging.Logger.prototype.logError = function(aMessage, aException) {
		if (this.isErrorEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.ERROR);
	};
	
	de.titus.logging.Logger.prototype.logWarn = function(aMessage, aException) {
		if (this.isWarnEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.WARN);
	};
	
	de.titus.logging.Logger.prototype.logInfo = function(aMessage, aException) {
		if (this.isInfoEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.INFO);
	};
	
	de.titus.logging.Logger.prototype.logDebug = function(aMessage, aException) {
		if (this.isDebugEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.DEBUG);
	};
	
	de.titus.logging.Logger.prototype.logTrace = function(aMessage, aException) {
		if (this.isTraceEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.TRACE);
	};
	
	de.titus.logging.Logger.prototype.log = function(aMessage, anException, aLogLevel) {
		if(this.logAppenders == undefined)
			return;
		
		if(this.logAppenders.length > 0){
			for(var i = 0; i < this.logAppenders.length; i++)
				this.logAppenders[i].logMessage(aMessage, anException, this.name, new Date(), aLogLevel);
		}
	};
});
de.titus.core.Namespace.create("de.titus.logging.LoggerRegistry", function() {
	
	de.titus.logging.LoggerRegistry = function(){
		this.loggers = {};
	};		
	
	de.titus.logging.LoggerRegistry.prototype.addLogger = function(aLogger){
		if(aLogger == undefined)
			return;
		
		if(this.loggers[aLogger.name] == undefined)
			this.loggers[aLogger.name] = aLogger;
	};	
	
	de.titus.logging.LoggerRegistry.prototype.getLogger = function(aLoggerName){
		if(aLoggerName == undefined)
			return;
		
		return this.loggers[aLoggerName];
	};	
	
	
	de.titus.logging.LoggerRegistry.getInstance = function(){
		if(de.titus.logging.LoggerRegistry.INSTANCE == undefined)
			de.titus.logging.LoggerRegistry.INSTANCE = new de.titus.logging.LoggerRegistry();
		
		return de.titus.logging.LoggerRegistry.INSTANCE;
	};	
	
});de.titus.core.Namespace.create("de.titus.logging.LoggerFactory", function() {
	
	de.titus.logging.LoggerFactory = function() {
		this.configs = undefined;
		this.appenders = {};
		this.loadLazyCounter = 0;
	};
	
	de.titus.logging.LoggerFactory.prototype.newLogger = function(aLoggerName) {
		var logger = de.titus.logging.LoggerRegistry.getInstance().getLogger(aLoggerName);
		if (logger == undefined) {
			var config = this.findConfig(aLoggerName);
			var logLevel = de.titus.logging.LogLevel.getLogLevel(config.logLevel);
			var appenders = this.getAppenders(config.appenders);
			
			logger = new de.titus.logging.Logger(aLoggerName, logLevel, appenders);
			de.titus.logging.LoggerRegistry.getInstance().addLogger(logger);
		}
		
		return logger;
	};
	
	de.titus.logging.LoggerFactory.prototype.getConfig = function() {
		if (this.configs == undefined)
			this.updateConfigs();
		
		return this.configs;
	};
	
	de.titus.logging.LoggerFactory.prototype.setConfig = function(aConfig) {
		if (aConfig != undefined) {
			this.configs = aConfig;
			this.updateLogger();
		}
	};
	
	de.titus.logging.LoggerFactory.prototype.updateConfigs = function(aConfig) {
		if (this.configs == undefined)
			this.configs = {};
		
		var configElement = $("[logging-properties]").first();
		if (configElement != undefined && (configElement.length == undefined || configElement.length == 1)) {
			var propertyString = configElement.attr("logging-properties");
			var properties = de.titus.core.SpecialFunctions.doEval(propertyString, {});
			this.loadConfig(properties);
		} else {
			de.titus.logging.LoggerFactory.getInstance().doLoadLazy();
		}
	};
	
	de.titus.logging.LoggerFactory.prototype.doLoadLazy = function() {
		if (this.loadLazyCounter > 10)
			return;
		this.loadLazyCounter++;
		window.setTimeout(function() {
			de.titus.logging.LoggerFactory.getInstance().loadConfig();
		}, 1);
	};
	
	de.titus.logging.LoggerFactory.prototype.loadConfig = function(aConfig) {
		if (aConfig == undefined)
			this.updateConfigs();
		else {
			if (aConfig.remote)
				this.loadConfigRemote(aConfig.remote);
			else if (aConfig.data) {
				this.setConfig(aConfig.data.configs);
			}
		}
	};
	
	de.titus.logging.LoggerFactory.prototype.loadConfigRemote = function(aRemoteData) {
		var this_ = this;
		var ajaxSettings = {
		"async" : false,
		"cache" : false,
		"dataType" : "json"
		};
		ajaxSettings = $.extend(ajaxSettings, aRemoteData);
		ajaxSettings.success = function(data) {
			this_.setConfig(data.configs);
		};
		ajaxSettings.error = function(error) {
			console.log(error);
		};
		$.ajax(ajaxSettings)
	};
	
	de.titus.logging.LoggerFactory.prototype.updateLogger = function() {
		
		var loggers = de.titus.logging.LoggerRegistry.getInstance().loggers;
		
		for ( var loggerName in loggers) {
			var logger = loggers[loggerName];
			
			var config = this.findConfig(loggerName);
			var logLevel = de.titus.logging.LogLevel.getLogLevel(config.logLevel);
			var appenders = this.getAppenders(config.appenders);
			
			logger.logLevel = logLevel;
			logger.logAppenders = appenders;
		}
	};
	
	de.titus.logging.LoggerFactory.prototype.findConfig = function(aLoggerName) {
		var defaultConfig = {
		"filter" : "",
		"logLevel" : "NOLOG",
		"appenders" : []
		};
		var actualConfig = undefined;
		var configs = this.getConfig();
		for (var i = 0; i < configs.length; i++) {
			var config = configs[i];
			if (this.isConfigActiv(aLoggerName, config, actualConfig))
				actualConfig = config;
			else if (config.filter == undefined || config.filter == "")
				defaultConfig = config;
			if (actualConfig != undefined && actualConfig.filter == aLoggerName)
				return actualConfig;
		}
		
		return actualConfig || defaultConfig;
	};
	
	de.titus.logging.LoggerFactory.prototype.isConfigActiv = function(aLoggerName, aConfig, anActualConfig) {
		if (anActualConfig != undefined && anActualConfig.filter.length >= aConfig.filter.filter)
			return false;
		return aLoggerName.search(aConfig.filter) == 0;
	};
	
	de.titus.logging.LoggerFactory.prototype.getAppenders = function(theAppenders) {
		var result = new Array();
		for (var i = 0; i < theAppenders.length; i++) {
			var appenderString = theAppenders[i];
			var appender = this.appenders[appenderString];
			if (appender == undefined) {
				appender = de.titus.core.SpecialFunctions.doEval("new " + appenderString + "();");
				if (appender != undefined) {
					this.appenders[appenderString] = appender;
				}
			}
			if (appender != undefined)
				result.push(appender);
		}
		
		return result;
	};
	
	de.titus.logging.LoggerFactory.getInstance = function() {
		if (de.titus.logging.LoggerFactory.INSTANCE == undefined)
			de.titus.logging.LoggerFactory.INSTANCE = new de.titus.logging.LoggerFactory();
		
		return de.titus.logging.LoggerFactory.INSTANCE;
	};
	
});
de.titus.core.Namespace.create("de.titus.logging.ConsolenAppender", function() {
	
	de.titus.logging.ConsolenAppender = function() {
	};
	
	de.titus.logging.ConsolenAppender.prototype = new de.titus.logging.LogAppender();
	de.titus.logging.ConsolenAppender.prototype.constructor = de.titus.logging.ConsolenAppender;
	
	de.titus.logging.ConsolenAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel) {
		if (de.titus.logging.LogLevel.NOLOG == aLogLevel)
			return;
		var log = "";
		if (aDate)
			log += log = this.formatedDateString(aDate) + " ";
		
		log += "***" + aLogLevel.title + "*** " + aLoggerName + "";
		
		if (aMessage)
			log += " -> " + aMessage;
		if (anException)
			log += ": " + anException;
		
		if (de.titus.logging.LogLevel.ERROR == aLogLevel)
			console.error == undefined ? console.error(log) : console.log(log);
		else if (de.titus.logging.LogLevel.WARN == aLogLevel)
			console.warn == undefined ? console.warn(log) : console.log(log);
		else if (de.titus.logging.LogLevel.INFO == aLogLevel)
			console.info == undefined ? console.info(log) : console.log(log);
		else if (de.titus.logging.LogLevel.DEBUG == aLogLevel)
			console.debug == undefined ? console.debug(log) : console.log(log);
		else if (de.titus.logging.LogLevel.TRACE == aLogLevel)
			console.trace == undefined ? console.trace(log) : console.log(log);
		
	};
});
de.titus.core.Namespace.create("de.titus.logging.HtmlAppender", function() {
	
	
	
	de.titus.logging.HtmlAppender = function(){
	};
	
	de.titus.logging.HtmlAppender.CONTAINER_QUERY = "#log";
	
	de.titus.logging.HtmlAppender.prototype = new de.titus.logging.LogAppender();
	de.titus.logging.HtmlAppender.prototype.constructor = de.titus.logging.HtmlAppender;
	
	de.titus.logging.HtmlAppender.prototype.logMessage=  function(aMessage, anException, aLoggerName, aDate, aLogLevel){
		var container = $(de.titus.logging.HtmlAppender.CONTAINER_QUERY);
		if(container == undefined)
			return;
		
		var log = $("<div />").addClass("log-entry " + aLogLevel.title);
		var logEntry = "";
		if(aDate)
			logEntry += logEntry = this.formatedDateString(aDate) + " ";
		
		logEntry += "***" + aLogLevel.title + "*** " + aLoggerName + "";
		
		if(aMessage)
			logEntry += " -> " + aMessage;
		if(anException)
			logEntry += ": " + anException;
		
		log.text(logEntry);		
		container.append(log);
	};
});de.titus.core.Namespace.create("de.titus.logging.MemoryAppender", function() {
	
	window.MEMORY_APPENDER_LOG = new Array();
	
	de.titus.logging.MemoryAppender = function(){
	};
	
	de.titus.logging.MemoryAppender.prototype = new de.titus.logging.LogAppender();
	de.titus.logging.MemoryAppender.prototype.constructor = de.titus.logging.MemoryAppender;
	
	de.titus.logging.MemoryAppender.prototype.logMessage=  function(aMessage, anException, aLoggerName, aDate, aLogLevel){		
		var log = {"date": aDate, 
				"logLevel": aLogLevel,
				"loggerName": aLoggerName,
				"message": aMessage,
				"exception": anException
		};
		if(!window.MEMORY_APPENDER_LOG)
			window.MEMORY_APPENDER_LOG = [];
		window.MEMORY_APPENDER_LOG.push(log);
	};
});de.titus.core.Namespace.create("de.titus.logging.InteligentBrowserAppender", function() {	
	de.titus.logging.InteligentBrowserAppender = function(){
		this.appender = undefined;
	};
	
	de.titus.logging.InteligentBrowserAppender.prototype = new de.titus.logging.LogAppender();
	de.titus.logging.InteligentBrowserAppender.prototype.constructor = de.titus.logging.InteligentBrowserAppender;
	
	de.titus.logging.InteligentBrowserAppender.prototype.getAppender = function(){
		if(this.appender == undefined)
		{
			var consoleAvalible = console && console.log === "function";			
			
			if(consoleAvalible)
				this.appender = new de.titus.logging.ConsolenAppender();
			else if($(de.titus.logging.HtmlAppender.CONTAINER_QUERY))
				this.appender = new de.titus.logging.HtmlAppender();
			else
				this.appender = new de.titus.logging.MemoryAppender();			
		}
		
		return this.appender;
	}
	
	de.titus.logging.InteligentBrowserAppender.prototype.logMessage=  function(aMessage, anException, aLoggerName, aDate, aLogLevel){		
		this.getAppender().logMessage(aMessage, anException, aLoggerName, aDate, aLogLevel);
	};
});
/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Frank Schüler
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function($){
	de.titus.core.Namespace.create("de.titus.jstl", function() {});
})($);
de.titus.core.Namespace.create("de.titus.jstl.Constants", function() {
	de.titus.jstl.Constants = {
		EVENTS : {
		onStart : "jstl-on-start",
		onLoad : "jstl-on-load",
		onSuccess : "jstl-on-success",
		onFail : "jstl-on-fail",
		onReady : "jstl-on-ready"
		},
		PHASE : {
			INIT:0,
			CONDITION:1,
			CONTEXT:2,
			MANIPULATION:3,
			CONTENT:3,
			BINDING:4,
			CHILDREN:5,
			READY:6
		}
	};	
});
(function($, GlobalSettings) {
	"use strict";
	de.titus.jstl.GlobalSettings = $.extend(true, {
		DEFAULT_TIMEOUT_VALUE: 1,
		DEFAULT_INCLUDE_BASEPATH : ""		
	}, GlobalSettings);
})($, de.titus.jstl.GlobalSettings);
de.titus.core.Namespace.create("de.titus.jstl.TaskRegistry", function() {
	
	var TaskRegistry = {
		taskchain : undefined
	};
	
	TaskRegistry.append = function(aName, aPhase, aSelector, aFunction, aChain) {
		if (!aChain && !TaskRegistry.taskchain)
			TaskRegistry.taskchain = TaskRegistry.__buildEntry(aName, aPhase, aSelector, aFunction);
		else if (!aChain && TaskRegistry.taskchain)
			TaskRegistry.append(aName, aPhase, aSelector, aFunction, TaskRegistry.taskchain);
		else if (aChain.phase <= aPhase && aChain.next && aChain.next.phase <= aPhase)
			TaskRegistry.append(aName, aPhase, aSelector, aFunction, aChain.next);
		else if (aChain.phase <= aPhase && aChain.next && aChain.next.phase > aPhase) {
			var tempChain = aChain.next;
			aChain.next = TaskRegistry.__buildEntry(aName, aPhase, aSelector, aFunction);
			aChain.next.next = tempChain;
		} else if (aChain.phase <= aPhase && !aChain.next)
			aChain.next = TaskRegistry.__buildEntry(aName, aPhase, aSelector, aFunction);
		else if (aChain.phase > aPhase) {
			var tempChain = aChain;
			TaskRegistry.taskchain = TaskRegistry.__buildEntry(aName, aPhase, aSelector, aFunction);
			TaskRegistry.taskchain.next = aChain;
		}
	}

	TaskRegistry.__buildEntry = function(aName, aPhase, aSelector, aFunction) {
		return {
		    name : aName,
		    phase : aPhase,
		    selector : aSelector,
		    task : aFunction
		};
	}

	de.titus.jstl.TaskRegistry = TaskRegistry;
});
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.ExecuteChain", function() {
		var ExecuteChain = de.titus.jstl.ExecuteChain = function(aTaskChain, aCount) {
			this.count = aCount || 0;
			this.taskChain = aTaskChain;			
		};
		ExecuteChain.prototype.finish = function() {
			this.count--;
			if (this.count == 0)
				this.taskChain.nextTask();
		};
	});
})($, de.titus.jstl.GlobalSettings);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.TaskChain", function() {
		var TaskChain = function(aElement, aContext, aProcessor, isRoot, aCallback) {
			this.element = aElement;
			this.context = aContext;
			this.processor = aProcessor;
			this.root = isRoot;
			this.callback = aCallback;
			this.__preventChilds = false;
			this.__taskchain = de.titus.jstl.TaskRegistry.taskchain;			
		};
		TaskChain.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.TaskChain");
		
		TaskChain.prototype.preventChilds = function() {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("preventChilds()");
			this.__preventChilds = true;
			return this;
		};
		
		TaskChain.prototype.isPreventChilds = function() {
			return this.__preventChilds;
		};
		
		TaskChain.prototype.updateContext = function(aContext, doMerge) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("updateContext()");
			if (doMerge)
				this.context = $.extend(true, {}, this.context, aContext);
			else
				this.context = aContext;
			
			return this;
		};
		
		
		
		TaskChain.prototype.nextTask = function(aContext, doMerge) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("nextTask( \"" + aContext + "\")");
			
			if (aContext)
				this.updateContext(aContext, doMerge);
			
			if (this.__taskchain) {
				var name = this.__taskchain.name;
				var task = this.__taskchain.task;
				var phase = this.__taskchain.phase;
				var selector = this.__taskchain.selector; 
				this.__taskchain = this.__taskchain.next;
				
				if (TaskChain.LOGGER.isDebugEnabled())
					TaskChain.LOGGER.logDebug("nextTask() -> next task: \"" + name + "\", phase: \"" + phase + "\", selector \"" + selector + "\"!");
				if(selector == undefined || this.element.is(selector))
					task(this.element, this.__buildContext(), this.processor, this);
				else{
					if (TaskChain.LOGGER.isDebugEnabled())
						TaskChain.LOGGER.logDebug("nextTask() -> skip task: \"" + name + "\", phase: \"" + phase + "\", selector \"" + selector + "\"!");
					this.nextTask();
				}
			} else {
				if (TaskChain.LOGGER.isDebugEnabled())
					TaskChain.LOGGER.logDebug("nextTask() -> task chain is finished!");				
				this.finish();
			}
			
			return this;
		};
		
		TaskChain.prototype.__buildContext = function() {
		    return $.extend({},this.context,{"$root": this.processor.element, "$element" : this.element});
		};
		
		TaskChain.prototype.finish = function() {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("finish()");			
			
			if(this.callback)
				this.callback(this.element, this.context, this.processor, this);
			
			return this;
		};
		
		de.titus.jstl.TaskChain = TaskChain;
	});
})($,de.titus.jstl.GlobalSettings);
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
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.If", function() {
		var If = de.titus.jstl.functions.If = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.If"),
		    TASK : function(aElement, aDataContext, aProcessor, aExecuteChain) {
			    if (If.LOGGER.isDebugEnabled())
				    If.LOGGER.logDebug("TASK");
			    
			    var expression = aElement.attr("jstl-if");
			    if (expression != undefined) {
				    var expression = aProcessor.resolver.resolveExpression(expression, aDataContext, false);
				    if (typeof expression === "function")
					    expression = expression(aElement, aDataContext, aProcessor);
				    
				    if (!(expression == true || expression == "true")) {
					    aElement.remove();
					    aExecuteChain.preventChilds().finish();
				    } else
					    aExecuteChain.nextTask();
			    } else
				    aExecuteChain.nextTask();
		    }
		};
		
		de.titus.jstl.TaskRegistry.append("if", de.titus.jstl.Constants.PHASE.CONDITION, "[jstl-if]", de.titus.jstl.functions.If.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($, GlobalSettings) {
	de.titus.core.Namespace.create("de.titus.jstl.functions.Preprocessor", function() {
		de.titus.jstl.functions.Preprocessor = Preprocessor = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Preprocessor"),
		    
		    STATICEVENTHANDLER : function(aExpression, aEvent, aContext, aProcessor) {
			    if (aExpression && aExpression != "") {
				    var eventAction = aProcessor.resolver.resolveExpression(aExpression, aContext);
				    if (typeof eventAction === "function")
					    eventAction(aContext.$element, aContext, aProcessor);
			    }
		    },
		    
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Preprocessor.LOGGER.isDebugEnabled())
				    Preprocessor.LOGGER.logDebug("TASK");
			    
			    
			    if (aElement[0].nodeType != 1 ||aElement[0].nodeName == "br")
				    return aTaskChain.preventChilds().finish();
			    
			    if (!aTaskChain.root) {
				    var ignore = aElement.attr("jstl-ignore");
				    if (ignore && ignore != "") {
					    ignore = aProcessor.resolver.resolveExpression(ignore, aContext, false);
					    if (ignore == "" || ignore == true || ignore == "true")
						   return  aTaskChain.preventChilds().finish();
				    }
				    
				    var async = aElement.attr("jstl-async");
				    if (async && async != "") {
					    async = aProcessor.resolver.resolveExpression(async, dataContext, false);
					    if (async == "" || async == true || async == "true"){					    	
						    aProcessor.onReady((function(aContext){this.jstlAsync({data: aContext});}).bind(aElement, $.extend({}, aContext)));
						    return aTaskChain.preventChilds().finish();
					    }
				    }
			    }
			    
			    Preprocessor.__appendEvents(aElement);
			    
			    aElement.trigger(de.titus.jstl.Constants.EVENTS.onLoad, [ aContext, aProcessor]);
			    setTimeout(function(){aTaskChain.nextTask();}, GlobalSettings.DEFAULT_TIMEOUT_VALUE);
			    
			    
		    },
		    
		    __appendEvents : function(aElement) {
			    if (aElement.attr("jstl-load"))
				    aElement.one(de.titus.jstl.Constants.EVENTS.onLoad, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.attr("jstl-load")));
			    if (aElement.attr("jstl-success"))
				    aElement.one(de.titus.jstl.Constants.EVENTS.onSuccess, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.attr("jstl-success")));
			    if (aElement.attr("jstl-fail"))
				    aElement.one(de.titus.jstl.Constants.EVENTS.onFail, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.attr("jstl-fail")));
		    }
		
		};
		
		de.titus.jstl.TaskRegistry.append("preprocessor", de.titus.jstl.Constants.PHASE.INIT, undefined, de.titus.jstl.functions.Preprocessor.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Choose", function() {
		var Choose = de.titus.jstl.functions.Choose = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Choose"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.attr("jstl-choose");
			    if (expression != undefined){
			    	Choose.__compute(aElement, aDataContext, aProcessor, aProcessor.resolver);
			    	aTaskChain.preventChilds();
			    }
			    
			    aTaskChain.nextTask();
		    },
		    
		    __compute : function(aChooseElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processChilds(" + aChooseElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
			    
			    var resolved = false;
			    aChooseElement.children().each(function() {
				    var child = $(this);
				    if (!resolved && Choose.__computeChild(aChooseElement, child, aDataContext, aProcessor, aExpressionResolver)) {
					    if (Choose.LOGGER.isTraceEnabled())
						    Choose.LOGGER.logTrace("compute child: " + child);
					    aProcessor.compute(child, aDataContext);
					    resolved = true;
				    } else {
					    if (Choose.LOGGER.isTraceEnabled())
						    Choose.LOGGER.logTrace("remove child: " + child);
					    child.remove();
				    }
			    });
		    },
		    
		    __computeChild : function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processChild(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
			    
			    if (Choose.__computeWhen(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver))
				    return true;
			    else if (Choose.__computeOtherwise(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver))
				    return true;
			    else
				    return false;
		    },
		    
		    __computeWhen : function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processWhenElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
			    
			    var expression = aElement.attr("jstl-when");
			    if (expression != undefined)
				    return aExpressionResolver.resolveExpression(expression, aDataContext, false);
			    return false;
		    },
		    
		    __computeOtherwise : function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processOtherwiseElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
			    
			    if (aElement.attr("jstl-otherwise") != undefined)
				    return true;
			    return false;
		    }
		};
		
		de.titus.jstl.TaskRegistry.append("choose", de.titus.jstl.Constants.PHASE.MANIPULATION, "[jstl-choose]", de.titus.jstl.functions.Choose.TASK);
	});
})($);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Foreach", function() {
		var Foreach = de.titus.jstl.functions.Foreach = {
		    
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Foreach"),
		    
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Foreach.LOGGER.isDebugEnabled())
				    Foreach.LOGGER.logDebug("execute run(" + aElement + ", " + aContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.attr("jstl-foreach");
			    if (expression != undefined) {
				    aTaskChain.preventChilds();
				    Foreach.__compute(expression, aElement, aContext, aProcessor, aProcessor.resolver, aTaskChain);
			    } else
				    aTaskChain.nextTask();
		    },
		    
		    __compute : function(aExpression, aElement, aContext, aProcessor, anExpressionResolver, aTaskChain) {
			    if (Foreach.LOGGER.isDebugEnabled())
				    Foreach.LOGGER.logDebug("execute __compute(" + aElement + ", " + aContext + ", " + aProcessor + ", " + anExpressionResolver + ")");
			    
			    var tempalte = Foreach.__template(aElement);
			    if (tempalte == undefined)
				    return;
			    
			    aElement.empty();
			    
			    var varName = aElement.attr("jstl-foreach-var") || "itemVar";
			    var statusName = aElement.attr("jstl-foreach-status") || "statusVar";			    
			    var list = anExpressionResolver.resolveExpression(aExpression, aContext, undefined);
			    
			    if (aExpression == "")
				    Foreach.__count(tempalte, statusName, aElement, aContext, aProcessor, aTaskChain);
			    else if (Array.isArray(list))
				    Foreach.__list(list, tempalte, varName, statusName, aElement, aContext, aProcessor, aTaskChain);
			    else if (typeof list === "object")
				    Foreach.__map(list, tempalte, varName, statusName, aElement, aContext, aProcessor, aTaskChain);
		    },
		    __count : function(aTemplate, aStatusName, aElement, aContext, aProcessor, aTaskChain) {
			    var startIndex = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-start-index"), aContext, 0) || 0;
			    var count = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-count"));
			    var step = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-step") || 1);
			    var executeChain = new de.titus.jstl.ExecuteChain(aTaskChain);
			    
			    for (var i = startIndex; i < count; i += step) {
				    var template = aTemplate.clone();
				    var context = $.extend({}, aContext);
				    context[aStatusName] = {
				        "index" : i,
				        "count" : count,
				        "context" : aContext
				    };
				    executeChain.count++;
				    Foreach.__computeContent(template, context, aElement, aProcessor, executeChain);				    
			    }
		    },
		    
		    __list : function(aListData, aTemplate, aVarname, aStatusName, aElement, aContext, aProcessor, aTaskChain) {
			    var startIndex = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-start-index"), aContext, 0) || 0;
			    var breakCondition = aElement.attr("jstl-foreach-break-condition");
			    var executeChain = new de.titus.jstl.ExecuteChain(aTaskChain, 1);
			    
			    for (var i = startIndex; i < aListData.length; i++) {
				    var template = aTemplate.clone();
				    var context = $.extend({}, aContext);
				    context[aVarname] = aListData[i];
				    context[aStatusName] = {
				        "index" : i,
				        "number" : (i + 1),
				        "count" : aListData.length,
				        "data" : aListData,
				        "context" : aContext
				    };
				    if (breakCondition && Foreach.__break(context, breakCondition, aElement, aProcessor))
					    return executeChain.finish();
				    else {
					    executeChain.count++;
					    Foreach.__computeContent(template, context, aElement, aProcessor, executeChain);
				    }
			    }
			    executeChain.finish();
		    },
		    
		    __map : function(aMap, aTemplate, aVarname, aStatusName, aElement, aContext, aProcessor, aTaskChain) {
			    var breakCondition = aElement.attr("jstl-foreach-break-condition");
			    var executeChain = new de.titus.jstl.ExecuteChain(aTaskChain, 1);
			    var i = 0;
			    for ( var name in aMap) {
				    var content = aTemplate.clone();
				    var context = $.extend({}, aContext);
				    context[aVarname] = aMap[name];
				    context[aStatusName] = {
				        "index" : i,
				        "number" : (i + 1),
				        "key" : name,
				        "data" : aMap,
				        "context" : aContext
				    };
				    
				    if (breakCondition && Foreach.__break(context, breakCondition, aElement, aProcessor))
					    return executeChain.finish();
				    else {
					    executeChain.count++;
					    Foreach.__computeContent(content, context, aElement, aProcessor, executeChain);
					    i++;
				    }
			    }
			    executeChain.finish();
		    },
		    
		    __break : function(aContext, aBreakCondition, aElement, aProcessor) {
			    var expression = aProcessor.resolver.resolveExpression(aBreakCondition, aContext, false);
			    if (typeof expression === "function")
				    expression = expression(aElement, aContext, aProcessor);
			    
			    return expression == true || expression == "true";
		    },
		    
		    __computeContent : function(aContent, aContext, aElement, aProcessor, aExecuteChain) {
			    aContent.appendTo(aElement);
			    aProcessor.compute(aContent, aContext, (function(aElement, aContent, aExecuteChain) {
				    aExecuteChain.finish();
			    }).bind({}, aElement, aContent, aExecuteChain));
		    },
		    
		    __template : function(aElement) {
			    var template = aElement.data("de.titus.jstl.functions.Foreach.Template");
			    if (template == undefined) {
				    template = $("<jstl/>").append(aElement.contents());
				    aElement.data("de.titus.jstl.functions.Foreach.Template", template);
			    }
			    return template;
		    }
		};
		
		de.titus.jstl.TaskRegistry.append("foreach", de.titus.jstl.Constants.PHASE.MANIPULATION, "[jstl-foreach]", de.titus.jstl.functions.Foreach.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
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
		
		de.titus.jstl.TaskRegistry.append("text", de.titus.jstl.Constants.PHASE.CONTENT, undefined, de.titus.jstl.functions.Text.TASK);
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Attribute", function() {
		var Attribute = de.titus.jstl.functions.Attribute = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Attribute"),
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Attribute.LOGGER.isDebugEnabled())
				    Attribute.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var attributes = aElement[0].attributes || [];
			    for (var i = 0; i < attributes.length; i++) {
				    var name = attributes[i].name;
				    if (name.indexOf("jstl-") != 0) {
					    var value = attributes[i].value;
					    if (value != undefined && value != "") {
						    try {
							    var newValue = aProcessor.resolver.resolveText(value, aDataContext);
							    if (value != newValue) {
								    if (Attribute.LOGGER.isDebugEnabled()) {
									    Attribute.LOGGER.logDebug("Change attribute \"" + name + "\" from \"" + value + "\" to \"" + newValue + "\"!");
								    }
								    aElement.attr(name, newValue);
							    }
						    } catch (e) {
							    Attribute.LOGGER.logError("Can't process attribute\"" + name + "\" with value \"" + value + "\"!");
						    }
					    }
				    }
			    }
			    
			    aTaskChain.nextTask();
		    }
		}
		
		de.titus.jstl.TaskRegistry.append("attribute", de.titus.jstl.Constants.PHASE.CONTENT, undefined, de.titus.jstl.functions.Attribute.TASK);
	});
})($);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Data", function() {
		var Data = de.titus.jstl.functions.Data = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Data"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Data.LOGGER.isDebugEnabled())
				    Data.LOGGER.logDebug("TASK");
			    
			    var expression = aElement.attr("jstl-data");
			    if (expression) {
				    var varname = aElement.attr("jstl-data-var");
				    var mode = aElement.attr("jstl-data-mode") || "direct";
				    Data.MODES[mode](expression, aElement, varname, aDataContext, aProcessor, aTaskChain);
				    
			    } else
				    aTaskChain.nextTask();
		    },
		    
		    __options : function(aElement, aDataContext, aProcessor) {
			    var options = aElement.attr("jstl-data-options");
			    if (options) {
				    options = aProcessor.resolver.resolveText(options, aDataContext);
				    options = aProcessor.resolver.resolveExpression(options, aDataContext);
				    return options || {};
			    }
			    return {};
		    },
		    __updateContext : function(aVarname, aData, aTaskChain) {
			    if (aData) {
				    if (!aVarname)
					    aTaskChain.updateContext(aData, true);
				    else
					    aTaskChain.context[aVarname] = aData;
			    }
		    },
		    
		    MODES : {
		        "direct" : function(anExpression, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        var data = aProcessor.resolver.resolveExpression(anExpression, aDataContext, anExpression);
			        Data.__updateContext(aVarname, data, aTaskChain);
			        aTaskChain.nextTask();
		        },
		        
		        "remote" : function(anExpression, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        var url = aProcessor.resolver.resolveText(anExpression, aDataContext);
			        var option = Data.__options(aElement, aDataContext, aProcessor);
			        var datatype = (aElement.attr("jstl-data-datatype") || "json").toLowerCase();
			        
			        var ajaxSettings = {
			            'url' : de.titus.core.Page.getInstance().buildUrl(url),
			            'async' : true,
			            'cache' : false,
			            'dataType' : datatype
			        };
			        ajaxSettings = $.extend(ajaxSettings, option);
			        
			        $.ajax(ajaxSettings).done(Data.__remoteResponse.bind({}, aVarname, datatype, aTaskChain));
		        },
		        
		        "url-parameter" : function(anExpression, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        var parameterName = aProcessor.resolver.resolveText(anExpression, aDataContext);
			        var data = de.titus.core.Page.getInstance().getUrl().getParameter(parameterName);
			        Data.__updateContext(aVarname, data, aTaskChain);
			        aTaskChain.nextTask();
		        }
		    },
		    CONTENTYPE : {
		        "xml" : de.titus.core.Converter.xmlToJson,
		        "json" : function(aData) {
			        return aData
		        }
		    },
		    
		    __remoteResponse : function(aVarname, aDatatype, aTaskChain, aData) {
			    var data = Data.CONTENTYPE[aDatatype](aData);
			    Data.__updateContext(aVarname, data, aTaskChain);
			    aTaskChain.nextTask();
		    }
		
		};
		
		de.titus.jstl.TaskRegistry.append("data", de.titus.jstl.Constants.PHASE.CONTEXT, "[jstl-data]", de.titus.jstl.functions.Data.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Include", function() {
		
		var Include = de.titus.jstl.functions.Include = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Include"),
		    CACHE : {},
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute run(" + aElement + ", " + aContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.attr("jstl-include");
			    if (expression) {
				    Include.__compute(expression, aElement, aContext, aProcessor, aTaskChain);
			    } else
				    aTaskChain.nextTask();
		    },
		    
		    __cacheCallback : function(aElement, aIncludeMode, aProcessor, aContext, aTaskChain, aTemplate) {
			    Include.__include(aElement, aTemplate, aIncludeMode, aProcessor, aContext, aTaskChain);
		    },
		    
		    __executeCacheCallback : function(aUrl, aTemplate) {
			    Include.CACHE[aUrl].template = $("<jstl/>").append(aTemplate);
			    Include.CACHE[aUrl].onload = false;
			    setTimeout(function() {
				    var cache = Include.CACHE[aUrl];
				    for (var i = 0; i < cache.callback.length; i++)
					    cache.callback[i](cache.template);
			    }, GlobalSettings.DEFAULT_TIMEOUT_VALUE);
		    },
		    
		    __compute : function(anIncludeExpression, aElement, aContext, aProcessor, aTaskChain) {
			    var url = aProcessor.resolver.resolveText(anIncludeExpression, aContext);
			    var disableCaching = url.indexOf("?") >= 0 || aElement.attr("jstl-include-cache-disabled") != undefined;
			    var cache = undefined;
			    if (!disableCaching)
				    cache = Include.CACHE[url];
			    
			    var includeMode = Include.__mode(aElement, aContext, aProcessor);
			    if (cache) {
				    if (cache.onload)
					    cache.callback.push(Include.__cacheCallback.bind({}, aElement, includeMode, aProcessor, aContext, aTaskChain));
				    else
					    Include.__include(aElement, cache.template, includeMode, aProcessor, aContext, aTaskChain);
			    } else {
				    cache = Include.CACHE[url] = {
				        onload : true,
				        callback : [
					        Include.__cacheCallback.bind({}, aElement, includeMode, aProcessor, aContext, aTaskChain)
				        ]
				    };
				    var options = Include.__options(aElement, aContext, aProcessor);
				    var ajaxSettings = {
				        'url' : Include.__buildUrl(url),
				        'async' : true,
				        'cache' : aElement.attr("jstl-include-ajax-cache-disabled") == undefined,
				        "dataType" : "html"
				    };
				    ajaxSettings = $.extend(true, ajaxSettings, options);
				    
				    $.ajax(ajaxSettings).done(Include.__executeCacheCallback.bind({}, ajaxSettings.url)).fail(function(error) {
					    throw JSON.stringify(error);
				    });
			    }
		    },
		    URLPATTERN : new RegExp("^((https?://)|/).*", "i"),
		    
		    __buildUrl : function(aUrl) {
			    var url = aUrl;
			    if (!Include.URLPATTERN.test(aUrl))
				    url = GlobalSettings.DEFAULT_INCLUDE_BASEPATH + aUrl;
			    url = de.titus.core.Page.getInstance().buildUrl(url);
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute __buildUrl(\"" + aUrl + "\") -> result: " + url);
			    
			    return url;
		    },
		    
		    __options : function(aElement, aContext, aProcessor) {
			    var options = aElement.attr("jstl-include-options");
			    if (options) {
				    options = aProcessor.resolver.resolveText(options, aContext);
				    options = aProcessor.resolver.resolveExpression(options, aContext);
				    return options || {};
			    }
			    
			    return {};
		    },
		    
		    __mode : function(aElement, aContext, aProcessor) {
			    var mode = aElement.attr("jstl-include-mode");
			    if (mode == undefined)
				    return "replace";
			    
			    mode = mode.toLowerCase();
			    if (mode == "append" || mode == "replace" || mode == "prepend")
				    return mode;
			    
			    return "replace";
		    },
		    
		    __include : function(aElement, aTemplate, aIncludeMode, aProcessor, aContext, aTaskChain) {
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute __include()");
			    var content = aTemplate.clone();
			    
			    if (aIncludeMode == "replace") {
				    aElement.empty();
				    content.appendTo(aElement);
			    } else if (aIncludeMode == "append")
				    content.appendTo(aElement);
			    else if (aIncludeMode == "prepend")
				    content.prependTo(aElement);
			    
			    aTaskChain.nextTask();
		    }
		};
		
		de.titus.jstl.TaskRegistry.append("include", de.titus.jstl.Constants.PHASE.MANIPULATION, "[jstl-include]", de.titus.jstl.functions.Include.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.AddAttribute", function() {
		var AddAttribute = de.titus.jstl.functions.AddAttribute = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.AddAttribute"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (AddAttribute.LOGGER.isDebugEnabled())
				    AddAttribute.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.attr("jstl-add-attribute");
			    if (expression) {
				    expression = aProcessor.resolver.resolveExpression(expression, aDataContext, false);
				    if (expression && typeof expression === "function")
					    expression = expression(aElement, aDataContext, aProcessor);
				    
				    if (expression && Array.isArray(expression))
					    AddAttribute.processArray(expression, aElement, aDataContext, aProcessor);
				    else if (expression && typeof expression === "object")
					    AddAttribute.processObject(expression, aElement, aDataContext, aProcessor);
			    }
			    
			    aTaskChain.nextTask();
		    },
		    
		    processArray : function(theDataArray, aElement, aDataContext, aProcessor) {
			    for (var i = 0; i < theDataArray.length; i++) {
				    AddAttribute.processObject(theDataArray[i], aElement, aDataContext, aProcessor);
			    }
		    },
		    
		    processObject : function(theData, aElement, aDataContext, aProcessor) {
			    if (theData.name)
				    aElement.attr(theData.name, theData.value);
			    else
				    AddAttribute.LOGGER.logError("run processObject (" + theData + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ") -> No attribute name defined!");
		    }
		
		};
		
		de.titus.jstl.TaskRegistry.append("add-attribute", de.titus.jstl.Constants.PHASE.CONTENT, "[jstl-add-attribute]", de.titus.jstl.functions.AddAttribute.TASK);
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Databind", function() {
		var Databind = de.titus.jstl.functions.Databind = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Databind"),
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Databind.LOGGER.isDebugEnabled())
				    Databind.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var varname = aElement.attr("jstl-databind-name");
			    if (varname && varname.trim() != "") {
				    var value = this.__value(aElement, aDataContext, aProcessor);
				    if (value != undefined)
					    aElement.data(varname, value);
			    }
			    
			    aTaskChain.nextTask();
		    },
		    
		    __value : function(aElement, aDataContext, aProcessor) {
			    return aProcessor.resolver.resolveExpression(aElement.attr("jstl-databind"), aDataContext, undefined);
		    }		
		};
		
		de.titus.jstl.TaskRegistry.append("databind", de.titus.jstl.Constants.PHASE.BINDING, "[jstl-databind]", de.titus.jstl.functions.Databind.TASK);
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Eventbind", function() {
		var Eventbind = de.titus.jstl.functions.Eventbind = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Eventbind"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Eventbind.LOGGER.isDebugEnabled())
				    Eventbind.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    if (aElement.attr("jstl-eventbind") != undefined)
				    aElement.de_titus_core_EventBind(aDataContext);
			    
			    aTaskChain.nextTask();
		    }
		
		};
		
		de.titus.jstl.TaskRegistry.append("eventbind", de.titus.jstl.Constants.PHASE.BINDING, "[jstl-eventbind]", de.titus.jstl.functions.Eventbind.TASK);
	});
})($);
(function($, SpecialFunctions, GlobalSettings) {
    "use strict";
    de.titus.core.Namespace.create("de.titus.jstl.Processor", function() {
	var Processor = function(aElement, aContext, aCallback) {
	    this.element = aElement;
	    this.parent = this.element.parent();
	    this.context = aContext || {};
	    this.callback = aCallback;
	    this.resolver = new de.titus.core.ExpressionResolver(this.element.data("jstlExpressionRegex"));
	};

	Processor.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.Processor");

	Processor.prototype.compute = function(aElement, aContext, aCallback) {
	    if (Processor.LOGGER.isDebugEnabled())
		Processor.LOGGER.logDebug("execute compute(" + aElement + ", " + aContext + ")");
	    if (!aElement) {
		this.element.trigger(de.titus.jstl.Constants.EVENTS.onStart, [ aContext, this ]);
		if (!this.element.is("body"))
		    this.element.detach();
		this.__computeElement(this.element, this.context, this.callback, true);
	    } else
		this.__computeElement(aElement, aContext, aCallback);
	};

	Processor.prototype.__computeElement = function(aElement, aContext, aCallback, isRoot) {
	    if (Processor.LOGGER.isDebugEnabled())
		Processor.LOGGER.logDebug("__computeElement() -> root: " + isRoot);

	    var taskChain = new de.titus.jstl.TaskChain(aElement, aContext, this, isRoot, Processor.prototype.__computeFinished.bind(this, aElement, aContext, isRoot, aCallback));
	    taskChain.nextTask();
	};

	Processor.prototype.__computeFinished = function(aElement, aContext, isRoot, aCallback) {
	    if (Processor.LOGGER.isDebugEnabled())
		Processor.LOGGER.logDebug("__computeFinished() -> is root: " + isRoot);

	    if (aElement.tagName() == "jstl" && aElement.contents().length > 0)
		aElement.replaceWith(aElement.contents());

	    if (typeof aCallback === "function")
		aCallback(aElement, aContext, this, isRoot);

	    aElement.trigger(de.titus.jstl.Constants.EVENTS.onSuccess, [ aContext, this ]);

	    if (isRoot)
		setTimeout(Processor.prototype.onReady.bind(this), GlobalSettings.DEFAULT_TIMEOUT_VALUE);
	};

	Processor.prototype.onReady = function(aFunction) {
	    if (Processor.LOGGER.isDebugEnabled())
		Processor.LOGGER.logDebug("onReady()");

	    if (aFunction) {
		this.element.one(de.titus.jstl.Constants.EVENTS.onReady, function(anEvent) {
		    aFunction(anEvent.delegateTarget, anEvent.data);
		});
		return this;
	    } else {

		if(!this.element.is("body"))
		    this.parent.append(this.element);

		setTimeout((function(aProcessor) {
		    this.trigger(de.titus.jstl.Constants.EVENTS.onReady, [ aProcessor ]);
		}).bind(this.element, this), GlobalSettings.DEFAULT_TIMEOUT_VALUE * 10);
	    }
	};

	de.titus.jstl.Processor = Processor;
    });
})(jQuery, de.titus.core.SpecialFunctions, de.titus.jstl.GlobalSettings);
de.titus.core.Namespace.create("de.titus.jstl.javascript.polyfills", function() {
//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Polyfill	


	if (!Array.from) {
	  Array.from = (function () {
	    var toStr = Object.prototype.toString;
	    var isCallable = function (fn) {
	      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
	    };
	    var toInteger = function (value) {
	      var number = Number(value);
	      if (isNaN(number)) { return 0; }
	      if (number === 0 || !isFinite(number)) { return number; }
	      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
	    };
	    var maxSafeInteger = Math.pow(2, 53) - 1;
	    var toLength = function (value) {
	      var len = toInteger(value);
	      return Math.min(Math.max(len, 0), maxSafeInteger);
	    };
	
	    // The length property of the from method is 1.
	    return function from(arrayLike/*, mapFn, thisArg */) {
	      // 1. Let C be the this value.
	      var C = this;
	
	      // 2. Let items be ToObject(arrayLike).
	      var items = Object(arrayLike);
	
	      // 3. ReturnIfAbrupt(items).
	      if (arrayLike == null) {
	        throw new TypeError("Array.from requires an array-like object - not null or undefined");
	      }
	
	      // 4. If mapfn is undefined, then let mapping be false.
	      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
	      var T;
	      if (typeof mapFn !== 'undefined') {
	        // 5. else
	        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
	        if (!isCallable(mapFn)) {
	          throw new TypeError('Array.from: when provided, the second argument must be a function');
	        }
	
	        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
	        if (arguments.length > 2) {
	          T = arguments[2];
	        }
	      }
	
	      // 10. Let lenValue be Get(items, "length").
	      // 11. Let len be ToLength(lenValue).
	      var len = toLength(items.length);
	
	      // 13. If IsConstructor(C) is true, then
	      // 13. a. Let A be the result of calling the [[Construct]] internal method 
	      // of C with an argument list containing the single item len.
	      // 14. a. Else, Let A be ArrayCreate(len).
	      var A = isCallable(C) ? Object(new C(len)) : new Array(len);
	
	      // 16. Let k be 0.
	      var k = 0;
	      // 17. Repeat, while k < len… (also steps a - h)
	      var kValue;
	      while (k < len) {
	        kValue = items[k];
	        if (mapFn) {
	          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
	        } else {
	          A[k] = kValue;
	        }
	        k += 1;
	      }
	      // 18. Let putStatus be Put(A, "length", len, true).
	      A.length = len;
	      // 20. Return A.
	      return A;
	    };
	  }());
	}

});(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jquery.jstl.plugin", function() {
		$.fn.jstl = function(aData) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstl(aData);
				});
			} else {
				var processor = this.data("de.titus.jstl.Processor");
				if (!processor || aData) {
					var data = aData || {};
					processor = new de.titus.jstl.Processor(this, data.data, data.callback || data.success);
					this.data("de.titus.jstl.Processor", processor);
					processor.compute();
				}
				return processor;
			}
		};
		
		$.fn.jstlAsync = function(aData) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstlAsync(aData);
				});
			} else {
				setTimeout($.fn.jstl.bind(this, aData), 1);
				return this;
			}
		};
		
		$(document).ready(function() {
			$("[jstl-autorun]").jstlAsync();
		});
		
	});
}(jQuery));

/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Frank Schüler
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function(){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Setup", function(){
		de.titus.form.Setup = {
			prefix : "data-form",
			fieldtypes : {}
		};
	});	
})();(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Constants", function() {
		de.titus.form.Constants.EVENTS = {
		FORM_INITIALIZED : "form-initialized",
		FORM_ACTION_CANCEL : "form-cancel",
		FORM_ACTION_SUBMIT : "form-submit",
		
		FORM_PAGE_INITIALIZED : "form-page-initalized",
		FORM_PAGE_CHANGED : "form-page-changed",
		FORM_PAGE_SHOW : "form-page-show",
		
		FORM_STEP_BACK : "form-step-back",
		FORM_STEP_NEXT : "form-step-next",
		FORM_STEP_SUMMARY : "form-step-summary",
		FORM_STEP_SUBMIT : "form-step-submit",
		
		FIELD_ACTIVE : "form-field-active",
		FIELD_INACTIVE : "form-field-inactive",
		FIELD_VALUE_CHANGED : "form-field-value-changed",
		FIELD_VALID : "form-field-valid",
		FIELD_INVALID : "form-field-invalid"
		};
		
		de.titus.form.Constants.STATE = {
		PAGES : "form-state-pages",
		SUMMARY : "form-state-summary",
		SUBMITED : "form-state-submited",
		};
		
		de.titus.form.Constants.ATTRIBUTE = {
		VALIDATION : "-validation",
		VALIDATION_FAIL_ACTION : "-validation-fail-action",
		CONDITION : "-condition",
		MESSAGE : "-message"
		}
		
	});
})();
(function(){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Registry", function(){
		de.titus.form.Registry.registFieldController = function(aTypename, aFunction){
			de.titus.form.Setup.fieldtypes[aTypename] = aFunction;
		};
	});	
})();(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Condition", function() {
		var Condition = function(aElement, aDataController, aExpressionResolver) {
			if(Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.expressionResolver = aExpressionResolver;
			this.data.state = false;
		};
		
		Condition.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Condition");
		
		Condition.prototype.doCheck = function(aCallback, callOnlyByChange) {
			if(Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("doCheck()");
				
			var state = false;
			var condition = this.data.element.attr(de.titus.form.Setup.prefix + de.titus.form.Constants.ATTRIBUTE.CONDITION);			
			if(condition != undefined && condition.trim() != ""){
				if(Condition.LOGGER.isDebugEnabled())
					Condition.LOGGER.logDebug("doCheck() -> condition: " + condition);
				
				var data = this.data.dataController.getData();
				if(Condition.LOGGER.isDebugEnabled())
					Condition.LOGGER.logDebug("doCheck() -> data: " + JSON.stringify(data));
				
				var condition = this.data.expressionResolver.resolveExpression(condition, data, false);
				if(typeof condition === "function")
					state = condition(data, this);
				else
					state = condition === true; 
			}
			else			
				state = true;	
			
			if(aCallback == undefined)
				this.data.state = state;
			else if(aCallback != undefined && callOnlyByChange && this.data.state != state){
				this.data.state = state;
				aCallback(this.data.state);
			}
			else if(aCallback != undefined && callOnlyByChange && this.data.state == state){
				this.data.state = state;
			}
			else{
				this.data.state = state;
				aCallback(this.data.state);
			}
			
			return this.data.state;					
		};
		
		de.titus.form.Condition = Condition
	});	
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Field", function() {
		var Field = function(aElement, aDataController, aExpressionResolver) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix + "-field");
			this.data.type = aElement.attr(de.titus.form.Setup.prefix + "-field-type");
			this.data.expressionResolver = aExpressionResolver || new de.titus.core.ExpressionResolver();
			this.data.conditionHandle = new de.titus.form.Condition(this.data.element, this.data.dataController, this.data.expressionResolver);
			this.data.validationHandle = new de.titus.form.Validation(this.data.element, this.data.dataController, this.data.expressionResolver);
			this.data.messageHandle = new de.titus.form.Message(this.data.element, this.data.dataController, this.data.expressionResolver);
			this.data.firstCall = true;
			this.data.active = undefined;
			this.data.valid = false;
			
			this.init();
		};
		
		Field.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Field");
		
		Field.prototype.init = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("init()");
			
			var initializeFunction = de.titus.form.Setup.fieldtypes[this.data.type] || de.titus.form.Setup.fieldtypes["default"];
			if (initializeFunction == undefined || typeof initializeFunction !== "function")
				throw "The fieldtype \"" + this.data.type + "\" is not available!";

			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED, Field.prototype.doValueChange.bind(this));
			this.fieldController = initializeFunction(this.data.element);
		};
		
		Field.prototype.doConditionCheck = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doConditionCheck()");
			
			this.data.active = this.data.conditionHandle.doCheck();			
			if (this.data.active)
				this.fieldController.showField(this.data.dataController.getData(this.data.name), this.data.dataController.getData());
			else
				this.setInactiv();			
			
			if (this.data.active) {
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);
				this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
				this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);				
			} else {
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
				this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);
				this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
			}
			
			if(this.data.firstCall){
				this.data.firstCall = false;
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);				
			}
			
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doConditionCheck() -> result: " + this.data.active);
			
			this.data.messageHandle.showMessage();
			return this.data.active;
		};
		
		Field.prototype.setInactiv = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("setInactiv()");
			this.data.dataController.changeValue(this.data.name, undefined, this);
			this.fieldController.hideField();
		};
		
		Field.prototype.showSummary = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("showSummary()");
			
			if (!this.data.active)
				return;
			
			this.fieldController.showSummary();
		};
		
		Field.prototype.doValueChange = function(aEvent) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doValueChange() -> event type: " + (aEvent != undefined ? aEvent.type : ""));
			
			var value = this.fieldController.getValue();
			if (this.doValidate(value))
				this.data.dataController.changeValue(this.data.name, value, this);
			else
				this.data.dataController.changeValue(this.data.name, undefined, this);
			
			if (aEvent == undefined)
				this.data.element.trigger($.Event(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED));
			else if (aEvent.type != de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED) {
				aEvent.preventDefault();
				aEvent.stopPropagation();
				this.data.element.trigger($.Event(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED));
			}
			
			this.data.messageHandle.showMessage();
		};
		
		Field.prototype.doValidate = function(aValue) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doValidate() -> field: " + this.data.name);
			
			this.data.valid = this.data.validationHandle.doCheck(aValue);			
			if (this.data.valid) {
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALID);
				this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_INVALID);
				this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_VALID);
			} else {
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_INVALID);
				this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_VALID);
				this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_INVALID);
			}
			
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doValidate() -> field: " + this.data.name + " - result: " + this.data.valid);
			
			return this.data.valid;
		};
		
		de.titus.form.Field = Field;
		
		$.fn.FormularField = function(aDataController) {
			if (this.length == undefined || this.length == 0)
				return;
			else if (this.length > 1) {
				var result = [];
				this.each(function() {
					result.push($(this).FormularField(aDataController));
				});
				return result;
			} else {
				var data = this.data("de.titus.form.Field");
				if (data == undefined) {
					data = new de.titus.form.Field(this, aDataController);
					this.data("de.titus.form.Field", data);
				}
				return data;
			}
		};
	});
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Message", function() {
		var Message = function(aElement, aDataController, aExpressionResolver) {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("constructor");
			
			this.data = {
			element : aElement,
			dataController : aDataController,
			expressionResolver : aExpressionResolver
			};
		};
		
		Message.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Message");
		
		Message.prototype.showMessage = function() {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("showMessage()");
			
			var messageAttr = de.titus.form.Setup.prefix + de.titus.form.Constants.ATTRIBUTE.MESSAGE;
			var messages = this.data.element.find("[" + messageAttr + "]");
			messages.removeClass("active");
			var data = this.data.dataController.getData();
			
			for (var i = 0; i < messages.length; i++) {
				var element = $(messages[i]);
				var expression = element.attr(messageAttr);
				if (expression != undefined && expression.trim() != "") {
					if (Message.LOGGER.isDebugEnabled())
						Message.LOGGER.logDebug("showMessage() -> expression: \"" + expression + "\"; data: \"" + JSON.stringify(data) + "\"");
					
					var result = false;
					var result = this.data.expressionResolver.resolveExpression(expression, data, false);
					if (typeof result === "function")
						result = result(data.value, data.data, this) || false;
					else
						result = result === true;
					
					if (Message.LOGGER.isDebugEnabled())
						Message.LOGGER.logDebug("showMessage() -> expression: \"" + expression + "\"; result: \"" + result + "\"");
					
					if (result)
						element.addClass("active");
				}
			}
		};
		
		Message.prototype.doValidate = function(aValue) {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("doValidate()");
			
		};
		
		de.titus.form.Message = Message;
	});
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Validation", function() {
		var Validation = function(aElement, aDataController, aExpressionResolver) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.expressionResolver = aExpressionResolver;
			this.data.state = false;
		};
		
		Validation.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Validation");
		
		Validation.prototype.doCheck = function(aValue) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("doCheck()");
			
			this.data.state = this.doValidate(aValue);
			
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("doCheck() -> " + this.data.state);
			return this.data.state;
		};
		
		Validation.prototype.doValidate = function(aValue) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("doValidate()");
			
			var validationAttr = de.titus.form.Setup.prefix + de.titus.form.Constants.ATTRIBUTE.VALIDATION;
			var validationElements = this.data.element.find("[" + validationAttr + "]");
			validationElements.removeClass("active");
			var data = {
			value : aValue,
			data : this.data.dataController.getData()
			};
			
			for (var i = 0; i < validationElements.length; i++) {
				var element = $(validationElements[i]);
				var validation = element.attr(validationAttr);
				if (validation != undefined && validation.trim() != "") {
					if (Validation.LOGGER.isDebugEnabled())
						Validation.LOGGER.logDebug("doCheck() -> expression: \"" + validation + "\"; data: \"" + JSON.stringify(data) + "\"");
					
					var result = false;
					var result = this.data.expressionResolver.resolveExpression(validation, data, false);
					if (typeof result === "function")
						result = result(data.value, data.data, this) || false;
					else
						result = result === true;
					
					if (Validation.LOGGER.isDebugEnabled())
						Validation.LOGGER.logDebug("doCheck() -> expression: \"" + validation + "\"; result: \"" + result + "\"");
					
					if (result) {
						element.addClass("active");
						return false;
					}
				}
			}
			
			return true;
		};
		
		de.titus.form.Validation = Validation;
	});
})();
(function() {
    "use strict";
    de.titus.core.Namespace.create("de.titus.form.DataController", function() {
	var DataController = function() {
	    if (DataController.LOGGER.isDebugEnabled())
		DataController.LOGGER.logDebug("constructor");

	    this.data = {};
	};

	DataController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataController");

	DataController.prototype.getData = function(aName) {
	    if (DataController.LOGGER.isDebugEnabled())
		DataController.LOGGER.logDebug("getData() -> aName: " + aName);

	    if (aName) {
		var names = aName.split(".");
		var data = this.data;
		for (var i = 0; i < (names.length - 1); i++) {
		    if (data[names[i]] != undefined) {
			data = data[names[i]];
		    }
		}
		return data;
	    } else
		return this.data;
	};

	DataController.prototype.changeValue = function(aName, aValue, aField) {
	    if (DataController.LOGGER.isDebugEnabled())
		DataController.LOGGER.logDebug("changeValue()");

	    var names = aName.split(".");
	    var data = this.data;
	    for (var i = 0; i < (names.length - 1); i++) {
		if (data[names[i]] == undefined) {
		    data[names[i]] = {};
		}
		data = data[names[i]];
	    }
	    data[names[names.length - 1]] = aValue;
	    
	    if (DataController.LOGGER.isDebugEnabled())
		DataController.LOGGER.logDebug("changeValue() -> data: " + JSON.stringify(this.data));
	};

	de.titus.form.DataController = DataController;
    });
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DataControllerProxy", function() {
		var DataControllerProxy = function(aDataController, aName) {
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("constructor");
			this.name = aName;
			this.dataController = aDataController;
		};
		
		DataControllerProxy.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataControllerProxy");
		
		DataControllerProxy.prototype.getData = function(aName){
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("getData() -> aName: " + aName);
				
			return this.dataController.getData(aName);
		};
		
		DataControllerProxy.prototype.changeValue = function(aName, aValue, aField){
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("changeValue()");			
			
			this.dataController.changeValue(this.name != undefined ? this.name + "." + aName : aName, aValue, aField);
		};	
		
		de.titus.form.DataControllerProxy = DataControllerProxy;
	});	
})();
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.ListFieldDataController", function() {
		var ListFieldDataController = function(aDataController, aName) {
			if(ListFieldDataController.LOGGER.isDebugEnabled())
				ListFieldDataController.LOGGER.logDebug("constructor");
			this.name = aName;
			this.internalDataController = new de.titus.form.DataController();
			this.dataController = aDataController;
		};
		
		ListFieldDataController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.ListFieldDataController");
		
		ListFieldDataController.prototype.getData = function(aName){
			if(ListFieldDataController.LOGGER.isDebugEnabled())
				ListFieldDataController.LOGGER.logDebug("getData() -> aName: " + aName);
			
			if(aName != undefined){
				var data = this.dataController.getData();
				data = $.extend(data, this.internalDataController.getData());
				return data;
			}
			else {
				var value= this.internalDataController.getData(aName);
				if(value == undefined)
					return this.dataController.getData(aName);
				else
					return value;
			}			
		};
		
		ListFieldDataController.prototype.changeValue = function(aName, aValue, aField){
			if(ListFieldDataController.LOGGER.isDebugEnabled())
				ListFieldDataController.LOGGER.logDebug("changeValue()");			
			
			this.internalDataController.changeValue(aName, aValue, aField);
		};	
		
		de.titus.form.ListFieldDataController = ListFieldDataController;
	});	
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Formular", function() {
		var Formular = function(aElement) {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix);
			this.data.pages = [];
			this.data.dataController = new de.titus.form.DataController();
			this.data.stepControl = undefined;
			this.data.currentPage = -1;
			this.data.state = de.titus.form.Constants.STATE.PAGES;
			this.expressionResolver = new de.titus.core.ExpressionResolver();
			this.init();
		};
		
		Formular.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Formular");
		
		Formular.prototype.init = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("init()");
			
			if (this.data.element.is("form"))
				this.data.element.on("submit", function(aEvent) {
					aEvent.preventDefault();
					aEvent.stopPropagation();
				});

			this.initAction();
			this.data.stepPanel = new de.titus.form.StepPanel(this);
			this.data.stepControl = new de.titus.form.StepControl(this);
			this.initEvents();
			this.initPages();
			
		};
		
		Formular.prototype.initAction = function() {
			var initAction = this.data.element.attr("data-form-init");
			if (initAction != undefined && initAction != "") {
				var data = this.expressionResolver.resolveExpression(initAction, this.data, undefined);
				if (typeof data === "function")
					data = data(this.data.element, this);
				
				if (typeof data === "object")
					this.data.dataController.data = data;
			}
		};
		
		Formular.prototype.initPages = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("initPages()");
			
			var pageElements = this.data.element.find("[" + de.titus.form.Setup.prefix + "-page" + "]");
			if (pageElements.length == 0) {
				var page = this.data.element.FormularPage(this.data.dataController, this.expressionResolver);
				page.data.number = 1;
				this.data.pages.push(page);
			} else {
				for (var i = 0; i < pageElements.length; i++) {
					var page = $(pageElements[i]).FormularPage(this.data.dataController);
					page.data.number = (i + 1);
					this.data.pages.push(page);
					page.hide();
				}
			}
			
			var page = de.titus.form.PageUtils.findNextPage(this.data.pages, -1);
			page.show();
			this.data.currentPage = page.data.number - 1;
			this.data.stepPanel.update();
			this.data.stepControl.update();
		};
		
		Formular.prototype.initEvents = function() {
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_ACTIVE, Formular.prototype.valueChanged.bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_INACTIVE, Formular.prototype.valueChanged.bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED, Formular.prototype.valueChanged.bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_VALID, Formular.prototype.valueChanged.bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_INVALID, Formular.prototype.valueChanged.bind(this));
		};
		
		Formular.prototype.valueChanged = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("valueChanged()");
			
			this.data.stepPanel.update();
			this.data.stepControl.update();
		};
		
		Formular.prototype.doValidate = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("doValidate()");
			
			for (var i = 0; i < this.data.pages.length; i++)
				if (this.data.pages[i].data.active && !this.data.pages[i].doValidate())
					return false;
			
			return true;
		};
		
		Formular.prototype.showSummary = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("showSummary()");
			
			for (var i = 0; i < this.data.pages.length; i++)
				if (this.data.pages[i].data.active)
					this.data.pages[i].showSummary();
			
			this.data.state = de.titus.form.Constants.STATE.SUMMARY;
			this.data.stepPanel.update();
			this.data.stepControl.update();
		};
		
		Formular.prototype.getCurrentPage = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("currentPage() -> current index: " + this.data.currentPage);
			
			return this.data.pages[this.data.currentPage];
		};
		
		Formular.prototype.prevPage = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("prevPage()");
			
			if (this.data.state == de.titus.form.Constants.STATE.SUBMITED)
				return;
			else if (this.data.state == de.titus.form.Constants.STATE.SUMMARY) {
				this.data.state = de.titus.form.Constants.STATE.PAGES;
				for (var i = 0; i < this.data.pages.length; i++)
					if (i != this.data.currentPage)
						this.data.pages[i].hide();
				
				this.data.pages[this.data.currentPage].show();
				
				this.data.stepPanel.update();
				this.data.stepControl.update();
				
			} else if (this.data.currentPage > 0) {
				this.data.pages[this.data.currentPage].hide();
				var page = de.titus.form.PageUtils.findPrevPage(this.data.pages, this.data.currentPage);
				this.data.currentPage = page.data.number - 1;
				this.data.pages[this.data.currentPage].show();
				this.data.state = de.titus.form.Constants.STATE.PAGES;
				this.data.stepPanel.update();
				this.data.stepControl.update();
			}
			
		};
		
		Formular.prototype.nextPage = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("nextPage()");
			
			if (this.data.currentPage < (this.data.pages.length - 1)) {
				if (!this.data.pages[this.data.currentPage].doValidate())
					return;
				
				var page = de.titus.form.PageUtils.findNextPage(this.data.pages, this.data.currentPage);
				if (page != undefined) {
					this.data.state = de.titus.form.Constants.STATE.PAGES;
					this.data.pages[this.data.currentPage].hide();
					this.data.currentPage = page.data.number - 1;
					this.data.pages[this.data.currentPage].show();
					this.data.stepPanel.update();
					this.data.stepControl.update();
					return;
				}
			} else {
				this.data.state = de.titus.form.Constants.STATE.SUMMARY;
				this.showSummary();
				this.data.stepPanel.update();
				this.data.stepControl.update();
			}
		};
		
		Formular.prototype.submit = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("submit()");
			
			this.data.state = de.titus.form.Constants.STATE.SUBMITED;
			this.data.stepPanel.update();
			this.data.stepControl.update();
			var data = this.data.dataController.getData();
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("submit() -> data: " + JSON.stringify(data));
			
			var action = this.data.element.attr("data-form-submit");
			if (action != undefined && action != "") {
				if (Formular.LOGGER.isDebugEnabled())
					Formular.LOGGER.logDebug("submit() -> use a submit action!");
				var data = this.expressionResolver.resolveExpression(action, data, undefined);
				if (typeof data === "function")
					data(form);
			} else {
				if (Formular.LOGGER.isDebugEnabled())
					Formular.LOGGER.logDebug("submit() -> use a default ajax!");
				
				var action = this.data.element.attr("action");
				var method = this.data.element.attr("method") || "post";
				var contentType = this.data.element.attr("enctype") || "application/json";
				
				var request = {
				"url" : action,
				"type" : method,
				"contentType" : contentType,
				"data" : contentType == "application/json" ? JSON.stringify(data) : data
				};
				// TODO Response processing
				$.ajax(request);
			}
		};
		
		de.titus.form.Formular = Formular;
	});
	
	$.fn.Formular = function() {
		if (this.length == undefined || this.length == 0)
			return;
		else if (this.length > 1) {
			var result = [];
			this.each(function() {
				result.push($(this).Formular());
			});
			return result;
		} else {
			var data = this.data("Formular");
			if (data == undefined) {
				data = new de.titus.form.Formular(this);
				this.data("Formular", data);
			}
			return data;
		}
	};
	
	$(document).ready(function() {
		$('[data-form]').Formular();
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Page", function() {
		var Page = function(aElement, aDataController, aExpressionResolver) {
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("constructor");
			this.data = {};
			this.data.number = undefined;
			this.data.element = aElement;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix + "-page");
			this.data.step = aElement.attr(de.titus.form.Setup.prefix + "-step");
			this.data.expressionResolver = aExpressionResolver || new de.titus.core.ExpressionResolver();
			this.data.dataController = aDataController;
			this.data.conditionHandle = new de.titus.form.Condition(this.data.element,this.data.dataController,this.data.expressionResolver);
			this.data.fieldMap = {};
			this.data.fields = [];
			this.data.active = false;
			
			this.init();
		};
		
		Page.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Page");
		
		Page.prototype.init = function() {
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("init()");
			
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED, Page.prototype.valueChangeListener.bind(this));
			this.initFields(this.data.element);
		};
		
		Page.prototype.valueChangeListener = function(aEvent) {
			for(var i = 0; i < this.data.fields.length; i++)
				this.data.fields[i].doConditionCheck();
		};
		

		Page.prototype.initFields = function(aElement) {
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("initFields()");
			
			if (aElement.attr(de.titus.form.Setup.prefix + "-field") != undefined) {
				var field = aElement.FormularField(this.data.dataController, this.data.expressionResolver);
				this.data.fieldMap[field.name] = field;
				this.data.fields.push(field);
			} else {
				var children = aElement.children();
				for (var i = 0; i < children.length; i++) {
					this.initFields($(children[i]));
				}
			}
		};
		
		
		Page.prototype.checkCondition = function(){
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("checkCondition()");
			
			this.data.active = this.data.conditionHandle.doCheck();
			if(!this.data.active)
				for(var i = 0; i < this.data.fields.length; i++)
					this.data.fields[i].setInactiv();
			
			return this.data.active;
		};		
		
		Page.prototype.show = function(){
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("show()");
			
			for(var i = 0; i < this.data.fields.length; i++)
				this.data.fields[i].doConditionCheck();
			
			this.data.element.show();
		};
		
		Page.prototype.hide = function(){
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("hide()");
			
			this.data.element.hide();
		};
		
		Page.prototype.showSummary = function(){
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("showSummary()");
			
			if(!this.data.active)
				return;
			
			this.show();
			for(var i = 0; i < this.data.fields.length; i++)
				if(this.data.fields[i].data.active)
					this.data.fields[i].showSummary();
		};
		
		Page.prototype.doValidate = function(){
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("doValidate()");
			
			for(var i = 0; i < this.data.fields.length; i++)
				if(this.data.fields[i].data.active && !this.data.fields[i].data.valid)
					return false;
			
			return true;
		};
		
		de.titus.form.Page = Page;
		
		$.fn.FormularPage = function(aDataController) {
			if (this.length == undefined || this.length == 0)
				return;
			else if (this.length > 1) {
				var result = [];
				this.each(function() {
					result.push($(this).FormularPage(aDataController));
				});
				return result;
			} else {
				var data = this.data("de.titus.form.Page");
				if (data == undefined) {
					data = new Page(this, aDataController);
					this.data("de.titus.form.Page", data);
				}
				return data;
			}
		};
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.PageUtils", function() {
		var PageUtils = {};		
		PageUtils.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.PageUtils");
		
		PageUtils.findPrevPage = function(thePages, aCurrentIndex){
			if(PageUtils.LOGGER.isDebugEnabled())
				PageUtils.LOGGER.logDebug("findPrevPage() -> aCurrentIndex: " + aCurrentIndex);
			
			for(var i = (aCurrentIndex - 1); i >= 0; i--){
				PageUtils.LOGGER.logDebug(i);
				var page = thePages[i];
				if(page.checkCondition())
					return page;
			}
			
			throw "Can't evaluate a previous page!";
		}
		
		PageUtils.findNextPage = function(thePages, aCurrentIndex){
			if(PageUtils.LOGGER.isDebugEnabled())
				PageUtils.LOGGER.logDebug("findNextPage() -> aCurrentIndex: " + aCurrentIndex );
			
			for(var i = (aCurrentIndex + 1); i < thePages.length; i++){
				PageUtils.LOGGER.logDebug(i);
				var page = thePages[i];
				if(page.checkCondition())
					return page;
			}
			
			throw "Can't evaluate a next page!";
		}
		de.titus.form.PageUtils = PageUtils;
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.StepControl", function() {
		var StepControl = function(aForm) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aForm.data.element.find("[" + de.titus.form.Setup.prefix + "-step-control" + "]");
			this.data.stepControlBack = undefined;
			this.data.stepControlNext = undefined;
			this.data.stepControlSummary = undefined;
			this.data.stepControlSubmit = undefined;
			this.data.form = aForm;
			this.init();
		};
		
		StepControl.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.StepControl");
		
		StepControl.prototype.init = function() {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("init()");
			
			this.data.stepControlBack = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-back" + "]");
			this.data.stepControlBack.hide();
			this.data.stepControlBack.on("click", StepControl.prototype.__StepBackHandle.bind(this));
			
			this.data.stepControlNext = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-next" + "]");
			this.data.stepControlNext.on("click", StepControl.prototype.__StepNextHandle.bind(this));
			
			this.data.stepControlSummary = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-summary" + "]");
			this.data.stepControlSummary.hide();
			this.data.stepControlSummary.on("click", StepControl.prototype.__StepSummaryHandle.bind(this));
			
			this.data.stepControlSubmit = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-submit" + "]");
			this.data.stepControlSubmit.hide();
			this.data.stepControlSubmit.on("click", StepControl.prototype.__StepSubmitHandle.bind(this));
		};
		
		StepControl.prototype.update = function() {
			if (this.data.form.data.state == de.titus.form.Constants.STATE.SUBMITED) {
				this.data.element.hide();
				return;
			} else {
							
				if ((this.data.form.data.pages.length - 1) > this.data.form.data.currentPage) {
					var page = this.data.form.getCurrentPage();
					if (page && page.doValidate())
						this.data.stepControlNext.show();
					else
						this.data.stepControlNext.hide();
					
					this.data.stepControlSummary.hide();
					this.data.stepControlSubmit.hide();
				} else if (this.data.form.data.state == de.titus.form.Constants.STATE.PAGES) {
					var page = this.data.form.getCurrentPage();
					this.data.stepControlNext.hide();
					if (page && page.doValidate())
						this.data.stepControlSummary.show();
					else
						this.data.stepControlSummary.hide();
					this.data.stepControlSubmit.hide();
				} else if (this.data.form.data.state == de.titus.form.Constants.STATE.SUMMARY) {
					this.data.stepControlNext.hide();
					this.data.stepControlSummary.hide();
					if(this.data.form.doValidate())
						this.data.stepControlSubmit.show();
					else
						this.data.stepControlSubmit.hide();
				}
			}
			
			if (this.data.form.data.currentPage > 0)
				this.data.stepControlBack.show();
			else
				this.data.stepControlBack.hide();
		};
		
		StepControl.prototype.__StepBackHandle = function(aEvent) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("__StepBackHandle()");
			
			if (this.data.form.data.currentPage > 0) {
				this.data.form.prevPage();
			}
		};
		
		StepControl.prototype.__StepNextHandle = function(aEvent) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("__StepNextHandle()");
			
			if ((this.data.form.data.pages.length - 1) > this.data.form.data.currentPage) {
				this.data.form.nextPage();
			}
		};
		
		StepControl.prototype.__StepSummaryHandle = function(aEvent) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("__StepSummaryHandle()");
			
			this.data.form.showSummary();
		};
		
		StepControl.prototype.__StepSubmitHandle = function(aEvent) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("__StepSubmitHandle()");
			
			this.data.form.submit();
		};
		
		de.titus.form.StepControl = StepControl;
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.StepPanel", function() {
		var StepPanel = function(aForm) {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aForm.data.element.find("[" + de.titus.form.Setup.prefix + "-step-panel" + "]");
			this.data.stepPanel = undefined;
			this.data.stepPanelSummaryState = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step='" + de.titus.form.Constants.STATE.SUMMARY + "']");
			this.data.stepPanelSubmitedState = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step='" + de.titus.form.Constants.STATE.SUBMITED + "']");
			this.data.form = aForm;
			this.init();
		};
		
		StepPanel.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.StepPanel");
		
		StepPanel.prototype.init = function() {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("init()");
			
		};
		
		StepPanel.prototype.update = function() {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("update()");
			this.data.element.find(".active").removeClass("active")

			if (this.data.form.data.state == de.titus.form.Constants.STATE.SUMMARY && this.data.stepPanelSummaryState != undefined)
				this.data.stepPanelSummaryState.addClass("active");
			else if (this.data.form.data.state == de.titus.form.Constants.STATE.SUBMITED && this.data.stepPanelSubmitedState != undefined)
				this.data.stepPanelSubmitedState.addClass("active");
			else {
				var page = this.data.form.getCurrentPage();
				if (page)
					this.data.element.find("[" + de.titus.form.Setup.prefix + "-step='" + page.data.step + "']").addClass("active");
			}
		};
		
		de.titus.form.StepPanel = StepPanel;
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.ContainerFieldController", function() {
		de.titus.form.ContainerFieldController = function(aElement) {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			
			this.init();
		};
		de.titus.form.ContainerFieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.ContainerFieldController");
		
		de.titus.form.ContainerFieldController.prototype.init = function() {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("init()");
			
		};		

		de.titus.form.ContainerFieldController.prototype.showField = function(aData) {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("showField()");
			
			this.element.show();
		};
		
		de.titus.form.ContainerFieldController.prototype.showSummary = function() {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("showSummary()");
						
		};
		
		de.titus.form.ContainerFieldController.prototype.hideField = function() {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("hideField()");
			
			this.element.hide()
		};
		
		de.titus.form.ContainerFieldController.prototype.getValue = function() {
			
		};
		
		de.titus.form.Registry.registFieldController("container", function(aElement, aFieldname, aValueChangeListener) {
			return new de.titus.form.ContainerFieldController(aElement, aFieldname, aValueChangeListener);
		});
	});
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DefaultFieldController", function() {
		var DefaultFieldController = function(aElement) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			this.input = undefined;
			this.type = undefined;
			this.filedata = undefined;
			this.timeoutId == undefined;
			this.init();
		};
		DefaultFieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DefaultFieldController");
		
		DefaultFieldController.prototype.valueChanged = function(aEvent) {
			aEvent.preventDefault();
			this.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
		};
		
		DefaultFieldController.prototype.init = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("init()");
			
			if (this.element.find("select").length == 1) {
				this.type = "select";
				this.element.find("select").on("change", DefaultFieldController.prototype.valueChanged.bind(this));
			} else {
				if (this.element.find("input[type='radio']").length > 0) {
					this.type = "radio";
					this.element.find("input[type='radio']").on("change", DefaultFieldController.prototype.valueChanged.bind(this));
				}
				if (this.element.find("input[type='checkbox']").length > 0) {
					this.type = "checkbox";
					this.element.find("input[type='checkbox']").on("change", DefaultFieldController.prototype.valueChanged.bind(this));
				} else if (this.element.find("input[type='file']").length == 1) {
					this.type = "file";
					this.element.find("input[type='file']").on("change", DefaultFieldController.prototype.readFileData.bind(this));
				} else {
					this.type = "text";
					this.element.find("input, textarea").on("keyup change", (function(aEvent) {
						if (this.timeoutId != undefined) {
							window.clearTimeout(this.timeoutId);
						}
						
						this.timeoutId = window.setTimeout((function() {
							this.valueChanged(aEvent);
						}).bind(this), 300);
						
					}).bind(this));
				}
				
			}
			
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("init() -> detect type: " + this.type);
		};
		
		DefaultFieldController.prototype.readFileData = function(aEvent) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("readFileData()");
			
			var input = aEvent.target;
			var multiple = input.files.length > 1;
			if (multiple)
				this.fileData = [];
			else
				this.fileData = undefined;
			
			var $__THIS__$ = this;
			var reader = new FileReader();
			var count = input.files.length;
			reader.addEventListener("load", function() {
				if (DefaultFieldController.LOGGER.isDebugEnabled())
					DefaultFieldController.LOGGER.logDebug("readFileData() -> reader load event!");
				
				count--;
				if (multiple)
					$__THIS__$.fileData.push(reader.result);
				else
					$__THIS__$.fileData = reader.result;
				
				if (count == 0)
					$__THIS__$.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
			}, false);
			
			var textField = this.element.find("input[type='text'][readonly]");
			if (textField.length == 1)
				textField.val("");
			for (var i = 0; i < input.files.length; i++) {
				reader.readAsDataURL(input.files[i]);
				if (textField.length == 1)
					textField.val(textField.val() != "" ? textField.val() + ", " + input.files[i].name : input.files[i].name);
			}
		};
		
		DefaultFieldController.prototype.showField = function(aValue, aData) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("showField()");
			
			if (this.type == "select")
				this.element.find("select").prop("disabled", false);
			else
				this.element.find("input, textarea").prop("disabled", false);
			this.element.show();
		};
		
		DefaultFieldController.prototype.showSummary = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("showSummary()");
			
			if (this.type == "select")
				this.element.find("select").prop("disabled", true);
			else
				this.element.find("input, textarea").prop("disabled", true);
			
		};
		
		DefaultFieldController.prototype.hideField = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("hideField()");
			
			this.element.hide()
		};
		
		DefaultFieldController.prototype.getValue = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("getValue()");
			
			if (this.type == "select")
				return this.element.find("select").val();
			else if (this.type == "radio")
				return this.element.find("input:checked").val();
			else if (this.type == "checkbox") {
				var result = [];
				this.element.find("input:checked").each(function() {
					result.push($(this).val());
				});
				return result;
			} else if (this.type == "file")
				return this.fileData;
			else
				return this.element.find("input, textarea").first().val();
		};
		
		de.titus.form.Registry.registFieldController("default", function(aElement, aFieldname, aValueChangeListener) {
			return new DefaultFieldController(aElement, aFieldname, aValueChangeListener);
		});
		
		de.titus.form.DefaultFieldController = DefaultFieldController;
	});
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.ListFieldController", function() {
		var ListFieldController = function(aElement) {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			this.template = this.element.find("[" + de.titus.form.Setup.prefix + "-field-list-template]");
			this.content = this.element.find("[" + de.titus.form.Setup.prefix + "-field-list-content]");
			this.listFields = [];
			
			
			this.init();
		};
		ListFieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.ListFieldController");
		
		ListFieldController.prototype.init = function() {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("init()");
			this.element.find("[" + de.titus.form.Setup.prefix + "-field-list-add-action]").on("click", ListFieldController.prototype.addAction.bind(this));
		};
		
		ListFieldController.prototype.addAction = function(aEvent) {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("addAction()");
			
			var dataController = new de.titus.form.ListFieldDataController(this.element.FormularField().data.dataController);
			
			
			var newRow = this.template.clone();
			console.log(newRow);
			newRow.removeAttr(de.titus.form.Setup.prefix + "-field-list-template");
			newRow.attr(de.titus.form.Setup.prefix + "-field-list-row", "");
			
			this.content.append(newRow);
			newRow.find("[" + de.titus.form.Setup.prefix + "-field]").FormularField(dataController);
			this.listFields.push(dataController);
		};		

		ListFieldController.prototype.showField = function(aData) {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("showField()");
			
			this.element.show();
		};
		
		ListFieldController.prototype.hideField = function() {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("hideField()");
			
			this.element.hide()
		};
		
		ListFieldController.prototype.showSummary = function() {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("showSummary()");
						
		};
		
		ListFieldController.prototype.getValue = function() {
			var result = [];
			for(var i = 0; i < this.listFields.length; i++)
				result.push(this.listFields[i].internalDataController.getData());
			
			return result;
		};
		
		de.titus.form.ListFieldController = ListFieldController; 
		
		de.titus.form.Registry.registFieldController("list", function(aElement, aFieldname, aValueChangeListener) {
			return new ListFieldController(aElement, aFieldname, aValueChangeListener);
		});
	});
})();
(function() {
	de.titus.core.Namespace.create("template.FieldController", function() {
		template.FieldController = function(aElement) {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			/*
			 * Every time if your field make a value change trigger the
			 * following jquery event on this.element:
			 * 
			 * this.element.tigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
			 */

		};
		template.FieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("template.FieldController");
		
		template.FieldController.prototype.showField = function(aValue, aData) {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("showField()");
			
			/*
			 * make your field visible aValue -> a Preseted value aData -> the
			 * data object from all of the formular
			 * 
			 * This function would be called every time, if your field need to display
			 */

			this.element.show();
		};
		
		template.FieldController.prototype.hideField = function() {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("hideField()");
			
			// hide this field
			
			this.element.hide()
		};
		
		template.FieldController.prototype.showSummary = function() {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("showSummary() -> isSummary: " + isSummery);
			
			// show your field as summary
		};
		
		template.FieldController.prototype.getValue = function() {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("getValue() -> " + JSON.stringify(this.employee));
			
			// return field value
			
			return "[value]";
		};
		
		de.titus.form.Registry.registFieldController("[my-costum-field-type]", function(aElement, aFieldname, aValueChangeListener) {
			// registrate field type + function to create the field controller
			return new template.FieldController(aElement, aFieldname, aValueChangeListener);
		});
		
	});
})($);

de.titus.core.Namespace.create("de.titus.jquery.plugins", function() {	
	
});
/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Frank Schüler
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


