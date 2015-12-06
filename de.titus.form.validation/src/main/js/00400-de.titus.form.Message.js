de.titus.core.Namespace.create("de.titus.form.Message", function() {

	de.titus.form.Message = function(aData){
		this.data = {
			element: undefined
		};
		$.extend(true, this.data, aData);
		this.data.element.data("de.titus.form.Message", this);		
		this.init();
	};
	
	de.titus.form.Message.prototype.init = function(){
		
	};
	
	de.titus.form.Message.prototype.setMessage = function(aMessage){
		this.data.element.empty();
		this.data.element.html(aMessage);
		this.show(true);
	};
	
	de.titus.form.Message.prototype.doClear = function(){
		this.data.element.empty();
		this.show(false);
	};
		
	de.titus.form.Message.prototype.show = function(show){
		if(show)		
			this.data.element.show();
		else
			this.data.element.hide();
	};
	
	$.fn.FormMessage = function(){
		if(this.length > 1){
			return this.each(function(){return $(this).FormMessage();});
		}
		
		return this.data.element.data("de.titus.form.Message");
	};	
});
