de.titus.core.Namespace.create("de.titus.core.SpecialFunctions", function() {

	var SpecialFunctions = de.titus.core.SpecialFunctions = {
	    DEVMODE : location.search ? (/.*devmode=true.*/ig).test(location.search) : false,
	    STATEMENTS : {},
	    doEval : function(aStatement, aContext, aCallback) {
		    if (aCallback)
			    SpecialFunctions.doEvalWithContext(aStatement, (aContext || {}), undefined, aCallback);
		    else {
			    if (typeof aStatement !== "string")
				    return aStatement;
			    
			    var statement = aStatement.trim();			    
			    if(statement === "")
			    	return undefined;

			    try {
				    var evalFunction = new Function("aContext", "with(this){return " + aStatement + ";}");
				    return evalFunction.call(aContext);
			    } catch (e) {
				    if (SpecialFunctions.DEVMODE) {
					    console.log("----------------------\n", "doEval()\n", "statement: \"", aStatement, "\"\n", "context: \"", aContext, "\"\n", "callback: \"", aCallback, "\"\n", "error: ", e, "\n", "----------------------");
				    }
				    throw e;
			    }
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
				    if (typeof result === "undefined")
					    return aDefault;
				    return result;
			    } catch (e) {
				    return aDefault;
			    }
	    }
	};

});
