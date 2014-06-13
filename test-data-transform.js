/*global data */

var transformed = data.reduce(function(memo, object) {
	return memo + object.val;
}, 0);

return transformed;
