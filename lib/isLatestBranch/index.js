const LATEST_BRANCHES = [
    'master',
    'latest',
];

/**
 * Should this branch produce "latest" versions
 * @param  {String} branch
 * @return {Boolean}
 */
module.exports = branch => LATEST_BRANCHES.includes(branch);
