// simple type detection
var type = function (object) {
	return Object.prototype.toString.call(object).match(/(\w+)\]/)[1];
};

// finds type of array, returns undefined if not consistent
var arrayType = function(array) {
	return array.reduce(function(memo, value) {
		if (memo === null) {
			memo = type(value);
		}
		else if (type(value) !== memo) {
			memo = undefined;
		}

		return memo;
	}, null);
};

// simple property HOF
var prop = function(key) {
	return function(object) {
		return object[key];
	}
}

// debounces functions
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
	"arrayType": arrayType,
	"prop": prop,
	"debounce": debounce
};
