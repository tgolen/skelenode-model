'use strict';

var swr = require('skelenode-swagger/respond');

module.exports = function(options) {
	var SkelenodeModel = {};
	SkelenodeModel.swr = swr;

	/**
	 * holds the swagger specs for each of our CRUD
	 * operations
	 *
	 * @type {Object}
	 */
	var swaggers = [];

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