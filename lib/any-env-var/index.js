/**
 * Finds one of any possible environment variables
 * @param  {...String} names
 * @return {String|undefined}
 */
module.exports = (...names) => process.env[names.find(name => process.env.hasOwnProperty(name))];
