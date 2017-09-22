(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.core.PagingUtils", function() {
		var PagingUtils = de.titus.core.PagingUtils = {
		    pagerData : function(aPage, aPages, aSize) {
			    var half = Math.round(aPages / 2);
			    var result = {
			        firstPage : 1,
			        startPage : 1,
			        endPage : aSize,
			        lastPage : aPages,
			        current : aPage,
			        pageCount : aPages
			    };
			    if (aSize > aPages)
				    result.endPage = aPages;
			    else if (aPage + half > aPages) {
				    result.endPage = aPages;
				    result.startPage = (end - aSize) + 1;
			    } else if (aPage - half > 1) {
				    result.endPage = (aPage + half);
				    result.startPage = (end - aSize) + 1;
			    }
			    result.count = result.endPage - result.startPage;
			    return result;
		    },
		    
		    pageArray : function(aPage, aSize, aArray) {
			    return aArray.slice((aPage - 1) * aSize, aSize);
		    }
		
		}
	});
})($);
