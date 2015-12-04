de.titus.core.Namespace.create("de.titus.form.Field", function() {

	de.titus.form.Field = function(aData){
		this.data = {
			element: undefined,
			type: undefined,
			validator: undefined,
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
	
	de.titus.form.Field.prototype.__valueChangeEvent = function(){
		//TODO READ VALUE FROM DOM
		this.data.value = "NEW VALUE";
		
		if(this.isValid())
			this.data.form.fireEvent("isValid", this);
	};
	
	de.titus.form.Field.prototype.isValid = function(){		
		return this.data.validator.validate(this.data.value, this);
	};
	
	$.fn.FormField = function(){
		if(this.length > 1){
			return this.each(function(){return $(this).FormField();});
		}
		
		return this.data.element.data("de.titus.form.Field");
	};	
});
