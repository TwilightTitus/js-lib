/**
 * http://usejsdoc.org/
 */

var VALIDLOGINNAME = undefined;
var checkLoginName = function(aLoginname) {
	if (VALIDLOGINNAME == aLoginname)
		return true;
	var valid = ((Math.random() * 100) % 4) < 1;
	if (valid)
		VALIDLOGINNAME = aLoginname;

	return valid;
};
