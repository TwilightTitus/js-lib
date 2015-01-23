de.titus.core.Namespace.create("de.titus.core.SpecialFunctions", function(){

	de.titus.core.SpecialFunctions = {};
	
	/**
	 * This is a special function to create an "eval"-function with an extends context.
	 * 
	 * @param $___DOMHELPER___$
	 * @param $___STATEMENT___$
	 * @param $___CONTEXT___$
	 * @returns
	 */
	window.$___DE_TITUS_CORE_EVAL_WITH_CONTEXT_EXTENTION___$ = function ($___DOMHELPER___$, $___STATEMENT___$, $___CONTEXT___$) {
		if ($___CONTEXT___$ != undefined) {
			$___DOMHELPER___$.mergeObjects(this, $___CONTEXT___$);
		}
		if ($___STATEMENT___$ != undefined) {
			return this.eval($___STATEMENT___$);
		}
	};
	
});