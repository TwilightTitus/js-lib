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
de.titus.core = de.titus.core || {
	Version : "1.10.2"
};
if (de.titus.core.Namespace == undefined) {
	de.titus.core.Namespace = {};
	/**
	 * creates a namespace and run the function, if the Namespace new
	 * 
	 * @param aNamespace
	 *            the namespace(requiered)
	 * @param aFunction
	 *            a function that be executed, if the namespace created
	 *            (optional)
	 * 
	 * @returns boolean, true if the namespace created
	 */
	de.titus.core.Namespace.create = function(aNamespace, aFunction) {
		var namespaces = aNamespace.split(".");
		var currentNamespace = window || global;
		for (var i = 0; i < namespaces.length; i++) {
			if (currentNamespace[namespaces[i]] == undefined)
				currentNamespace[namespaces[i]] = {};
			currentNamespace = currentNamespace[namespaces[i]];			
		}
		aFunction();
	};
};de.titus.core.Namespace.create("de.titus.core.SpecialFunctions", function() {

	var SpecialFunctions = de.titus.core.SpecialFunctions = {
	    DEVMODE : location.search ? (/.*devmode=true.*/ig).test(location.search) : false,
	    STATEMENTS : {},
	    doEval : function(aStatement, aContext, aCallback) {
		    if (aCallback)
			    SpecialFunctions.doEvalWithContext(aStatement, (aContext || {}), undefined, aCallback);
		    else {
			    if (typeof aStatement !== "string")
				    return aStatement;
			    
			    var statement = aStatement.trim();			    
			    if(statement.length == 0)
			    	return undefined;

			    try {
				    var evalFunction = new Function("aContext", "with(this){return " + aStatement + ";}");
				    return evalFunction.call(aContext);
			    } catch (e) {
				    if (SpecialFunctions.DEVMODE) {
					    console.log("----------------------\n", "doEval()\n", "statement: \"", aStatement, "\"\n", "context: \"", aContext, "\"\n", "callback: \"", aCallback, "\"\n", "error: ", e, "\n", "----------------------");
				    }
				    throw e;
			    }
		    }
	    },

	    /**
	     * 
	     * @param aStatement
	     * @param aContext
	     * @param aDefault
	     * @param aCallback
	     * @returns
	     */
	    doEvalWithContext : function(aStatement, aContext, aDefault, aCallback) {
		    if (typeof aCallback === "function") {
			    window.setTimeout(function() {
				    var result = SpecialFunctions.doEvalWithContext(aStatement, aContext, aDefault, undefined);
				    aCallback(result, aContext);
			    }, 1);

		    } else
			    try {
				    var result = SpecialFunctions.doEval(aStatement, aContext);
				    if (typeof result === "undefined")
					    return aDefault;
				    return result;
			    } catch (e) {
				    return aDefault;
			    }
	    }
	};

});
(function($) {
	de.titus.core.Namespace.create("de.titus.core.jquery.Components", function() {
		var Components = de.titus.core.jquery.Components = {};
		Components.asComponent = function(aName, aConstructor) {
			$.fn[Components.__buildFunctionName(aName)] = function(aData) {
				return Components.__createInstance(this, aName, aConstructor, aData);
			};
		};

		Components.__buildFunctionName = function(aName) {
			return aName.replace(/\./g, "_");
		};

		Components.__createInstance = function(aElement, aName, aConstructor, aData) {
			if (aElement.length == 0)
				return;
			else if (aElement.length > 1) {
				var result = [];
				aElement.each(function() {
					result.push(Components.__createInstance($(this), aName, aConstructor, aData));
				});
				return result;
			} else {
				var component = aElement.data(aName);
				if (!component) {
					component = new aConstructor(aElement, aData);
					aElement.data(aName, component);
				}

				return component;
			}
		}

	});
})($);
(function($) {
	$.fn.tagName = $.fn.tagName || function() {
		if (this.length == 0)
			return undefined;
		else if (this.length > 1) {
			let result = [];
			this.each(function() {
				result.push($(this)[0].tagName.toLowerCase());
			});
			return result;
		} else
			return $(this)[0].tagName.toLowerCase();
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
		var PagingUtils = de.titus.core.PagingUtils = {
		    pagerData : function(aPage, aPages, aSize) {
			    var half = Math.round(aPages / 2);
			    var result = {
			        firstPage : 1,
			        startPage : 1,
			        endPage : aSize,
			        lastPage : aPages,
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
	var Matcher = de.titus.core.regex.Matcher = function(/* RegExp */aRegExp, /* String */aText) {
		this.internalRegex = aRegExp;
		this.processingText = aText;
		this.currentMatch = undefined;
	}

	Matcher.prototype.isMatching = /* boolean */function() {
		return this.internalRegex.test(this.processingText);
	};
	
	Matcher.prototype.next = /* boolean */function() {
		this.currentMatch = this.internalRegex.exec(this.processingText);
		if (this.currentMatch != undefined) {
			this.processingText = this.processingText.replace(this.currentMatch[0], "");
			return true;
		}
		return false;
	};
	
	Matcher.prototype.getMatch = /* String */function() {
		if (this.currentMatch != undefined)
			return this.currentMatch[0];
		return undefined;
	};
	
	Matcher.prototype.getGroup = /* String */function(/* int */aGroupId) {
		if (this.currentMatch != undefined)
			return this.currentMatch[aGroupId];
		return undefined;
	};
	
	Matcher.prototype.replaceAll = /*String*/ function(/* String */aReplaceValue, /* String */aText) {
		if (this.currentMatch != undefined)
			return aText.replace(this.currentMatch[0], aReplaceValue);
		return aText;
	};
});

de.titus.core.Namespace.create("de.titus.core.regex.Regex", function() {
	
	var Regex = de.titus.core.regex.Regex = function(/* String */aRegex, /* String */aOptions) {
		this.internalRegex = new RegExp(aRegex, aOptions);
	};
	
	Regex.prototype.parse = /* de.titus.core.regex.Matcher */function(/* String */aText) {
		return new de.titus.core.regex.Matcher(this.internalRegex, aText);
	};
});
de.titus.core.Namespace.create("de.titus.core.ExpressionResolver", function() {

	var ExpressionResolver = de.titus.core.ExpressionResolver = function(varRegex) {
		this.regex = new de.titus.core.regex.Regex(varRegex || de.titus.core.ExpressionResolver.TEXT_EXPRESSION_REGEX);
	};

	/**
	 * static variables
	 */
	// ExpressionResolver.TEXT_EXPRESSION_REGEX = "\\$\\{([^\\$\\{\\}]*)\\}";
	ExpressionResolver.TEXT_EXPRESSION_REGEX = "\\$\\{([^\\{\\}]+)\\}";

	/**
	 * @param aText
	 * @param aDataContext
	 * @param aDefaultValue
	 * 
	 * @returns
	 */
	ExpressionResolver.prototype.resolveText = function(aText, aDataContext, aDefaultValue) {
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
	ExpressionResolver.prototype.resolveExpression = function(aExpression, aDataContext, aDefaultValue) {
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
	ExpressionResolver.prototype.internalResolveExpression = function(aExpression, aDataContext, aDefaultValue) {
		try {
			return de.titus.core.SpecialFunctions.doEvalWithContext(aExpression, aDataContext, aDefaultValue);
		} catch (e) {
			return aDefaultValue;
		}
	};

	de.titus.core.ExpressionResolver.DEFAULT = new de.titus.core.ExpressionResolver();
});
(function($) {
	de.titus.core.Namespace.create("de.titus.core.URL", function() {
		var URL = de.titus.core.URL = function(aProtocol, aDomain, aPort, aPath, theParameter, aMarker) {
			
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
		
		URL.prototype.getParameter = function(aKey) {
			var value = this.getParameters()[aKey];
			if (value == undefined)
				return undefined;
			if (value.length > 1)
				return value;
			else
				return value[0];
		};
		
		URL.prototype.getParameters = function(aKey) {
			return this.getParameters()[aKey];
		};
		
		URL.prototype.addParameter = function(aKey, aValue, append) {
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
		
		URL.prototype.getQueryString = function() {
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
		
		URL.prototype.getMarkerString = function() {
			if (this.getMarker() != undefined)
				return "#" + this.getMarker();
			
			return "";
		};
		
		URL.prototype.asString = function() {
			var result = this.getProtocol() + "://" + this.getDomain() + ":" + this.getPort();
			
			if (this.getPath() != undefined)
				result = result + this.getPath();
			
			result = result + this.getQueryString() + this.getMarkerString();
			
			return result;
		};
		
		URL.prototype.toString = function() {
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
		
		var Page = de.titus.core.Page = function() {
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
		Page.CSSTEMPLATE = '<link rel="stylesheet" type="text/css"/>';
		Page.JSTEMPLATE = '<script type="text/javascript"></script>';
		
		Page.prototype.addJsFile = function(aUrl, aFunction, forceFunction) {
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
		
		Page.prototype.addJsFiles = function(aUrls, aFunction, forceFunction) {
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
		
		Page.prototype.addCssFile = function(aUrl) {
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
		
		Page.prototype.addCssFiles = function(aUrls) {
			if ($.isArray(aUrls)) {
				for (i = 0; i < aUrls.length; i++) {
					this.addCssFile(aUrls[i]);
				}
			}
		};
		
		Page.prototype.getUrl = function() {
			return de.titus.core.URL.getCurrentUrl();
		};
		
		Page.prototype.buildUrl = function(aUrl) {
			var browser = this.detectBrowser();
			if (browser.ie && browser.ie < 11) {
				var tempUrl = aUrl.toLowerCase().trim();
				if (this.hasBaseTag && !tempUrl.indexOf("http:") == 0 && !tempUrl.indexOf("https:") == 0 && !tempUrl.indexOf("ftp:") == 0 && !tempUrl.indexOf("ftps:") == 0 && !tempUrl.indexOf("mailto:") == 0 && !tempUrl.indexOf("notes:") == 0 && !tempUrl.indexOf("/") == 0) {
					return this.baseTagValue + aUrl;
				}
			}
			return aUrl;
		};
		
		Page.prototype.detectBrowser = function() {
			if(Page.BROWSER)
				return Page.BROWSER;
			
			Page.BROWSER = {};
			if(document.documentMode)
				Page.BROWSER.ie = document.documentMode;			
			else
				Page.BROWSER.other = true;
			
			return Page.BROWSER;
		};
		
		Page.prototype.setData = function(aKey, aValue) {
			this.data[aKey] = aValue;
		};
		
		Page.prototype.getData = function(aKey) {
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
		var StringUtils = $.fn.de_titus_core_StringUtils = de.titus.core.StringUtils = {};
		StringUtils.DEFAULTS = {};
		StringUtils.DEFAULTS.formatToHtml = {
		"tabsize" : 4,
		"tabchar" : "&nbsp;",
		"newlineTag" : "<br/>"
		};
		
		StringUtils.DEFAULTS.trimTextLength = {
			"postfix" : "..."
		};
		
		StringUtils.trimTextLength = function(aText, maxLength, theSettings) {
			if (aText == undefined || typeof aText !== "string" || aText == "")
				return aText;
			
			var settings = $.extend({}, theSettings, StringUtils.DEFAULTS.trimTextLength);
			
			if (aText.length > maxLength) {
				var end = maxLength - settings.postfix.length;
				if ((aText.length - end) > 0)
					return aText.substring(0, end).trim() + settings.postfix;
			}
			return aText;
		};
		
		StringUtils.formatToHtml = function(aText, theSettings) {
			if (aText == undefined || typeof aText !== "string" || aText == "")
				return aText;
			
			var settings = $.extend({}, theSettings, StringUtils.DEFAULTS.formatToHtml);
			var text = aText.replace(new RegExp("\n\r", "g"), "\n");
			var text = aText.replace(new RegExp("\r", "g"), "\n");
			var lines = text.split("\n");
			var text = "";
			for (var i = 0; i < lines.length; i++) {
				if (i != 0)
					text = text + settings.newlineTag;
				text = text + StringUtils.preventTabs(lines[i], settings.tabsize, settings.tabchar);
			}
			return text;
		};
		
		StringUtils.getTabStopMap = function(tabSize, tabString) {
			var tabstopMap = [];
			for (var i = 0; i <= tabSize; i++) {
				if (i == 0)
					tabstopMap[0] = "";
				else
					tabstopMap[i] = tabstopMap[i - 1] + tabString;
			}
			
			return tabstopMap;
		};
		
		StringUtils.preventTabs = function(aText, theTabStops, theTabStopChar) {
			var tabstopMap = StringUtils.getTabStopMap(theTabStops, theTabStopChar);
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
		StringUtils.format = function(aText, args) {
			var objects = arguments;
			return aText.replace(StringUtils.format.VARREGEX, function(item) {
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
		StringUtils.format.VARREGEX = new RegExp("{-?[0-9]+}", "g");
		
	});
})($);
(function($) {
	de.titus.core.Namespace.create("de.titus.core.EventBind", function() {
		"use strict";
		var EventBind = de.titus.core.EventBind = function(anElement, aContext) {
			var result = {
			    preventDefault : (typeof anElement.attr("event-prevent-default") !== "undefined"),
			    stopPropagation : (typeof anElement.attr("event-stop-propagation") !== "undefined")
			};
			result.eventType = anElement.attr("event-type");
			if (typeof result.eventType === 'undefined')
				anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.FAIL);
			else {
				result.action = anElement.attr("event-action");
				result.delegation = anElement.attr("event-delegation");

				if (typeof (result.action || result.delegation) === 'undefined') {
					anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.FAIL);
					return;
				}

				result.eventData = anElement.attr("event-data");
				if (typeof result.eventData !== 'undefined' && result.eventData.length > 0)
					result.eventData = de.titus.core.EventBind.EXPRESSIONRESOLVER.resolveExpression(eventData, aContext, {});
				else if (typeof aContext !== 'undefined')
					result.eventData = $().extend({}, aContext);

				if (typeof result.eventData !== 'undefined')
					anElement.on(result.eventType, null, result.eventData, de.titus.core.EventBind.$$__execute__$$);
				else
					anElement.on(result.eventType, de.titus.core.EventBind.$$__execute__$$);
				anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.READY);
				return result;
			}
		};

		EventBind.EXPRESSIONRESOLVER = new de.titus.core.ExpressionResolver();
		EventBind.STATE = {
			FINISHED : "$$EventBind.FINISHED$$"
		};
		EventBind.FINISHEDSTATE = {
		    FAIL : "fail",
		    READY : "ready"
		};

		EventBind.$$__execute__$$ = function(anEvent) {
			var element = $(this);
			var data = element.data("de.titus.core.EventBind");
			if (data.preventDefault)
				anEvent.preventDefault();
			if (data.stopPropagation)
				anEvent.stopPropagation();

			if (typeof data.action !== 'undefined') {
				var action = data.action;
				action = EventBind.EXPRESSIONRESOLVER.resolveExpression(data.action, anEvent.data, undefined);
				if (typeof action === "function") {
					var args = Array.from(arguments);
					if (args != undefined && args.length >= 1 && anEvent.data != undefined)
						args.splice(1, 0, anEvent.data);
					action.apply(action, args);
				}
			}

			if (typeof data.delegation !== 'undefined')
				element.trigger(data.delegation, typeof data.eventData !== 'undefined' ? [ data.eventData ] : undefined);

			return !anEvent.isDefaultPrevented();
		};
		de.titus.core.jquery.Components.asComponent("de.titus.core.EventBind", de.titus.core.EventBind);

		$(document).ready(function() {
			var elements = $("[event-autorun]");
			if (typeof elements !== 'undefined' && elements.length > 0) {
				elements.de_titus_core_EventBind();
				elements.find("[event-type]").de_titus_core_EventBind();

				var observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {
						mutation.addedNodes.forEach(function(node) {
							if (node.nodetype != Node.TEXT_NODE) {
								$(node).de_titus_core_EventBind();
								$(node).find("[event-type]").de_titus_core_EventBind();
							}
						});
					});
				});

				// configuration of the observer:
				var config = {
				    attributes : true,
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
if (typeof String.prototype.hashCode !== 'function') {
	String.prototype.hashCode = function() {
		var hash = 0, i, chr;
		if (this.length === 0)
			return hash;
		for (i = 0; i < this.length; i++) {
			chr = this.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	};
}
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
(function($, aResolver) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.core.ScreenObserver", function() {
		var Observer = de.titus.core.ScreenObserver = {
		    __timeoutId : undefined,
		    __handler : {},
		    addHandler : function(aHandler) {
			    if (typeof aHandler.condition !== 'undefined' && aHandler.condition.length != 0) {
				    aHandler.id = de.titus.core.UUID("-");
				    Observer.__handler[aHandler.id] = aHandler;
				    Observer.__callHandler(aHandler, Observer.__screenData());
				    return aHandler;
			    }
		    },
		    __screenData : function() {
			    return {
			        width : window.innerWidth,
			        height : window.innerHeight,
			        pixelRatio : window.devicePixelRatio,
			        landscape : (window.innerHeight <= window.innerWidth),
			        portrait : (window.innerHeight > window.innerWidth)
			    };
		    },
		    __resizing : function() {
			    Observer.__timeoutId = undefined;
			    var screen = Observer.__screenData();
			    Object.getOwnPropertyNames(Observer.__handler).forEach(function(aHandlerId) {
				    Observer.__callHandler(Observer.__handler[aHandlerId], screen);
			    });

		    },
		    __callHandler : function(aHandler, aScreen) {
			    setTimeout((function(aHandler, aScreen, aResolver) {
				    var result = aResolver.resolveExpression(aHandler.condition, aScreen, false);
				    if (typeof result !== 'boolean')
					    return Observer.__handler[aHandler.id] == undefined;

				    if (result) {
					    aHandler.active = true;
					    aHandler.activate.call(aScreen);
					    if (typeof aHandler.deactivate !== 'function')
						    Observer.__handler[aHandler.id] == undefined;
				    } else if (aHandler.active && typeof aHandler.deactivate === 'function') {
					    aHandler.deactivate.call(aScreen);
					    aHandler.active = false;
				    }

			    }).bind(null, aHandler, aScreen, aResolver), 66);
		    },
		    __handleResize : function() {
			    if (Observer.__timeoutId)
				    clearTimeout(Observer.__timeoutId);

			    Observer.__timeoutId = setTimeout(Observer.__resizing, 250);
		    }
		};

		window.addEventListener('resize', Observer.__handleResize, false);
		$(document).ready(Observer.__resizing);
	});
})($, de.titus.core.ExpressionResolver.DEFAULT);

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

de.titus.core.Namespace.create("de.titus.logging.Version", function() {
	de.titus.logging.Version = "2.1.0";
});de.titus.core.Namespace.create("de.titus.logging.LogLevel", function() {
	
	var LogLevel = de.titus.logging.LogLevel = function(aOrder, aTitle){
		this.order = aOrder;
		this.title = aTitle;
	};
	
	LogLevel.prototype.isIncluded = function(aLogLevel){
		return this.order >= aLogLevel.order;
	};
	
	LogLevel.getLogLevel = function(aLogLevelName){
		if(aLogLevelName == undefined)
			return de.titus.logging.LogLevel.NOLOG;
		
		var levelName = aLogLevelName.toUpperCase();
		return de.titus.logging.LogLevel[levelName];
	};
	
	LogLevel.NOLOG = new LogLevel(0, "NOLOG");
	LogLevel.ERROR = new LogLevel(1, "ERROR");
	LogLevel.WARN 	= new LogLevel(2, "WARN");
	LogLevel.INFO 	= new LogLevel(3, "INFO");
	LogLevel.DEBUG = new LogLevel(4, "DEBUG");
	LogLevel.TRACE = new LogLevel(5, "TRACE");	
});
de.titus.core.Namespace.create("de.titus.logging.LogAppender", function() {
	
	var LogAppender = de.titus.logging.LogAppender = function() {	};
	
	LogAppender.prototype.formatedDateString = function(aDate){
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
	LogAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel){};
	
	
});

de.titus.core.Namespace.create("de.titus.logging.Logger", function() {
	
	var Logger = de.titus.logging.Logger = function(aName, aLogLevel, aLogAppenders) {
		this.name = aName;
		this.logLevel = aLogLevel;
		this.logAppenders = aLogAppenders;
	};
	
	Logger.prototype.isErrorEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.ERROR);
	};
	Logger.prototype.isWarnEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.WARN);
	};
	Logger.prototype.isInfoEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.INFO);
	};
	Logger.prototype.isDebugEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.DEBUG);
	};
	Logger.prototype.isTraceEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.TRACE);
	};
	
	Logger.prototype.logError = function(aMessage, aException) {
		if (this.isErrorEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.ERROR);
	};
	
	Logger.prototype.logWarn = function(aMessage, aException) {
		if (this.isWarnEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.WARN);
	};
	
	Logger.prototype.logInfo = function(aMessage, aException) {
		if (this.isInfoEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.INFO);
	};
	
	Logger.prototype.logDebug = function(aMessage, aException) {
		if (this.isDebugEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.DEBUG);
	};
	
	Logger.prototype.logTrace = function(aMessage, aException) {
		if (this.isTraceEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.TRACE);
	};
	
	Logger.prototype.log = function(aMessage, anException, aLogLevel) {
		if(this.logAppenders == undefined)
			return;
		
		if(this.logAppenders.length > 0){
			for(var i = 0; i < this.logAppenders.length; i++)
				this.logAppenders[i].logMessage(aMessage, anException, this.name, new Date(), aLogLevel);
		}
	};
});
de.titus.core.Namespace.create("de.titus.logging.LoggerRegistry", function() {
	
	var LoggerRegistry = de.titus.logging.LoggerRegistry = function(){
		this.loggers = {};
	};		
	
	LoggerRegistry.prototype.addLogger = function(aLogger){
		if(aLogger == undefined)
			return;
		
		if(this.loggers[aLogger.name] == undefined)
			this.loggers[aLogger.name] = aLogger;
	};	
	
	LoggerRegistry.prototype.getLogger = function(aLoggerName){
		if(aLoggerName == undefined)
			return;
		
		return this.loggers[aLoggerName];
	};	
	
	
	LoggerRegistry.getInstance = function(){
		if(LoggerRegistry.INSTANCE == undefined)
			LoggerRegistry.INSTANCE = new LoggerRegistry();
		
		return LoggerRegistry.INSTANCE;
	};	
	
});de.titus.core.Namespace.create("de.titus.logging.LoggerFactory", function() {
	
	var LoggerFactory = de.titus.logging.LoggerFactory = function() {
		this.configs = undefined;
		this.appenders = {};
		this.loadLazyCounter = 0;
	};
	
	LoggerFactory.prototype.newLogger = function(aLoggerName) {
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
	
	LoggerFactory.prototype.getConfig = function() {
		if (this.configs == undefined)
			this.updateConfigs();
		
		return this.configs;
	};
	
	LoggerFactory.prototype.setConfig = function(aConfig) {
		if (aConfig != undefined) {
			this.configs = aConfig;
			this.updateLogger();
		}
	};
	
	LoggerFactory.prototype.updateConfigs = function(aConfig) {
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
	
	LoggerFactory.prototype.doLoadLazy = function() {
		if (this.loadLazyCounter > 10)
			return;
		this.loadLazyCounter++;
		window.setTimeout(function() {
			de.titus.logging.LoggerFactory.getInstance().loadConfig();
		}, 1);
	};
	
	LoggerFactory.prototype.loadConfig = function(aConfig) {
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
	
	LoggerFactory.prototype.loadConfigRemote = function(aRemoteData) {
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
	
	LoggerFactory.prototype.updateLogger = function() {
		
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
	
	LoggerFactory.prototype.findConfig = function(aLoggerName) {
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
	
	LoggerFactory.prototype.isConfigActiv = function(aLoggerName, aConfig, anActualConfig) {
		if (anActualConfig && anActualConfig.filter.length >= aConfig.filter.filter)
			return false;
		return aLoggerName.search(aConfig.filter) == 0;
	};
	
	LoggerFactory.prototype.getAppenders = function(theAppenders) {
		var result = new Array();
		for (var i = 0; i < theAppenders.length; i++) {
			var appenderString = theAppenders[i];
			var appender = this.appenders[appenderString];
			if (!appender) {
				appender = de.titus.core.SpecialFunctions.doEval("new " + appenderString + "();");
				if (appender) {
					this.appenders[appenderString] = appender;
				}
			}
			if (appender != undefined)
				result.push(appender);
		}
		
		return result;
	};
	
	LoggerFactory.getInstance = function() {
		if (LoggerFactory.INSTANCE == undefined)
			LoggerFactory.INSTANCE = new LoggerFactory();
		
		return LoggerFactory.INSTANCE;
	};
	
});
de.titus.core.Namespace.create("de.titus.logging.ConsolenAppender", function() {
	
	var ConsolenAppender = de.titus.logging.ConsolenAppender = function() {
	};
	
	ConsolenAppender.prototype = new de.titus.logging.LogAppender();
	ConsolenAppender.prototype.constructor = ConsolenAppender;
	
	ConsolenAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel) {
		if (de.titus.logging.LogLevel.NOLOG == aLogLevel)
			return;
		var log = [];
		if (aDate)
			Array.prototype.push.apply(log, [
			        this.formatedDateString(aDate), " "
			]);
		
		Array.prototype.push.apply(log, [
		        "***", aLogLevel.title, "*** ", aLoggerName
		]);
		if (aMessage) {
			log.push(" -> ");
			if (Array.isArray(aMessage))
				Array.prototype.push.apply(log, aMessage);
			else
				log.push(aMessage);
		}
		if (anException)
			Array.prototype.push.apply(log, [
			        ": ", anException
			]);
		
		if (de.titus.logging.LogLevel.ERROR == aLogLevel)
			console.error == undefined ? console.error.apply(console,log) : console.log.apply(console,log);
		else if (de.titus.logging.LogLevel.WARN == aLogLevel)
			console.warn == undefined ? console.warn.apply(console,log) : console.log.apply(console,log);
		else if (de.titus.logging.LogLevel.INFO == aLogLevel)
			console.info == undefined ? console.info.apply(console,log) : console.log.apply(console,log);
		else if (de.titus.logging.LogLevel.DEBUG == aLogLevel)
			console.debug == undefined ? console.debug.apply(console,log) : console.log.apply(console,log);
		else if (de.titus.logging.LogLevel.TRACE == aLogLevel)
			console.trace == undefined ? console.trace.apply(console,log) : console.log.apply(console,log);
		
	};
});
(function($) {
	de.titus.core.Namespace.create("de.titus.logging.HtmlAppender", function() {
		
		var HtmlAppender = de.titus.logging.HtmlAppender = function() {};
		
		HtmlAppender.CONTAINER_QUERY = "#log";
		
		HtmlAppender.prototype = new de.titus.logging.LogAppender();
		HtmlAppender.prototype.constructor = HtmlAppender;
		
		HtmlAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel) {
			var container = $(de.titus.logging.HtmlAppender.CONTAINER_QUERY);
			if (container == undefined)
				return;
			
			var log = $("<div />").addClass("log-entry " + aLogLevel.title);
			var logEntry = "";
			if (aDate)
				logEntry += logEntry = this.formatedDateString(aDate) + " ";
			
			logEntry += "***" + aLogLevel.title + "*** " + aLoggerName + "";
			
			if (aMessage)
				logEntry += " -> " + aMessage;
			if (anException)
				logEntry += ": " + anException;
			
			log.text(logEntry);
			container.append(log);
		};
	});
})($);
de.titus.core.Namespace.create("de.titus.logging.MemoryAppender", function() {
	
	window.MEMORY_APPENDER_LOG = new Array();
	
	var MemoryAppender = de.titus.logging.MemoryAppender = function(){};
	
	MemoryAppender.prototype = new de.titus.logging.LogAppender();
	MemoryAppender.prototype.constructor = MemoryAppender;
	
	MemoryAppender.prototype.logMessage=  function(aMessage, anException, aLoggerName, aDate, aLogLevel){		
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
	var InteligentBrowserAppender = de.titus.logging.InteligentBrowserAppender = function() {
		this.appender = undefined;
	};
	
	InteligentBrowserAppender.prototype = new de.titus.logging.LogAppender();
	InteligentBrowserAppender.prototype.constructor =InteligentBrowserAppender;
	
	InteligentBrowserAppender.prototype.getAppender = function() {
		if (this.appender == undefined) {
			var consoleAvalible = console && console.log === "function";
			
			if (consoleAvalible)
				this.appender = new de.titus.logging.ConsolenAppender();
			else if ($(de.titus.logging.HtmlAppender.CONTAINER_QUERY))
				this.appender = new de.titus.logging.HtmlAppender();
			else
				this.appender = new de.titus.logging.MemoryAppender();
		}
		
		return this.appender;
	}

	InteligentBrowserAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel) {
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
	de.titus.core.Namespace.create("de.titus.jstl", function() {
		de.titus.jstl.Version = "4.0.4";
	});
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
			CONTENT:4,
			CLEANING: 5,
			CHILDREN:6,
			BINDING:7,
			FINISH:8
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
		let ExecuteChain = de.titus.jstl.ExecuteChain = function(aTaskChain, aCount, aCallback) {
			this.count = aCount || 0;
			this.taskChain = aTaskChain;
			this.callback = aCallback;
		};
		ExecuteChain.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.ExecuteChain");

		ExecuteChain.prototype.finish = function() {
			if (ExecuteChain.LOGGER.isDebugEnabled())
				ExecuteChain.LOGGER.logDebug("count: " + this.count);

			this.count--;
			if (this.count == 0) {
				if (typeof this.callback === "function")
					this.callback(this);
				this.taskChain.nextTask();
			}
		};
	});
})($, de.titus.jstl.GlobalSettings);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.TaskChain", function() {
		let TaskChain = function(aElement, aContext, aProcessor, isRoot, aCallback) {
			this.element = aElement;
			this.context = aContext;
			this.processor = aProcessor;
			this.root = isRoot;
			if (typeof aCallback === "function" || Array.isArray(aCallback))
				this.callback = aCallback;
			this.__preventChilds = false;
			this.__taskchain = de.titus.jstl.TaskRegistry.taskchain;
			this.__currentTask = undefined;
			this.__buildContext();
		};
		TaskChain.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.TaskChain");

		TaskChain.prototype.skipToPhase = function(aPhase) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("skipToPhase()");

			while (this.__taskchain && this.__taskchain.phase < aPhase)
				this.__taskchain = this.__taskchain.next;

			return this;
		};

		TaskChain.prototype.preventChilds = function() {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug([ "preventChilds() ", this ]);
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
				this.context = $.extend(this.context, aContext);
			else
				this.context = aContext;

			this.__buildContext();

			return this;
		};

		TaskChain.prototype.appendCallback = function(aCallback) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("appendCallback()");
			if (typeof aCallback !== "function")
				return;

			if (Array.isArray(this.callback))
				this.callback.push(aCallback);
			else if (this.callback)
				this.callback = [ this.callback, aCallback ]
			else
				this.callback = aCallback;

			return this;
		};

		TaskChain.prototype.nextTask = function(aContext, doMerge) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug([ "nextTask( \"", aContext, "\", \"", doMerge, "\")" ]);

			if (typeof aContext !== "undefined")
				if (typeof aContext !== "object")
					throw new Error();
				else
					this.updateContext(aContext, doMerge);

			if (this.__taskchain) {
				let task = this.__taskchain.task;
				let phase = this.__taskchain.phase;
				let selector = this.__taskchain.selector;
				this.__currentTask = this.__taskchain;
				this.__taskchain = this.__taskchain.next;

				if (TaskChain.LOGGER.isDebugEnabled())
					TaskChain.LOGGER.logDebug([ "nextTask() -> next task: \"", name, "\", phase: \"", phase, "\", selector \"", selector, "\", element \"", this.element, "\" !" ]);
				if (selector == undefined || this.element.is(selector))
					try {
						task(this.element, this.context, this.processor, this);
					} catch (e) {
						TaskChain.LOGGER.logError(e);
					}
				else {
					if (TaskChain.LOGGER.isDebugEnabled())
						TaskChain.LOGGER.logDebug([ "nextTask() -> skip task: \"", name, "\", phase: \"", phase, "\", selector \"", selector, "\"!" ]);
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
			this.context["$element"] = this.element;
			this.context["$root"] = this.processor.element;
			return this.context;
		};

		TaskChain.prototype.finish = function(async) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("finish()");

			if (async) {
				let self = this;
				setTimeout(function() {
					self.finish();
				}, 0);
			}

			else {
				if (typeof this.callback === "function")
					this.callback(this.element, this.context, this.processor, this);
				else if (Array.isArray(this.callback))
					for (let i = 0; i < this.callback.length; i++)
						if (typeof this.callback[i] === "function")
							this.callback[i](this.element, this.context, this.processor, this);

				this.element.trigger(de.titus.jstl.Constants.EVENTS.onSuccess, [ this.context, this.processor ]);
			}

			return this;
		};

		de.titus.jstl.TaskChain = TaskChain;
	});
})($, de.titus.jstl.GlobalSettings);
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
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.If", function() {
		let If = de.titus.jstl.functions.If = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.If"),
		    TASK : function(aElement, aDataContext, aProcessor, aExecuteChain) {
			    if (If.LOGGER.isDebugEnabled())
				    If.LOGGER.logDebug("TASK");
			    
			    let expression = aElement.attr("jstl-if");
			    if (typeof expression !== 'undefined') {
				    expression = aProcessor.resolver.resolveExpression(expression, aDataContext, false);
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
		let Preprocessor = de.titus.jstl.functions.Preprocessor = {
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

			    if (aElement[0].nodeType != 1 || aElement.tagName() == "br")
				    return aTaskChain.preventChilds().finish();

			    if (!aTaskChain.root) {
				    let ignore = aElement.attr("jstl-ignore");
				    if (typeof ignore !== 'undefined') {
					    if (ignore.length > 0)
						    ignore = aProcessor.resolver.resolveExpression(ignore, aContext, false);
					    else
					    	ignore = true;
					    if (ignore)
						    return aTaskChain.preventChilds().finish();
				    }

				    let async = aElement.attr("jstl-async");
				    if (typeof async !== 'undefined') {
					    if (async.length > 0)
						    async = aProcessor.resolver.resolveExpression(async, dataContext, false);
					    else
						    async = true;
					    if (async) {
						    aProcessor.onReady(function() {
						    	aElement.jstlAsync({
								    data : $.extend({}, aContext)
							    });
						    });
						    return aTaskChain.preventChilds().finish();
					    }
				    }

			    }

			    Preprocessor.__appendEvents(aElement);

			    aElement.trigger(de.titus.jstl.Constants.EVENTS.onLoad, [ aContext, aProcessor ]);
			    aTaskChain.nextTask();
		    },

		    __appendEvents : function(aElement) {
			    if (aElement.attr("jstl-load"))
				    aElement.one(de.titus.jstl.Constants.EVENTS.onLoad, function(aEvent, aContext, aProcessor){Preprocessor.STATICEVENTHANDLER(aElement.attr("jstl-load"), aEvent, aContext, aProcessor);});
			    if (aElement.attr("jstl-success"))
				    aElement.one(de.titus.jstl.Constants.EVENTS.onSuccess, function(aEvent, aContext, aProcessor){Preprocessor.STATICEVENTHANDLER(aElement.attr("jstl-success"), aEvent, aContext, aProcessor);});
		    }

		};

		de.titus.jstl.TaskRegistry.append("preprocessor", de.titus.jstl.Constants.PHASE.INIT, undefined, de.titus.jstl.functions.Preprocessor.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
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

					        if (!aElement.is(".jstl-screen-condition-ready")) {
						        aElement.jstl({
						            "data" : aContext,
						            "callback" : function() {
							            aElement.removeClass("jstl-screen-inactive");
							            aElement.addClass("jstl-screen-active");
							            aElement.addClass("jstl-screen-condition-ready");
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
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Choose", function() {
		let Choose = de.titus.jstl.functions.Choose = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Choose"),

		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");

			    let expression = aElement.attr("jstl-choose");
			    if (typeof expression !== 'undefined') {
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

			    let expression = aElement.attr("jstl-when");
			    if (typeof expression !== 'undefined')
				    return aExpressionResolver.resolveExpression(expression, aDataContext, false);
			    return false;
		    },

		    __computeOtherwise : function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processOtherwiseElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");

			    if (typeof aElement.attr("jstl-otherwise") !== 'undefined')
				    return true;
			    return false;
		    }
		};

		de.titus.jstl.TaskRegistry.append("choose", de.titus.jstl.Constants.PHASE.CONDITION, "[jstl-choose]", de.titus.jstl.functions.Choose.TASK);
	});
})($);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Foreach", function() {
		let Foreach = de.titus.jstl.functions.Foreach = {

		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Foreach"),

		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Foreach.LOGGER.isDebugEnabled())
				    Foreach.LOGGER.logDebug("execute run(" + aElement + ", " + aContext + ", " + aProcessor + ")");

			    let expression = aElement.attr("jstl-foreach");
			    if (expression !== undefined) {
				    aTaskChain.preventChilds();
				    Foreach.__compute(expression, aElement, aContext, aProcessor, aProcessor.resolver, aTaskChain);
			    } else
				    aTaskChain.nextTask();
		    },

		    __compute : function(aExpression, aElement, aContext, aProcessor, aResolver, aTaskChain) {
			    if (Foreach.LOGGER.isDebugEnabled())
				    Foreach.LOGGER.logDebug("execute __compute(" + aElement + ", " + aContext + ", " + aProcessor + ", " + aResolver + ")");

			    var template = Foreach.__template(aElement);
			    if (typeof template !== 'undefined') {
				    aElement.empty();
				    let varName = aElement.attr("jstl-foreach-var") || "itemVar";
				    let statusName = aElement.attr("jstl-foreach-status") || "statusVar";
				    if (aExpression.length == 0 && typeof aElement.attr("jstl-foreach-count") !== "undefined")
					    Foreach.__count(template, statusName, aElement, aContext, aProcessor, aTaskChain);
				    else {
					    let list = aResolver.resolveExpression(aExpression, aContext, undefined);
					    if (Array.isArray(list))
						    Foreach.__list(list, template, varName, statusName, aElement, aContext, aProcessor, aTaskChain);
					    else if (typeof list === "object")
						    Foreach.__map(list, template, varName, statusName, aElement, aContext, aProcessor, aTaskChain);
					    else if (typeof list === "undefined")
						    Foreach.__map(aContext, template, varName, statusName, aElement, aContext, aProcessor, aTaskChain);
					    else
						    aTaskChain.nextTask();
				    }
			    }
		    },
		    __count : function(aTemplate, aStatusName, aElement, aContext, aProcessor, aTaskChain) {
			    var startIndex = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-start-index"), aContext, 0) || 0;
			    var count = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-count"));
			    var step = typeof aElement.attr("jstl-foreach-step") !== 'undefined' ? aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-step")) : 1;
			    var executeChain = new de.titus.jstl.ExecuteChain(aTaskChain);

			    for (let i = startIndex; i < count; i += step) {
				    let context = {};
				    context = $.extend(context, aContext);
				    context[aStatusName] = {
				        "index" : i,
				        "count" : count,
				        "context" : aContext
				    };
				    executeChain.count++;
				    Foreach.__computeContent(aTemplate.clone(), context, aElement, aProcessor, executeChain);
			    }
		    },

		    __list : function(aListData, aTemplate, aVarname, aStatusName, aElement, aContext, aProcessor, aTaskChain) {
			    var startIndex = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-start-index"), aContext, 0) || 0;
			    var breakCondition = aElement.attr("jstl-foreach-break-condition");
			    var executeChain = new de.titus.jstl.ExecuteChain(aTaskChain, 1);

			    for (let i = startIndex; i < aListData.length; i++) {
				    let context = {};
				    context = $.extend(context, aContext);
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
					    Foreach.__computeContent(aTemplate.clone(), context, aElement, aProcessor, executeChain);
				    }
			    }
			    executeChain.finish();
		    },

		    __map : function(aMap, aTemplate, aVarname, aStatusName, aElement, aContext, aProcessor, aTaskChain) {
			    var breakCondition = aElement.attr("jstl-foreach-break-condition");
			    var executeChain = new de.titus.jstl.ExecuteChain(aTaskChain, 1);
			    var properties = Object.getOwnPropertyNames(aMap);

			    for (let i = 0; i < properties.length; i++) {
				    let name = properties[i];
				    let context = {};
				    context = $.extend(context, aContext);
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
					    Foreach.__computeContent(aTemplate.clone(), context, aElement, aProcessor, executeChain);
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
			    aProcessor.compute(aContent, aContext, function() {
				    aExecuteChain.finish();
			    });
		    },

		    __template : function(aElement) {
			    var template = aElement.data("de.titus.jstl.functions.Foreach.Template");
			    if (typeof template === 'undefined') {
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
		let Text = de.titus.jstl.functions.Text = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Text"),

		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Text.LOGGER.isDebugEnabled())
				    Text.LOGGER.logDebug("execute run(" + aElement + ", " + aContext + ", " + aProcessor + ")");

			    let ignore = aElement.attr("jstl-text-ignore");
			    if (typeof ignore === "undefined") {
				    // IE BUG
				    if (!de.titus.core.Page.getInstance().detectBrowser().other)
					    Text.normalize(aElement[0]);
				    var contenttype = aElement.attr("jstl-text-content-type") || "text";
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
			    if (aNode) {
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
			    }
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
			        var text = aText;
			        var addAsHtml = false;

			        let trimLength = (aBaseElement.attr("jstl-text-trim-length") || "").trim();
			        if (trimLength.length > 0) {
				        trimLength = aProcessor.resolver.resolveExpression(trimLength, aContext, "-1");
				        trimLength = parseInt(trimLength);
				        if (trimLength && trimLength > 0)
					        text = de.titus.core.StringUtils.trimTextLength(text, trimLength);
			        }

			        let preventformat = aBaseElement.attr("jstl-text-prevent-format");
			        if (typeof preventformat === "string") {
				        preventformat = preventformat.trim().length > 0 ? (aProcessor.resolver.resolveExpression(preventformat, aContext, true) || true) : true;
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
		let Attribute = de.titus.jstl.functions.Attribute = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Attribute"),
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Attribute.LOGGER.isDebugEnabled())
				    Attribute.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");

			    let attributes = aElement[0].attributes || [];
			    for (var i = 0; i < attributes.length; i++) {
				    let name = attributes[i].name;
				    if (name.indexOf("jstl-") != 0) {
					    let value = attributes[i].value;
					    if (value != undefined && value != "") {
						    try {
							    let newValue = aProcessor.resolver.resolveText(value, aDataContext);
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
		};

		de.titus.jstl.TaskRegistry.append("attribute", de.titus.jstl.Constants.PHASE.CONTENT, undefined, de.titus.jstl.functions.Attribute.TASK);
	});
})($);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Data", function() {
		let Data = de.titus.jstl.functions.Data = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Data"),

		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Data.LOGGER.isDebugEnabled())
				    Data.LOGGER.logDebug("TASK");

			    let expression = aElement.attr("jstl-data");
			    if (typeof expression !== 'undefined') {
				    let varname = aElement.attr("jstl-data-var");
				    let defaultValue = Data.__defaultvalue(aElement, expression, aDataContext, aProcessor);
				    let mode = aElement.attr("jstl-data-mode") || "direct";
				    Data.MODES[mode](expression, defaultValue, aElement, varname, aDataContext, aProcessor, aTaskChain);

			    } else
				    aTaskChain.nextTask();
		    },

		    __defaultvalue : function(aElement, anExpression, aDataContext, aProcessor) {
			    let defaultExpression = aElement.attr("jstl-data-default");
			    if (typeof defaultExpression === 'undefined')
				    return anExpression;
			    else if (defaultExpression.length == 0)
				    return undefined;
			    else
				    return aProcessor.resolver.resolveExpression(defaultExpression, aDataContext, anExpression);
		    },

		    __options : function(aElement, aDataContext, aProcessor) {
			    let options = aElement.attr("jstl-data-options");
			    if (options) {
				    options = aProcessor.resolver.resolveText(options, aDataContext);
				    options = aProcessor.resolver.resolveExpression(options, aDataContext);
				    return options;
			    }
		    },
		    __updateContext : function(aVarname, aData, aTaskChain) {
			    if (typeof aData !== 'undefined') {
				    if (!aVarname)
					    aTaskChain.updateContext(aData, true);
				    else
					    aTaskChain.context[aVarname] = aData;
			    }
		    },

		    MODES : {
		        "direct" : function(anExpression, aDefault, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        let data = aProcessor.resolver.resolveExpression(anExpression, aDataContext, aDefault);
			        Data.__updateContext(aVarname, data, aTaskChain);
			        aTaskChain.nextTask();
		        },

		        "remote" : function(anExpression, aDefault, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        let url = aProcessor.resolver.resolveText(anExpression, aDataContext);
			        url = de.titus.core.Page.getInstance().buildUrl(url);
			        let option = Data.__options(aElement, aDataContext, aProcessor);
			        let datatype = (aElement.attr("jstl-data-datatype") || "json").toLowerCase();

			        let ajaxSettings = {
			            "url" : url,
			            "async" : true,
			            "cache" : false,
			            "dataType" : datatype,
			            "success" : function(aData, aState, aResponse) {
				            Data.__remoteResponse(aVarname, datatype, aTaskChain, ajaxSettings, aData, aState, aResponse);
			            },
			            "error" : function(aResponse, aState, aError) {
				            Data.__remoteError(aElement, aTaskChain, ajaxSettings, aResponse, aState, aError);
			            }
			        };
			        if (option)
				        ajaxSettings = $.extend(ajaxSettings, option);

			        $.ajax(ajaxSettings);
		        },

		        "url-parameter" : function(anExpression, aDefault, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        let parameterName = aProcessor.resolver.resolveText(anExpression, aDataContext, anExpression);
			        let data = de.titus.core.Page.getInstance().getUrl().getParameter(parameterName);
			        if (typeof data !== 'undefined')
				        Data.__updateContext(aVarname, data, aTaskChain);
			        else if (typeof aDefault !== 'undefined')
				        Data.__updateContext(aVarname, aDefault, aTaskChain);

			        aTaskChain.nextTask();
		        }
		    },
		    CONTENTYPE : {
		        "xml" : de.titus.core.Converter.xmlToJson,
		        "json" : function(aData) {
			        return aData;
		        }
		    },

		    __remoteResponse : function(aVarname, aDatatype, aTaskChain, aRequest, aData, aState, aResponse) {
			    if (Data.LOGGER.isDebugEnabled())
				    Data.LOGGER.logDebug([ "add remote data \"", aData, "\ as var \"", aVarname, "\" as datatype \"", aDatatype, "\" -> (request: \"", aRequest, "\", response: \"", aResponse, "\")" ]);

			    Data.__updateContext(aVarname, Data.CONTENTYPE[aDatatype](aData), aTaskChain);
			    aTaskChain.nextTask();
		    },

		    __remoteError : function(aElement, aTaskChain, aRequest, aResponse, aState, aError) {
			    Data.LOGGER.logError([ "jstl-data error at element \"", aElement, "\" -> request: \"", aRequest, "\", response: \"", aResponse, "\", state: \"", aState, "\" error: \"", aError, "\"!" ]);
			    aTaskChain.finish();
		    }
		};

		de.titus.jstl.TaskRegistry.append("data", de.titus.jstl.Constants.PHASE.CONTEXT, "[jstl-data]", de.titus.jstl.functions.Data.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Include", function() {

		let Include = de.titus.jstl.functions.Include = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Include"),
		    CACHE : {},
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute run(" + aElement + ", " + aContext + ", " + aProcessor + ")");

			    let expression = aElement.attr("jstl-include");
			    if (expression.length > 0)
				    Include.__compute(expression, aElement, aContext, aProcessor, aTaskChain);
			    else
				    aTaskChain.nextTask();
		    },

		    __cacheCallback : function(aElement, aProcessor, aContext, aTaskChain, aTemplate) {
			    Include.__include(aElement, aTemplate, aProcessor, aContext, aTaskChain);
		    },

		    __executeCacheCallback : function(aUrl, aTemplate) {
			    let cache = Include.CACHE[aUrl.hashCode()];
			    cache.onload = false;
			    cache.template = $("<jstl/>").append(aTemplate);
			    for (let i = 0; i < cache.callback.length; i++)
				    cache.callback[i](cache.template);
		    },

		    __compute : function(anIncludeExpression, aElement, aContext, aProcessor, aTaskChain) {
			    aElement.addClass("jstl-include-loading");
			    let url = aProcessor.resolver.resolveText(anIncludeExpression, aContext);
			    url = Include.__buildUrl(url);
			    let disableCaching = url.indexOf("?") >= 0 || typeof aElement.attr("jstl-include-cache-disabled") !== 'undefined';
			    let cache = undefined;
			    if (!disableCaching)
				    cache = Include.CACHE[url.hashCode()];

			    if (cache) {
				    if (cache.onload)
					    cache.callback.push(function(aTemplate) {
						    Include.__cacheCallback(aElement, aProcessor, aContext, aTaskChain, aTemplate);
					    });
				    else
					    Include.__include(aElement, cache.template, aProcessor, aContext, aTaskChain);
			    } else {
				    cache = Include.CACHE[url.hashCode()] = {
				        onload : true,
				        callback : [ function(aTemplate) {
					        Include.__cacheCallback(aElement, aProcessor, aContext, aTaskChain, aTemplate);
				        } ]
				    };
				    let ajaxSettings = $.extend({
				        'url' : url,
				        'async' : true,
				        'cache' : (typeof aElement.attr("jstl-include-ajax-cache-disabled") === 'undefined'),
				        "dataType" : "html"
				    }, Include.__options(aElement, aContext, aProcessor));

				    ajaxSettings.success = function(aTemplate) {
					    Include.__executeCacheCallback(url, aTemplate);
				    };
				    ajaxSettings.error = function(aResponse, aState, aError) {
					    Include.__remoteError(aElement, aTaskChain, ajaxSettings, aResponse, aState, aError);
				    };

				    $.ajax(ajaxSettings);
			    }
		    },
		    URLPATTERN : new RegExp("^((https?://)|/).*", "i"),

		    __buildUrl : function(aUrl) {
			    let url = aUrl;
			    if (!Include.URLPATTERN.test(aUrl))
				    url = GlobalSettings.DEFAULT_INCLUDE_BASEPATH + aUrl;
			    url = de.titus.core.Page.getInstance().buildUrl(url);
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute __buildUrl(\"" + aUrl + "\") -> result: " + url);

			    return url;
		    },

		    __options : function(aElement, aContext, aProcessor) {
			    let options = aElement.attr("jstl-include-options");
			    if (options) {
				    options = aProcessor.resolver.resolveText(options, aContext);
				    options = aProcessor.resolver.resolveExpression(options, aContext);
				    return options;
			    }
		    },

		    __mode : function(aElement, aContext, aProcessor) {
			    let mode = aElement.attr("jstl-include-mode");
			    if (mode == undefined)
				    return "replace";

			    mode = mode.toLowerCase();
			    if (mode == "append" || mode == "replace" || mode == "prepend")
				    return mode;

			    return "replace";
		    },

		    __include : function(aElement, aTemplate, aProcessor, aContext, aTaskChain) {
				if (Include.LOGGER.isDebugEnabled())
					Include.LOGGER.logDebug("execute __include()");
				let template = aTemplate.clone();
				let includeMode = Include.__mode(aElement, aContext, aProcessor);

				if (includeMode == "replace") {
					aElement.empty();
					aElement.append(template.contents());
					aElement.removeClass("jstl-include-loading");
					aTaskChain.nextTask();
				} else if (includeMode == "append") {
					let wrapper = $("<div></div>");
					wrapper.append(template);
					aProcessor.compute(wrapper, aContext, (function(aElement, aTemplate, aTaskChain) {
						aElement.append(aTemplate.contents());
						aElement.removeClass("jstl-include-loading");
						aTaskChain.finish();
					}).bind({}, aElement, wrapper, aTaskChain));
				} else if (includeMode == "prepend"){
					let wrapper = $("<div></div>");
					wrapper.append(template);
					aProcessor.compute(wrapper, aContext, (function(aElement, aTemplate, aTaskChain) {
						aElement.prepend(template.contents());
						aElement.removeClass("jstl-include-loading");
						aTaskChain.finish();
					}).bind({}, aElement, wrapper, aTaskChain));					
				}				
			},

		    __remoteError : function(aElement, aTaskChain, aRequest, aResponse, aState, aError) {
			    Include.LOGGER.logError([ "jstl-include error at element \"", aElement, "\" -> request: \"", aRequest, "\", response: \"", aResponse, "\", state: \"", aState, "\" error: \"", aError, "\"!" ]);
			    aTaskChain.finish();
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
				    var value = Databind.__value(aElement, aDataContext, aProcessor);
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
				Processor.LOGGER.logDebug([ "execute compute(\"", aElement, "\", \"", aContext, "\")" ]);
			if (!aElement) {
				this.element.removeClass("jstl-ready");
				this.element.addClass("jstl-running");
				this.element.trigger(de.titus.jstl.Constants.EVENTS.onStart, [ aContext, this ]);
				this.__computeElement(this.element, this.context, true, this.callback);
			} else
				this.__computeElement(aElement, aContext, false, aCallback);
		};

		Processor.prototype.__computeElement = function(aElement, aContext, isRoot, aCallback) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug(["__computeElement() -> root: ", isRoot, "\""]);

			let self = this;
			let taskChain = new de.titus.jstl.TaskChain(aElement, aContext, this, isRoot, function(aElement, aContext){ self.__computeFinished(isRoot, aCallback, aElement, aContext);});
			taskChain.nextTask();
		};

		Processor.prototype.__computeFinished = function(isRoot, aCallback, aElement, aContext) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("__computeFinished() -> is root: " + isRoot);

			if (typeof aCallback === "function")
				aCallback(aElement, aContext, this, isRoot);

			var tagName = aElement.tagName();
			if ((tagName == "x-jstl" || tagName == "jstl") && aElement.contents().length > 0)
				aElement.replaceWith(aElement.contents());

			if (isRoot) {
				this.context = aContext;
				this.onReady();
			}
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
				let self = this;
				setTimeout(function() {
					self.element.removeClass("jstl-running");
					self.element.addClass("jstl-ready");
					self.element.trigger(de.titus.jstl.Constants.EVENTS.onReady, [ self ]);
				}, GlobalSettings.DEFAULT_TIMEOUT_VALUE * 10);
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
				if (!processor) {
					var data = aData || {};
					processor = new de.titus.jstl.Processor(this, $.extend(true, {}, data.data), data.callback || data.success);
					// processor = new de.titus.jstl.Processor(this, data.data,
					// data.callback || data.success);
					this.data("de.titus.jstl.Processor", processor);
				} else if (aData) {
					var data = aData || {};
					if (data.data)
						// processor.context = data.data;
						processor.context = $.extend(true, {}, data.data);
					if (typeof data.callback === 'function')
						processor.callback = data.callback
				}
				processor.compute();
				return processor;
			}
		};

		$.fn.jstlAsync = function(aData) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				var result = [];
				this.each(function() {
					var value = $(this).jstlAsync(aData);
					if (value)
						result.push(value);
				});
				return result;
			} else {
				var self = this;
				setTimeout(function() {
					self.jstl(aData);
				}, 1);
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
			fieldtypes : {}
		};
	});	
})();(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Constants", function() {
		de.titus.form.Constants.TYPES = {
		    PAGE : "page",
		    SUMMARY_PAGE : "summary-page",
		    SUBMITTED_PAGE : "submitted-page"
		};

		de.titus.form.Constants.EVENTS = {
		    INITIALIZED : "form-initialized",
		    SUCCESSED : "form-successed",
		    FAILED : "form-failed",
		    STATE_CHANGED : "form-state-changed",

		    ACTION_RESET : "form-action-reset",
		    ACTION_SUBMIT : "form-action-submit",
		    ACTION_PAGE_BACK : "form-action-page-back",
		    ACTION_PAGE_NEXT : "form-action-page-next",
		    ACTION_SUMMARY : "form-action-page-summary",
		    ACTION_LIST_FIELD_ADD : "form-action-list-field-add",
		    ACTION_LIST_FIELD_REMOVE : "form-action-list-field-remove",

		    PAGE_INITIALIZED : "form-page-initialized",
		    PAGE_CHANGED : "form-page-changed",
		    PAGE_SHOW : "form-page-show",
		    PAGE_HIDE : "form-page-hide",
		    PAGE_SUMMARY : "form-page-summary",
		    PAGE_SUBMITTED : "form-page-submitted",

		    FIELD_VALIDATED : "form-field-validated",
		    FIELD_SHOW : "form-field-show",
		    FIELD_HIDE : "form-field-hide",
		    FIELD_SUMMARY : "form-field-SUMMARY",
		    FIELD_VALUE_CHANGED : "form-field-value-changed",

		    VALIDATION_STATE_CHANGED : "form-validation-state-changed",
		    VALIDATION_VALID : "form-validation-valid",
		    VALIDATION_INVALID : "form-validation-invalid",

		    CONDITION_STATE_CHANGED : "form-condition-state-changed",
		    CONDITION_MET : "form-condition-met",
		    CONDITION_NOT_MET : "form-condition-not-met",

		    BUTTON_INACTIVE : "form-button-inactive",
		    BUTTON_ACTIVE : "form-button-active",
		};

		de.titus.form.Constants.STATE = {
		    INPUT : "form-state-input",
		    SUBMITTED : "form-state-submitted",
		};

		de.titus.form.Constants.ATTRIBUTE = {
		    VALIDATION : "-validation",
		    VALIDATION_FAIL_ACTION : "-validation-fail-action",
		    CONDITION : "-condition",
		    MESSAGE : "-message"
		};

		de.titus.form.Constants.SPECIALSTEPS = {
		    START : "form-step-start",
		    SUMMARY : "form-step-summary",
		    SUBMITTED : "form-step-submitted"
		};

		de.titus.form.Constants.STRUCTURELEMENTS = {
		    FORM : {
			    selector : "[data-form]"
		    },
		    PAGE : {
			    selector : "[data-form-page]"
		    },
		    SINGLEFIELD : {
			    selector : "[data-form-field]"
		    },
		    CONTAINERFIELD : {
			    selector : "[data-form-container-field]"
		    },
		    LISTFIELD : {
			    selector : "[data-form-list-field]"
		    },
		};

	});
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Registry", function() {
		var Registry = de.titus.form.Registry = {
			LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Registry"),
			FIELDCONTROLLER : {},
			registFieldController : function(aTypename, aFunction) {
				if(Registry.LOGGER.isDebugEnabled())
					Registry.LOGGER.logDebug("registFieldController (\"" + aTypename + "\")");
				
				Registry.FIELDCONTROLLER[aTypename] = aFunction;
			},
			getFieldController : function(aTypename, aElement){
				if(Registry.LOGGER.isDebugEnabled())
					Registry.LOGGER.logDebug("getFieldController (\"" + aTypename + "\")");
				
				var initFunction = Registry.FIELDCONTROLLER[aTypename];	
				if(initFunction)
					return initFunction(aElement);
				else
					return Registry.FIELDCONTROLLER["default"](aElement);
			}
		};
	});
})();
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.utils.EventUtils", function() {
		var EventUtils = de.titus.form.utils.EventUtils = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.utils.EventUtils"),
		    triggerEvent : function(aElement, aEvent, aData) {
			    if (EventUtils.LOGGER.isDebugEnabled())
				    EventUtils.LOGGER.logDebug("triggerEvent(\"" + aEvent + "\")");

			    EventUtils.__checkOfUndefined(aEvent);

			    setTimeout((function(aEvent, aData) {
				    if (EventUtils.LOGGER.isDebugEnabled())
					    EventUtils.LOGGER.logDebug([ "fire event event \"", aEvent, "\"\non ", this, "\nwith data \"" + aData + "\"!" ]);
				    this.trigger(aEvent, aData);
			    }).bind(aElement, aEvent, aData), 1);
		    },
		    handleEvent : function(aElement, aEvent, aCallback, aSelector) {
			    // TODO REFECTORING TO ONE SETTINGS PARAMETER OBJECT

			    if (EventUtils.LOGGER.isDebugEnabled())
				    EventUtils.LOGGER.logDebug([ "handleEvent \"", aEvent, "\"\nat ", aElement, "\nwith selector ", aSelector ]);

			    EventUtils.__checkOfUndefined(aEvent);

			    if (Array.isArray(aEvent))
				    aElement.on(aEvent.join(" "), aSelector, aCallback);
			    else
				    aElement.on(aEvent, aSelector, aCallback);
		    },
		    __checkOfUndefined : function(aValue) {
			    if (Array.isArray(aValue))
				    for (var i = 0; i < aValue.length; i++)
					    if (aValue[i] === undefined)
						    throw new Error("Error: undefined value at array index \"" + i + "\"");
					    else if (aValue === undefined)
						    throw new Error("Error: undefined value");
		    }

		};
	});

})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.utils.FormularUtils", function() {
		var FormularUtils = de.titus.form.utils.FormularUtils = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.utils.FormularUtils"),

		    getFormularElement : function(aElement) {
			    if (FormularUtils.LOGGER.isDebugEnabled())
				    FormularUtils.LOGGER.logDebug("getFormularElement()");

			    if (aElement.is("[data-form]"))
				    return aElement;
			    else
				    return aElement.parents("[data-form]").first();
		    },
		    getFormular : function(aElement) {
			    if (FormularUtils.LOGGER.isDebugEnabled())
				    FormularUtils.LOGGER.logDebug("getFormular()");

			    var formularElement = FormularUtils.getFormularElement(aElement);
			    if (formularElement)
				    return formularElement.Formular();
		    },

		    getPage : function(aElement) {
			    if (FormularUtils.LOGGER.isDebugEnabled())
				    FormularUtils.LOGGER.logDebug("getPage()");
			    
			    if (aElement.is("[data-form]"))
			    	return undefined;
			    else if (aElement.is("[data-form-page]"))
				    return aElement.formular_Page();
			    else {
				    var parent = aElement.parents("[data-form-page]").first();
				    if (parent.length == 1)
					    return parent.formular_Page();
			    }
		    },
		    getField : function(aElement) {
			    if (FormularUtils.LOGGER.isDebugEnabled())
				    FormularUtils.LOGGER.logDebug("getField()");
			    if (aElement.is("[data-form]"))
			    	return undefined;
			    else if (aElement.is("[data-form-field]"))
				    return aElement.formular_Field();
			    else {
				    var parent = aElement.parents("[data-form-field]").first();
				    if (parent.length == 1)
					    return parent.formular_Field();
			    }
		    },

		    isFieldsValid : function(theFields, force) {
			    for (var i = 0; i < theFields.length; i++) {
				    var field = theFields[i];
				    var valid = force ? field.doValidate(force) : field.data.valid;
				    if (!valid)
					    return false;
			    }

			    return true;
		    },
		    
		    toBaseModel : function(theFields, aFilter, aContainer) {
			    var result = aContainer || {};
			    for (var i = 0; i < theFields.length; i++) {
				    var data = theFields[i].getData(aFilter);
				    if (Array.isArray(data))
					    FormularUtils.toBaseModel(data, result);
				    else if (data && data.value)
					    result[data.name] = data;
			    }
			    return result;
		    }
		};
	});

})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.utils.JQueryFunctions", function() {

		var CONSTANTS = de.titus.form.utils.JQueryFunctions = {};
		CONSTANTS.ASSOCIATEDELEMENTSELECTOR = (function(ELEMENTS) {
			var selectors = [];
			for ( var name in ELEMENTS)
				if (ELEMENTS[name].selector)
					selectors.push(ELEMENTS[name].selector);

			return selectors.join(", ");
		}(de.titus.form.Constants.STRUCTURELEMENTS));

		$.fn.formular_utils_RemoveAddClass = function(aRemoveClass, anAddClass) {
			if (this.length === 0)
				return;
			else if (this.length > 1) {
				this.each(function() {
					$(this).formular_utils_RemoveAddClass(aRemoveClass, anAddClass);
				});
			} else {
				this.removeClass(aRemoveClass);
				this.addClass(anAddClass);
			}
			return this;
		};

		$.fn.formular_utils_SetInitializing = function() {
			return this.formular_utils_RemoveAddClass("initialized", "initializing");
		};

		$.fn.formular_utils_SetInitialized = function() {
			return this.formular_utils_RemoveAddClass("initializing", "initialized");
		};

		$.fn.formular_utils_SetActive = function() {
			return this.formular_utils_RemoveAddClass("inactive", "active");
		};

		$.fn.formular_utils_SetInactive = function() {
			return this.formular_utils_RemoveAddClass("active", "inactive");
		};

		$.fn.formular_utils_SetValid = function() {
			return this.formular_utils_RemoveAddClass("invalid", "valid");
		};

		$.fn.formular_utils_SetInvalid = function() {
			return this.formular_utils_RemoveAddClass("valid", "invalid");
		};

		$.fn.formular_field_utils_getAssociatedStructurElement = function() {
			if (this.length == 1) {
				if (this.is(CONSTANTS.ASSOCIATEDELEMENTSELECTOR))
					return this;
				else
					return this.parent().formular_field_utils_getAssociatedStructurElement();
			}
		};

	});
})($);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Condition", function() {
		var Condition = de.titus.form.Condition = function(aElement) {
			if (Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    formular : undefined,
			    dataContext : undefined,
			    expression : (aElement.attr("data-form-condition") || "").trim(),
			    expressionResolver : new de.titus.core.ExpressionResolver(),
			    timeoutId : undefined
			};

			setTimeout(Condition.prototype.__init.bind(this), 1);
		};

		Condition.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Condition");

		Condition.prototype.__init = function() {
			if (Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("__init()");

			if (this.data.expression !== "") {
				this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);
				this.data.dataContext = this.data.element.formular_findDataContext();
				de.titus.form.utils.EventUtils.handleEvent(this.data.formular.data.element, [ EVENTTYPES.CONDITION_STATE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED, EVENTTYPES.FIELD_VALIDATED ], Condition.prototype.__doCondition.bind(this));
			}

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.INITIALIZED ], Condition.prototype.__doCheck.bind(this));
		};

		Condition.prototype.__doCondition = function(aEvent) {
			if (this.data.timeoutId)
				clearTimeout(this.data.timeoutId);

			this.data.timeoutId = setTimeout(Condition.prototype.__doCheck.bind(this, aEvent), 100);
		};

		Condition.prototype.__doCheck = function(aEvent) {
			if (Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug([ "__doCheck(\"", aEvent, "\") -> expression: \"", this.data.expression, "\", element: \"", this.data.element, "\", this: \"", this, "\"" ]);

			aEvent.preventDefault();
			if (aEvent.type != EVENTTYPES.INITIALIZED && aEvent.type != EVENTTYPES.FIELD_VALUE_CHANGED)
				aEvent.stopPropagation();

			if (aEvent.currentTarget == this.data.element && (aEvent.type == EVENTTYPES.CONDITION_STATE_CHANGED || aEvent.Type == EVENTTYPES.VALIDATION_STATE_CHANGED || aEvebt.type == EVENTTYPES.FIELD_VALIDATED))
				; // IGNORE CONDTION_STATE_CHANGE AND VALIDATION_STATE_CHANGED
			// ON SELF
			else if (this.data.expression === "")
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.CONDITION_MET);
			else {
				var data = this.data.dataContext.getData({
				    condition : true,
				    validate : false
				});

				data = de.titus.form.data.utils.DataUtils.toModel(data, "object");
				if (Condition.LOGGER.isDebugEnabled())
					Condition.LOGGER.logDebug([ "__doCheck() -> data: \"", data, "\", expression: \"", this.data.expression, "\"" ]);

				var result = this.data.expressionResolver.resolveExpression(this.data.expression, data, false);
				if (result)
					de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.CONDITION_MET);
				else
					de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.CONDITION_NOT_MET);
			}
		};

		de.titus.core.jquery.Components.asComponent("formular_Condition", de.titus.form.Condition);
	});
})($, de.titus.form.Constants.EVENTS);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DataContext", function() {
		var DataContext = de.titus.form.DataContext = function(aElement, aOption) {
			this.data = {
			    element : aElement,
			    data : aOption.data,
			    scope : aOption.scope,
			    parentDataContext : undefined,
			    init : false
			};
		};

		DataContext.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataContext");

		DataContext.prototype.__getParentDataContext = function() {
			if (!this.data.init) {
				this.data.parentDataContext = this.data.element.formular_findParentDataContext();
				this.data.init = true;
			}

			return this.data.parentDataContext;
		};

		DataContext.prototype.getData = function(aFilter) {
			if (DataContext.LOGGER.isDebugEnabled())
				DataContext.LOGGER.logDebug("getData (\"", aFilter, "\")");

			var dataContext = this.__getParentDataContext() ? this.__getParentDataContext().getData(aFilter) : {};
			var data = typeof this.data.data === "function" ? this.data.data(aFilter) : this.data.data;
			if (data) {
				if (this.data.scope)
					dataContext[this.data.scope] = data;
				else
					$.extend(dataContext, data);
			}

			if (DataContext.LOGGER.isDebugEnabled())
				DataContext.LOGGER.logDebug([ "getData() -> nativ data: ", dataContext ]);

			return dataContext;
		};

		$.fn.formular_DataContext = function(aOption) {
			if (this.length == 1) {
				var dataContext = this.data("de.titus.form.DataContext");
				if (!dataContext || aOption) {
					dataContext = new de.titus.form.DataContext(this, aOption);
					this.data("de.titus.form.DataContext", dataContext);
					this.attr("data-form-data-context", "");
				}

				return dataContext;
			}
		};

		$.fn.formular_findDataContext = function() {
			if (this.length == 1) {
				if (this.attr("data-form-data-context") !== undefined || this.attr("data-form") !== undefined)
					return this.formular_DataContext();
				else
					return this.parent().formular_findDataContext();
			}
		};

		$.fn.formular_findParentDataContext = function() {
			if (this.length == 1)
				return this.parent().formular_findDataContext();
		};
	});

})($);
(function($, ELEMENTS) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Field", function() {
		var Field = de.titus.form.Field = {
			FIELDSELECTORS : [ ELEMENTS.SINGLEFIELD.selector, ELEMENTS.CONTAINERFIELD.selector, ELEMENTS.LISTFIELD.selector ].join(", ")
		};

		$.fn.formular_field_utils_getSubFields = function() {
			var result = [];
			this.children().each(function() {
				var element = $(this);
				if (element.is(Field.FIELDSELECTORS))
					result.push(element.formular_Field());
				else {
					var subFields = element.formular_field_utils_getSubFields();
					if (subFields)
						Array.prototype.push.apply(result, subFields);
				}
			});

			return result;
		};

		$.fn.formular_field_utils_getAssociatedField = function() {
			var field = this.formular_Field();
			if (field)
				return field;

			return this.parent().formular_field_utils_getAssociatedField();
		};

		$.fn.formular_Field = function() {
			if (this.length === 0)
				return;
			else if (this.length > 1) {
				var result = [];
				this.each(function() {
					var field = $(this).formular_Field();
					if (field)
						result.push(field);
				});

				return result;
			} else {
				var field = this.data("de.titus.form.Field");
				if (!field) {
					if (this.is("[data-form-field]"))
						field = new de.titus.form.fields.SingleField(this);
					else if (this.is("[data-form-container-field]"))
						field = new de.titus.form.fields.ContainerField(this);
					else if (this.is("[data-form-list-field]"))
						field = new de.titus.form.fields.ListField(this);

					if (field)
						this.data("de.titus.form.Field", field);
				}

				return field;
			}
		};
	});
})($, de.titus.form.Constants.STRUCTURELEMENTS);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Message", function() {
		var Message = de.titus.form.Message = function(aElement) {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    dataContext : undefined,
			    expression : (aElement.attr("data-form-message") || "").trim(),
			    expressionResolver : new de.titus.core.ExpressionResolver(),
			    timeoutId : undefined
			};
			this.data.element.formular_utils_SetInactive();
			setTimeout(Message.prototype.__init.bind(this), 1);
			// this.__init();
		};

		Message.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Message");

		Message.prototype.__init = function() {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("__init()");

			if (this.data.expression !== "") {
				var element = this.data.element.formular_field_utils_getAssociatedStructurElement();
				this.data.dataContext = this.data.element.formular_findDataContext();
				de.titus.form.utils.EventUtils.handleEvent(element, [ EVENTTYPES.INITIALIZED, EVENTTYPES.FIELD_VALUE_CHANGED ], Message.prototype.__doMessage.bind(this));
			}
		};

		Message.prototype.__doMessage = function(aEvent) {
			if (this.data.timeoutId)
				clearTimeout(this.data.timeoutId);

			this.data.timeoutId = setTimeout(Message.prototype.__doCheck.bind(this, aEvent), 300);
		};

		Message.prototype.__doCheck = function(aEvent) {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug([ "__doCheck(\"", aEvent, "\")" ]);

			var data = this.data.dataContext.getData({
			    condition : false,
			    validate : true
			});

			data = de.titus.form.data.utils.DataUtils.toModel(data, "object");
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug([ "__doCheck() -> data context: \"", data, "\", expression: \"", this.data.expression, "\"" ]);

			var result = this.data.expressionResolver.resolveExpression(this.data.expression, data, false);
			if (result)
				this.data.element.formular_utils_SetActive();
			else
				this.data.element.formular_utils_SetInactive();
		};

		de.titus.core.jquery.Components.asComponent("formular_Message", de.titus.form.Message);

		$.fn.formular_initMessages = function() {
			return this.find("[data-form-message]").formular_Message();
		};
	});
})($, de.titus.form.Constants.EVENTS);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Validation", function() {
		var Validation = de.titus.form.Validation = function(aElement) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("constructor");

			var validations = aElement.find("[data-form-validation]").formular_ValidationExpression();
			this.data = {
			    element : aElement,
			    formular : undefined,
			    dataContext : undefined,
			    field : undefined,
			    expressionResolver : new de.titus.core.ExpressionResolver(),
			    validations : Array.isArray(validations) ? validations : validations ? [ validations ] : undefined,
			    timeoutId : undefined
			};

			setTimeout(Validation.prototype.__init.bind(this), 1);
		};

		Validation.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Validation");

		Validation.prototype.__init = function() {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("__init()");

			this.data.field = this.data.element.formular_field_utils_getAssociatedField();
			this.data.dataContext = this.data.element.formular_findDataContext();

			if (this.data.field.data.required || (this.data.validations && this.data.validations.length > 0)) {
				var formularElement = de.titus.form.utils.FormularUtils.getFormularElement(this.data.element);
				de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.INITIALIZED, EVENTTYPES.FIELD_VALUE_CHANGED ], Validation.prototype.__doLazyValidate.bind(this));
				de.titus.form.utils.EventUtils.handleEvent(formularElement, [ EVENTTYPES.CONDITION_STATE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED ], Validation.prototype.__doLazyValidate.bind(this));
			} else {
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_VALID);
				de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.INITIALIZED, EVENTTYPES.FIELD_VALUE_CHANGED ], (function() {
					de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_VALID);
				}).bind(this));
			}
		};

		Validation.prototype.__doLazyValidate = function(aEvent) {
			if (this.data.timeoutId)
				clearTimeout(this.data.timeoutId);

			this.data.timeoutId = setTimeout(Validation.prototype.__handleEvent.bind(this, aEvent), 300);
		};

		Validation.prototype.__handleEvent = function(aEvent) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug([ "__handleEvent(\"", aEvent, "\")" ]);

			aEvent.preventDefault();

			if (aEvent.type != EVENTTYPES.INITIALIZED && aEvent.type != EVENTTYPES.FIELD_VALUE_CHANGED)
				aEvent.stopPropagation();

			if (aEvent.currentTarget == this.data.element && aEvent.Type == EVENTTYPES.VALIDATION_STATE_CHANGED)
				return;

			if (this.doValidate())
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_VALID);
			else
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_INVALID);
		};

		Validation.prototype.doValidate = function() {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("doValidate()");

			this.data.element.find("[data-form-validation]").formular_utils_SetInactive();

			var fieldData = this.data.field.getData({
			    condition : false,
			    validate : true
			});
			var hasValue = !this.__valueEmpty(fieldData);

			if (hasValue)
				this.data.element.removeClass("no-value");
			else
				this.data.element.addClass("no-value");

			var condition = this.data.field.data.condition;
			var required = this.data.field.data.required;
			var requiredOnActive = this.data.field.data.requiredOnActive;
			var hasValidations = this.data.validations && this.data.validations.length > 0;

			if (!condition && (requiredOnActive || !required))
				return true;
			else if (required && !hasValue)
				return false;
			else if (hasValue && hasValidations)
				return this.__checkValidations(fieldData);
			else
				return true;
		};

		Validation.prototype.__checkValidations = function(aFieldData) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug([ "__checkValidation(\"", aFieldData, "\")" ]);

			var data = this.data.dataContext.getData({
			    condition : false,
			    validate : true
			});
			data.$value = aFieldData ? aFieldData.value : undefined;

			data = de.titus.form.data.utils.DataUtils.toModel(data, "object");
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug([ "__checkValidation() -> dataContext: \"", data, "\"" ]);

			for (var i = 0; i < this.data.validations.length; i++) {
				var validation = this.data.validations[i];
				if (!validation.doValidate(data)) {
					validation.data.element.formular_utils_SetActive();
					return false;
				}
			}
			return true;
		};

		Validation.prototype.__valueEmpty = function(aFieldData) {
			return aFieldData === undefined || aFieldData.value === undefined || (Array.isArray(aFieldData.value) && aFieldData.value.length === 0) || (typeof aFieldData.value === "string" && aFieldData.value.trim().length === 0);
		};

		de.titus.core.jquery.Components.asComponent("formular_Validation", de.titus.form.Validation);
	});
})($, de.titus.form.Constants.EVENTS);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.ValidationExpression", function() {
		var ValidationExpression = de.titus.form.ValidationExpression = function(aElement) {
			if (ValidationExpression.LOGGER.isDebugEnabled())
				ValidationExpression.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    expression : (aElement.attr("data-form-validation") || "").trim(),
			    expressionResolver : new de.titus.core.ExpressionResolver()
			};
		};

		ValidationExpression.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.ValidationExpression");

		ValidationExpression.prototype.doValidate = function(aContext) {
			if (ValidationExpression.LOGGER.isDebugEnabled())
				ValidationExpression.LOGGER.logDebug([ "doValidate() -> expression: \"", this.data.expression, "\"" ]);
			if (this.data.expression !== "")
				return this.data.expressionResolver.resolveExpression(this.data.expression, aContext, false);

			return true;
		};

		de.titus.core.jquery.Components.asComponent("formular_ValidationExpression", de.titus.form.ValidationExpression);
	});
})();
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Formular", function() {
		var Formular = de.titus.form.Formular = function(aElement) {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    name : aElement.attr("data-form"),
			    state : de.titus.form.Constants.STATE.INPUT,
			    expressionResolver : new de.titus.core.ExpressionResolver()
			};

			this.data.element.formular_DataContext({
				data : Formular.prototype.getData.bind(this)
			});

			this.data.element.formular_utils_SetInitializing();
			setTimeout(Formular.prototype.__init.bind(this), 1);
		};

		Formular.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Formular");

		Formular.prototype.__init = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("init()");

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.ACTION_SUBMIT ], Formular.prototype.submit.bind(this));

			this.data.element.formular_StepPanel();
			this.data.element.formular_FormularControls();
			this.data.element.formular_PageController();
			this.data.element.formular_initMessages();

			setTimeout((function() {
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.INITIALIZED);
				this.data.element.formular_utils_SetInitialized();
			}).bind(this), 100);
		};

		Formular.prototype.getData = function(aFilter, aModel) {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug([ "getData (\"", aFilter, "\", \"", aModel, "\")" ]);

			var result = {};
			var pages = this.data.element.formular_PageController().data.pages;
			for (var i = 0; i < pages.length; i++) {
				var data = pages[i].getData(aFilter);
				if (data)
					result = $.extend(result, data);
			}

			if (aModel)
				result = de.titus.form.data.utils.DataUtils.toModel(result, aModel);

			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug([ "getData (\"", aFilter, "\", \"", aModel, "\") -> result: \"", result, "\"" ]);

			return result;
		};

		Formular.prototype.submit = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("submit ()");

			try {
				console.log("object model: ");
				console.log(this.getData("object"));
				console.log("key-value model: ");
				console.log(this.getData("key-value"));
				console.log("list-model model: ");
				console.log(this.getData("list-model"));
				console.log("data-model model: ");
				console.log(this.getData("data-model"));

				this.data.state = de.titus.form.Constants.STATE.SUBMITTED;

				let hasError = false;
				let action = (this.data.element.attr("data-form-action") || "").trim();
				if (action.length > 0) {
					let result = this.data.expressionResolver.resolveExpression(action, {
						form : this
					});
					if (typeof result === "function")
						result = result(this);
					
					if(typeof result === "boolean")
						hasError = !result;
				}

				if (!hasError) {
					de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.STATE_CHANGED);
					de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.SUCCESSED);
				} else
					de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.FAILED);
			} catch (e) {
				Formular.LOGGER.logError(e);
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.FAILED);
			}
		};
	});

	de.titus.core.jquery.Components.asComponent("Formular", de.titus.form.Formular);

	$(document).ready(function() {
		$('[data-form]').Formular();
	});
})($, de.titus.form.Constants.EVENTS);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.FormularControls", function() {
		var FormularControls = de.titus.form.FormularControls = function(aElement) {
			if (FormularControls.LOGGER.isDebugEnabled())
				FormularControls.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement
			};

			this.init();
		};

		FormularControls.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.FormularControls");

		FormularControls.prototype.init = function() {
			if (FormularControls.LOGGER.isDebugEnabled())
				FormularControls.LOGGER.logDebug("init()");

			this.data.element.find("[data-form-button-reset]").formular_buttons_ResetButton();
			this.data.element.find("[data-form-button-back]").formular_buttons_BackButton();
			this.data.element.find("[data-form-button-next]").formular_buttons_NextButton();
			this.data.element.find("[data-form-button-summary]").formular_buttons_SummaryButton();
			this.data.element.find("[data-form-button-submit]").formular_buttons_SubmitButton();			
		};

		de.titus.core.jquery.Components.asComponent("formular_FormularControls", de.titus.form.FormularControls);
	});
})($,de.titus.form.Constants.EVENTS);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Page", function() {
		var Page = de.titus.form.Page = function(aElement) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formular : undefined,
			    dataContext : undefined,
			    type : de.titus.form.Constants.TYPES.PAGE,
			    name : aElement.attr("data-form-page"),
			    step : (aElement.attr("data-form-step") || "").trim(),
			    active : false,
			    condition : undefined,
			    valid : undefined,
			    fields : []
			};

			this.data.element.formular_DataContext({
			    data : Page.prototype.getData.bind(this),
			    scope : "$page"
			});
			setTimeout(Page.prototype.__init.bind(this), 1);
		};

		Page.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Page");

		Page.prototype.__init = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("init()");

			this.data.formular = de.titus.form.utils.FormularUtils.getFormular(this.data.element);
			this.data.dataContext = this.data.element.formular_findParentDataContext();

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.CONDITION_MET, EVENTTYPES.CONDITION_NOT_MET ], Page.prototype.__changeConditionState.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.CONDITION_STATE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED ], Page.prototype.__changeValidationState.bind(this));

			this.data.fields = this.data.element.formular_field_utils_getSubFields();
			this.data.element.formular_Condition();

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.PAGE_INITIALIZED);
		};

		Page.prototype.__changeConditionState = function(aEvent) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug([ "__changeConditionState (\"", aEvent, "\") -> page: \"", this, "\"" ]);

			aEvent.preventDefault();
			aEvent.stopPropagation();

			var condition = false;
			if (aEvent.type == EVENTTYPES.CONDITION_MET)
				condition = true;

			if (this.data.condition != condition) {
				this.data.condition = condition;
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.CONDITION_STATE_CHANGED);
			}
		};

		Page.prototype.__changeValidationState = function(aEvent) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug([ "__changeConditionState (\"", aEvent, "\") -> page: \"", this, "\"" ]);

			aEvent.preventDefault();
			var valid = this.doValidate();
			if (this.data.valid != valid) {
				this.data.valid = valid;

				if (this.data.valid)
					this.data.element.formular_utils_SetValid();
				else
					this.data.element.formular_utils_SetInvalid();

				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_STATE_CHANGED);
			}
		};

		Page.prototype.doValidate = function(force) {
			return de.titus.form.utils.FormularUtils.isFieldsValid(this.data.fields, force);
		};

		Page.prototype.hide = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("hide ()");
			this.data.active = false;
			this.data.element.formular_utils_SetInactive();

		};

		Page.prototype.show = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("show ()");

			if (this.data.condition) {
				this.data.element.formular_utils_SetActive();
				for (var i = 0; i < this.data.fields.length; i++)
					this.data.fields[i].show();

				this.data.active = true;
			}
		};

		Page.prototype.summary = function() {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("summary ()");

			if (this.data.condition) {
				for (var i = 0; i < this.data.fields.length; i++)
					this.data.fields[i].summary();

				this.data.element.formular_utils_SetActive();
			}
		};

		Page.prototype.getData = function(aFilter) {
			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug([ "getData(\"", aFilter, "\") -> page: \"", this, "\"" ]);

			var result;
			if (aFilter.example)
				result = de.titus.form.utils.FormularUtils.toBaseModel(this.data.fields, aFilter);
			else if (this.data.active || (this.data.condition && this.data.valid))
				result = de.titus.form.utils.FormularUtils.toBaseModel(this.data.fields, aFilter);
			else
				return;

			if (Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug([ "getData() -> result: \"", result, "\"" ]);

			if (this.data.name)
				return {
				    name : this.data.name,
				    type : "container-field",
				    $type : "container-field",
				    value : result
				};
			else
				return result;
		};

		de.titus.core.jquery.Components.asComponent("formular_Page", de.titus.form.Page);
	});
})($, de.titus.form.Constants.EVENTS);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.PageControlHandle", function() {
		var PageControlHandle = de.titus.form.PageControlHandle = function(aPage, aIndex, aStep, aPageController) {
			if (PageControlHandle.LOGGER.isDebugEnabled())
				PageControlHandle.LOGGER.logDebug("constructor");
			this.data = {
			    index : aIndex,
			    page : aPage,
			    step : aStep,
			    pageController : aPageController
			};
		};
		
		PageControlHandle.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.PageControlHandle");
		
		PageControlHandle.prototype.hide = function() {
			if (PageControlHandle.LOGGER.isDebugEnabled())
				PageControlHandle.LOGGER.logDebug("hide ()");
			if (this.data.page && this.data.page.hide)
				this.data.page.hide();
			
		};
		
		PageControlHandle.prototype.show = function() {
			if (PageControlHandle.LOGGER.isDebugEnabled())
				PageControlHandle.LOGGER.logDebug("show ()");
			if (this.data.page && this.data.page.show)
				this.data.page.show();
		};
	});
})($);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.PageController", function() {
		var PageController = de.titus.form.PageController = function(aElement) {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    pages : [],
			    pageHandles : [],
			    currentHandle : undefined
			};

			setTimeout(PageController.prototype.__init.bind(this), 1);
		};

		PageController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.PageController");

		PageController.prototype.__init = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("__init()");

			var formularElement = this.data.element;
			this.data.pages = this.data.element.find("[data-form-page]").formular_Page();
			if(typeof this.data.pages === 'undefined')
				this.data.pages = [];
			else if (!Array.isArray(this.data.pages))
				this.data.pages = [ this.data.pages ];

			this.data.pageHandles = this.__initPageHandles();

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, EVENTTYPES.ACTION_PAGE_BACK, PageController.prototype.toPrevPage.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.ACTION_PAGE_NEXT, EVENTTYPES.ACTION_SUMMARY, EVENTTYPES.ACTION_SUBMIT ], PageController.prototype.toNextPage.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, EVENTTYPES.CONDITION_STATE_CHANGED, PageController.prototype.__checkCurrentPage.bind(this));
		};

		PageController.prototype.__initPageHandles = function() {
			var handles = [];
			var index = 0;
			var lastStep = de.titus.form.Constants.SPECIALSTEPS.START;
			for (var i = 0; i < this.data.pages.length; i++) {
				var page = this.data.pages[i];
				if (page.data.step !== "")
					lastStep = page.data.step;
				else
					page.data.step = lastStep;

				page.hide();

				var handle = new de.titus.form.PageControlHandle(page, i, lastStep, this);

				handles.push(handle);
			}

			var summaryPage = new de.titus.form.page.utils.VirtualPage(this.data.element, {
			    pageController : this,
			    type : de.titus.form.Constants.TYPES.SUMMARY_PAGE,
			    step : de.titus.form.Constants.SPECIALSTEPS.SUMMARY,
			    event : EVENTTYPES.PAGE_SUMMARY
			});
			handles.push(new de.titus.form.PageControlHandle(summaryPage, handles.length, summaryPage.data.step, this));

			var submittedPage = new de.titus.form.page.utils.VirtualPage(this.data.element, {
			    pageController : this,
			    type : de.titus.form.Constants.TYPES.SUBMITTED_PAGE,
			    step : de.titus.form.Constants.SPECIALSTEPS.SUBMITTED,
			    event : EVENTTYPES.PAGE_SUBMITTED
			});
			handles.push(new de.titus.form.PageControlHandle(submittedPage, handles.length, submittedPage.data.step, this));

			return handles;
		};

		PageController.prototype.__checkCurrentPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("__checkCurrentPage()");
			if (!this.data.currentHandle && this.data.pageHandles[0].data.page.data.condition)
				this.__toPageHandle(this.data.pageHandles[0]);

		};

		PageController.prototype.isFirstPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("isFirstPage()");
			return this.data.currentHandle && this.data.currentHandle.data.index === 0;
		};

		PageController.prototype.getCurrentPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("getCurrentPage()");

			if (this.data.currentHandle)
				return this.data.currentHandle.data.page;
		};

		PageController.prototype.getNextPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("getNextPage()");

			return this.__getNextPageHandle().data.page;
		};

		PageController.prototype.hasNextPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("hasNextPage()");

			return this.__getNextPageHandle() !== undefined;
		};

		PageController.prototype.__getNextPageHandle = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("__getNextPageHandle()");

			if (!this.data.currentHandle)
				return;
			else if (!this.data.currentHandle.data.page.doValidate(true))
				return this.data.currentHandle;
			else {
				for (var i = this.data.currentHandle.data.index + 1; i < this.data.pageHandles.length; i++) {
					var handle = this.data.pageHandles[i];
					if (handle.data.page.data.condition)
						return handle;
				}
				return this.data.currentHandle;
			}
		};

		PageController.prototype.__getPrevPageHandle = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("__getPrevPageHandle()");

			if (!this.data.currentHandle)
				return this.data.pageHandles[0];
			else {
				for (var i = this.data.currentHandle.data.index - 1; 0 <= i; i--) {
					var handle = this.data.pageHandles[i];
					if (handle.data.page.data.condition)
						return handle;
				}
				return this.data.currentHandle;
			}
		};

		PageController.prototype.__toPageHandle = function(aPageHandle) {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("__toPage()");

			if (aPageHandle) {
				if (this.data.currentHandle) {
					this.data.element.removeClass("step-" + this.data.currentHandle.data.step);
					this.data.currentHandle.hide();
				}

				this.data.currentHandle = aPageHandle;
				this.data.element.addClass("step-" + this.data.currentHandle.data.step);
				this.data.currentHandle.show();

				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.PAGE_CHANGED);
			}
		};

		PageController.prototype.toPrevPage = function() {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("toPrevPage()");

			var pageHandle = this.__getPrevPageHandle();
			if (pageHandle)
				this.__toPageHandle(pageHandle);
		};

		PageController.prototype.toNextPage = function(execute) {
			if (PageController.LOGGER.isDebugEnabled())
				PageController.LOGGER.logDebug("toNextPage()");

			var pageHandle = this.__getNextPageHandle();
			if (pageHandle)
				this.__toPageHandle(pageHandle);
		};

		de.titus.core.jquery.Components.asComponent("formular_PageController", de.titus.form.PageController);
	});
})($, de.titus.form.Constants.EVENTS);
(function($, CONSTANTS) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.StepPanel", function() {
		var StepPanel = de.titus.form.StepPanel = function(aElement) {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    panelElement : aElement.find("[data-form-step-panel]"),
			    steps : [],
			    current : undefined
			};

			setTimeout(StepPanel.prototype.__init.bind(this), 1);
		};

		StepPanel.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.StepPanel");

		StepPanel.prototype.__init = function() {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("init()");

			var steps = [];
			var index = 0;
			this.data.panelElement.find("[data-form-step]").each(function() {
				var element = $(this);
				element.formular_utils_SetInactive();
				var step = {
				    index : index++,
				    id : element.attr("data-form-step").toLowerCase(),
				    element : element
				};
				steps.push(step);
			});

			this.data.steps = steps;

			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ CONSTANTS.EVENTS.STATE_CHANGED, CONSTANTS.EVENTS.PAGE_CHANGED ], StepPanel.prototype.update.bind(this));
		};

		StepPanel.prototype.update = function(aEvent) {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("update() -> " + aEvent.type);

			var formular = this.data.element.Formular();
			var pageController = this.data.element.formular_PageController();
			var state = formular.data.state;
			var stepId = CONSTANTS.SPECIALSTEPS.START;

			if (state == CONSTANTS.STATE.INPUT && pageController.getCurrentPage())
				stepId = pageController.getCurrentPage().data.step;
			else if (state == CONSTANTS.STATE.SUMMARY)
				stepId = CONSTANTS.SPECIALSTEPS.SUMMARY;
			else if (state == CONSTANTS.STATE.SUBMITTED)
				stepId = CONSTANTS.SPECIALSTEPS.SUBMITTED;

			this.setStep(stepId);
		};

		StepPanel.prototype.setStep = function(aId) {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("setStep(\"" + aId + "\")");
			var step = this.getStep(aId);
			if (step !== undefined) {
				if (this.data.current) {
					this.data.current.element.formular_utils_SetInactive();
					this.data.element.removeClass("step-" + this.data.current.id);
				}
				this.data.current = step;
				this.data.current.element.formular_utils_SetActive();
				this.data.element.addClass("step-" + aId);
			}
		};

		StepPanel.prototype.getStep = function(aId) {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("getStep(\"" + aId + "\")");
			if (!aId)
				return;

			var id = aId.toLowerCase();
			for (var i = 0; i < this.data.steps.length; i++) {
				var step = this.data.steps[i];
				if (step.id == id)
					return step;
			}
		};

		de.titus.core.jquery.Components.asComponent("formular_StepPanel", de.titus.form.StepPanel);
	});

})($, de.titus.form.Constants);
(function($, EVENTTYPES, aEventUtils) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.buttons.BackButton", function() {
		var BackButton = de.titus.form.buttons.BackButton = function(aElement) {
			if (BackButton.LOGGER.isDebugEnabled())
				BackButton.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formularElement : de.titus.form.utils.FormularUtils.getFormularElement(aElement)
			};

			setTimeout(BackButton.prototype.__init.bind(this), 1);
		};

		BackButton.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.buttons.BackButton");

		BackButton.prototype.__init = function() {
			if (BackButton.LOGGER.isDebugEnabled())
				BackButton.LOGGER.logDebug("__init()");

			aEventUtils.handleEvent(this.data.element, "click", BackButton.prototype.execute.bind(this));
			aEventUtils.handleEvent(this.data.formularElement, [ EVENTTYPES.PAGE_CHANGED ], BackButton.prototype.update.bind(this));
			this.data.element.formular_utils_SetInactive();
			aEventUtils.triggerEvent(this.data.element, EVENTTYPES.BUTTON_INACTIVE);
		};

		BackButton.prototype.execute = function(aEvent) {
			aEvent.preventDefault();
			aEvent.stopPropagation();
			aEventUtils.triggerEvent(this.data.element, EVENTTYPES.ACTION_PAGE_BACK);
		};

		BackButton.prototype.update = function(aEvent) {
			if (BackButton.LOGGER.isDebugEnabled())
				BackButton.LOGGER.logDebug("update() -> " + aEvent.type);

			var formular = this.data.formularElement.Formular();
			if (formular.data.state != de.titus.form.Constants.STATE.SUBMITTED) {
				var pageController = this.data.formularElement.formular_PageController();
				if (!pageController.isFirstPage()) {
					this.data.element.formular_utils_SetActive();
					aEventUtils.triggerEvent(this.data.element, EVENTTYPES.BUTTON_ACTIVE);
					return;
				}
			}

			this.data.element.formular_utils_SetInactive();
			aEventUtils.triggerEvent(this.data.element, EVENTTYPES.BUTTON_INACTIVE);
		};

		de.titus.core.jquery.Components.asComponent("formular_buttons_BackButton", de.titus.form.buttons.BackButton);
	});
})($, de.titus.form.Constants.EVENTS, de.titus.form.utils.EventUtils);
(function($, EVENTTYPES, aEventUtils) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.buttons.NextButton", function() {
		var NextButton = de.titus.form.buttons.NextButton = function(aElement) {
			if (NextButton.LOGGER.isDebugEnabled())
				NextButton.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formularElement : de.titus.form.utils.FormularUtils.getFormularElement(aElement)
			};

			setTimeout(NextButton.prototype.__init.bind(this), 1);
		};

		NextButton.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.buttons.NextButton");

		NextButton.prototype.__init = function() {
			if (NextButton.LOGGER.isDebugEnabled())
				NextButton.LOGGER.logDebug("__init()");

			aEventUtils.handleEvent(this.data.element, "click", NextButton.prototype.execute.bind(this));
			aEventUtils.handleEvent(this.data.formularElement, [ EVENTTYPES.PAGE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED ], NextButton.prototype.update.bind(this));
			this.data.element.formular_utils_SetInactive();
			aEventUtils.triggerEvent(this.data.element, EVENTTYPES.BUTTON_INACTIVE);
		};

		NextButton.prototype.execute = function(aEvent) {
			aEvent.preventDefault();
			aEvent.stopPropagation();
			aEventUtils.triggerEvent(this.data.element, EVENTTYPES.ACTION_PAGE_NEXT);
		};

		NextButton.prototype.update = function(aEvent) {
			if (NextButton.LOGGER.isDebugEnabled())
				NextButton.LOGGER.logDebug("update() -> " + aEvent.type);

			var pageController = this.data.formularElement.formular_PageController();
			var page = pageController.getCurrentPage();
			if (page && page.data.type == de.titus.form.Constants.TYPES.PAGE && page.data.condition && page.data.valid) {
				var nextPage = pageController.getNextPage();
				if (nextPage.data.type == de.titus.form.Constants.TYPES.PAGE) {
					this.data.element.formular_utils_SetActive();
					aEventUtils.triggerEvent(this.data.element, EVENTTYPES.BUTTON_ACTIVE);
					return;
				}
			}

			this.data.element.formular_utils_SetInactive();
			aEventUtils.triggerEvent(this.data.element, EVENTTYPES.BUTTON_INACTIVE);
		};

		de.titus.core.jquery.Components.asComponent("formular_buttons_NextButton", de.titus.form.buttons.NextButton);
	});
})($, de.titus.form.Constants.EVENTS, de.titus.form.utils.EventUtils);
(function($, EVENTTYPES, aEventUtils) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.buttons.ResetButton", function() {
		var ResetButton = de.titus.form.buttons.ResetButton = function(aElement) {
			if (ResetButton.LOGGER.isDebugEnabled())
				ResetButton.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formularElement : de.titus.form.utils.FormularUtils.getFormularElement(aElement)
			};

			setTimeout(ResetButton.prototype.__init.bind(this), 1);
		};

		ResetButton.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.buttons.ResetButton");

		ResetButton.prototype.__init = function() {
			if (ResetButton.LOGGER.isDebugEnabled())
				ResetButton.LOGGER.logDebug("init()");

			aEventUtils.handleEvent(this.data.element, "click", ResetButton.prototype.execute.bind(this));
			aEventUtils.handleEvent(this.data.formularElement, [ EVENTTYPES.ACTION_SUBMIT ], ResetButton.prototype.update.bind(this));
			this.data.element.formular_utils_SetActive();
			aEventUtils.triggerEvent(this.data.element, EVENTTYPES.BUTTON_ACTIVE);
		};

		ResetButton.prototype.execute = function(aEvent) {
			aEvent.preventDefault();
			aEvent.stopPropagation();
			aEventUtils.triggerEvent(this.data.element, EVENTTYPES.ACTION_RESET);
		};

		ResetButton.prototype.update = function(aEvent) {
			if (ResetButton.LOGGER.isDebugEnabled())
				ResetButton.LOGGER.logDebug("update() -> " + aEvent.type);

			this.data.element.formular_utils_SetInactive();
			aEventUtils.triggerEvent(this.data.element, EVENTTYPES.BUTTON_INACTIVE);
		};

		de.titus.core.jquery.Components.asComponent("formular_buttons_ResetButton", de.titus.form.buttons.ResetButton);
	});
})($, de.titus.form.Constants.EVENTS, de.titus.form.utils.EventUtils);
(function($, EVENTTYPES, aEventUtils) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.buttons.SubmitButton", function() {
		var SubmitButton = de.titus.form.buttons.SubmitButton = function(aElement) {
			if (SubmitButton.LOGGER.isDebugEnabled())
				SubmitButton.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formularElement : de.titus.form.utils.FormularUtils.getFormularElement(aElement)
			};

			setTimeout(SubmitButton.prototype.__init.bind(this), 1);
		};

		SubmitButton.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.buttons.SubmitButton");

		SubmitButton.prototype.__init = function() {
			if (SubmitButton.LOGGER.isDebugEnabled())
				SubmitButton.LOGGER.logDebug("__init()");

			aEventUtils.handleEvent(this.data.element, "click", SubmitButton.prototype.execute.bind(this));
			aEventUtils.handleEvent(this.data.formularElement, [ EVENTTYPES.PAGE_CHANGED ], SubmitButton.prototype.update.bind(this));
			this.data.element.formular_utils_SetInactive();
			aEventUtils.triggerEvent(this.data.element, EVENTTYPES.BUTTON_INACTIVE);
		};

		SubmitButton.prototype.execute = function(aEvent) {
			aEvent.preventDefault();
			aEvent.stopPropagation();
			aEventUtils.triggerEvent(this.data.element, EVENTTYPES.ACTION_SUBMIT);
		};

		SubmitButton.prototype.update = function(aEvent) {
			if (SubmitButton.LOGGER.isDebugEnabled())
				SubmitButton.LOGGER.logDebug("update() -> " + aEvent.type);

			var pageController = this.data.formularElement.formular_PageController();
			var page = pageController.getCurrentPage();
			if (page.data.type == de.titus.form.Constants.TYPES.SUMMARY_PAGE) {
				this.data.element.formular_utils_SetActive();
				aEventUtils.triggerEvent(this.data.element, EVENTTYPES.BUTTON_ACTIVE);
			} else {
				this.data.element.formular_utils_SetInactive();
				aEventUtils.triggerEvent(this.data.element, EVENTTYPES.BUTTON_INACTIVE);
			}
		};

		de.titus.core.jquery.Components.asComponent("formular_buttons_SubmitButton", de.titus.form.buttons.SubmitButton);
	});
})($, de.titus.form.Constants.EVENTS, de.titus.form.utils.EventUtils);
(function($, EVENTTYPES, aEventUtils) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.buttons.SummaryButton", function() {
		var SummaryButton = de.titus.form.buttons.SummaryButton = function(aElement) {
			if (SummaryButton.LOGGER.isDebugEnabled())
				SummaryButton.LOGGER.logDebug("constructor");
			this.data = {
			    element : aElement,
			    formularElement : de.titus.form.utils.FormularUtils.getFormularElement(aElement)
			};

			setTimeout(SummaryButton.prototype.__init.bind(this), 1);
		};

		SummaryButton.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.buttons.SummaryButton");

		SummaryButton.prototype.__init = function() {
			if (SummaryButton.LOGGER.isDebugEnabled())
				SummaryButton.LOGGER.logDebug("__init()");

			aEventUtils.handleEvent(this.data.element, "click", SummaryButton.prototype.execute.bind(this));
			aEventUtils.handleEvent(this.data.formularElement, [ EVENTTYPES.PAGE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED ], SummaryButton.prototype.update.bind(this));
			this.data.element.formular_utils_SetInactive();
			aEventUtils.triggerEvent(this.data.element, EVENTTYPES.BUTTON_INACTIVE);
		};

		SummaryButton.prototype.execute = function(aEvent) {
			aEvent.preventDefault();
			aEvent.stopPropagation();
			aEventUtils.triggerEvent(this.data.element, EVENTTYPES.ACTION_SUMMARY);
		};

		SummaryButton.prototype.update = function(aEvent) {
			if (SummaryButton.LOGGER.isDebugEnabled())
				SummaryButton.LOGGER.logDebug("update() -> " + aEvent.type);

			var pageController = this.data.formularElement.formular_PageController();
			var page = pageController.getCurrentPage();
			if (page && page.data.condition && page.data.valid) {
				var nextPage = pageController.getNextPage();
				if (nextPage.data.type == de.titus.form.Constants.TYPES.SUMMARY_PAGE) {
					this.data.element.formular_utils_SetActive();
					aEventUtils.triggerEvent(this.data.element, EVENTTYPES.BUTTON_ACTIVE);
					return;
				}
			}
			this.data.element.formular_utils_SetInactive();
			aEventUtils.triggerEvent(this.data.element, EVENTTYPES.BUTTON_INACTIVE);
		};

		de.titus.core.jquery.Components.asComponent("formular_buttons_SummaryButton", de.titus.form.buttons.SummaryButton);
	});
})($, de.titus.form.Constants.EVENTS, de.titus.form.utils.EventUtils);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.data.utils.DataUtils", function() {
		var DataUtils = de.titus.form.data.utils.DataUtils = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.data.utils.DataUtils"),

		    toModel : function(aData, aModel) {
			    if (DataUtils.LOGGER.isDebugEnabled())
				    DataUtils.LOGGER.logDebug([ "toModel (\"", aData, "\", \"", aModel, "\")" ]);

			    var model = aModel.toLowerCase().trim();
			    if (typeof DataUtils[model] === "function")
				    return DataUtils[model](aData);
			    return aData;
		    }
		};
	});

})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.data.utils.ObjectModel", function() {
		var ObjectModel = de.titus.form.data.utils.ObjectModel = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.data.utils.ObjectModel"),

		    toModel : function(aData) {
			    if (ObjectModel.LOGGER.isDebugEnabled())
				    ObjectModel.LOGGER.logDebug([ "toModel(\"", aData, "\"" ]);
			    if (aData === undefined)
				    return;
			    var result;
			    if (typeof aData.$type === "string") {
				    if (aData.$type == "single-field")
					    return aData.value;
				    else
					    return ObjectModel.toModel(aData.value);
			    } else if (Array.isArray(aData)) {
				    result = [];
				    for (var i = 0; i < aData.length; i++)
					    result.push(ObjectModel.toModel(aData[i]));
			    } else if (typeof aData === "object") {
				    result = {};
				    for ( var name in aData)
					    result[name] = ObjectModel.toModel(aData[name]);
			    } else
				    return aData;

			    return result;
		    }
		};
		$.extend(de.titus.form.data.utils.DataUtils, {
			"object" : ObjectModel.toModel
		});
	});

})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.field.controller.DefaultController", function() {
		var DefaultController = de.titus.form.field.controller.DefaultController = function(aElement) {
			if (DefaultController.LOGGER.isDebugEnabled())
				DefaultController.LOGGER.logDebug("constructor");

			this.element = aElement;
			this.input = undefined;
			this.type = undefined;
			this.filedata = undefined;
			this.timeoutId = undefined;
			this.data = {
				type : undefined
			};
			// setTimeout(DefaultController.prototype.__init.bind(this), 1);
			this.__init();
		};
		DefaultController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.field.controller.DefaultController");

		DefaultController.prototype.valueChanged = function(aEvent) {
			aEvent.preventDefault();
			aEvent.stopPropagation();
			de.titus.form.utils.EventUtils.triggerEvent(this.element, de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
		};

		DefaultController.prototype.__init = function() {
			if (DefaultController.LOGGER.isDebugEnabled())
				DefaultController.LOGGER.logDebug("init()");

			if (this.element.find("select").length == 1) {
				this.type = "select";
				this.element.find("select").on("change", DefaultController.prototype.valueChanged.bind(this));
			} else {
				if (this.element.find("input[type='radio']").length > 0) {
					this.type = "radio";
					this.element.find("input[type='radio']").on("change", DefaultController.prototype.valueChanged.bind(this));
				} else if (this.element.find("input[type='checkbox']").length > 0) {
					this.type = "checkbox";
					this.element.find("input[type='checkbox']").on("change", DefaultController.prototype.valueChanged.bind(this));
				} else if (this.element.find("input[type='file']").length == 1) {
					this.type = "file";
					this.element.find("input[type='file']").on("change", DefaultController.prototype.readFileData.bind(this));
				} else {
					this.type = "text";
					this.element.find("input, textarea").on("keyup change", (function(aEvent) {
						if (this.timeoutId !== undefined) {
							window.clearTimeout(this.timeoutId);
						}

						this.timeoutId = window.setTimeout((function() {
							this.valueChanged(aEvent);
						}).bind(this), 300);

					}).bind(this));
				}

				this.data.type = this.type;
			}

			de.titus.form.utils.EventUtils.handleEvent(this.element, de.titus.form.Constants.EVENTS.FIELD_SHOW, (function() {
				if (this.type == "select")
					this.element.find("select").prop("disabled", false);
				else
					this.element.find("input, textarea").prop("disabled", false);
			}).bind(this));

			de.titus.form.utils.EventUtils.handleEvent(this.element, de.titus.form.Constants.EVENTS.FIELD_SUMMARY, (function() {
				if (this.type == "select")
					this.element.find("select").prop("disabled", true);
				else
					this.element.find("input, textarea").prop("disabled", true);
			}).bind(this));

			if (DefaultController.LOGGER.isDebugEnabled())
				DefaultController.LOGGER.logDebug("init() -> detect type: " + this.type);
		};

		DefaultController.prototype.readFileData = function(aEvent) {
			if (DefaultController.LOGGER.isDebugEnabled())
				DefaultController.LOGGER.logDebug("readFileData()");

			let input = aEvent.target;
			let multiple = input.files.length > 1;
			if (multiple)
				this.fileData = [];
			else
				this.fileData = undefined;

			let counter = {
				count : input.files.length
			};

			let textField = this.element.find("input[type='text'][readonly]");
			if (textField.length == 1)
				textField.val("");
			for (var i = 0; i < input.files.length; i++) {
				let reader = new FileReader();
				reader.addEventListener("loadend", DefaultController.prototype.__fileReaded.bind(this, counter, reader, input.files[i], multiple), false);
				reader.readAsDataURL(input.files[i]);
				if (textField.length == 1)
					textField.val(textField.val() !== "" ? textField.val() + ", " + input.files[i].name : input.files[i].name);
			}
		};

		DefaultController.prototype.__fileReaded = function(aCounter, aReader, aFile, isMultible, aEvent) {
			if (DefaultController.LOGGER.isDebugEnabled())
				DefaultController.LOGGER.logDebug("readFileData() -> reader load event!");

			let file = {
			    name : aFile.name,
			    type : aFile.type,
			    size : aFile.size,
			    data : aReader.result
			};

			if (isMultible)
				this.fileData.push(file);
			else
				this.fileData = file;

			aCounter.count--;
			if (aCounter.count === 0)
				de.titus.form.utils.EventUtils.triggerEvent(this.element, de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
		};

		DefaultController.prototype.getValue = function() {
			if (DefaultController.LOGGER.isDebugEnabled())
				DefaultController.LOGGER.logDebug("getValue()");
			var value;
			if (this.type == "select") {
				value = this.element.find("select").val();
				if (value && value.length > 0)
					return value;
			} else if (this.type == "radio") {
				value = this.element.find("input:checked").val();
				if (value && value.trim() !== "")
					return value;
			} else if (this.type == "checkbox") {
				var values = [];
				this.element.find("input:checked").each(function() {
					var value = $(this).val();
					if (value && value.trim() !== "")
						values.push(value);
				});
				return values.length > 0 ? values : undefined;
			} else if (this.type == "file")
				return this.fileData;
			else {
				value = this.element.find("input, textarea").first().val();
				if (value && value.trim() !== "")
					return value;
			}
		};

		de.titus.form.Registry.registFieldController("default", function(aElement) {
			return new DefaultController(aElement);
		});
	});
})($);
(function($, EventUtils, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.fields.ContainerField", function() {
		var ContainerField = de.titus.form.fields.ContainerField = function(aElement) {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    dataContext : undefined,
			    name : (aElement.attr("data-form-container-field") || "").trim(),
			    active : false,
			    required : (aElement.attr("data-form-required") !== undefined),
			    requiredOnActive : (aElement.attr("data-form-required") === "on-condition-true"),
			    condition : undefined,
			    // always valid, because it's only a container
			    valid : undefined,
			    fields : []
			};

			this.data.element.formular_DataContext({
			    data : ContainerField.prototype.getData.bind(this),
			    scope : "$container"
			});
			this.hide();
			setTimeout(ContainerField.prototype.__init.bind(this), 1);
		};

		ContainerField.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.fields.ContainerField");

		ContainerField.prototype.__init = function() {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug("init()");

			this.data.dataContext = this.data.element.formular_findParentDataContext();
			EventUtils.handleEvent(this.data.element, [ EVENTTYPES.CONDITION_MET, EVENTTYPES.CONDITION_NOT_MET ], ContainerField.prototype.__changeConditionState.bind(this));
			EventUtils.handleEvent(this.data.element, [ EVENTTYPES.CONDITION_STATE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED ], ContainerField.prototype.__handleValidationEvent.bind(this), "*");

			this.data.fields = this.data.element.formular_field_utils_getSubFields();

			this.data.element.formular_Condition();

			EventUtils.triggerEvent(this.data.element, EVENTTYPES.INITIALIZED);
		};

		ContainerField.prototype.__changeConditionState = function(aEvent) {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug([ "__changeConditionState()  for \"", this.data.name, "\" -> ", aEvent ]);

			aEvent.preventDefault();
			aEvent.stopPropagation();

			var condition = false;
			if (aEvent.type == EVENTTYPES.CONDITION_MET)
				condition = true;

			if (this.data.condition != condition) {
				this.data.condition = condition;
				if (this.data.condition)
					this.show();
				else
					this.hide();

				EventUtils.triggerEvent(this.data.element, EVENTTYPES.CONDITION_STATE_CHANGED);
			}
		};

		ContainerField.prototype.__handleValidationEvent = function(aEvent) {
			this.doValidate(true);
		};

		ContainerField.prototype.doValidate = function(force) {
			if (force) {
				var oldValid = this.data.valid;
				this.data.valid = de.titus.form.utils.FormularUtils.isFieldsValid(this.data.fields, force);
				if (oldValid != this.data.valid) {
					if (this.data.valid)
						this.data.element.formular_utils_SetValid();
					else
						this.data.element.formular_utils_SetInvalid();
				}
			}

			return this.data.valid;
		};

		ContainerField.prototype.hide = function() {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug("hide ()");

			this.data.active = false;
			this.data.element.formular_utils_SetInactive();
			for (var i = 0; i < this.data.fields.length; i++)
				this.data.fields[i].hide();

		};

		ContainerField.prototype.show = function() {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug("show ()");
			if (this.data.condition) {
				this.data.element.formular_utils_SetActive();
				for (var i = 0; i < this.data.fields.length; i++)
					this.data.fields[i].show();

				this.data.active = true;
			}
		};

		ContainerField.prototype.summary = function() {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug("summary ()");
			if (this.data.condition) {
				for (var i = 0; i < this.data.fields.length; i++)
					this.data.fields[i].summary();

				this.data.element.formular_utils_SetActive();
			}
		};

		ContainerField.prototype.getData = function(aFilter) {
			if (ContainerField.LOGGER.isDebugEnabled())
				ContainerField.LOGGER.logDebug("getData(\"", aFilter, "\")");

			var result;
			if (aFilter.example)
				result = de.titus.form.utils.FormularUtils.toBaseModel(this.data.fields, aFilter);
			else if (this.data.condition && (this.data.active || (this.data.condition && this.data.valid)))
				result = de.titus.form.utils.FormularUtils.toBaseModel(this.data.fields, aFilter);
			else
				return;

			if (this.data.name)
				return {
				    name : this.data.name,
				    type : "container-field",
				    $type : "container-field",
				    value : result
				};
			else
				return result;

		};
	});
})($, de.titus.form.utils.EventUtils, de.titus.form.Constants.EVENTS);
(function($, EventUtils, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.fields.ListField", function() {
		var ListField = de.titus.form.fields.ListField = function(aElement) {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    dataContext : undefined,
			    name : (aElement.attr("data-form-list-field") || "").trim(),
			    template : aElement.find("[data-form-content-template]").detach(),
			    contentContainer : aElement.find("[data-form-content-container]"),
			    addButton : aElement.find("[data-form-list-field-action-add]"),
			    required : (aElement.attr("data-form-required") !== undefined),
			    requiredOnActive : (aElement.attr("data-form-required") === "on-condition-true"),
			    min : parseInt(aElement.attr("data-form-list-field-min") || "0"),
			    max : parseInt(aElement.attr("data-form-list-field-max") || "0"),
			    condition : undefined,
			    valid : undefined,
			    items : []
			};

			this.data.element.formular_DataContext({
			    data : ListField.prototype.getData.bind(this),
			    scope : "$list"
			});
			this.hide();
			setTimeout(ListField.prototype.__init.bind(this), 1);
		};

		ListField.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.fields.ListField");

		ListField.prototype.__init = function() {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("init()");

			this.data.dataContext = this.data.element.formular_findParentDataContext();
			EventUtils.handleEvent(this.data.element, [ EVENTTYPES.CONDITION_MET, EVENTTYPES.CONDITION_NOT_MET ], ListField.prototype.__changeConditionState.bind(this));
			EventUtils.handleEvent(this.data.element, [ EVENTTYPES.CONDITION_STATE_CHANGED, EVENTTYPES.VALIDATION_STATE_CHANGED, EVENTTYPES.FIELD_VALUE_CHANGED ], ListField.prototype.__handleValidationEvent.bind(this), "*");

			this.data.element.formular_Condition();

			EventUtils.handleEvent(this.data.addButton, [ "click" ], ListField.prototype.__addItem.bind(this));

			EventUtils.triggerEvent(this.data.element, EVENTTYPES.INITIALIZED);
			this.doValidate();
		};

		ListField.prototype.__addItem = function(aEvent) {
			var item = {
			    id : ("item-" + de.titus.core.UUID()),
			    index : this.data.items.length,
			    element : this.data.template.clone(),
			    field : undefined
			};
			item.element = this.data.template.clone();
			item.element.attr("id", item.id);
			item.element.attr("data-form-list-item", item.id);
			if (item.element.attr("data-form-container-field") === undefined)
				item.element.attr("data-form-container-field", "item");
			item.element.formular_utils_SetInitializing();

			this.data.items.push(item);
			item.element.appendTo(this.data.contentContainer);

			EventUtils.handleEvent(item.element.find("[data-form-list-field-action-remove]"), [ "click" ], ListField.prototype.__removeItem.bind(this));

			setTimeout(ListField.prototype.__initializeItem.bind(this, item), 1);
		};

		ListField.prototype.__initializeItem = function(aItem) {
			aItem.field = aItem.element.formular_Field();
			aItem.element.formular_DataContext({
			    data : (function(aFilter) {
				    var data = this.field.getData(aFilter);
				    if (data)
					    return data.value;
			    }).bind(aItem),
			    scope : "$item"
			});

			aItem.element.formular_initMessages();

			aItem.element.formular_utils_SetInitialized();
			EventUtils.triggerEvent(this.data.element, EVENTTYPES.FIELD_VALUE_CHANGED);
			this.doValidate();
			this.__doCheckAddButton();
		};

		ListField.prototype.__removeItem = function(aEvent) {

			var target = $(aEvent.target);
			var itemElement = target.parents("[data-form-list-item]");
			var itemId = itemElement.attr("id");

			for (var i = 0; i < this.data.items.length; i++) {
				var item = this.data.items[i];
				if (item.id == itemId) {
					this.data.items.splice(i, 1);
					itemElement.remove();					
					//this.doValidate();
					this.__handleValidationEvent(aEvent);
					this.__doCheckAddButton();
					EventUtils.triggerEvent(this.data.element, EVENTTYPES.FIELD_VALUE_CHANGED);
					return;
				}
			}

		};

		ListField.prototype.__doCheckAddButton = function() {
			if (this.data.max === 0 || this.data.items.length < this.data.max)
				this.data.element.find("[data-form-list-field-action-add]").formular_utils_SetActive();
			else
				this.data.element.find("[data-form-list-field-action-add]").formular_utils_SetInactive();
		};

		ListField.prototype.__changeConditionState = function(aEvent) {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug([ "__changeConditionState()  for \"", this.data.name, "\" -> ", aEvent ]);

			aEvent.preventDefault();
			aEvent.stopPropagation();

			var condition = false;
			if (aEvent.type == EVENTTYPES.CONDITION_MET)
				condition = true;

			if (this.data.condition != condition) {
				this.data.condition = condition;
				if (this.data.condition)
					this.show();
				else
					this.hide();

				EventUtils.triggerEvent(this.data.element, EVENTTYPES.CONDITION_STATE_CHANGED);
			}
		};

		ListField.prototype.__handleValidationEvent = function(aEvent) {
			var oldValid = this.data.valid;
			this.doValidate();

			if (this.data.valid != oldValid)
				EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_STATE_CHANGED);

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.FIELD_VALIDATED);
		};
		

		ListField.prototype.doValidate = function(force) {
			var oldValid = this.data.valid;
			if (this.data.items.length === 0)
				this.data.valid = !this.data.required;
			else if (this.data.items.length < this.data.min)
				this.data.valid = false;
			else if (this.data.max !== 0 && this.data.items.length > this.data.max)
				this.data.valid = false;
			else
				this.data.valid = this.__isListItemsValid();

			if (oldValid != this.data.valid) {
				if (this.data.valid)
					this.data.element.formular_utils_SetValid();
				else
					this.data.element.formular_utils_SetInvalid();
			}

			return this.data.valid;
		};

		ListField.prototype.__isListItemsValid = function() {
			for (var i = 0; i < this.data.items.length; i++) {
				var item = this.data.items[i];
				if (!item.field.data.valid)
					return false;
			}

			return true;
		};

		ListField.prototype.hide = function() {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("hide ()");

			this.data.element.formular_utils_SetInactive();
			for (var i = 0; i < this.data.items.length; i++) {
				var item = this.data.items[i];
				item.field.hide();
			}
		};

		ListField.prototype.show = function() {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("show ()");
			if (this.data.condition) {
				this.data.element.formular_utils_SetActive();
				for (var i = 0; i < this.data.items.length; i++) {
					var item = this.data.items[i];
					item.field.show();
				}
			}
			this.data.element.find("[data-form-list-field-action-remove]").formular_utils_SetActive();
			this.__doCheckAddButton();
		};

		ListField.prototype.summary = function() {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("summary ()");
			if (this.data.condition) {
				for (var i = 0; i < this.data.items.length; i++) {
					var item = this.data.items[i];
					item.field.summary();
				}
				this.data.element.formular_utils_SetActive();
			}
			this.data.element.find("[data-form-list-field-action-remove]").formular_utils_SetInactive();
			this.data.element.find("[data-form-list-field-action-add]").formular_utils_SetInactive();
		};

		ListField.prototype.getData = function(aFilter) {
			if (ListField.LOGGER.isDebugEnabled())
				ListField.LOGGER.logDebug("getData(\"", aFilter, "\")");

			var items = [];
			if (aFilter.example)
				items = ListField.getExample(aFilter);
			else if (this.data.condition && (this.data.valid || aFilter.validate || aFilter.condition)) {
				for (var i = 0; i < this.data.items.length; i++) {
					var item = this.data.items[i];
					var fieldData = item.field.getData(aFilter);
					if (fieldData && fieldData.value)
						items.push(fieldData.value);
				}
			} else
				return;

			if (items.length > 0) {
				return {
				    name : this.data.name,
				    type : "list-field",
				    $type : "list-field",
				    value : items
				};
			}
		};

		ListField.prototype.getExample = function(aFilter) {
			// TODO
		};
	});
})($, de.titus.form.utils.EventUtils, de.titus.form.Constants.EVENTS);
(function($, EVENTTYPES) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.fields.SingleField", function() {
		var Field = de.titus.form.fields.SingleField = function(aElement) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("constructor");

			this.data = {
			    element : aElement,
			    dataContext : undefined,
			    name : (aElement.attr("data-form-field") || "").trim(),
			    type : (aElement.attr("data-form-field-type") || "default").trim(),
			    required : (aElement.attr("data-form-required") !== undefined),
			    requiredOnActive : (aElement.attr("data-form-required") === "on-condition-true"),
			    condition : undefined,
			    valid : undefined,
			    controller : undefined
			};

			this.data.element.formular_DataContext({
			    data : Field.prototype.getData.bind(this),
			    scope : "$field"
			});
			this.hide();

			setTimeout(Field.prototype.__init.bind(this), 1);
		};

		Field.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.fields.SingleField");

		Field.prototype.__init = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("init()");

			this.data.dataContext = this.data.element.formular_findParentDataContext();
			this.data.controller = de.titus.form.Registry.getFieldController(this.data.type, this.data.element);
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.CONDITION_MET, EVENTTYPES.CONDITION_NOT_MET ], Field.prototype.__changeConditionState.bind(this));
			de.titus.form.utils.EventUtils.handleEvent(this.data.element, [ EVENTTYPES.VALIDATION_VALID, EVENTTYPES.VALIDATION_INVALID ], Field.prototype.__changeValidationState.bind(this));

			this.data.element.formular_Condition();
			this.data.element.formular_Validation();

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.INITIALIZED);
		};

		Field.prototype.__changeConditionState = function(aEvent) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("__changeConditionState()  for \"" + this.data.name + "\" -> " + aEvent.type);

			aEvent.preventDefault();
			aEvent.stopPropagation();

			var condition = false;
			if (aEvent.type == EVENTTYPES.CONDITION_MET)
				condition = true;

			if (this.data.condition != condition) {
				this.data.condition = condition;
				if (this.data.condition)
					this.show();
				else
					this.hide();

				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.CONDITION_STATE_CHANGED);
			}
		};

		Field.prototype.__changeValidationState = function(aEvent) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug([ "__changeValidationState() for field \"", this.data.name, "\" -> ", aEvent.type, "; field: \"", this, "\"" ]);

			aEvent.preventDefault();
			aEvent.stopPropagation();

			var valid = aEvent.type == EVENTTYPES.VALIDATION_VALID;

			if (this.data.valid != valid) {
				if (Field.LOGGER.isDebugEnabled())
					Field.LOGGER.logDebug("__changeValidationState() for field \"" + this.data.name + "\" from " + this.data.valid + " -> " + valid);

				this.data.valid = valid;

				if (this.data.valid)
					this.data.element.formular_utils_SetValid();
				else
					this.data.element.formular_utils_SetInvalid();

				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.VALIDATION_STATE_CHANGED);
			}

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.FIELD_VALIDATED);
		};

		Field.prototype.doValidate = function(force) {
			if (force) {
				this.data.valid = this.data.element.formular_Validation().doValidate();
				if (this.data.valid)
					this.data.element.formular_utils_SetValid();
				else
					this.data.element.formular_utils_SetInvalid();
			}

			return this.data.valid;
		};

		Field.prototype.hide = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("hide ()");

			this.data.element.formular_utils_SetInactive();
			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.FIELD_HIDE);
		};

		Field.prototype.show = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("show ()");
			if (this.data.condition) {
				this.data.element.formular_utils_SetActive();
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.FIELD_SHOW);
			}
		};

		Field.prototype.summary = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("summary ()");
			if (this.data.condition) {
				de.titus.form.utils.EventUtils.triggerEvent(this.data.element, EVENTTYPES.FIELD_SUMMARY);
				this.data.element.formular_utils_SetActive();
			}
		};

		Field.prototype.getData = function(aFilter) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug([ "getData(\"", aFilter, "\")" ]);

			var result;
			if (aFilter.example)
				result = this.data.controller.getExample();
			else if (this.data.condition && (this.data.valid || aFilter.validate || aFilter.condition))
				result = this.data.controller.getValue();
			else
				return;

			return {
			    name : this.data.name,
			    type : this.data.controller.data.type ? this.data.controller.data.type : this.data.type,
			    $type : "single-field",
			    value : result
			};
		};
	});
})($, de.titus.form.Constants.EVENTS);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.page.utils.VirtualPage", function() {
		var Page = de.titus.form.page.utils.VirtualPage = function(aElement, theOptions) {
			this.data = {
			    element : aElement,
			    pageController : theOptions.pageController,
			    type : theOptions.type,
			    valid : true,
			    condition : true,
			    step : theOptions.step,
			    event : theOptions.event
			};
		};

		Page.prototype.show = function() {
			var pages = this.data.pageController.data.pages;
			for (var i = 0; i < pages.length; i++)
				pages[i].summary();

			de.titus.form.utils.EventUtils.triggerEvent(this.data.element, this.data.event);
		};

		Page.prototype.hide = function() {
			var pages = this.data.pageController.data.pages;
			for (var i = 0; i < pages.length; i++)
				pages[i].hide();

		};

		Page.prototype.doValidate = function() {
			return true;
		};
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


