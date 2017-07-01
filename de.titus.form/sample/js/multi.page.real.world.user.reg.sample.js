/**
 * http://usejsdoc.org/
 */

var VALIDLOGINNAME = undefined;
var checkLoginName = function(aLoginname) {
	if (VALIDLOGINNAME == aLoginname)
		return true;
	var rand = Math.ceil(Math.random() * 100);
	var mod = rand % 2;
	var valid = (mod == 1);
	if (valid)
		VALIDLOGINNAME = aLoginname;
	return valid;
};
