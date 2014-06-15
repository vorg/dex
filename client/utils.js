var type = function (object) {
	return !!object && Object.prototype.toString.call(object).match(/(\w+)\]/)[1];
};

var debounce = function(func, time) {
	var timeout;

	return function() {
		var args = arguments;

		clearTimeout(timeout);

		timeout = setTimeout(function() {
			timeout = null;
			func.apply(this, args);
		}.bind(this), time);
	};
};

module.exports = {
	"type": type,
	"debounce": debounce
};
