/**
 * Checks if semver has a pre-release tag
 * @param  {String} version
 * @return {Boolean}
 */
module.exports = version => /^\d{1,}\.\d{1,}\.\d{1,}$/.test(version);
