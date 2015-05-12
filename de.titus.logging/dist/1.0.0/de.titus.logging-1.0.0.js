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