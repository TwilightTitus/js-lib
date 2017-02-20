(function($) {
    "use strict";
    de.titus.core.Namespace.create("de.titus.core.Converter", function() {
	de.titus.core.Converter.xmlToJson = function(aNode) {
	    // Create the return object
	    var obj = {};
	    if (aNode.nodeType == 1 || aNode.nodeType == 9) { // element
		// do attributes
		if (aNode.attributes != undefined && aNode.attributes.length > 0) {
		    var attributes = {};
		    for (var j = 0; j < aNode.attributes.length; j++) {
			var attribute = aNode.attributes.item(j);
			attributes[attribute.nodeName] = attribute.nodeValue;
		    }
		    obj["@attributes"] = attributes;
		}
	    } else if (aNode.nodeType == 3 || aNode.nodeType == 4) // text
		return aNode.textContent.trim();

	    // do children
	    if (aNode.hasChildNodes()) {
		var textContent = undefined;
		var hasChildren = false;
		for (var i = 0; i < aNode.childNodes.length; i++) {
		    var item = aNode.childNodes.item(i);
		    if (item.nodeType == 1) {
			hasChildren = true;
			var nodeName = item.nodeName;
			if (typeof (obj[nodeName]) == "undefined") {
			    obj[nodeName] = de.titus.core.Converter.xmlToJson(item);
			} else {
			    if (typeof (obj[nodeName].push) == "undefined") {
				var old = obj[nodeName];
				obj[nodeName] = [];
				obj[nodeName].push(old);
			    }
			    obj[nodeName].push(de.titus.core.Converter.xmlToJson(item));
			}
		    } else if (item.nodeType == 3 || item.nodeType == 4)
			if (item.textContent != "")
			    textContent = (textContent ? textContent + item.textContent : item.textContent);
		}

		if (textContent) {
		    if (obj["@attributes"] == undefined && !hasChildren)
			obj = textContent.trim();
		    else
			obj.text = textContent.trim();
		}	    
	    }
	    return obj;
	};

    });
})($);
