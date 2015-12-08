de.titus.core.Namespace.create("de.titus.form.MessageControllerController", function() {

	de.titus.form.MessageController = function(aData){
		if(de.titus.form.MessageController.LOGGER.isDebugEnabled()){
			de.titus.form.MessageController.LOGGER.logDebug("call de.titus.form.MessageController.prototype.constructor()");
		}
		this.init(aData);
	};
	de.titus.form.MessageController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.MessageController");
	
	de.titus.form.MessageController.prototype.init = function(aData){
		if(de.titus.form.MessageController.LOGGER.isDebugEnabled()){
			de.titus.form.MessageController.LOGGER.logDebug("call de.titus.form.MessageController.prototype.init()");
		}
		this.data = {
				element: undefined,
				field: undefined
			};
			$.extend(true, this.data, aData);
			this.data.element.data("de.titus.form.MessageController", this);
		};
	
	de.titus.form.MessageController.prototype.setMessage = function(aMessage){
		if(de.titus.form.MessageController.LOGGER.isDebugEnabled()){
			de.titus.form.MessageController.LOGGER.logDebug("call de.titus.form.MessageController.prototype.setMessage()");
		}
		this.data.element.empty();
		this.data.element.html(aMessage);
		this.show(true);
	};
	
	de.titus.form.MessageController.prototype.doClear = function(){
		if(de.titus.form.MessageController.LOGGER.isDebugEnabled()){
			de.titus.form.MessageController.LOGGER.logDebug("call de.titus.form.MessageController.prototype.doClear()");
		}
		this.data.element.empty();
		this.show(false);
	};
		
	de.titus.form.MessageController.prototype.show = function(show){
		if(de.titus.form.MessageController.LOGGER.isDebugEnabled()){
			de.titus.form.MessageController.LOGGER.logDebug("call de.titus.form.MessageController.prototype.show()");
		}
		if(show)		
			this.data.element.show();
		else
			this.data.element.hide();
	};
});
