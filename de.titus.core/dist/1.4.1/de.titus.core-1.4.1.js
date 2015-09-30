if(de == undefined)
	var de = {};
if(de.titus == undefined){
	de.titus = {};
}
if(de.titus.core == undefined){
	de.titus.core = {};
}
if(de.titus.core.Namespace == undefined){
	de.titus.core.Namespace = {};	
	/**
	 * creates a namespace and run the function, if the Namespace new
	 * @param aNamespace 
	 * 		the namespace(requiered)
	 * @param aFunction 
	 * 		a function that be executed, if the namespace created (optional)
	 * 
	 *  @returns boolean, true if the namespace created
	 */
	de.titus.core.Namespace.create = function (aNamespace, aFunction){
		var namespaces = aNamespace.split(".");
		var currentNamespace = window;
		var namespaceCreated = false;
		for(i = 0; i < namespaces.length; i++){
			if (currentNamespace[namespaces[i]] == undefined) {
				currentNamespace[namespaces[i]] = {};
				namespaceCreated = true;
	        }
			currentNamespace = currentNamespace[namespaces[i]];
		}
		if(namespaceCreated && aFunction != undefined){
			"use strict";
			aFunction();
		}
		
		return namespaceCreated;
	};	
	
	/**
	 * exist the namespace?
	 * 
	 * @param aNamespace 
	 * 		the namespace(requiered)
	 * 
	 *  @returns boolean, true if the namespace existing
	 */
	de.titus.core.Namespace.exist = function (aNamespace){
		var namespaces = aNamespace.split(".");
		var currentNamespace = window;
		for(i = 0; i < namespaces.length; i++){
			if (currentNamespace[namespaces[i]] == undefined) {
				return false;
	        }
			currentNamespace = currentNamespace[namespaces[i]];
		}		
		return true;
	};	
};de.titus.core.Namespace.create("de.titus.core.SpecialFunctions", function() {
	
	de.titus.core.SpecialFunctions = {};
	de.titus.core.SpecialFunctions.EVALRESULTVARNAME = {};
	de.titus.core.SpecialFunctions.EVALRESULTS = {};
	
	de.titus.core.SpecialFunctions.doEval = function(aDomhelper, aStatement, aContext) {
		if (aStatement != undefined) {
			var varname = de.titus.core.SpecialFunctions.newVarname();
			var runContext = aContext || {};
			with (runContext) {
				eval("de.titus.core.SpecialFunctions.EVALRESULTS." + varname + " = " + aStatement + ";");
			}
			
			var result = de.titus.core.SpecialFunctions.EVALRESULTS[varname];
			de.titus.core.SpecialFunctions.EVALRESULTS[varname] = undefined;
			de.titus.core.SpecialFunctions.EVALRESULTVARNAME[varname] = undefined;
			return result;
		}
		
		return undefined;
	};
	
	de.titus.core.SpecialFunctions.newVarname = function() {
		var varname = "var" + (new Date().getTime());
		if (de.titus.core.SpecialFunctions.EVALRESULTVARNAME[varname] == undefined) {
			de.titus.core.SpecialFunctions.EVALRESULTVARNAME[varname] = "";
			return varname;
		} else
			return de.titus.core.SpecialFunctions.newVarname();
	};
	
});
de.titus.core.Namespace.create("de.titus.core.DomHelper", function() {
	
	/**
	 * 
	 */
	/**
	 * @author xce3560
	 * 
	 */
	de.titus.core.DomHelper = /* constructor */function() {
	};
	
	/**
	 * 
	 * @param aElement
	 */
	de.titus.core.DomHelper.prototype.toDomObject = function(aElement) {
	};
	
	/**
	 * 
	 * @param aElement
	 */
	de.titus.core.DomHelper.prototype.cloneDomObject = function(aElement) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 */
	de.titus.core.DomHelper.prototype.getAttribute = function(aDomElementObject, anAttribute) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getAttributes = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 * @param value
	 *            if the value undefined the attribute need to be removed!
	 */
	de.titus.core.DomHelper.prototype.setAttribute = function(aDomElementObject, /* string */anAttribute, /* string */value) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 */
	de.titus.core.DomHelper.prototype.getProperty = function(aDomElementObject, anAttribute) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 * @param aValue
	 */
	de.titus.core.DomHelper.prototype.setProperty = function(aDomElementObject, anAttribute, aValue) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getChildCount = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getChilds = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getParent = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getHtml = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param aHtml
	 * @param aType
	 *            values -> append, prepend, replace, [undefined]
	 */
	de.titus.core.DomHelper.prototype.setHtml = function(aDomElementObject, aHtml, aType) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getText = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param aText
	 * @param aType
	 *            values -> append, prepend, replace, [undefined]
	 */
	de.titus.core.DomHelper.prototype.setText = function(aDomElementObject, aText, aType) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.doRemove = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.doRemoveChilds = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aId
	 */
	de.titus.core.DomHelper.prototype.getDomElementById = function(aId) {
	};
	
	/**
	 * 
	 * @param theSettings
	 *            The minimum settings properties are url, async, cache! The settingsObject would be extents by costum data!
	 * @param aCallback
	 *            The callback function signature is function(template)
	 */
	de.titus.core.DomHelper.prototype.doRemoteLoadHtml = function(theSettings, aCallback) {
	};
	
	/**
	 * 
	 * @param theSettings
	 * @param aCallback
	 */
	de.titus.core.DomHelper.prototype.doRemoteLoadJson = function(theSettings, aCallback) {
	};
	
	/**
	 * 
	 * @param aObject1
	 * @param aObject2
	 * @returns The function need to be return the "aObject1"!
	 */
	de.titus.core.DomHelper.prototype.mergeObjects = function(aObject1, aObject2) {
	};
	
	/**
	 * 
	 * @param aObject1
	 * @param aObject2
	 * @returns The function need to be return the "aObject1"!
	 */
	de.titus.core.DomHelper.prototype.extendObjects = function(aObject1, aObject2) {
	};
	
	/**
	 * 
	 * @param aVariable
	 * 
	 * @returns true, if the parameter a function. Undefined is false!
	 */
	de.titus.core.DomHelper.prototype.isFunction = function(aVariable) {
	};
	
	/**
	 * 
	 * @param aVariable
	 * 
	 * @returns true, if the parameter a array;
	 */
	de.titus.core.DomHelper.prototype.isArray = function(aVariable) {
	};
	
	/**
	 * Call the function, after dom is ready!
	 * 
	 * @param afunction
	 * 
	 */
	de.titus.core.DomHelper.prototype.doOnReady = function(afunction) {
	};
	
	/**
	 * 
	 * @param aKey
	 * @param aData
	 */
	de.titus.core.DomHelper.prototype.setBindData = function(aDomElementObject, aKey, aData) {
	};
	
	/**
	 * 
	 * @param aKey
	 */
	de.titus.core.DomHelper.prototype.getBindData = function(aDomElementObject, aKey) {
	};
	
	/**
	 * 
	 * @param aValue
	 *            true = show item or false = hide item
	 */
	de.titus.core.DomHelper.prototype.doShow = function(aDomElementObject, aValue) {
	};
	
	/**
	 * 
	 */
	de.titus.core.DomHelper.prototype.getValue = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aValue
	 */
	de.titus.core.DomHelper.prototype.setValue = function(aDomElementObject, aValue) {
	};
	
	/**
	 * 
	 * @param aEvent
	 *            click, keyup, change
	 * @param aCallback
	 */
	de.titus.core.DomHelper.prototype.addEvent = function(aDomElementObject, aEvent, aCallback) {
	};
	
	/**
	 * 
	 * @param aStatement
	 * @param aDefault
	 * @param aCallback
	 * @returns
	 */
	de.titus.core.DomHelper.prototype.doEval = function(aStatement, aDefault, aCallback) {
		return this.doEvalWithContext(aStatement, {}, aDefault, aCallback);
	};
	
	/**
	 * 
	 * @param aStatement
	 * @param aContext
	 * @param aDefault
	 * @param aCallback
	 * @returns
	 */
	de.titus.core.DomHelper.prototype.doEvalWithContext = function(aStatement, aContext, aDefault, aCallback) {
		if (aCallback != undefined && this.isFunction(aCallback)) {
			var $__THIS__$ = this;
			window.setTimeout(function() {
				var result = $__THIS__$.doEvalWithContext(aStatement, aContext, aDefault, undefined);
				aCallback(result, aContext, this);
			}, 10);
			
		} else {
			var result = de.titus.core.SpecialFunctions.doEval(this, aStatement, aContext);
			
			// var result = $___DE_TITUS_CORE_EVAL_WITH_CONTEXT_EXTENTION___$(this, aStatement, aContext);
			if (result == undefined) {
				return aDefault;
			}
			return result;
		}
	};
	
	/**
	 * @returns de.titus.core.DomHelper
	 */
	de.titus.core.DomHelper.getInstance = function() {
		if (de.titus.core.GLOBAL_DOMHELPER_INSTANCE == undefined) {
			de.titus.core.GLOBAL_DOMHELPER_INSTANCE = new de.titus.core.DomHelper();
		}
		return de.titus.core.GLOBAL_DOMHELPER_INSTANCE;
	};
});
de.titus.core.Namespace.create("de.titus.core.regex.Matcher", function() {
	de.titus.core.regex.Matcher = function(/* RegExp */aRegExp, /* String */aText) {
		this.internalRegex = aRegExp;
		this.processingText = aText;
		this.currentMatch = undefined;
	}

	de.titus.core.regex.Matcher.prototype.isMatching = /* boolean */function() {
		return this.internalRegex.test(this.processingText);
	};
	
	de.titus.core.regex.Matcher.prototype.next = /* boolean */function() {
		this.currentMatch = this.internalRegex.exec(this.processingText);
		if (this.currentMatch != undefined) {
			this.processingText = this.processingText.replace(this.currentMatch[0], "");
			return true;
		}
		return false;
	};
	
	de.titus.core.regex.Matcher.prototype.getMatch = /* String */function() {
		if (this.currentMatch != undefined)
			return this.currentMatch[0];
		return undefined;
	};
	
	de.titus.core.regex.Matcher.prototype.getGroup = /* String */function(/* int */aGroupId) {
		if (this.currentMatch != undefined)
			return this.currentMatch[aGroupId];
		return undefined;
	};
	
	de.titus.core.regex.Matcher.prototype.replaceAll = /*String*/ function(/* String */aReplaceValue, /* String */aText) {
		if (this.currentMatch != undefined)
			return aText.replace(this.currentMatch[0], aReplaceValue);
		return aText;
	};
});

