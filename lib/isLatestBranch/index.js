/**
 * Should this branch produce "latest" versions
 * @param  {String} branch         Current branch
 * @param  {String} isLatestBranch Branch from which to publish latest
 * @return {Boolean}
 */
module.exports = (branch, isLatestBranch = 'master') => ['latest', isLatestBranch].includes(branch);
