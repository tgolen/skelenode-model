'use strict';

var _ = require('underscore'),
	SkelenodeModel = require('./index');

module.exports = function(options) {
	var Model = new SkelenodeModel(options);

	// define some action constants that we can use
	options.actions = {
		find:    'FIND',
		create:  'CREATE',
		update:  'UPDATE',
		remove:  'REMOVE'
	};

	// holds a swagger spec for each supported action
	options.spec = {};

	/**
	 * calls a method called 'allow' in our options that will
	 * 	perform any access checking
	 *
	 * @author Tim Golen 2015-03-01
	 * @access private
	 *
	 * @param  {string} action the CRUD actions being done
	 * @param  {object} req an Express or Restify Request object
	 * @param  {object} res an Express or Restify Response object
	 * @param  {Function} cb
	 *         if request is allowed, cb(null, true)
	 *         if request is not allowed, cb(null, false)
	 *
	 * @return {void}
	 */
	function allow(action, req, res, cb) {
		// call the allow method in our options if it exists
		// or we will just assume it is always allowed
		if (options.allow) {
			return options.allow.apply(this, arguments);
		}

		return cb && cb(null, true);
	}

	/**
	 * calls a method called 'clean' in our options that will
	 * 	perform any cleaning on the object being acted upon.
	 * 	If we're doing a create, then it gets cleaned before going into the DB
	 * 	If we're doing an update, then it gets cleaned before the response
	 * 		is sent
	 *
	 * @author Tim Golen 2015-03-01
	 * @access private
	 *
	 * @param  {string} action the CRUD actions being done
	 * @param  {object} result that needs to be cleaned
	 * @param  {object} req an Express or Restify Request object
	 * @param  {object} res an Express or Restify Response object
	 * @param  {Function} cb
	 *         will pass a server error as the first argument if necessary
	 *
	 * @return {void}
	 */
	function clean(action, result, req, res, cb) {
		// call the clean method in our options if it exists
		// or we will just assume it is always clean
		if (options.clean) {
			return options.clean.apply(this, arguments);
		}
		return cb && cb();
	}

	/**
	 * each crud method calls this and will perform an allow()
	 * to ensure the request is appropriate, then clean() to ensure
	 * that the data is clean
	 *
	 * @author Tim Golen 2015-03-01
	 * @access private
	 *
	 * @param  {string} action the CRUD actions being done
	 * @param  {object} req an Express or Restify Request object
	 * @param  {object} res an Express or Restify Response object
	 * @param  {Function} next
	 *
	 * @return {void}
	 */
	function performCrudAction(action, req, res, next) {
		allow(action, req, res, function(err, isAllowed) {
			if (err) {
				return Model.swr.error.serverError(res);
			}
			if (!isAllowed) {
				return Model.swr.error.forbidden(res);
			}
			switch (action) {
				case options.actions.find:
					find(action, req, res, function(err, result) {
						if (err) {
							return Model.swr.error.serverError(res);
						}
						Model.swr.success(result, res);
						next();
					});
					break;
			}
		});
	}

	/**
	 * Runs a query to get our result, then cleans the result
	 * calls an optional 'found' method if it exists in the options
	 *
	 * @author Tim Golen 2015-03-01
	 * @access private
	 *
	 * @param  {string} action the CRUD actions being done
	 * @param  {object} req an Express or Restify Request object
	 * @param  {object} res an Express or Restify Response object
	 * @param  {Function} cb
	 *         passed an error as the first argument if it exists
	 *         passes the result as the second argument
	 *
	 * @return {void}
	 */
	function find(action, req, res, cb) {
		var result = {};
		// TODO: run our query

		// clean our result
		clean(action, result, req, res, function(err) {
			if (err) {
				return cb(err);
			}

			// see if there is a method in our options that we need
			// to run once we have found our results
			if (options.found) {
				options.found(result, req, res, cb);
			} else {
				cb && cb(null, result);
			}
		});
	}

	/**
	 * initializes our CRUD model by adding the necessary swagger
	 * specs
	 *
	 * @author Tim Golen 2015-03-01
	 * @access public
	 *
	 * @return {void}
	 */
	Model.setSwaggerSpecs = function() {
		for (var action in options.spec) {
			Model.setSwagger(options.spec[action], function(req, res, next) {
					performCrudAction(action, req, res, next);
				});
		}
	};

	return Model;
};