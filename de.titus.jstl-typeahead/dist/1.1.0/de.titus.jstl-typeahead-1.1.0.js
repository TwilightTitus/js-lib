/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Frank Schüler
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function($, ExpressionResolver) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jquery.Typeahead", function() {
		var Typeahead = de.titus.jquery.Typeahead = function(aElement, aData) {
			this.element = aElement;
			this.suggestionBox = undefined;
			this.data = aData || {};
			this.timeoutId = undefined;
			this.suggestionData = undefined;
			this.currentSelection = undefined;
			this.selected = undefined;
			this.__init();
		};

		Typeahead.KEYCODES = {
		    KEY_ARROW_UP : 40,
		    KEY_ARROW_DOWN : 38,
		    KEY_ENTER : 13,
		    KEY_ESC : 27

		};

		Typeahead.prototype.__init = function() {
			if (this.data.inputAction == undefined || typeof this.data.inputAction !== "function") {
				this.data.inputAction = ExpressionResolver.resolveExpression(this.element.attr("typeahead-input-action"));
				if (typeof this.data.inputAction !== "function")
					throw "Typeahead input action ist not a function!";
			}

			if (this.data.selectionAction == undefined || typeof this.data.selectAction !== "function") {
				this.data.selectionAction = ExpressionResolver.resolveExpression(this.element.attr("typeahead-selection-action"));
			}

			if (this.data.display == undefined)
				this.data.display = this.element.attr("typeahead-display");

			if (this.data.displayMarker == undefined)
				this.data.displayMarker = (this.element.attr("typeahead-display-marker") != undefined);

			if (this.data.interval == undefined)
				this.data.inputInterval = parseInt(this.element.attr("typeahead-input-interval") || "300");

			if (this.data.inputSize == undefined)
				this.data.inputSize = parseInt(this.element.attr("typeahead-input-size") || "1");
			
			if (this.data.maxSuggestions == undefined)
				this.data.maxSuggestions = parseInt(this.element.attr("typeahead-max-suggestions") || "10");

			if (this.data.template == undefined)
				this.data.template = this.element.attr("typeahead-template");

			if (this.data.multichoice == undefined)
				this.data.multichoice = this.element.attr("typeahead-multi-choice") != undefined;

			this.suggestionBox = $("<div></div>");
			this.suggestionBox.addClass("typeahead-suggestion-box");
			this.suggestionBox.attr("jstl-ignore", "");

			var innerBox = $("<div></div>");
			innerBox.addClass("typeahead-suggestion-inner-box");
			innerBox.attr("jstl-include", this.data.template);

			this.suggestionBox.append(innerBox);
			this.element.parent().append(this.suggestionBox);

			this.element.on("keyup change focus", Typeahead.prototype.inputHandle.bind(this));
		};

		Typeahead.prototype.inputHandle = function(aEvent) {
			if (this.timeoutId)
				clearTimeout(this.timeoutId);

			if (aEvent.type == "keyup") {
				if (aEvent.keyCode == Typeahead.KEYCODES.KEY_ESC)
					this.__cancelSelection(aEvent);
				else if (aEvent.keyCode == Typeahead.KEYCODES.KEY_ENTER)
					this.__confirmSelection(aEvent);
				else if (aEvent.keyCode == Typeahead.KEYCODES.KEY_ARROW_UP || aEvent.keyCode == Typeahead.KEYCODES.KEY_ARROW_DOWN)
					this.__selectionByKey(aEvent);
				else
					this.__doInput(aEvent);
			} else if (aEvent.type == "change")
				this.__doInput(aEvent);
			else if (aEvent.type == "focus")
				if (!this.selected)
					this.__doInput(aEvent);

		};

		Typeahead.prototype.__doInput = function(aEvent) {
			var value = (this.element.val() || "").trim();
			if (value.length >= this.data.inputSize)
				this.timeoutId = setTimeout(Typeahead.prototype.__callInputAction.bind(this, value), this.data.inputInterval);
			else
				this.__hideSuggestionBox();
		};

		Typeahead.prototype.__selectionByKey = function(aEvent) {
			if (!this.suggestionData)
				return;

			if (this.currentSelection) {
				this.suggestionBox.find("[typeahead-selection-id='" + this.currentSelection.id + "']").removeClass("active");
				var index = this.currentSelection.index + (aEvent.keyCode == Typeahead.KEYCODES.KEY_ARROW_UP ? 1 : -1);

				if (index >= this.suggestionData.list.length)
					index = 0;
				else if (index < 0)
					index = this.suggestionData.list.length - 1;

				this.currentSelection = this.suggestionData.list[index];
			} else
				this.currentSelection = this.suggestionData.list[0];

			this.suggestionBox.find("[typeahead-selection-id='" + this.currentSelection.id + "']").addClass("active");

		};

		Typeahead.prototype.__cancelSelection = function(aEvent) {
			this.currentSelection = undefined;
			if (typeof this.selected != undefined)
				this.__doSelected(this.selected);
			this.__hideSuggestionBox();
		};

		Typeahead.prototype.__confirmSelection = function(aEvent) {
			if (this.currentSelection)
				this.__doSelected(this.currentSelection);
			else if (typeof this.suggestionData != "undefined" && this.suggestionData.list.length == 1)
				this.__doSelected(this.suggestionData.list[0]);
			else
				this.__doSelected();
				this.__hideSuggestionBox();
		};

		Typeahead.prototype.__callInputAction = function(aValue) {
			this.data.inputAction(aValue, Typeahead.prototype.inputActionCallback.bind(this, aValue));
		};

		Typeahead.prototype.inputActionCallback = function(aValue, aValues) {
			var value = (this.element.val() || "").trim();
			if (value == aValue) {
				this.suggestionData = this.__transformValues(aValue, aValues);
				this.suggestionBox.jstl({
				    data : {
				        value : aValue,
				        items : this.suggestionData.list
				    },
				    callback : Typeahead.prototype.__initSuggestionBox.bind(this)
				});
			} else
				this.__hideSuggestionBox();
		};

		Typeahead.prototype.__transformValues = function(aValue, aValues) {
			let result = {
			    map : {},
			    list : []
			};
			let min = Math.min(aValues.length, this.data.maxSuggestions);
			let displayMarkerValues = aValue.split(" ");
			for (let i = 0; i < min; i++) {
				let item = this.__buildItemData(displayMarkerValues, aValues[i]);
				item.index = i;
				item.id = "item-id-" + i;
				result.map[item.id] = item;
				result.list.push(item);
			}

			return result;
		};

		Typeahead.prototype.__buildItemData = function(aDisplayMarkerValues, aData) {
			let itemData = aData;
			let value = aData;
			if (this.data.display)
				value = ExpressionResolver.resolveExpression(this.data.display, itemData, this.data.display);
			return {
			    display : this.__buildDisplay(aDisplayMarkerValues, value),
			    value : value,
			    data : itemData
			};
		};

		Typeahead.prototype.__buildDisplay = function(aValues, aDisplay) {
			if (this.data.displayMarker) {
				var regex = "";
				for (var i = 0; i < aValues.length; i++) {
					if (i == 0)
						regex += "|";
					regex += aValues[i];
				}
				regex = "[^<](" + regex + ")[^>]";

				return aDisplay.replace(new RegExp(regex, "i"), function(aMatch) {
					return "<b>" + aMatch + "</b>";
				});
			}
			return aDisplay;
		};

		Typeahead.prototype.__initSuggestionBox = function() {
			this.suggestionBox.find("[typeahead-selection-id]").on("click", Typeahead.prototype.__selectionHandle.bind(this));
			this.__showSuggestionBox();
		};

		Typeahead.prototype.__selectionHandle = function(aEvent) {
			var selectedElement = $(aEvent.currentTarget);
			var id = selectedElement.attr("typeahead-selection-id");
			if (id)
				this.__doSelected(this.suggestionData.map[id]);
		};

		Typeahead.prototype.__doSelected = function(aItem) {
			this.selected = aItem;
			if (!aItem)
				return this.element.val("");
			else {
				this.element.val(aItem.value);
				if (typeof this.data.selectionAction === "function")
					this.data.selectionAction(aItem.data);
			}
			this.__hideSuggestionBox();

			this.element.trigger("typeahead:select", [ aItem, this ]);
		}

		Typeahead.prototype.__showSuggestionBox = function() {
			var offsetParent = this.element.parent().offset();
			var offset = this.element.offset();
			this.suggestionBox.css("top", ((offset.top - offsetParent.top) + this.element.outerHeight()) + "px");
			this.suggestionBox.css("left", (offset.left - offsetParent.left) + "px");

			this.suggestionBox.width(this.element.outerWidth());

			if (!this.suggestionBox.is("active"))
				this.suggestionBox.addClass("active");
		};

		Typeahead.prototype.__hideSuggestionBox = function() {
			this.suggestionBox.removeClass("active");
			this.suggestionData = undefined;
			this.currentSelection = undefined;
		};

		Typeahead.prototype.setSelectedData = function(aData) {
			let item = this.__buildItemData("", aData);
			this.__doSelected(item);
		}

		Typeahead.prototype.getSelectedData = function() {
			if (typeof this.selected !== "undefined")
				return this.selected.data;
		}

		de.titus.core.jquery.Components.asComponent("de.titus.Typeahead", Typeahead);
		$(document).ready(function() {
			$(".jstl-typeahead").de_titus_Typeahead();
		});
	});
})($, new de.titus.core.ExpressionResolver());
