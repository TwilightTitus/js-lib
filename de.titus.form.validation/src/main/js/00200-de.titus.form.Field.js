de.titus.core.Namespace.create("de.titus.form.validation.Field", function() {

	de.titus.form.validation.Validator = function(aElement){
		this.element = aElement;
		this.name = aElement.attr("fv-fieldname");
		this.dependencies = aElement.attr("fv-dependencies");
		this.type = aElement.attr("fv-type");
		this.load = aElement.attr("fv-load");
		this.form = undefined;
	};
	
	de.titus.form.validation.Validator.prototype.init = function(aForm){
		this.form = aForm;
	};
	
	de.titus.form.validation.Validator.prototype.doLoad = function(){
		if(this.load != undefined){
			this.load(this)
		}
	};
	
	de.titus.form.validation.Validator.prototype.isValid = function(){		
		return ;
	};
	
	de.titus.form.validation.Validator.prototype.doValidRule = function(){		
		return true;
	};
	
	de.titus.form.validation.Validator.prototype.doValidRemote = function(){		
		return ;
	};
	
	
});
