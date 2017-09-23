(function($) {
	de.titus.core.Namespace.create("de.titus.core.EventBind", function() {
		"use strict";
		var EventBind = de.titus.core.EventBind = function(anElement, aContext) {
			var result = {
			    preventDefault : (typeof anElement.attr("event-prevent-default") !== "undefined"),
			    stopPropagation : (typeof anElement.attr("event-stop-propagation") !== "undefined")
			};
			result.eventType = anElement.attr("event-type");
			if (typeof result.eventType === 'undefined')
				anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.FAIL);
			else {
				result.action = anElement.attr("event-action");
				result.delegation = anElement.attr("event-delegation");

				if (typeof (result.action || result.delegation) === 'undefined') {
					anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.FAIL);
					return;
				}

				result.eventData = anElement.attr("event-data");
				if (typeof result.eventData !== 'undefined' && result.eventData.length > 0)
					result.eventData = de.titus.core.EventBind.EXPRESSIONRESOLVER.resolveExpression(eventData, aContext, {});
				else if (typeof aContext !== 'undefined')
					result.eventData = $().extend({}, aContext);

				if (typeof result.eventData !== 'undefined')
					anElement.on(result.eventType, null, result.eventData, de.titus.core.EventBind.$$__execute__$$);
				else
					anElement.on(result.eventType, de.titus.core.EventBind.$$__execute__$$);
				anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.READY);
				return result;
			}
		};

		EventBind.EXPRESSIONRESOLVER = new de.titus.core.ExpressionResolver();
		EventBind.STATE = {
			FINISHED : "$$EventBind.FINISHED$$"
		};
		EventBind.FINISHEDSTATE = {
		    FAIL : "fail",
		    READY : "ready"
		};

		EventBind.$$__execute__$$ = function(anEvent) {
			var element = $(this);
			var data = element.data("de.titus.core.EventBind");
			if (data.preventDefault)
				anEvent.preventDefault();
			if (data.stopPropagation)
				anEvent.stopPropagation();

			if (typeof data.action !== 'undefined') {
				var action = data.action;
				action = EventBind.EXPRESSIONRESOLVER.resolveExpression(data.action, anEvent.data, undefined);
				if (typeof action === "function") {
					var args = Array.from(arguments);
					if (args != undefined && args.length >= 1 && anEvent.data != undefined)
						args.splice(1, 0, anEvent.data);
					action.apply(action, args);
				}
			}

			if (typeof data.delegation !== 'undefined')
				element.trigger(data.delegation, typeof data.eventData !== 'undefined' ? [ data.eventData ] : undefined);

			return !anEvent.isDefaultPrevented();
		};
		de.titus.core.jquery.Components.asComponent("de.titus.core.EventBind", de.titus.core.EventBind);

		$(document).ready(function() {
			var elements = $("[event-autorun]");
			if (typeof elements !== 'undefined' && elements.length > 0) {
				elements.de_titus_core_EventBind();
				elements.find("[event-type]").de_titus_core_EventBind();

				var observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {
						mutation.addedNodes.forEach(function(node) {
							if (node.nodetype != Node.TEXT_NODE) {
								$(node).de_titus_core_EventBind();
								$(node).find("[event-type]").de_titus_core_EventBind();
							}
						});
					});
				});

				// configuration of the observer:
				var config = {
				    attributes : true,
				    childList : true,
				    subtree : true,
				    characterData : false
				};

				// pass in the target node, as well as the observer options
				observer.observe(document.querySelector("[event-autorun]"), config);
			}
		});
	});
})($, document);
