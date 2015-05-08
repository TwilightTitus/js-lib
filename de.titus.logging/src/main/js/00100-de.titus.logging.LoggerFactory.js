de.titus.core.Namespace.create("de.titus.logging.LoggerFactory", function() {
	
	de.titus.logging.LoggerFactory = function(){
		
	};
	de.titus.logging.LoggerFactory.prototype.newLogger(LoggerName){
		return;
	};
	
	
	
	
	de.titus.logging.LoggerFactory.INSTANCE = new de.titus.logging.LoggerFactory();
	de.titus.logging.LoggerFactory.getInstance = function(){
		if(de.titus.logging.LoggerFactory.INSTANCE == undefined)
			de.titus.logging.LoggerFactory.INSTANCE = new de.titus.logging.LoggerFactory();
		
		return de.titus.logging.LoggerFactory.INSTANCE;
	};
	
	
});