(function($) {
	de.titus.core.Namespace.create("de.titus.core.EventBind", function() {
		"use strict";
		var EventBind = de.titus.core.EventBind = function(anElement, aContext) {
			if (anElement.data(de.titus.core.EventBind.STATE.FINISHED) == undefined) {
				var result = {
				    preventDefault : (typeof anElement.attr("event-prevent-default") !== "undefined"),
				    stopPropagation : (typeof anElement.attr("event-stop-propagation") !== "undefined")
				};
				result.eventType = anElement.attr("event-type");
				if (result.eventType == undefined || result.eventType.trim().length == 0) {
					anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.FAIL);
					return anElement;
				}

				result.action = anElement.attr("event-action");
				if (result.action == undefined || result.action.trim().length == 0) {
					anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.FAIL);
					return anElement;
				}
				if (EventBind.FUNCTIONS[result.action]) {
					result.defaultAction = true;
					result.action = EventBind.FUNCTIONS[result.action];
				}

				var data = undefined;
				result.eventData = anElement.attr("event-data");
				if (result.eventData != undefined && result.eventData.trim().length > 0) {
					data = de.titus.core.EventBind.EXPRESSIONRESOLVER.resolveExpression(eventData, aContext, {});
				} else if (aContext != undefined) {
					data = $().extend({}, aContext);
				} else {
					data = {};
				}

				anElement.on(eventType, null, data, de.titus.core.EventBind.$$__execute__$$);
				anElement.data("de.titus.core.EventBind", result);
				anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.READY);
				return anElement;
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
		EventBind.FUNCTIONS = {
			"trigger-event" : function(anEvent) {
				var element = $(anEvent.target);
				element.trigger(element.attr("data-trigger-event"));
			}
		};

		EventBind.$$__execute__$$ = function(anEvent) {
			var element = $(this);
			var data = element.data("de.titus.core.EventBind");
			if (data.preventDefault)
				anEvent.preventDefault();
			if (data.stopPropagation)
				anEvent.stopPropagation();

			var action = data.action;
			if (!data.defaultAction)
				action = EventBind.EXPRESSIONRESOLVER.resolveExpression(data.action, anEvent.data, undefined);

			if (typeof action === "function") {
				var args = Array.from(arguments);
				if (args != undefined && args.length >= 1 && anEvent.data != undefined)
					args.splice(1, 0, anEvent.data);
				action.apply(action, args);
			}

			return !anEvent.isDefaultPrevented();
		};
		de.titus.core.jquery.Components.asComponent("de.titus.core.EventBind", de.titus.core.EventBind);

		$(document).ready(function() {
			var hasAutorun = $("[event-autorun]");
			if (hasAutorun != undefined && hasAutorun.length != 0) {
				$("[event-autorun]").de_titus_core_EventBind();
				$("[event-autorun]").find("[event-type]").de_titus_core_EventBind();

				var observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {
						for (var i = 0; i < mutation.addedNodes.length; i++) {
							if (mutation.addedNodes[i].nodetype != Node.TEXT_NODE) {
								$(mutation.addedNodes[i]).find("[event-type]").de_titus_core_EventBind();
							}
						}
					});
				});

				// configuration of the observer:
				var config = {
				    attributes : false,
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
