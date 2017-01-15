(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.PageUtils", function() {
		de.titus.form.PageUtils.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.PageUtils");
		
		de.titus.form.PageUtils.findBackPage = function(thePages, aCurrentIndex){
			if(de.titus.form.PageUtils.LOGGER.isDebugEnabled())
				de.titus.form.PageUtils.LOGGER.logDebug("findBackPage()");
			
			for(var i = (aCurrentIndex - 1); i >= 0; i--){
				var page = thePages[i];
				if(page.checkCondition())
					return page;
			}
			
			throw "Can't evaluate a previous page!";
		}
		
		de.titus.form.PageUtils.findNextPage = function(thePages, aCurrentIndex){
			if(de.titus.form.PageUtils.LOGGER.isDebugEnabled())
				de.titus.form.PageUtils.LOGGER.logDebug("findNextPage() -> aCurrentIndex: " + aCurrentIndex );
			
			for(var i = (aCurrentIndex + 1); i < thePages.length; i++){
				de.titus.form.PageUtils.LOGGER.logDebug(i);
				var page = thePages[i];
				if(page.checkCondition())
					return page;
			}
			
			throw "Can't evaluate a next page!";
		}
	});
})($);
