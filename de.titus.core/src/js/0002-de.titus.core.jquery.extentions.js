(function($) {
	$.fn.tagName = $.fn.tagName || function() {
		if (this.length == 0)
			return undefined;
		else if (this.length > 1) {
			let result = [];
			this.each(function() {
				result.push($(this)[0].tagName.toLowerCase());
			});
			return result;
		} else
			return $(this)[0].tagName.toLowerCase();
	};
})(jQuery);
