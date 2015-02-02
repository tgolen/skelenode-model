'use strict';

var glob = require('glob'),
	path = require('path'),
	swagger = require('swagger-node-restify'),
	swaggerMethodName = {
		get: 'addGet',
		put: 'addPut',
		post: 'addPost',
		delete: 'addDelete'
	},
	modelPath = null;
	models = [];

/**
 * gets all model files and adds them to swagger
 * it will then add those to swagger as the proper resource
 *
 * @author Tim Golen 2014-12-17
 *
 * @param  {Function} cb
 */
function init(pathToModels, cb) {
	modelPath = pathToModels;
	glob(modelPath + '/**/*.js', function(err, files) {
		if (err) return cb && cb(err);

		files.forEach(function(file) {
			var Model = require(file)(),
				modelSwagger = Model.getSwagger();
			if (modelSwagger) {
				modelSwagger.forEach(function(swaggerResource) {
					swagger[swaggerMethodName[swaggerResource.spec.method.toLowerCase()]](swaggerResource);
				});
			}
			models.push(Model);
		});

		return cb && cb(null, models);
	});
}

/**
 * returns all of our model files
 *
 * @author Tim Golen 2015-01-26
 *
 * @param  {Function} cb
 *
 * @return {array} an array containing all of our models
 */
function models(cb) {
	return cb(null, models);
}

exports.init = init;
exports.models = models;