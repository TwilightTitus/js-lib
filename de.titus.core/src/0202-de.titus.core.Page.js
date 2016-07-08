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
			if (this.detectBrowser().microsoft) {
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
			"microsoft" : false,
			"other" : false
			};
			var ua = window.navigator.userAgent;
			
			var msie = ua.indexOf('MSIE ');
			if (msie > 0) {
				result.microsoft = true;
				return result;
			}
			var trident = ua.indexOf('Trident/');
			if (trident > 0) {
				result.microsoft = true;
				return result;
			}
			var edge = ua.indexOf('Edge/');
			if (edge > 0) {
				result.microsoft = true;
				return result;
			}
			
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