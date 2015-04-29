de.titus.core.Namespace.create("de.titus.core.SpecialFunctions", function() {
	
	de.titus.core.SpecialFunctions = {};
	
	de.titus.core.SpecialFunctions.doEval = function(aDomhelper, aStatement, aContext) {
		if (aStatement != undefined) {
			eval("var $___DE_TITUS_CORE_EVAL_RESULT_FUNCTION___$ = function($___DOMHELPER___$,$___CONTEXT___$){ " + "$___DOMHELPER___$.mergeObjects(this, $___CONTEXT___$);" + "var $___EVAL_RESULT___$ = " + aStatement + ";" + "return $___EVAL_RESULT___$;};");
			if ($___DE_TITUS_CORE_EVAL_RESULT_FUNCTION___$ != undefined) {
				var result = $___DE_TITUS_CORE_EVAL_RESULT_FUNCTION___$(aDomhelper, aContext);
				$___DE_TITUS_CORE_EVAL_RESULT_FUNCTION___$ = undefined;
				
				return result;
			}
			return undefined;
		}
	};
});
