de.titus.core.Namespace.create("de.titus.logging.LoggerFactory", function() {
	
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
	
	
});