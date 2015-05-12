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


if(de == undefined)
	var de = {};
if(de.titus == undefined){
	de.titus = {};
}
if(de.titus.core == undefined){
	de.titus.core = {};
}
if(de.titus.core.Namespace == undefined){
	de.titus.core.Namespace = {};	
	/**
	 * creates a namespace and run the function, if the Namespace new
	 * @param aNamespace 
	 * 		the namespace(requiered)
	 * @param aFunction 
	 * 		a function that be executed, if the namespace created (optional)
	 * 
	 *  @returns boolean, true if the namespace created
	 */
	de.titus.core.Namespace.create = function (aNamespace, aFunction){
		var namespaces = aNamespace.split(".");
		var currentNamespace = window;
		var namespaceCreated = false;
		for(i = 0; i < namespaces.length; i++){
			if (currentNamespace[namespaces[i]] == undefined) {
				currentNamespace[namespaces[i]] = {};
				namespaceCreated = true;
	        }
			currentNamespace = currentNamespace[namespaces[i]];
		}
		if(namespaceCreated && aFunction != undefined){
			"use strict";
			aFunction();
		}
		
		return namespaceCreated;
	};	
	
	/**
	 * exist the namespace?
	 * 
	 * @param aNamespace 
	 * 		the namespace(requiered)
	 * 
	 *  @returns boolean, true if the namespace existing
	 */
	de.titus.core.Namespace.exist = function (aNamespace){
		var namespaces = aNamespace.split(".");
		var currentNamespace = window;
		for(i = 0; i < namespaces.length; i++){
			if (currentNamespace[namespaces[i]] == undefined) {
				return false;
	        }
			currentNamespace = currentNamespace[namespaces[i]];
		}		
		return true;
	};	
};de.titus.core.Namespace.create("de.titus.core.SpecialFunctions", function() {
	
	de.titus.core.SpecialFunctions = {};
	
	de.titus.core.SpecialFunctions.doEval = function(aDomhelper, aStatement, aContext) {
		if (aStatement != undefined) {
			eval("var $___DE_TITUS_CORE_EVAL_RESULT_FUNCTION___$ = function($___DOMHELPER___$,$___CONTEXT___$){ " + "$___DOMHELPER___$.mergeObjects(this, $___CONTEXT___$);" + "var $___EVAL_RESULT___$ = " + aStatement + ";" + "return $___EVAL_RESULT___$;};");
			if ($___DE_TITUS_CORE_EVAL_RESULT_FUNCTION___$ != undefined) {
				var result = $___DE_TITUS_CORE_EVAL_RESULT_FUNCTION___$(aDomhelper, aContext);
				$___DE_TITUS_CORE_EVAL_RESULT_FUNCTION___$ = undefined;
				
				return result;
			}
			return undefined;
		}
	};
});
de.titus.core.Namespace.create("de.titus.core.DomHelper", function(){
	
	/**
	 * 
	 */
	de.titus.core.DomHelper = /* constructor */function() {
	};
	
	/**
	 * 
	 * @param aElement
	 */
	de.titus.core.DomHelper.prototype.toDomObject = function(aElement) {
	};
	
	/**
	 * 
	 * @param aElement
	 */
	de.titus.core.DomHelper.prototype.cloneDomObject = function(aElement) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 */
	de.titus.core.DomHelper.prototype.getAttribute = function(aDomElementObject, anAttribute) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getAttributes = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 * @param value
	 * 		if the value undefined the attribute need to be removed!
	 */
	de.titus.core.DomHelper.prototype.setAttribute = function(aDomElementObject, /* string */anAttribute, /* string */value) {
	};
	
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getChildCount = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getChilds = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getParent = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getHtml = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param aHtml
	 * @param aType
	 *            values -> append, prepend, replace, [undefined]
	 */
	de.titus.core.DomHelper.prototype.setHtml = function(aDomElementObject, aHtml, aType) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getText = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param aText
	 * @param aType
	 *            values -> append, prepend, replace, [undefined]
	 */
	de.titus.core.DomHelper.prototype.setText = function(aDomElementObject, aText, aType) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.doRemove = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.doRemoveChilds = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aId
	 */
	de.titus.core.DomHelper.prototype.getDomElementById = function(aId) {
	};
	
	/**
	 * 
	 * @param theSettings
	 *            The minimum settings properties are url, async, cache! The settingsObject would be extents by costum data!
	 * @param aCallback
	 *            The callback function signature is function(template)
	 */
	de.titus.core.DomHelper.prototype.doRemoteLoadHtml = function(theSettings, aCallback) {
	};
	
	/**
	 * 
	 * @param theSettings
	 * @param aCallback
	 */
	de.titus.core.DomHelper.prototype.doRemoteLoadJson = function(theSettings, aCallback) {
	};
	
	/**
	 * 
	 * @param aObject1
	 * @param aObject2
	 * @returns The function need to be return the "aObject1"!
	 */
	de.titus.core.DomHelper.prototype.mergeObjects = function(aObject1, aObject2) {
	};
	
	/**
	 * 
	 * @param aVariable
	 * 
	 * @returns true, if the parameter a function. Undefined is false!
	 */
	de.titus.core.DomHelper.prototype.isFunction = function(aVariable) {};
	
	/**
	 * 
	 * @param aVariable
	 * 
	 * @returns 
	 * 		true, if the parameter a array;
	 */
	de.titus.core.DomHelper.prototype.isArray = function(aVariable) {};
	
	/**
	 * Call the function, after dom is ready!
	 * 
	 * @param afunction
	 * 
	 */
	de.titus.core.DomHelper.prototype.doOnReady = function(afunction) {};
	
	/**
	 * 
	 * @param aStatement
	 * @param aDefault
	 * @returns
	 */
	de.titus.core.DomHelper.prototype.doEval = function(aStatement, aDefault) {
		return this.doEvalWithContext(aStatement, {}, aDefault);
	};
	
	/**
	 * 
	 * @param aStatement
	 * @param aContext
	 * @param aDefault
	 * @returns
	 */
	de.titus.core.DomHelper.prototype.doEvalWithContext = function(aStatement, aContext, aDefault) {
		var result = de.titus.core.SpecialFunctions.doEval(this, aStatement, aContext);
		
//		var result = $___DE_TITUS_CORE_EVAL_WITH_CONTEXT_EXTENTION___$(this, aStatement, aContext);
		if (result == undefined) {
			return aDefault;
		}
		return result;
	};
	
	/**
	 * @returns de.titus.core.DomHelper
	 */
	de.titus.core.DomHelper.getInstance = function() {
		if (de.titus.core.GLOBAL_DOMHELPER_INSTANCE == undefined) {
			de.titus.core.GLOBAL_DOMHELPER_INSTANCE = new de.titus.core.DomHelper();
		}
		return de.titus.core.GLOBAL_DOMHELPER_INSTANCE;
	};
});

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
	
	de.titus.logging.LogAppender = function(aDomHelper) {
		this.domHelper = aDomHelper || de.titus.core.DomHelper.getInstance();
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
			this.log(aMessage, aException);
	};
	
	de.titus.logging.Logger.prototype.logWarn = function(aMessage, aException) {
		if (this.isWarnEnabled())
			this.log(aMessage, aException);
	};
	
	de.titus.logging.Logger.prototype.logInfo = function(aMessage, aException) {
		if (this.isInfoEnabled())
			this.log(aMessage, aException);
	};
	
	de.titus.logging.Logger.prototype.logDebug = function(aMessage, aException) {
		if (this.isDebugEnabled())
			this.log(aMessage, aException);
	};
	
	de.titus.logging.Logger.prototype.logTrace = function(aMessage, aException) {
		if (this.isTraceEnabled())
			this.log(aMessage, aException);
	};
	
	de.titus.logging.Logger.prototype.log = function(aMessage, anException) {
		if(this.logAppenders == undefined)
			return;
		
		if(this.logAppenders.length > 0){
			for(var i = 0; i < this.logAppenders.length; i++)
				this.logAppenders[i].logMessage(aMessage, anException, this.name, new Date(), this.logLevel);
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
	
	de.titus.logging.LoggerFactory = function(){
		this.configs = {};
		this.domHelper = de.titus.core.DomHelper.getInstance();
		this.appenders = {};
	};
	de.titus.logging.LoggerFactory.prototype.loadConfig = function(aConfig){
		if(aConfig.domHelper)
			this.domHelper = aConfig.domHelper;
		if(aConfig.remote)
			this.loadConfigRemote(aConfig.remote);
		else if(aConfig.data)
			this.configs = aConfig.data.configs;		
	};
	
	de.titus.logging.LoggerFactory.prototype.loadConfigRemote = function(aRemoteData){
		var this_ = this;
		var ajaxSettings = {
			'async' : false,
			'cache' : false 
			};
		ajaxSettings = this.domHelper.mergeObjects(ajaxSettings, aRemoteData);
		this.domHelper.doRemoteLoadJson(ajaxSettings, function(data) {
			this_.configs = data.configs;
			this_.updateConfigs();
		});
	};
	
	de.titus.logging.LoggerFactory.prototype.updateConfigs = function(){
		
	};
	
	
	de.titus.logging.LoggerFactory.prototype.newLogger = function(aLoggerName){
		var logger = de.titus.logging.LoggerRegistry.getInstance().getLogger(aLoggerName);
		if(logger == undefined)
		{
			var config = this.findConfig(aLoggerName);
			var logLevel = de.titus.logging.LogLevel.getLogLevel(config.logLevel);
			var appenders = this.getAppenders(config.appenders);
			
			logger = new de.titus.logging.Logger(aLoggerName, logLevel, appenders);
			de.titus.logging.LoggerRegistry.getInstance().addLogger(logger);
		}
		
		return logger;
	};
	
	
	de.titus.logging.LoggerFactory.prototype.findConfig = function(aLoggerName){
		var defaultConfig = {"filter": "", "logLevel": "NOLOG", "appenders":[]};
		var actualConfig = undefined;
		for(var i = 0; i < this.configs.length; i++){
			var config = this.configs[i];
			if(this.isConfigActiv(aLoggerName, config, actualConfig))
				actualConfig = config;
			else if(config.filter == undefined || config.filter == "")
				defaultConfig = config;
			if(actualConfig != undefined && actualConfig.filter == aLoggerName)
				return actualConfig;
		}		
		
		return actualConfig || defaultConfig;
	};
	
	de.titus.logging.LoggerFactory.prototype.isConfigActiv = function(aLoggerName, aConfig, anActualConfig){
		if(anActualConfig != undefined && anActualConfig.filter.length >= aConfig.filter.filter)
			return false;
		return aLoggerName.search(aConfig.filter) == 0;			
	};
	
	de.titus.logging.LoggerFactory.prototype.getAppenders = function(theAppenders){
		var result = new Array();
		for(var i = 0; i < theAppenders.length; i++){
			var appenderString = theAppenders[i];
			var appender = this.appenders[appenderString];
			if(appender == undefined)
			{
				appender = this.domHelper.doEval("new " + appenderString + "();");
				if(appender != undefined)
				{
					appender.domHelper = this.domHelper;
					this.appenders[appenderString] = appender;
				}
			}
			if(appender != undefined)
				result.push(appender);
		}		
		
		return result;		
	};
	
	
	
	de.titus.logging.LoggerFactory.getInstance = function(){
		if(de.titus.logging.LoggerFactory.INSTANCE == undefined)
			de.titus.logging.LoggerFactory.INSTANCE = new de.titus.logging.LoggerFactory();
		
		return de.titus.logging.LoggerFactory.INSTANCE;
	};
	
	
});de.titus.core.Namespace.create("de.titus.logging.ConsolenAppender", function() {
	
	de.titus.logging.ConsolenAppender = function(){
	};
	
	de.titus.logging.ConsolenAppender.prototype = new de.titus.logging.LogAppender();
	de.titus.logging.ConsolenAppender.prototype.constructor = de.titus.logging.ConsolenAppender;
	
	de.titus.logging.ConsolenAppender.prototype.logMessage=  function(aMessage, anException, aLoggerName, aDate, aLogLevel){
		var log = "";
		if(aDate)
			log += log = aDate + " ";
		
		log += "***" + aLogLevel.title + "*** " + aLoggerName + "";
		
		if(aMessage)
			log += " -> " + aMessage + ":";
		if(anException)
			log += anException;
		
		console.log(log);
	};
});de.titus.core.Namespace.create("de.titus.logging.HtmlAppender", function() {
	
	
	
	de.titus.logging.HtmlAppender = function(){
	};
	
	de.titus.logging.HtmlAppender.CONTAINER_QUERY = "#log";
	
	de.titus.logging.HtmlAppender.prototype = new de.titus.logging.LogAppender();
	de.titus.logging.HtmlAppender.prototype.constructor = de.titus.logging.HtmlAppender;
	
	de.titus.logging.HtmlAppender.prototype.logMessage=  function(aMessage, anException, aLoggerName, aDate, aLogLevel){
		var container = this.domHelper.toDomObject(de.titus.logging.HtmlAppender.CONTAINER_QUERY);
		if(container == undefined)
			return;
		
		var log = '<div class="log-entry ' + aLogLevel.title + '">';
		if(aDate)
			log += log = aDate + " ";
		
		log += "***" + aLogLevel.title + "*** " + aLoggerName + "";
		
		if(aMessage)
			log += " -> " + aMessage + ":";
		if(anException)
			log += anException;
		
		log += "</div>";
		
		this.domHelper.setHtml(container, log, "append");
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
			if(console.log)
				this.appender = new de.titus.logging.ConsolenAppender();
			else if(this.domHelper.toDomObject(de.titus.logging.HtmlAppender.CONTAINER_QUERY))
				this.appender = new de.titus.logging.HtmlAppender();
			else
				this.appender = new de.titus.logging.MemoryAppender();
			
			this.appender.domHelper = this.domHelper;
		}
		
		return this.appender;
	}
	
	de.titus.logging.InteligentBrowserAppender.prototype.logMessage=  function(aMessage, anException, aLoggerName, aDate, aLogLevel){		
		this.getAppender().logMessage(aMessage, anException, aLoggerName, aDate, aLogLevel);
	};
});
de.titus.core.Namespace.create("de.titus.TemplateEngine", function() {
	
	/**
	 * @param aTemplate
	 *            The definition to template
	 */
	de.titus.TemplateEngine = /* constructor */function(aDomHelper, aTargetElement, theSettings) {
		this.domHelper = aDomHelper || theSettings.domHelper || de.titus.utils.DomHelper.getInstance();
		this.settings = new de.titus.TemplateEngineSettings(aTargetElement, this.domHelper);
		this.settings.initialize();
		if (theSettings != undefined) {
			this.settings = this.domHelper.mergeObjects(this.settings, theSettings);
		}
		
		this.$target = this.domHelper.toDomObject(aTargetElement);
		this.$template;
		this.data;
		this.options;
		
		this.isTemplateInit = false;
		this.isDataInit = false;
		this.isOptionInit = false;
		this.hasError = false;
	};
	
	de.titus.TemplateEngine.GLOBAL_VARIABLEN_REGEX = /\$\{([^\$\\{\}]*)\}/;
	de.titus.TemplateEngine.GLOBAL_ISFUNCTION_REGEX = /([^\(\)]*)(\([^\(\)]*\);?)/;
	
	de.titus.TemplateEngine.prototype.doTemplating = /* string */function() {
		if(this.settings.onLoad != undefined)
			this.domHelper.doEval(this.settings.onLoad, this.settings.options);
		var this_ = this;
		window.setTimeout(function() {
			this_.initTemplate();
			this_.initData();
			this_.doRendering();
		}, 1);
	};
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * init the Template definition
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	de.titus.TemplateEngine.prototype.initTemplate = /* void */function() {
		if (this.settings.templateMode == "id") {
			this.loadTemplateById();
		} else if (this.settings.templateMode == "remote") {
			this.loadTemplateByRemote();
		} else if (this.settings.templateMode == "function") {
			this.loadTemplateByFunction();
		}
	};
	
	de.titus.TemplateEngine.prototype.loadTemplateById = function() {
		var template = this.domHelper.getDomElementById(this.settings.template);
		var template = this.domHelper.getText(template);
		this.$template = this.domHelper.toDomObject(template);
		this.isTemplateInit = true;
	};
	
	de.titus.TemplateEngine.prototype.loadTemplateByRemote = function() {
		var this_ = this;
		var ajaxSettings = {
		'url' : this.evalText(this.settings.template, this.settings.options),
		'async' : this.settings.templateAsync,
		'cache' : false,
		'error' : function(){this_.hasError = true;}
		};
		ajaxSettings = this.domHelper.mergeObjects(ajaxSettings, this.settings.templateRemoteData);
		this.domHelper.doRemoteLoadHtml(ajaxSettings, function(template) {
			this_.$template = this_.domHelper.toDomObject(template);
			this_.isTemplateInit = true;
		});
	};
	
	de.titus.TemplateEngine.prototype.loadTemplateByFunction = function() {
		if (this.settings.templateAsync) {
			var this_ = this;
			window.setTimeout(function() {
				var template = eval(this_.settings.template);
				this_.$template = this_.domHelper.toDomObject(template);
				this_.isTemplateInit = true;
			}, 1);
		} else {
			var template = eval(this.settings.template);
			this.$template = this.domHelper.toDomObject(template);
			this.isTemplateInit = true;
		}
	};
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * init the content data
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	de.titus.TemplateEngine.prototype.initData = /* void */function() {
		if (this.settings.dataMode == "direct") {
			this.loadDataByDirect();
		} else if (this.settings.dataMode == "remote") {
			this.loadDataByRemote();
		} else if (this.settings.dataMode == "function") {
			this.loadDataByFunction();
		}
	};
	
	de.titus.TemplateEngine.prototype.loadDataByDirect = function() {
		this.data = this.settings.data || {};
		this.isDataInit = true;
	};
	
	de.titus.TemplateEngine.prototype.loadDataByRemote = function() {
		var this_ = this;
		var ajaxSettings = {
		'url' : this.evalText(this.settings.data, this.settings.options),
		'async' : this.settings.dataAsync,
		'cache' : false,
		'error' : function(){this_.hasError = true;}
		};
		ajaxSettings = this.domHelper.mergeObjects(ajaxSettings, this.settings.dataRemoteData);
		this.domHelper.doRemoteLoadJson(ajaxSettings, function(data) {
			this_.data = data;
			this_.isDataInit = true;
		});
	};
	
	de.titus.TemplateEngine.prototype.loadDataByFunction = function() {
		if (this.settings.dataAsync) {
			var this_ = this;
			window.setTimeout(function() {
				this_.data = eval(this_.settings.data);
				this_.isDataInit = true;
			}, 1);
		} else {
			this.data = eval(this.settings.data);
			this.isDataInit = true;
		}
	};
	
	/**
	 * 
	 */
	de.titus.TemplateEngine.prototype.doRendering = /* string */function() {
		if(this.hasError){
			if(this.settings.onError != undefined)
				this.domHelper.doEval(this.settings.onError, this.settings.options);
		}
		if (this.isTemplateInit && this.isDataInit) {
			this.domHelper.doRemoveChilds(this.$target);
			if (this.domHelper.isArray(this.data)) {
				for (var i = 0; i < this.data.length; i++) {
					this.internalRendering(this.data[i], this.options);
				}
			} else {
				this.internalRendering(this.data, this.options);
			}
			
			if(this.settings.onSuccess != undefined)
				this.domHelper.doEval(this.settings.onSuccess, this.settings.options);
		} else {
			var this_ = this;
			window.setTimeout(function() {
				this_.doRendering();
			}, 10);
		}
	};
	
	/**
	 * 
	 * @param theData
	 * @param theOptions
	 */
	de.titus.TemplateEngine.prototype.internalRendering = function(theData, theOptions) {
		var content = this.domHelper.cloneDomObject(this.$template);
		content = this.domHelper.toDomObject(content);
		this.processing(content, theData, theOptions);
		this.domHelper.setHtml(this.$target, content, "append");
	};
	
	/**
	 * 
	 * @param aElement
	 * @param theData
	 * @param theOptions
	 * @returns
	 */
	de.titus.TemplateEngine.prototype.processing = function(aElement, theData, theOptions) {
		if (this.processDirectives(aElement, theData, theOptions)) {
			var childs = this.domHelper.getChilds(aElement);
			if (childs != undefined) {
				for (var i = 0; i < childs.length; i++) {
					var child = this.domHelper.toDomObject(childs[i]);
					this.processing(child, theData, theOptions);
				}
			}
		}
	};
	
	/**
	 * 
	 * @param aElement
	 * @param theData
	 * @param theOptions
	 * @returns true, if the complety processed
	 */
	de.titus.TemplateEngine.prototype.processDirectives = function(aElement, theData, theOptions) {
		var result = true;
		result = result && this.processIfDirective(aElement, theData, theOptions);
		result = result && this.processChooseDirective(aElement, theData, theOptions);
		result = result && this.processTemplateReference(aElement, theData, theOptions);
		result = result && this.processForeachDirective(aElement, theData, theOptions);
		result = result && this.processContent(aElement, theData, theOptions);
		
		return result;
	};
	
	/**
	 * 
	 * @param aElement
	 * @param theData
	 * @param theOptions
	 * @returns {String}
	 */
	de.titus.TemplateEngine.prototype.processTemplateReference = function(aElement, theData, theOptions) {
		var definition = this.domHelper.getAttribute(aElement, this.settings.attributePrefix + 'template') || this.domHelper.getAttribute(aElement, this.settings.attributePrefix + 'template-remote') || this.domHelper.getAttribute(aElement, this.settings.attributePrefix + 'template-function');
		if (definition != undefined && definition.length != 0) {
			
			var executeTemplate = this.domHelper.getAttribute(aElement, this.settings.attributePrefix + 'template-execute') || true;
			if (executeTemplate != undefined) {
				executeTemplate = this.evalVariable(executeTemplate, aElement, theData, theOptions, true);
			}
			
			this.domHelper.doRemoveChilds(aElement);
			/*
			 * <code>var settings; var remoteData = this.domHelper.getAttribute(aElement, this.settings.attributePrefix + 'template-data-remote'); var data = theData; if(remoteData != undefined && de.titus.TemplateEngine.GLOBAL_VARIABLEN_REGEX.test(remoteData)){ var match = de.titus.TemplateEngine.GLOBAL_VARIABLEN_REGEX.exec(remoteData); data = this.evalVariable(match[1], aElement, theData, theOptions); settings.data = {}; settings.data = data; }</code>
			 */

			this.processAttributes(aElement, theData, theOptions, true);
			if (executeTemplate == true) {
				var templateEngine = new de.titus.TemplateEngine(this.domHelper, aElement);
				var data = theData || {};
				data = this.domHelper.mergeObjects(data, templateEngine.settings);
				templateEngine.settings = data;
				templateEngine.doTemplating();
			}
		}
		
		return true;
	};
	
	/**
	 * 
	 * @param aElement
	 * @param theData
	 * @param theOptions
	 * @returns {Boolean}
	 */
	de.titus.TemplateEngine.prototype.processChooseDirective = function(aElement, theData, theOptions) {
		var expression = this.domHelper.getAttribute(aElement, this.settings.attributePrefix + 'choose');
		
		if (expression != undefined) {
			var childs = this.domHelper.getChilds(aElement);
			var elseElement;
			var removeOthers = false;
			for (var i = 0; i < childs.length; i++) {
				var child = this.domHelper.toDomObject(childs[i]);
				if (!removeOthers) {
					var elseExpression = this.domHelper.getAttribute(child, this.settings.attributePrefix + 'else');
					var ifExpression = this.domHelper.getAttribute(child, this.settings.attributePrefix + 'if')
					if (elseElement == undefined && elseExpression != undefined) {
						elseElement = child;
					} else if (ifExpression != undefined && this.processIfDirective(child, theData, theOptions)) {
						this.domHelper.setAttribute(child, this.settings.attributePrefix + 'if')
						removeOthers = true;
					} else {
						this.domHelper.doRemove(child);
					}
				} else
					this.domHelper.doRemove(child);
			}
			
			if (removeOthers && elseElement != undefined)
				this.domHelper.doRemove(otherwiseElement);
		}
		return true;
	};
	
	/**
	 * 
	 * @param aElement
	 * @param theData
	 * @param theOptions
	 * @returns {Boolean}
	 */
	de.titus.TemplateEngine.prototype.processIfDirective = function(aElement, theData, theOptions) {
		var expression = this.domHelper.getAttribute(aElement, this.settings.attributePrefix + 'if');
		this.domHelper.setAttribute(aElement, this.settings.attributePrefix + 'if');
		
		var defaultValue = this.domHelper.getAttribute(aElement, this.settings.attributePrefix + 'if-default');
		if (expression != undefined) {
			var result = this.evalVariable(expression, theData, theOptions, undefined, false);
			
			if (result != true) {
				this.domHelper.doRemove(aElement);
				return false;
			}
		}
		
		return true;
	};
	
	de.titus.TemplateEngine.prototype.processForeachDirective = function(aElement, theData, theOptions) {
		var expression = this.domHelper.getAttribute(aElement, this.settings.attributePrefix + 'foreach');
		this.domHelper.setAttribute(aElement, this.settings.attributePrefix + 'foreach');
		
		if (expression != undefined && expression.length != 0) {
			var result = this.evalVariable(expression, theData, theOptions);
			
			if (this.domHelper.isArray(result)) {
				
				var varName = this.domHelper.getAttribute(aElement, this.settings.attributePrefix + 'foreach-var-item') || "item";
				var statusName = this.domHelper.getAttribute(aElement, this.settings.attributePrefix + 'foreach-var-status') || "status";
				var repeatContent = this.domHelper.getAttribute(aElement, this.settings.attributePrefix + 'foreach-repeat-content') || false;
				repeatContent = this.domHelper.doEval(repeatContent, false);
				
				var baseElement;
				var templates;
				if (repeatContent) {
					baseElement = aElement;
					var childs = this.domHelper.getChilds(aElement);
					templates = this.convertToTemplate(childs);
					this.domHelper.doRemove(childs);
					
				} else {
					baseElement = this.domHelper.getParent(aElement);
					templates = this.convertToTemplate(aElement);
					
				}
				
				for (var i = 0; i < result.length; i++) {
					var status = {
					"index" : i,
					"number" : (i + 1),
					"count" : result.length,
					"list" : result };
					var data = {};
					data[varName] = result[i];
					data[statusName] = status;
					
					this.processForeachTemplates(baseElement, templates, data, theOptions);
				}
			}
			else{
				this.domHelper.doRemove(aElement);
			}
			
			return false;
		} else {
			// there is no foreach directiv avalible
			return true;
		}
	};
	
	/**
	 * 
	 * @param aElement
	 * @returns {Array}
	 */
	de.titus.TemplateEngine.prototype.convertToTemplate = function(aElement) {
		var templates = new Array();
		if (this.domHelper.isArray(aElement)) {
			for (var i = 0; i < aElement.length; i++) {
				templates.push(this.domHelper.toDomObject(aElement[i]));
			}
		} else {
			templates.push(this.domHelper.toDomObject(aElement));
		}
		
		return templates;
	};
	
	/**
	 * 
	 * @param aElement
	 * @param theChilds
	 * @param theData
	 * @param theOptions
	 */
	de.titus.TemplateEngine.prototype.processForeachTemplates = function(aElement, theTemplates, theData, theOptions) {
		for (var i = 0; i < theTemplates.length; i++) {
			var content = this.domHelper.cloneDomObject(theTemplates[i]);
			content = this.domHelper.toDomObject(content);
			this.domHelper.setHtml(aElement, content, "append");
			this.processing(content, theData, theOptions);
			
		}
	};
	
	/**
	 * 
	 * @param aElement
	 * @param theData
	 * @param theOptions
	 * @returns {String}
	 */
	de.titus.TemplateEngine.prototype.processContent = function(aElement, theData, theOptions) {
		var dataFormatter = this.domHelper.getAttribute(aElement, this.settings.attributePrefix + 'formatter');
		var undefinedValue = this.domHelper.getAttribute(aElement, this.settings.attributePrefix + 'undefined-value');
		
		if (this.domHelper.getChildCount(aElement) == 0) {
			var content = this.domHelper.getText(aElement);
			content = this.evalText(content, theData, theOptions, dataFormatter, undefinedValue);
			this.domHelper.setHtml(aElement, content);
			this.processAttributes(aElement, theData, theOptions);
			return false;
		}
		
		this.processAttributes(aElement, theData, theOptions, dataFormatter, undefinedValue);
		return true;
	};
	
	/**
	 * 
	 * @param aElement
	 * @param theData
	 * @param theOptions
	 */
	de.titus.TemplateEngine.prototype.processAttributes = function(aElement, theData, theOptions, all, theDataformatter, theUndefinedValue) {
		var attributes = this.domHelper.getAttributes(aElement);
		var processAll = all || false;
		for ( var name in attributes) {
			if (processAll || this.settings.attributePrefix == undefined || this.settings.attributePrefix.lenght == 0 || name.indexOf(this.settings.attributePrefix) != 0) {
				var value = attributes[name];
				value = this.evalText(value, theData, theOptions, theDataformatter, theUndefinedValue);
				this.domHelper.setAttribute(aElement, name, value);
			}
		}
	};
	
	de.titus.TemplateEngine.prototype.evalText = function(aText, theData, theOptions, theDataformatter, theUndefinedValue) {
		var content = aText;
		var runValue = aText;
		while (de.titus.TemplateEngine.GLOBAL_VARIABLEN_REGEX.test(runValue)) {
			var match = de.titus.TemplateEngine.GLOBAL_VARIABLEN_REGEX.exec(runValue);
			var result = this.evalVariable(match[0], theData, theOptions, theDataformatter, theUndefinedValue);
			if (result != undefined) {
				content = content.replace(match[0], result);
			}
			runValue = runValue.replace(match[0], "");
		}
		
		return content;
	}

	/**
	 * 
	 * @param aVariable
	 * @param aElement
	 * @param theData
	 * @param theOptions
	 * 
	 * @returns returns the value of "aVariable"
	 */
	de.titus.TemplateEngine.prototype.evalVariable = function(aVariable, theData, theOptions, aDefaultValue, theDataformatter, theUndefinedValue) {
		var dataFormatter = theDataformatter;
		var undefinedValue = theUndefinedValue;
		var variable = aVariable;
		
		var data = theData || {};
		var match = de.titus.TemplateEngine.GLOBAL_VARIABLEN_REGEX.exec(aVariable);
		if(match != undefined)
			variable = match[1];
		
		if (de.titus.TemplateEngine.GLOBAL_ISFUNCTION_REGEX.test(aVariable)) {
			var functionMatch = de.titus.TemplateEngine.GLOBAL_ISFUNCTION_REGEX.exec(variable);
			variable = functionMatch[1];
		}
		
		var result = this.domHelper.doEvalWithContext(variable, data);
		if (this.domHelper.isFunction(result)) {
			result = result(data);
		}
		
		if (dataFormatter != undefined) {
			var formatFunction = this.domHelper.doEvalWithContext(variable, data);
			if (formatFunction != undefined && this.domHelper.isFunction(formatFunction)) {
				result = formatFunction(result);
			}
		}
		if (result == undefined && undefinedValue == undefined) {
			return aDefaultValue;
		} else if (result == undefined && undefinedValue != undefined) {
			return undefinedValue;
		} else {
			return result;
		}
	};
	
});
de.titus.core.Namespace.create("de.titus.TemplateEngineSettings", function(){

	de.titus.TemplateEngineSettings = /* constructor */function(aTargetElement, aDomHelper) {
		this.domHelper = aDomHelper || de.titus.utils.DomHelper.getInstance();
		this.target = this.domHelper.toDomObject(aTargetElement);

		this.template;
		this.templateMode = 'id'; // id, remote, function
		this.templateAsync = true;
		this.templateRemoteData = {};

		this.data;
		this.dataMode = 'direct'; // direct, remote, function
		this.dataAsync = true;
		this.dataRemoteData = {};

		this.options = {};

		this.onLoad = undefined;
		this.onSuccess = undefined;
		this.onError = undefined;
		
		this.attributePrefix = "tpl-";
	};

	/**
	 * Initialize all required settings.
	 *
	 * @param theOverrideSettings
	 */
	de.titus.TemplateEngineSettings.prototype.initialize = function() {

		this.templateRemoteData = this.domHelper.doEval(this.domHelper.getAttribute(this.target, this.attributePrefix +'template-remote-data'), {}) || {};
		this.dataRemoteData = this.domHelper.doEval(this.domHelper.getAttribute(this.target, this.attributePrefix+'template-data-remote-data'), {}) || {};
		this.options = this.domHelper.doEval(this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-options'), {}) || {};
		this.initTemplateSettings();
		this.initDataSettings();
		this.onLoad = this.domHelper.getAttribute(this.target, this.attributePrefix +'on-load');
		this.onSuccess = this.domHelper.getAttribute(this.target, this.attributePrefix +'on-success');
		this.onError = this.domHelper.getAttribute(this.target, this.attributePrefix +'on-error');
	};

	/**
	 * Initialize the settings for the template
	 */
	de.titus.TemplateEngineSettings.prototype.initTemplateSettings = function() {
		if (this.template != undefined) {
			return;
		} else if (this.domHelper.getAttribute(this.target, this.attributePrefix + 'template') != undefined) {
			this.template = this.domHelper.doEval(this.domHelper.getAttribute(this.target, this.attributePrefix + 'template'));
			this.templateMode = 'id';
		} else if (this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-remote') != undefined) {
			this.template = this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-remote');
			this.templateMode = 'remote';
		} else if (this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-function') != undefined) {
			this.template = this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-function');
			this.templateMode = 'function';
		}
	};

	/**
	 * Initialize the settings for the data
	 */
	de.titus.TemplateEngineSettings.prototype.initDataSettings = function() {
		if (this.data != undefined) {
			return;
		} else if (this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-data') != undefined) {
			this.data = this.domHelper.doEval(this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-data'));
			this.dataMode = 'direct';
		} else if (this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-data-remote') != undefined) {
			this.data = this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-data-remote');
			this.dataMode = 'remote';
		} else if (this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-data-function') != undefined) {
			this.data = this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-data-function');
			this.dataMode = 'function';
		}
	};
});

de.titus.core.Namespace.create("de.titus.jquery.TemplateEnginePlugin", function(){
	(function($) {
		$.fn.doTemplating = function(/* settings */ theSettings) {
			var templateEngine = new de.titus.TemplateEngine( de.titus.jquery.DomHelper.getInstance(),this, theSettings);
			templateEngine.doTemplating();
		};

	}(jQuery));
});
de.titus.core.Namespace.create("de.titus.jquery.DomHelper", function() {
	
	/**
	 * Constructor of DomHelper for JQuery
	 */
	de.titus.jquery.DomHelper = function() {
	};
	
	/**
	 * extents de.titus.jquery.DomHelper
	 */
	de.titus.jquery.DomHelper.prototype = new de.titus.core.DomHelper();
	de.titus.jquery.DomHelper.prototype.constructor = de.titus.jquery.DomHelper;
	
	/**
	 * 
	 * @param aElement
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.toDomObject = function(aElement) {
		return $(aElement);
	};
	
	/**
	 * 
	 * @param aElement
	 */
	de.titus.jquery.DomHelper.prototype.cloneDomObject = function(aElement) {
		return aElement.clone();
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.getAttribute = function(aDomElementObject, /* string */anAttribute) {
		return aDomElementObject.attr(anAttribute);
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getAttributes = function(aDomElementObject) {
		var attributes = {};
		$.each(aDomElementObject.get(0).attributes, function(i, attrib){
		    attributes[attrib.name] = attrib.value;
		});
		return attributes;
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 * @param aValue
	 */
	de.titus.jquery.DomHelper.prototype.setAttribute = function(aDomElementObject, /* string */anAttribute, /* string */aValue) {
		if (aValue == undefined)
			aDomElementObject.removeAttr(anAttribute);
		else
			aDomElementObject.attr(anAttribute, aValue);
	};
	
	/**
	 * Get the width of element. 
	 * 
	 * @param aDomElementObject
	 * @returns int, width in px
	 */
	de.titus.core.DomHelper.prototype.getWith = function(aDomElementObject){
		return aDomElementObject.width();
	};
	
	/**
	 * Set the width of element.
	 * 
	 * 
	 * @param aDomElementObject
	 * @param aWidth, width in px
	 */
	de.titus.core.DomHelper.prototype.setWith = function(aDomElementObject, aWidth){
		aDomElementObject.width(aWidth);
	};
	
	/**
	 * Get the width from the content area of element. (width of element - padding-left -padding-right)
	 * 
	 * @param aDomElementObject
	 * @returns int, width in px
	 */
	de.titus.core.DomHelper.prototype.getContentWith = function(aDomElementObject){
		return aDomElementObject.innerWidth();
	};
	
	/**
	 * Set the width from the content area of element. 
	 * 
	 * @param aDomElementObject
	 * @param aWidth
	 */
	de.titus.core.DomHelper.prototype.setContentWith = function(aDomElementObject, aWidth){
		aDomElementObject.innerWidth(aWidth);
	};
	
	/**
	 * Get the height of element.
	 * 
	 * @param aDomElementObject
	 * @returns int, height in px
	 */
	de.titus.core.DomHelper.prototype.getHeight = function(aDomElementObject){
		return aDomElementObject.height();
	};
	
	/**
	 * Set the height of element.
	 * 
	 * @param aDomElementObject
	 * @param aHeight
	 */
	de.titus.core.DomHelper.prototype.setHeight = function(aDomElementObject, aHeight){
		aDomElementObject.height(aHeight);
	};
	
	/**
	 * Get the height from the content area of element. (width of element - padding-top -padding-bottom)
	 * 
	 * @param aDomElementObject
	 * @returns int, height in px
	 */
	de.titus.core.DomHelper.prototype.getContentHeight = function(aDomElementObject){
		return aDomElementObject.innerHeight();
	};
	
	/**
	 * Get the height from the content area of element.
	 * 
	 * @param aDomElementObject
	 * @param aHeight
	 */
	de.titus.core.DomHelper.prototype.setContentHeight = function(aDomElementObject, aHeight){
		aDomElementObject.innerHeight(aHeight);
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.getChilds = function(aDomElementObject) {
		return aDomElementObject.children() || new Array();
	};
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getChildCount = function(aDomElementObject) {
		return this.getChilds(aDomElementObject).length;
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.getParent = function(aDomElementObject) {
		return aDomElementObject.parent();
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.getHtml = function(aDomElementObject) {
		return aDomElementObject.html();
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param aHtml
	 * @param aType
	 *            values -> append, prepend, replace, [undefined]
	 */
	de.titus.jquery.DomHelper.prototype.setHtml = function(aDomElementObject, aHtml, aType) {
		if (aType == undefined) {
			aDomElementObject.html(aHtml);
		} else if (aType == "append") {
			aDomElementObject.append(aHtml);
		} else if (aType == "prepend") {
			aDomElementObject.prepend(aHtml);
		} else if (aType == "replace") {
			aDomElementObject.html(aHtml);
		} else {
			throw "The type \"" + aType + "\" is not supported!";
		}
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.jquery.DomHelper.prototype.getText = function(aDomElementObject) {
		return aDomElementObject.text();
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param aText
	 * @param aType
	 *            values -> append, prepend, replace, [undefined]
	 */
	de.titus.jquery.DomHelper.prototype.setText = function(aDomElementObject, aText, aType) {
		if (aType == undefined) {
			aDomElementObject.text(aText);
		} else if (aType == "append") {
			var currentText = aDomElementObject.text();
			aDomElementObject.append(aText + currentText);
		} else if (aType == "prepend") {
			var currentText = aDomElementObject.text();
			aDomElementObject.append(currentText + aText);
		} else if (aType == "replace") {
			aDomElementObject.text(aText);
		} else {
			throw "The type \"" + aType + "\" is not supported!";
		}
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.jquery.DomHelper.prototype.doRemove = function(aDomElementObject) {
		if ($.isArray(aDomElementObject)) {
			for (var i = 0; i < aDomElementObject.length; i++) {
				aDomElementObject[i].remove();
			}
		} else {
			aDomElementObject.remove();
		}
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.jquery.DomHelper.prototype.doRemoveChilds = function(aDomElementObject) {
		aDomElementObject.empty();
	};
	
	/**
	 * 
	 * @param aId
	 */
	de.titus.jquery.DomHelper.prototype.getDomElementById = function(aId) {
	};
	
	/**
	 * 
	 * @param theSettings
	 * @param aCallback
	 */
	de.titus.jquery.DomHelper.prototype.doRemoteLoadHtml = function(theSettings, aCallback) {
		var settings = {
		dataType : "html",
		success : aCallback };
		settings = $().extend(theSettings, settings);
		$.ajax(settings);
	};
	
	/**
	 * 
	 * @param theSettings
	 * @param aCallback
	 */
	de.titus.jquery.DomHelper.prototype.doRemoteLoadJson = function(theSettings, aCallback) {
		var settings = {
		dataType : "json",
		success : aCallback };
		settings = $().extend(theSettings, settings);
		$.ajax(settings);
	};
	
	/**
	 * 
	 * @param aObject1
	 * @param aObject2
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.mergeObjects = function(aObject1, aObject2) {
		return $().extend(aObject1, aObject2);
	};
	
	/**
	 * @param aVariable
	 * 
	 * @returns true, it the parameter a function.
	 */
	de.titus.jquery.DomHelper.prototype.isFunction = function(aVariable) {
		return $.isFunction(aVariable);
	};
	
	/**
	 * 
	 * @param aVariable
	 * 
	 * @returns true, if the parameter a array;
	 */
	de.titus.core.DomHelper.prototype.isArray = function(aVariable) {
		return $.isArray(aVariable) || aVariable.length != undefined;
	};
	
	/**
	 * Call the function, after dom is ready!
	 * 
	 * @param afunction
	 * 
	 */
	de.titus.core.DomHelper.prototype.doOnReady = function(aFunction) {
		$(document).ready(aFunction);		
	};
	
	/**
	 * 
	 */
	de.titus.jquery.DomHelper.getInstance = function() {
		return new de.titus.jquery.DomHelper();
	};
	
	de.titus.core.DomHelper.getInstance = function() {
		return new de.titus.jquery.DomHelper();
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


