de.titus.core.Namespace.create("de.titus.logging.LoggerFactory", function() {
	
	de.titus.logging.LoggerFactory = function() {
		this.configs = undefined;
		this.domHelper = de.titus.core.DomHelper.getInstance();
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
		
		var configElement = this.domHelper.toDomObject("[logging-properties]");
		if (configElement != undefined && (configElement.length == undefined || configElement.length == 1)) {
			var propertyString = this.domHelper.getAttribute(configElement, "logging-properties");
			var properties = this.domHelper.doEval(propertyString, {});
			this.loadConfig(properties);
		} else {
			this.domHelper.doOnReady(function() {
				de.titus.logging.LoggerFactory.getInstance().doLoadLazy();
			});
		}
	};
	
	de.titus.logging.LoggerFactory.prototype.doLoadLazy = function() {
		if (this.loadLazyCounter > 10)
			return;
		this.loadLazyCounter++;
		window.setTimeout(function() {
			de.titus.logging.LoggerFactory.getInstance().loadConfig();
		}, 100);
	};
	
	de.titus.logging.LoggerFactory.prototype.loadConfig = function(aConfig) {
		if (aConfig == undefined)
			this.updateConfigs();
		else {
			if (aConfig.domHelper)
				this.domHelper = aConfig.domHelper;
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
		'async' : false,
		'cache' : false };
		ajaxSettings = this.domHelper.mergeObjects(ajaxSettings, aRemoteData);
		this.domHelper.doRemoteLoadJson(ajaxSettings, function(data) {
			this_.setConfig(data.configs);
		});
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
		"appenders" : [] };
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
				appender = this.domHelper.doEval("new " + appenderString + "();");
				if (appender != undefined) {
					appender.domHelper = this.domHelper;
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
