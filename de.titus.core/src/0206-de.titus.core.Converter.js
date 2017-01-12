(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.core.Converter", function() {
		de.titus.core.Converter.xmlToJson = function(xml) {
			// Create the return object
			var obj = {};
			if (xml.nodeType == 1 || xml.nodeType == 9) { // element
				// do attributes
				if (xml.attributes != undefined && xml.attributes.length > 0) {
					var attributes = {};
					for (var j = 0; j < xml.attributes.length; j++) {
						var attribute = xml.attributes.item(j);
						attributes[attribute.nodeName] = attribute.nodeValue;
					}
					obj["@attributes"] = attributes;
				}
			} else if (xml.nodeType == 3) { // text
				return xml.nodeValue;
			} else if (xml.nodeName.indexOf("#cdata") == 0) {
				return xml.nodeValue;
			}
			
			// do children
			if (xml.hasChildNodes()) {
				if (xml.childNodes.length == 1 && xml.childNodes.item(0).nodeType != 3) {
					obj[xml.childNodes.item(0).nodeName] = de.titus.core.Converter.xmlToJson(xml.childNodes.item(0));
				}
				else if (xml.childNodes.length == 1 && xml.childNodes.item(0).nodeType == 3 && obj["@attributes"] != undefined) {
					obj[xml.childNodes.item(0).nodeName] = de.titus.core.Converter.xmlToJson(xml.childNodes.item(0));
				}
				else if (xml.childNodes.length == 1 && xml.childNodes.item(0).nodeType == 3 && obj["@attributes"] == undefined) {
					return de.titus.core.Converter.xmlToJson(xml.childNodes.item(0));
				}else {
					for (var i = 0; i < xml.childNodes.length; i++) {
						var item = xml.childNodes.item(i);
						if (item.nodeType != 3) {							
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
						}
					}
				}
			}
			return obj;
		};
		
	});
})($);