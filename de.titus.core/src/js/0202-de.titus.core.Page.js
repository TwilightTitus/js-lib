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
