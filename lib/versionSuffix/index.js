/**
 * Extract the suffix part from the complete version
 * @param  {String} version Semver
 * @return {String}         Pre-release tag
 */
module.exports = version => version.replace(/^\d{1,}.\d{1,}.\d{1,}[-|.]?/, '');
