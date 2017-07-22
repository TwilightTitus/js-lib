(function($) {
	de.titus.core.Namespace.create("de.titus.js.Bundler", function() {
		var Bundler = de.titus.js.Bundler = function(element) {
			this.element = element;

		};

		Bundler.prototype.doHandleDependencies = function(aEvent) {
			if (aEvent == undefined)
				return Bundler.prototype.doHandleDependencies.bind(this);
			var element = $(aEvent.target);
			if (element.is(":checked")) {
				var dependencies = element.attr("data-module-dependencies");
				var dependencies = dependencies.split(",");
				for (var i = 0; i < dependencies.length; i++)
					this.element.find("[data-module=" + dependencies[i].trim() + "]").prop("checked", true);
			}
		};

		Bundler.prototype.doBundle = function(aEvent) {
			if (aEvent == undefined)
				return Bundler.prototype.doBundle.bind(this);

			this.element.removeClass("state-waiting").addClass("state-bundling");

			console.log(aEvent);

			var jsType = $(aEvent.currentTarget).attr("data-js-type");
			var codes = [];
			this.element.find("[data-module]:checked").each(function() {
				codes.push($(this).attr("data-module-" + jsType));
			});
			var concat = function(aCodes, aBundleCode, aCallback, aResponse) {
				console.log(aCodes);
				if (aResponse) {
					console.log(aResponse);
					aBundleCode += aResponse;
				}
				if (aCodes.length > 0) {
					var request = {
						url : aCodes.splice(0, 1)
					};
					$.ajax(request).done(concat.bind({}, aCodes, aBundleCode, aCallback));
				} else
					aCallback(aBundleCode);
			};

			concat(codes, "", Bundler.prototype.__generateDownloadLink.bind(this));
		};

		Bundler.prototype.__generateDownloadLink = function(aBundleCode) {
			console.log(aBundleCode);
		};

		de.titus.core.jquery.Components.asComponent("de.titus.js.Bundler", de.titus.js.Bundler);
	});
})($);
