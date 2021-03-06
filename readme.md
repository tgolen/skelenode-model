# Skelenode Model
This is a [Skelenode](https://github.com/tgolen/skelenode) component to manage your data models. It relies on [Skelenode Swagger](https://github.com/tgolen/skelenode-swagger) to provide automatic API documentation and routing. It can be paired with [Skelenode Socket](https://github.com/tgolen/skelenode-socket) to allow HTTP requests to the model via XHR or web sockets using the same API route.

# Requirements
* You must have a [Skelenode](https://github.com/tgolen/skelenode) server running with [Skelenode Swagger](https://github.com/tgolen/skelenode-swagger)

# Installation
```
npm install skelenode-model
```

# Usage
### Create a model file
`app/models/hello/world.js`
```javascript
'use strict';

var SkelenodeModel = require('skelenode-model');

module.exports = function() {
	var Model = new SkelenodeModel();

	// create a swagger endpoint for this model
	Model.setSwagger({
			method: 'GET',
			path: '/api/v1/hello/world',
			nickname: 'hello_world'
		}, function(req, res, next) {
			// each model receives an 'swr' attribute that contains the responses from
			// Skelenode Swagger
			Model.swr.success({ msg: 'Hello World!' }, res);
			next();
		});

	return Model;
};
```

### Load the model with Skelenode Model Loader
```
var skelenodeModelLoader = require('skelenode-model/loader');
skelenodeModelLoader.init(__dirname + '/app/models');
```

### Access that path via an HTTP request (will vary by your server setup) such as:
```
http://localhost:3000/api/v1/hello/world

{
    "success": true,
    "code": 200,
    "result": {
        "msg": "Hello World!"
    }
}
```

## Methods

### setSwagger(spec, action)
Adds a swagger API endpoint with the given `spec` and `action`.
```
Model.setSwagger({
		method: 'GET',
		path: '/api/v1/hello/world',
		nickname: 'hello_world'
	}, function(req, res, next) {
		Model.swr.success({ msg: 'Hello World!' }, res);
		next();
	});
```

### getSwagger()
Returns an array of all the swagger endpoints for the given model

# Contributing
Open a pull request with plenty of well-written instructions on what you are submitting and why you are submitting it
