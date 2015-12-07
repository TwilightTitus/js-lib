de.titus.core.Namespace.create("de.titus.form.TextField", function() {

	de.titus.form.TextField =  function(aData){
		de.titus.form.Field.call(this, aData);
		this.data.inputElement = this.data.element.find("input");
	};		
	de.titus.form.TextField.prototype = Object.create(de.titus.form.Field.prototype);
	de.titus.form.TextField.prototype.constructor = de.titus.form.TextField;
	
	de.titus.form.TextField.prototype.init = function(){		
		
	};
	
	
	
	
		
	de.titus.form.TextField.prototype.readValue = function(){		
		return this.data.inputElement.val();
	};
	
	de.titus.form.FieldtypeRegistry.add("text", de.titus.form.TextField);
});
