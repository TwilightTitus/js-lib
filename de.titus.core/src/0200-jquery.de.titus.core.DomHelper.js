de.titus.core.Namespace.create("de.titus.jquery.DomHelper", function() {
	/**
	 * Constructor of DomHelper for JQuery
	 */
	de.titus.jquery.DomHelper = function() {
	};
	
	/**
	 * extents de.titus.jquery.DomHelper
	 */
	de.titus.jquery.DomHelper.prototype = new de.titus.core.DomHelper();
	de.titus.jquery.DomHelper.prototype.constructor = de.titus.jquery.DomHelper;
	
	/**
	 * 
	 * @param aElement
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.toDomObject = function(aElement) {
		return $(aElement);
	};
	
	/**
	 * 
	 * @param aElement
	 */
	de.titus.jquery.DomHelper.prototype.cloneDomObject = function(aElement) {
		return aElement.clone();
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.getAttribute = function(aDomElementObject, /* string */anAttribute) {
		return aDomElementObject.attr(anAttribute);
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getAttributes = function(aDomElementObject) {
		var attributes = {};
		$.each(aDomElementObject.get(0).attributes, function(i, attrib) {
			attributes[attrib.name] = attrib.value;
		});
		return attributes;
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 * @param aValue
	 */
	de.titus.jquery.DomHelper.prototype.setAttribute = function(aDomElementObject, /* string */anAttribute, /* string */aValue) {
		if (aValue == undefined)
			aDomElementObject.removeAttr(anAttribute);
		else
			aDomElementObject.attr(anAttribute, aValue);
	};
	
	/**
	 * Get the width of element.
	 * 
	 * @param aDomElementObject
	 * @returns int, width in px
	 */
	de.titus.core.DomHelper.prototype.getWith = function(aDomElementObject) {
		return aDomElementObject.width();
	};
	
	/**
	 * Set the width of element.
	 * 
	 * 
	 * @param aDomElementObject
	 * @param aWidth,
	 *            width in px
	 */
	de.titus.core.DomHelper.prototype.setWith = function(aDomElementObject, aWidth) {
		aDomElementObject.width(aWidth);
	};
	
	/**
	 * Get the width from the content area of element. (width of element - padding-left -padding-right)
	 * 
	 * @param aDomElementObject
	 * @returns int, width in px
	 */
	de.titus.core.DomHelper.prototype.getContentWith = function(aDomElementObject) {
		return aDomElementObject.innerWidth();
	};
	
	/**
	 * Set the width from the content area of element.
	 * 
	 * @param aDomElementObject
	 * @param aWidth
	 */
	de.titus.core.DomHelper.prototype.setContentWith = function(aDomElementObject, aWidth) {
		aDomElementObject.innerWidth(aWidth);
	};
	
	/**
	 * Get the height of element.
	 * 
	 * @param aDomElementObject
	 * @returns int, height in px
	 */
	de.titus.core.DomHelper.prototype.getHeight = function(aDomElementObject) {
		return aDomElementObject.height();
	};
	
	/**
	 * Set the height of element.
	 * 
	 * @param aDomElementObject
	 * @param aHeight
	 */
	de.titus.core.DomHelper.prototype.setHeight = function(aDomElementObject, aHeight) {
		aDomElementObject.height(aHeight);
	};
	
	/**
	 * Get the height from the content area of element. (width of element - padding-top -padding-bottom)
	 * 
	 * @param aDomElementObject
	 * @returns int, height in px
	 */
	de.titus.core.DomHelper.prototype.getContentHeight = function(aDomElementObject) {
		return aDomElementObject.innerHeight();
	};
	
	/**
	 * Get the height from the content area of element.
	 * 
	 * @param aDomElementObject
	 * @param aHeight
	 */
	de.titus.core.DomHelper.prototype.setContentHeight = function(aDomElementObject, aHeight) {
		aDomElementObject.innerHeight(aHeight);
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.getChilds = function(aDomElementObject) {
		return aDomElementObject.children() || new Array();
	};
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getChildCount = function(aDomElementObject) {
		return this.getChilds(aDomElementObject).length;
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.getParent = function(aDomElementObject) {
		return aDomElementObject.parent();
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.getHtml = function(aDomElementObject) {
		return aDomElementObject.html();
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param aHtml
	 * @param aType
	 *            values -> append, prepend, replace, [undefined]
	 */
	de.titus.jquery.DomHelper.prototype.setHtml = function(aDomElementObject, aHtml, aType) {
		if (aType == undefined) {
			aDomElementObject.html(aHtml);
		} else if (aType == "append") {
			aDomElementObject.append(aHtml);
		} else if (aType == "prepend") {
			aDomElementObject.prepend(aHtml);
		} else if (aType == "replace") {
			aDomElementObject.html(aHtml);
		} else {
			throw "The type \"" + aType + "\" is not supported!";
		}
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.jquery.DomHelper.prototype.getText = function(aDomElementObject) {
		return aDomElementObject.text();
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param aText
	 * @param aType
	 *            values -> append, prepend, replace, [undefined]
	 */
	de.titus.jquery.DomHelper.prototype.setText = function(aDomElementObject, aText, aType) {
		if (aType == undefined) {
			aDomElementObject.text(aText);
		} else if (aType == "append") {
			var currentText = aDomElementObject.text();
			aDomElementObject.append(aText + currentText);
		} else if (aType == "prepend") {
			var currentText = aDomElementObject.text();
			aDomElementObject.append(currentText + aText);
		} else if (aType == "replace") {
			aDomElementObject.text(aText);
		} else {
			throw "The type \"" + aType + "\" is not supported!";
		}
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.jquery.DomHelper.prototype.doRemove = function(aDomElementObject) {
		if ($.isArray(aDomElementObject)) {
			for (var i = 0; i < aDomElementObject.length; i++) {
				aDomElementObject[i].remove();
			}
		} else {
			aDomElementObject.remove();
		}
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.jquery.DomHelper.prototype.doRemoveChilds = function(aDomElementObject) {
		aDomElementObject.empty();
	};
	
	/**
	 * 
	 * @param aId
	 */
	de.titus.jquery.DomHelper.prototype.getDomElementById = function(aId) {
	};
	
	/**
	 * 
	 * @param theSettings
	 * @param aCallback
	 */
	de.titus.jquery.DomHelper.prototype.doRemoteLoadHtml = function(theSettings, aCallback) {
		var settings = {
		dataType : "html",
		success : aCallback };
		settings = $().extend(theSettings, settings);
		$.ajax(settings);
	};
	
	/**
	 * 
	 * @param theSettings
	 * @param aCallback
	 */
	de.titus.jquery.DomHelper.prototype.doRemoteLoadJson = function(theSettings, aCallback) {
		var settings = {
		dataType : "json",
		success : aCallback };
		settings = $().extend(theSettings, settings);
		$.ajax(settings);
	};
	
	/**
	 * 
	 * @param aObject1
	 * @param aObject2
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.mergeObjects = function(aObject1, aObject2) {
		return $().extend(aObject1, aObject2);
	};
	
	/**
	 * @param aVariable
	 * 
	 * @returns true, it the parameter a function.
	 */
	de.titus.jquery.DomHelper.prototype.isFunction = function(aVariable) {
		return $.isFunction(aVariable);
	};
	
	/**
	 * 
	 * @param aVariable
	 * 
	 * @returns true, if the parameter a array;
	 */
	de.titus.core.DomHelper.prototype.isArray = function(aVariable) {
		return $.isArray(aVariable) || aVariable.length != undefined;
	};
	
	/**
	 * Call the function, after dom is ready!
	 * 
	 * @param afunction
	 * 
	 */
	de.titus.core.DomHelper.prototype.doOnReady = function(aFunction) {
		$(document).ready(aFunction);
	};
	
	/**
	 * 
	 */
	de.titus.jquery.DomHelper.getInstance = function() {
		return new de.titus.jquery.DomHelper();
	};
	
	if ($ != undefined) {
		de.titus.core.DomHelper.getInstance = function() {
			return new de.titus.jquery.DomHelper();
		};
	}
});
