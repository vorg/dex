# Usage

	grunt --script=[data-transform-script.js] --data=[data-file.json] --port=[frontend-port]

## Example test data

```json
[
	{ "val": 2 },
	{ "val": -1 },
	{ "val": 3 },
	{ "val": 4 }
]
```

## Example data transform

```js
var data = data.map(function(object) {
	return object.val * 2;
});

return [
	{ "type": "json", "data": data }
]
```

## Available data displays

- `json` - displays json data
- `bar` - bar chart, requires x/y fields
- `scatter` - scatterplot, requires x/y fields
- `geo` - map, requires lat/lon fields
- `info` - basic info, requires array of values

# Simple architecture overview

Node runs express server serving static html from `public/index.html`. Frontend site scripts are written using browserify (entry point is `client/main.js`), compiled on the fly using browserify middleware for express. 

Data file, and transform scripts are being watched by `fs.watch`, and new changes are pushed automatically through websockets to running frontend, without need to reload.
