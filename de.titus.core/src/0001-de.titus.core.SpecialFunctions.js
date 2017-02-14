de.titus.core.Namespace.create("de.titus.core.SpecialFunctions", function() {
	
	de.titus.core.SpecialFunctions = {};
	
	de.titus.core.SpecialFunctions.doEval = function(aStatement, aContext, aCallback) {
		if (aCallback) {
			de.titus.core.SpecialFunctions.doEvalWithContext(aStatement, (aContext || {}), undefined, aCallback);
		} else {
			if (aStatement != undefined && typeof aStatement !== "string")
				return aStatement;
			else if (aStatement != undefined) {
				var result = undefined;
				var runContext = aContext || {};
				with (runContext) {
					eval("result = " + aStatement + ";");
				}
				return result;
			}
			
			return undefined;
		}
	};
	
	
	/**
	 * 
	 * @param aStatement
	 * @param aContext
	 * @param aDefault
	 * @param aCallback
	 * @returns
	 */
	de.titus.core.SpecialFunctions.doEvalWithContext = function(aStatement, aContext, aDefault, aCallback) {
		if (aCallback && typeof aCallback === "function") {
			window.setTimeout(function() {
				var result = de.titus.core.SpecialFunctions.doEvalWithContext(aStatement, aContext, aDefault, undefined);
				aCallback(result, aContext);
			}, 1);
			
		} else
			try {
				var result = de.titus.core.SpecialFunctions.doEval(aStatement, aContext);
				if(result == undefined)
					return aDefault;
				return result;
			} catch (e) {
				return aDefault;
			}
	};
	
});
