(function($) {
	$('body').on("test", function() {
		console.log(arguments);
	});
})($);
var testfunction = function() {
	console.log(arguments);
};
