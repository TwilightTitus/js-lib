(function($, ExpressionResolver) {
	de.titus.core.Namespace.create("de.titus.jquery.Typeahead", function() {
		var Typeahead = de.titus.jquery.Typeahead = function(aElement, aData) {
			this.element = aElement;
			this.suggestionBox = undefined;
			this.data = aData || {};
			this.timeoutId = undefined;
			this.init();
		};
		
		Typeahead.prototype.init = function() {
			if (this.data.inputAction == undefined || typeof this.data.inputAction !== "function") {
				this.data.inputAction = ExpressionResolver.resolveExpression(this.element.attr("typeahead-input-action"));
				if (typeof this.data.inputAction !== "function")
					throw "Typeahead input action ist not a function!";
			}
			
			if (this.data.display == undefined)
				this.data.display = this.element.attr("typeahead-display");
			
			if (this.data.displayMarker == undefined)
				this.data.displayMarker = (this.element.attr("typeahead-display-marker") != undefined);
			
			if (this.data.interval == undefined)
				this.data.inputInterval = parseInt(this.element.attr("typeahead-input-interval") || "300");
			
			if (this.data.inputSize == undefined)
				this.data.inputSize = parseInt(this.element.attr("typeahead-input-size") || "1");
			
			if (this.data.template == undefined)
				this.data.template = this.element.attr("typeahead-template");
			
			this.suggestionBox = $("<div></div>");
			this.suggestionBox.addClass("typeahead-suggestion-box");
			this.suggestionBox.attr("jstl-ignore", "");
			
			var innerBox = $("<div></div>");
			innerBox.addClass("typeahead-suggestion-inner-box");
			innerBox.attr("jstl-include", this.data.template);
			
			
			this.suggestionBox.append(innerBox);
			$("body").append(this.suggestionBox);
			
			this.element.on("keyup change", Typeahead.prototype.inputHandle.bind(this));			
		};
		
		Typeahead.prototype.inputHandle = function() {
			if (this.timeoutId)
				clearTimeout(this.timeoutId);
			
			var value = (this.element.val() || "").trim();
			if (value.length >= this.data.inputSize)
				this.timeoutId = setTimeout(Typeahead.prototype.callInputAction.bind(this, value), this.data.inputInterval);
			else
				this.hideSuggestionBox();
		};
		
		Typeahead.prototype.callInputAction = function(aValue) {
			this.data.inputAction(aValue, Typeahead.prototype.inputActionCallback.bind(this, aValue));
		};
		
		Typeahead.prototype.inputActionCallback = function(aValue, aValues) {
			var value = (this.element.val() || "").trim();
			if (value == aValue) {
				var items = this.transformValues(aValue, aValues);
				this.suggestionBox.jstl({
				    data : {
				        value : aValue,
				        items : items
				    },
				    callback : Typeahead.prototype.showSuggestionBox.bind(this)
				});
			}
			else
				this.hideSuggestionBox();
		};
		
		Typeahead.prototype.transformValues = function(aValue, aValues) {
			var result = [];
			for (var i = 0; i < aValues.length; i++) {
				var itemData = aValues[i];
				result.push({
				    display : this.buildDisplay(aValue, itemData),
				    data : itemData
				});
			}
			
			return result;
		};
		
		Typeahead.prototype.buildDisplay = function(aValue, aItemData) {
			var display = ExpressionResolver.resolveExpression(this.data.display, aItemData, this.data.display)
			if (this.data.displayMarker)
				display = display.replace(new RegExp(aValue, "i"), function(aMatch) {
					return "<b>" + aMatch + "</b>";
				});
			
			return display;
		};
		
		Typeahead.prototype.showSuggestionBox = function() {
			var offset = this.element.offset();
			this.suggestionBox.css("top", (offset.top + this.element.outerHeight()) + "px");
			this.suggestionBox.css("left", offset.left + "px");
			
			this.suggestionBox.width(this.element.outerWidth());
			
			
			if (!this.suggestionBox.is("active"))
				this.suggestionBox.addClass("active");
		};
		
		Typeahead.prototype.hideSuggestionBox = function() {
			this.suggestionBox.removeClass("active");
		};
		
		de.titus.core.jquery.Components.asComponent("de.titus.Typeahead", Typeahead);
		$(document).ready(function() {
			$(".jstl-typeahead").de_titus_Typeahead();
		});
	});
})($, new de.titus.core.ExpressionResolver());
