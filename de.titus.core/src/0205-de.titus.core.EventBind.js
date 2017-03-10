(function($) {
	de.titus.core.Namespace.create("de.titus.core.EventBind", function() {
		"use strict";
		var EventBind = de.titus.core.EventBind = function(anElement, aContext) {
			if (anElement.data(de.titus.core.EventBind.STATE.FINISHED) == undefined) {
				
				var eventType = anElement.attr("event-type");
				if (eventType == undefined || eventType.trim().length == 0) {
					anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.FAIL);
					return this;
				}
				
				var action = anElement.attr("event-action");
				if (action == undefined || action.trim().length == 0) {
					anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.FAIL);
					return this;
				}
				
				var data = undefined;
				var eventData = anElement.attr("event-data");
				if (eventData != undefined && eventData.trim().length > 0){
					data = de.titus.core.EventBind.EXPRESSIONRESOLVER.resolveExpression(eventData, aContext , {});
				}
				else if(aContext != undefined){
					data = $().extend({}, aContext);
				}
				else {
					data = {};
				}
				
				anElement.on(eventType, null, data, de.titus.core.EventBind.$$__execute__$$);
				anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.READY);
				return this;
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
			if (element.attr("event-prevent-default") != undefined)
				anEvent.preventDefault();
			if (element.attr("event-stop-propagation") != undefined)
				anEvent.stopPropagation();
			
			var action = element.attr("event-action");
			action = de.titus.core.EventBind.EXPRESSIONRESOLVER.resolveExpression(action, anEvent.data, undefined);
			if (typeof action === "function"){
				var args = Array.from(arguments);
				if(args != undefined && args.length >= 1 && anEvent.data != undefined){
					args.splice(1,0,anEvent.data);
				}
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
