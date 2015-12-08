de.titus.core.Namespace.create("de.titus.form.TextField", function() {

	de.titus.form.TextField =  function(aData){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.TextField.prototype.constructor()");
		}
		this.init(aData);
	};	
	
	de.titus.form.TextField.prototype = Object.create(de.titus.form.Field.prototype);
	de.titus.form.TextField.prototype.constructor = de.titus.form.TextField;
	de.titus.form.TextField.prototype.parent = de.titus.form.Field.prototype;
	
	de.titus.form.TextField.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.TextField");
	
	de.titus.form.TextField.prototype.init = function(aData){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.TextField.prototype.init()");
		}
		this.parent.init.call(this, aData);
		if(this.data.element.is("input[type='text']"))
			this.data.inputElement = this.data.element;
		else
			this.data.inputElement = this.data.element.find("input[type='text']");
		
		var $__THIS__$ = this;
		this.data.inputElement.bind( "keyup", this.__valueChangeEvent.bind(this));
	};
	
	de.titus.form.TextField.prototype.__valueChangeEvent = function(){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.TextField.prototype.__valueChangeEvent()");
		}
		if(this.changeEventTimeoutid)
			clearTimeout(this.changeEventTimeoutid);
		
		this.changeEventTimeoutid = setTimeout(this.parent.__valueChangeEvent.bind(this), this.data.validateTimeout);
	};	
		
	de.titus.form.TextField.prototype.readValues = function(){
		if(de.titus.form.TextField.LOGGER.isDebugEnabled()){
			de.titus.form.TextField.LOGGER.logDebug("call de.titus.form.TextField.prototype.readValue() -> " + this.data.inputElement.val());
		}
		var value = this.data.inputElement.val();
		if(value == undefined || value == "")
			return [];
		
		return [value];
	};
	
	de.titus.form.FieldtypeRegistry.add("text", de.titus.form.TextField);
});
