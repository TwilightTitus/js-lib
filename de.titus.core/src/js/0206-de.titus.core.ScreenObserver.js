(function($, aResolver) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.core.ScreenObserver", function() {
		var Observer = de.titus.core.ScreenObserver = {
		    __timeoutId : undefined,
		    __handler : [],
		    addHandler : function(aHandler) {
			    if (typeof aHandler.condition !== 'undefined' && aHandler.condition.length != 0) {
				    Observer.__handler.push(aHandler);
				    Observer.__callHandler(aHandler, Observer.__screenData());
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
			    Observer.__handler.forEach(function(aHandler, aIndex) {
				    Observer.__callHandler(aHandler, screen, aIndex);
			    });

		    },
		    __callHandler : function(aHandler, aScreen, aIndex) {
			    setTimeout((function(aHandler, aScreen, aIndex, aResolver) {
				    var result = aResolver.resolveExpression(aHandler.condition, aScreen, false);
				    if (typeof result !== 'boolean')
					    return Observer.__handler.splice(aIndex, 1);

				    if (result) {
					    aHandler.callback.call(aScreen);
					    if (aHandler.once)
						    Observer.__handler.splice(aIndex, 1);
				    }
			    }).bind(null, aHandler, aScreen, aIndex, aResolver), 66);
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
