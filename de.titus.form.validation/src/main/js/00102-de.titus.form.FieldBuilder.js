de.titus.core.Namespace.create("de.titus.form.FieldBuilder", function() {
	
	de.titus.form.FieldBuilder.buildFields = function(aElement, aForm) {
		var childs = aElement.children();
		if (childs == undefined || childs.length == 0)
			return [];
		
		var fields = [];
		for (var i = 0; i < childs.length; i++) {
			var child = $(childs[i]);
			var name = child.attr(aForm.settings.prefix + "field");
			if (name != undefined) {
				var field = de.titus.form.FieldBuilder.buildField(child, aForm);
				if (field != undefined)
					fields.push(field);
			} else
				fields = $.merge(fields, de.titus.form.FieldBuilder.buildFields(child, aForm));
			
		}
		
		return fields;
	};
	
	de.titus.form.FieldBuilder.buildField = function(aElement, aForm) {
		var field = aElement.data("de.titus.form.Field");
		if (field == undefined && aForm != undefined) {
			var data = {
			name : aElement.attr(aForm.settings.prefix + "field"),
			type : aElement.attr(aForm.settings.prefix + "field-type")
			};
			
			var fieldConstructor = de.titus.form.Registry.getFieldType(data.type);
			field = fieldConstructor(aElement, aForm);
			aElement.data("de.titus.form.Field", field);
		}
		
		return field;
	};
	
	$.fn.FormField = function() {
		if (this.length == undefined || this.length == 0)
			return;
		else if (this.length > 1)
			return this.each(function() {
				return $(this).FormField();
			});
		else
			return de.titus.form.FieldBuilder.buildField(this);
	};
});
