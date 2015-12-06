de.titus.core.Namespace.create("de.titus.form.Field", function() {

	de.titus.form.Field = function(aData){
		this.data = {
			element: undefined,
			type: undefined,
			validator: undefined,
			message: undefined,
			dependencies: undefined,
			load: undefined,
			form: undefined,
			value: undefined
		};
		$.extend(true, this.data, aData);
		this.data.element.data("de.titus.form.Field", this);		
		this.init();
	};
	
	de.titus.form.Field.prototype.init = function(){
		
	};
		
	de.titus.form.Field.prototype.show = function(show){
		if(show)		
			this.data.element.show();
		else
			this.data.element.hide();
	};
	
	de.titus.form.Field.prototype.doLoad = function(){
	};
	
	de.titus.form.Field.prototype.readValue = function(){
		return "";
	};
	
	de.titus.form.Field.prototype.isValid = function(){		
		return this.data.validator.doValidate(this.data.value, this);
	};
	
	de.titus.form.Field.prototype.__valueChangeEvent = function(){
		this.data.value = this.readValue();		
		if(this.isValid())
			this.data.form.fireEvent("valid", this);
		else
			this.data.form.fireEvent("invalid", this);
	};
	
	$.fn.FormField = function(){
		if(this.length > 1){
			return this.each(function(){return $(this).FormField();});
		}
		
		return this.data.element.data("de.titus.form.Field");
	};	
});
