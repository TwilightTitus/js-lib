(function($) {
	de.titus.core.Namespace.create("de.titus.core.jquery.Components",
			function() {
				var Components = de.titus.core.jquery.Components = {};
				Components.asComponent = function(aName, aConstructor) {
					$.fn[Components.__buildFunctionName(aName)] = function(
							aData) {
						return Components.__createInstance(this, aName,
								aConstructor, aData);
					};
				};

				Components.__buildFunctionName = function(aName) {
					return aName.replace(/\./g, "_");
				};

				Components.__createInstance = function(aElement, aName,
						aConstructor, aData) {
					if (aElement.length == 0)
						return;
					else if (aElement.length > 1) {
						var result = [];
						aElement.each(function() {
							result.push($(this).de_titus_Typeahead(aData));
						});
						return result;
					} else {
						var component = aElement.data(aName);
						if (!component) {
							component = new aConstructor(aElement, aData);
							aElement.data(aName, component);
						}

						return component;
					}
				}

			});
})($);
