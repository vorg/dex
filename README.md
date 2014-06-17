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
return data.map(function(object) {
	return object.val * 2;
});
```

# Simple architecture overview

Node runs express server serving static html from `public/index.html`. Frontend site scripts are written using browserify (entry point is `client/main.js`), compiled on the fly using browserify middleware for express. 

Data file, and transform scripts are being watched by `fs.watch`, and new changes are pushed automatically through websockets to running frontend, without need to reload.
