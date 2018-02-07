/**
 * Add suffix (commit sha) to version for all tags but latest
 * @param  {string} tag
 * @return {string}
 *
 * @example
 * await versionSuffix('latest') // ''
 * await versionSuffix('feature-branch') // '-c447f6a'
 */
module.exports = async function versionSuffix(tag) {
    if (tag === 'latest') {
        return '';
    }

    return `-${await require('../git-data').sha}`;
}
