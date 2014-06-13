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
	"debounce": debounce
};
