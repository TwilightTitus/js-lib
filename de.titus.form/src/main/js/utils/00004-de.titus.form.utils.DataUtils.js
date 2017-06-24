(function($){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.utils.DataUtils", function() {
		var DataUtils = de.titus.form.utils.DataUtils = {
			LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.utils.DataUtils"),
			"object" : function(theData){
				if (DataUtils.LOGGER.isDebugEnabled())
					DataUtils.LOGGER.logDebug("data of fields to object: " + JSON.stringify(theData) );
				
				var result = {};
				for(var i = 0; i < theData.length; i++){
					var data = theData[i];
					DataUtils.__toSimpleObject(data, result);
				}
				
				if (DataUtils.LOGGER.isDebugEnabled())
					DataUtils.LOGGER.logDebug("data of fields to object: result: " + JSON.stringify(result) );
				
				return result;
			},
			"key-value" : function(theData){
				if (DataUtils.LOGGER.isDebugEnabled())
					DataUtils.LOGGER.logDebug("data of fields to key-value: " + JSON.stringify(theData) );
				
				var result = {};
				for(var i = 0; i < theData.length; i++){
					var data = theData[i];
					result[data.name] = data.value;
				}
				
				return result;
			},
			"list-model": function(theData){
				if (DataUtils.LOGGER.isDebugEnabled())
					DataUtils.LOGGER.logDebug("data of fields to list-model: " + JSON.stringify(theData) );
				
				return theDatas;
			},
			"data-model": function(theData){
				if (DataUtils.LOGGER.isDebugEnabled())
					DataUtils.LOGGER.logDebug("data of fields to data-model: " + JSON.stringify(theData) );
				
				var result = {};
				for(var i = 0; i < theData.length; i++){
					var data = theData[i];
					DataUtils.__toSimpleObject(data, result);
				}
				
				return result;
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
				context.items =  context.items || [];
				
				for (var i = 0; i < names.length; i++) {
					var name = names[i];
					var item = DataUtils.__getItem(aName, context.items);
					if(item == undefined)
						item = { name : name, type: "unkown", items : []};
					
					context = item;
				}
				
				context.type = aData.type;
				context.value = aData.value;				
			},
			__getItem : function(aName, theItems) {
				for(var i = 0; i < theItems.length; i++)
					if(theItems[i].name == aName)
						return theItems[i];
			}
			
		};
	});
	
})($);