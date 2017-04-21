de.titus.core.Namespace.create("de.titus.core.SpecialFunctions", function() {
	
	var SpecialFunctions = de.titus.core.SpecialFunctions = {
	    doEval : function(aStatement, aContext, aCallback) {
		    if (aCallback)
		    	SpecialFunctions.doEvalWithContext(aStatement, (aContext || {}), undefined, aCallback);
		    else {
			    if (typeof aStatement !== "string")
				    return aStatement;
			    else {
				    var result = undefined;
				    var runContext = aContext || {};
				    var statement = aStatement.trim();
				    if(statement.length == 0)
				    	return result;
				    
				    with (runContext) {
					    try {
						    eval("result = " + statement + ";");
					    } catch (e) {
						    if (!console)
							    return;
						    else if (console.warn)
							    console.warn("de.titus.core.SpecialFunctions.doEval ***Warn*** expression: " + aStatement + ": ", e);
						    else if (console.log)
							    console.log("de.titus.core.SpecialFunctions.doEval ***Warn*** expression: " + aStatement + ": ", e);
						    return undefined;
					    }
				    }
				    return result;
			    }
			    
			    return undefined;
		    }
	    },
	    
	    /**
		 * 
		 * @param aStatement
		 * @param aContext
		 * @param aDefault
		 * @param aCallback
		 * @returns
		 */
	    doEvalWithContext : function(aStatement, aContext, aDefault, aCallback) {
		    if (typeof aCallback === "function") {
			    window.setTimeout(function() {
				    var result = SpecialFunctions.doEvalWithContext(aStatement, aContext, aDefault, undefined);
				    aCallback(result, aContext);
			    }, 1);
			    
		    } else
			    try {
				    var result = SpecialFunctions.doEval(aStatement, aContext);
				    if (result == undefined)
					    return aDefault;
				    return result;
			    } catch (e) {
				    return aDefault;
			    }
	    }
	};
	
});
