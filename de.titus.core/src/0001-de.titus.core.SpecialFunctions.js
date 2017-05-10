de.titus.core.Namespace.create("de.titus.core.SpecialFunctions", function() {
	
	var SpecialFunctions = de.titus.core.SpecialFunctions = {
		 STATEMENTS : {},
		    doEval : function(aStatement, aContext, aCallback) {
			    if (aCallback)
				    SpecialFunctions.doEvalWithContext(aStatement, (aContext || {}), undefined, aCallback);
			    else {
				    if (typeof aStatement !== "string")
					    return aStatement;
				    else {
					    var runContext = aContext || {};
					    if(runContext["$$$$___STATEMENT___VALUE___$$$___TEXT___$$$$"] !== undefined)
					    	return undefined;
					    
					    var $$$$___STATEMENT___VALUE___$$$___TEXT___$$$$ = aStatement;				    
					    with (runContext) {
						    try {
							    return eval("(function(){ return " + $$$$___STATEMENT___VALUE___$$$___TEXT___$$$$ + ";})()");
						    } catch (e) {
							    if (!console)
								    return;
							    else if (console.error)
								    console.error("de.titus.core.SpecialFunctions.doEval ***Error*** expression: " + aStatement + ": ", e);
							    else if (console.log)
								    console.log("de.titus.core.SpecialFunctions.doEval ***Error*** expression: " + aStatement + ": ", e);
							    return undefined;
						    }
					    }
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
