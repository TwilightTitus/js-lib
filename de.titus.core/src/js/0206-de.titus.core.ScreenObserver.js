(function($, aResolver) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.core.ScreenObserver", function() {
		var Observer = de.titus.core.ScreenObserver = {
		    __timeoutId : undefined,
		    __handler : {},
		    addHandler : function(aHandler) {
			    if (typeof aHandler.condition !== 'undefined' && aHandler.condition.length != 0) {
				    aHandler.id = de.titus.core.UUID("-");
				    Observer.__handler[aHandler.id] = aHandler;
				    Observer.__callHandler(aHandler, Observer.__screenData());
				    return aHandler;
			    }
		    },
		    __screenData : function() {
			    return {
			        width : window.innerWidth,
			        height : window.innerHeight,
			        pixelRatio : window.devicePixelRatio,
			        landscape : (window.innerHeight <= window.innerWidth),
			        portrait : (window.innerHeight > window.innerWidth)
			    };
		    },
		    __resizing : function() {
			    Observer.__timeoutId = undefined;
			    var screen = Observer.__screenData();
			    Object.getOwnPropertyNames(Observer.__handler).forEach(function(aHandlerId) {
				    Observer.__callHandler(Observer.__handler[aHandlerId], screen);
			    });

		    },
		    __callHandler : function(aHandler, aScreen) {
			    setTimeout((function(aHandler, aScreen, aResolver) {
				    var result = aResolver.resolveExpression(aHandler.condition, aScreen, false);
				    if (typeof result !== 'boolean')
					    return Observer.__handler[aHandler.id] == undefined;

				    if (result) {
					    aHandler.active = true;
					    aHandler.activate.call(aScreen);
					    if (typeof aHandler.deactivate !== 'function')
						    Observer.__handler[aHandler.id] == undefined;
				    } else if (aHandler.active && typeof aHandler.deactivate === 'function') {
					    aHandler.deactivate.call(aScreen);
					    aHandler.active = false;
				    }

			    }).bind(null, aHandler, aScreen, aResolver), 66);
		    },
		    __handleResize : function() {
			    if (Observer.__timeoutId)
				    clearTimeout(Observer.__timeoutId);

			    Observer.__timeoutId = setTimeout(Observer.__resizing, 250);
		    }
		};

		window.addEventListener('resize', Observer.__handleResize, false);
		$(document).ready(Observer.__resizing);
	});
})($, de.titus.core.ExpressionResolver.DEFAULT);
