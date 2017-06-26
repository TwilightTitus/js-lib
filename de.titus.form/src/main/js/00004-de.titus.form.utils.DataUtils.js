(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.utils.DataUtils", function() {
		var DataUtils = de.titus.form.utils.DataUtils = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.utils.DataUtils"),
		    "nativ" : function(theData) {
			    if (DataUtils.LOGGER.isDebugEnabled())
				    DataUtils.LOGGER.logDebug([ "Get the nativ data structur: ", theData ]);
			    return theData;
		    },

		    "object" : function(theData) {
			    if (DataUtils.LOGGER.isDebugEnabled())
				    DataUtils.LOGGER.logDebug("data of fields to object: " + JSON.stringify(theData));

			    var result = {};
			    for (var i = 0; i < theData.length; i++)
				    DataUtils.__addToObject(theData[i], result);

			    if (DataUtils.LOGGER.isDebugEnabled())
				    DataUtils.LOGGER.logDebug("data of fields to object: result: " + JSON.stringify(result));

			    return result;
		    },

		    "key-value" : function(theData) {
			    if (DataUtils.LOGGER.isDebugEnabled())
				    DataUtils.LOGGER.logDebug("data of fields to key-value: " + JSON.stringify(theData));

			    var result = {};
			    for (var i = 0; i < theData.length; i++) {
				    var data = theData[i];
				    result[data.name] = data.value;
			    }

			    return result;
		    },

		    "list-model" : function(theData, aContextName) {
			    if (DataUtils.LOGGER.isDebugEnabled())
				    DataUtils.LOGGER.logDebug("data of fields to list-model: " + JSON.stringify(theData));
			    var result = [];
			    for (var i = 0; i < theData.length; i++) {
				    var item = theData[i];
				    var name = aContextName != undefined && aContextName.trim() != "" ? aContextName + "." + item.name : item.name;
				    if (theData[i].value != undefined) {
					    result.push({
					        name : name,
					        value : item.value
					    });
				    }
				    if (item.items && item.items.length > 0)
					    Array.prototype.push(result, DataUtils["list-model"](item.items, name));
			    }
			    return result;
		    },

		    "data-model" : function(theData, aContextName) {
			    if (DataUtils.LOGGER.isDebugEnabled())
				    DataUtils.LOGGER.logDebug("data of fields to data-model: " + JSON.stringify(theData));
			    var result = {};
			    for (var i = 0; i < theData.length; i++)
				    DataUtils.__addToDataModel(theData[i], result);

			    if (DataUtils.LOGGER.isDebugEnabled())
				    DataUtils.LOGGER.logDebug("data of fields to data-model: result: " + JSON.stringify(result));

			    return result;
		    },
		    
		    __addToDataModel : function(aData, aContext, aContextName) {
			    //{name:"", value:"", type:"", items:[]}
		    	//NAMES SPLITTING 
		    },
		   
		    __getObjectContext : function(aContextName, aRoot) {
			    if (aContextName == undefined || aContextName.trim() == '')
				    return aRoot;

			    var names = aContextName.split(".");
			    var context = aRoot;
			    for (var i = 0; i < names.length; i++) {
				    if (context[names[i]] == undefined)
					    context[names[i]] = {};
				    context = context[names[i]];
			    }

			    return context;
		    },

		    __addToObject : function(aData, aContext, aContextName) {
			    var data = aData.value;
			    var fullname = aContextName ? aContextName + "." + aData.name : aData.name;
			    if (aData.items && aData.items.length > 0) {
				    for (var i = 0; i < aData.items.length; i++)
					    DataUtils.__addToObject(aData.items[i], aContext, fullname);
			    }
			    if (data != undefined) {
				    var contextName = undefined;
				    var key = fullname;
				    var lastIndex = fullname.lastIndexOf(".");
				    if (lastIndex >= 0) {
					    key = fullname.substring(lastIndex + 1);
					    contextName = fullname.substring(0, lastIndex);
				    }

				    var context = DataUtils.__getObjectContext(contextName, aContext);
				    context[key] = data;
			    }
		    },

		    __toSimpleObject : function(aData, aContext) {
			    var names = aData.name.split(".");
			    var context = aContext;
			    for (var i = 0; i < (names.length - 1); i++) {
				    if (context[names[i]] == undefined)
					    context[names] = {};
				    context = context[names[i]];
			    }
			    context[names[names.length - 1]] = aData.value;
		    },

		    __toModelObject : function(aName, aData, aContext) {
			    var names = aName.split(".");
			    var context = aContext;
			    context.items = context.items || [];

			    for (var i = 0; i < names.length; i++) {
				    var name = names[i];
				    var item = DataUtils.__getItem(aName, context.items);
				    if (item == undefined)
					    item = {
					        name : name,
					        type : "unkown",
					        items : []
					    };

				    context = item;
			    }

			    context.type = aData.type;
			    context.value = aData.value;
		    },
		    __getItem : function(aName, theItems) {
			    for (var i = 0; i < theItems.length; i++)
				    if (theItems[i].name == aName)
					    return theItems[i];
		    }

		};
	});

})($);
