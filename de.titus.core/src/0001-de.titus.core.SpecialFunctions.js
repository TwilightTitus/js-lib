de.titus.core.Namespace.create("de.titus.core.SpecialFunctions", function() {
	
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
