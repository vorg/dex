var array = data.map(function(object) {
	return object.val * 2;
});

return {
	"data": {
		"arr": array,
		"other": false
	},
	"meta": {
		"name": "DEX",
		"test": true
	}
};
