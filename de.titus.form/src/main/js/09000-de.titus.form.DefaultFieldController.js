(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DefaultFieldController", function() {
		var DefaultFieldController = function(aElement, aFieldname, aValueChangeListener) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			this.fieldname = aFieldname;
			this.valueChangeListener = aValueChangeListener;
			this.input = undefined;
			this.type = undefined;
			this.filedata = undefined;
			this.timeoutId == undefined;
			
			this.init();
		};
		DefaultFieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DefaultFieldController");
		
		DefaultFieldController.prototype.init = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("init()");
			
			if (this.element.find("select").length == 1) {
				this.type = "select";
				this.element.find("select").on("change", this.valueChangeListener);
			} else {
				if (this.element.find("input[type='radio']").length > 0){
					this.type = "radio";
					this.element.find("input[type='radio']").on("change", this.valueChangeListener);
				}
				if (this.element.find("input[type='checkbox']").length > 0){
					this.type = "checkbox";
					this.element.find("input[type='checkbox']").on("change", this.valueChangeListener);
				}
				else if (this.element.find("input[type='file']").length == 1){
					this.type = "file";
					this.element.find("input[type='file']").on("change", DefaultFieldController.prototype.readFileData.bind(this));
				}
				else{
					this.type = "text";
					this.element.find("input, textarea").on("keyup change", (function(aEvent){
						if(this.timeoutId != undefined){
							window.clearTimeout(this.timeoutId);
						}
						
						this.timeoutId = window.setTimeout((function(){
							this.valueChangeListener(aEvent);
						}).bind(this), 300);
						
					}).bind(this));
				}
				
			}
			
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("init() -> detect type: " + this.type);
		};		
		
		DefaultFieldController.prototype.readFileData = function(aEvent) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("readFileData()");
			
			var input = aEvent.target;
			var multiple = input.files.length > 1;
			if (multiple)
				this.fileData = [];
			else
				this.fileData = undefined;
			
			var $__THIS__$ = this;
			var reader = new FileReader();
			var count = input.files.length;
			reader.addEventListener("load", function() {
				if (DefaultFieldController.LOGGER.isDebugEnabled())
					DefaultFieldController.LOGGER.logDebug("readFileData() -> reader load event!");
				
				count--;
				if (multiple)
					$__THIS__$.fileData.push(reader.result);
				else
					$__THIS__$.fileData = reader.result;
				
				if(count == 0)
					$__THIS__$.valueChangeListener(aEvent);
			}, false);
			
			var textField = this.element.find("input[type='text'][readonly]");
			if(textField.length == 1)
				textField.val("");
			for (var i = 0; i < input.files.length; i++){
				reader.readAsDataURL(input.files[i]);
				if(textField.length == 1)
					textField.val(textField.val() != "" ? textField.val() + ", " + input.files[i].name : input.files[i].name);				
			}
			
			
			
			
		};

		DefaultFieldController.prototype.showField = function(aData) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("showField()");
			
			if (this.type == "select")
				this.element.find("select").prop("disabled", false);
			else
				this.element.find("input, textarea").prop("disabled", false);
			this.element.show();
		};
		
		DefaultFieldController.prototype.showSummary = function(isSummary) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("showSummary()");
			
			if(isSummary){
				if (this.type == "select")
					this.element.find("select").prop("disabled", true);
				else
					this.element.find("input, textarea").prop("disabled", true);
			}
			else{
				if (this.type == "select")
					this.element.find("select").prop("disabled", false);
				else
					this.element.find("input, textarea").prop("disabled", false);
			}			
		};
		
		DefaultFieldController.prototype.hideField = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("hideField()");		
			
			this.element.hide()
		};
		
		DefaultFieldController.prototype.setValid = function(isValid, aMessage) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("setValid() -> " + isValid + " - \"" + aMessage + "\"");
			
		};
		
		DefaultFieldController.prototype.getValue = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("getValue()");
			
			if (this.type == "select")
				return this.element.find("select").val();
			else if (this.type == "radio")
				return this.element.find("input:checked").val();
			else if (this.type == "checkbox"){
				var result = [];
				this.element.find("input:checked").each(function(){result.push($(this).val());});
				return result;
			}
			else if (this.type == "file")
				return this.fileData;
			else
				return this.element.find("input, textarea").first().val();
		};
		
		de.titus.form.Registry.registFieldController("default", function(aElement, aFieldname, aValueChangeListener) {
			return new DefaultFieldController(aElement, aFieldname, aValueChangeListener);
		});
		
		de.titus.form.DefaultFieldController = DefaultFieldController;
	});
})();