de.titus.core.Namespace.create("de.titus.core.regex.Regex", function() {
	
	de.titus.core.regex.Regex = function(/* String */aRegex, /* String */aOptions) {
		this.internalRegex = new RegExp(aRegex, aOptions);
	};
	
	de.titus.core.regex.Regex.prototype.parse = /* de.titus.core.regex.Matcher */function(/* String */aText) {
		return new de.titus.core.regex.Matcher(this.internalRegex, aText);
	};
});
de.titus.jquery.Namespace.create("de.titus.jquery.DomHelper", function() {
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
	de.titus.jquery.DomHelper.prototype.getAttributes = function(aDomElementObject) {
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
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 */
	de.titus.jquery.DomHelper.prototype.getProperty = function(aDomElementObject, anAttribute) {
		return aDomElementObject.prop(anAttribute);
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 * @param aValue
	 */
	de.titus.jquery.DomHelper.prototype.setProperty = function(aDomElementObject, anAttribute, aValue) {
		aDomElementObject.prop(anAttribute, aValue);
	};
	
	/**
	 * Get the width of element.
	 * 
	 * @param aDomElementObject
	 * @returns int, width in px
	 */
	de.titus.jquery.DomHelper.prototype.getWith = function(aDomElementObject) {
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
	de.titus.jquery.DomHelper.prototype.setWith = function(aDomElementObject, aWidth) {
		aDomElementObject.width(aWidth);
	};
	
	/**
	 * Get the width from the content area of element. (width of element - padding-left -padding-right)
	 * 
	 * @param aDomElementObject
	 * @returns int, width in px
	 */
	de.titus.jquery.DomHelper.prototype.getContentWith = function(aDomElementObject) {
		return aDomElementObject.innerWidth();
	};
	
	/**
	 * Set the width from the content area of element.
	 * 
	 * @param aDomElementObject
	 * @param aWidth
	 */
	de.titus.jquery.DomHelper.prototype.setContentWith = function(aDomElementObject, aWidth) {
		aDomElementObject.innerWidth(aWidth);
	};
	
	/**
	 * Get the height of element.
	 * 
	 * @param aDomElementObject
	 * @returns int, height in px
	 */
	de.titus.jquery.DomHelper.prototype.getHeight = function(aDomElementObject) {
		return aDomElementObject.height();
	};
	
	/**
	 * Set the height of element.
	 * 
	 * @param aDomElementObject
	 * @param aHeight
	 */
	de.titus.jquery.DomHelper.prototype.setHeight = function(aDomElementObject, aHeight) {
		aDomElementObject.height(aHeight);
	};
	
	/**
	 * Get the height from the content area of element. (width of element - padding-top -padding-bottom)
	 * 
	 * @param aDomElementObject
	 * @returns int, height in px
	 */
	de.titus.jquery.DomHelper.prototype.getContentHeight = function(aDomElementObject) {
		return aDomElementObject.innerHeight();
	};
	
	/**
	 * Get the height from the content area of element.
	 * 
	 * @param aDomElementObject
	 * @param aHeight
	 */
	de.titus.jquery.DomHelper.prototype.setContentHeight = function(aDomElementObject, aHeight) {
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
	de.titus.jquery.DomHelper.prototype.getChildCount = function(aDomElementObject) {
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
		    success : aCallback
		};
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
		    success : aCallback
		};
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
	 * @param aKey
	 * @param aData
	 */
	de.titus.jquery.DomHelper.prototype.setBindData = function(aDomElementObject, aKey, aData) {
		aDomElementObject.data(aKey, aData);
	};
	
	/**
	 * 
	 * @param aKey
	 */
	de.titus.jquery.DomHelper.prototype.getBindData = function(aDomElementObject, aKey) {
		return aDomElementObject.data(aKey);
	};
	
	/**
	 * 
	 * @param aValue
	 *            true = show item or false = hide item
	 */
	de.titus.jquery.DomHelper.prototype.doShow = function(aDomElementObject, aValue) {
		if (aValue)
			aDomElementObject.show();
		else
			aDomElementObject.hide();
	};
	
	/**
	 * 
	 */
	de.titus.jquery.DomHelper.prototype.getValue = function(aDomElementObject) {
		return aDomElementObject.val();
	};
	
	/**
	 * 
	 * @param aValue
	 */
	de.titus.jquery.DomHelper.prototype.setValue = function(aDomElementObject, aValue) {
		aDomElementObject.val(aValue);
	};
	
	/**
	 * 
	 * @param aEvent
	 *            click, keyup, change
	 * @param aCallback
	 */
	de.titus.jquery.DomHelper.prototype.addEvent = function(aDomElementObject, aEvent, aCallback) {
		aDomElementObject.bind(aEvent, aCallback);
	};
	
	/**
	 * 
	 * @param aVariable
	 * 
	 * @returns true, if the parameter a array;
	 */
	de.titus.jquery.DomHelper.prototype.isArray = function(aVariable) {
		return $.isArray(aVariable) || aVariable.length != undefined;
	};
	
	/**
	 * Call the function, after dom is ready!
	 * 
	 * @param afunction
	 * 
	 */
	de.titus.jquery.DomHelper.prototype.doOnReady = function(aFunction) {
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
