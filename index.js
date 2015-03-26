'use strict';

var swr = require('skelenode-swagger/respond');
var swaggerNodeRestify = require('swagger-node-restify');

module.exports = function(options) {
	var SkelenodeModel = {};
	SkelenodeModel.swr = swr;
    SkelenodeModel.swr.params = swaggerNodeRestify.params;

	/**
	 * holds the swagger specs for each of our CRUD
	 * operations
	 *
	 * @type {Object}
	 */
	var swaggers = [];

	/**
	 * an initialization method that is called
	 * as soon as the model is loaded.
	 *
	 * @author Tim Golen 2015-03-01
	 *
	 * @return {void}
	 */
	SkelenodeModel.init = function() {};

	/**
	 * sets the swagger options for a CRUD operation
	 * example:
	 * SkelenodeModel.setSwagger('create', {}, function() {});
	 *
	 * @author Tim Golen 2014-12-23
	 *
	 * @param  {object} spec the swagger specification
	 * @param  {function} action the swagger action
	 *
	 * @return {boolean} true if successful, false if not
	 */
	SkelenodeModel.setSwagger = function(spec, action) {
		swaggers.push({
			spec: spec,
			action: action
		});
		return true;
	};

	/**
	 * returns the swagger methods for this model
	 * example:
	 * SkelenodeModel.getSwagger()
	 *
	 * @author Tim Golen 2014-12-23
	 *
	 * @return {object} contains all the swagger resources
	 *                           set for this model
	 */
	SkelenodeModel.getSwagger = function() {
		return swaggers;
	};

	return SkelenodeModel;
};