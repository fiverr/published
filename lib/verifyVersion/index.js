const isCleanSemVer = require('../isCleanSemVer');
const isReleaseCandidate = require('../isReleaseCandidate');
const isLatestBranch = require('../isLatestBranch');

/**
 * Throw an error and a tag and a version are not compatible with our logic
 * @param  {String} tag
 * @param  {String} suffix
 * @return {Boolean}
 */
module.exports = function verifyVersion(version, branch) {
    const latestBranch = isLatestBranch(branch);
    const cleanVersion = isCleanSemVer(version);
    const releaseCandidate = isReleaseCandidate(version);

    if (latestBranch && !cleanVersion) {
        throw new Error(`Publishing a "latest" version is not allowed using a pre-release suffix.\nRemove the pre-release from ${version}.`);
    }

    if (!latestBranch && cleanVersion) {
        throw new Error(`${version} is not declared as a release candidate ("rc" in version's pre release part, e.g. 1.2.0-rc.1). Not publishing.`);
    }

    return [latestBranch, releaseCandidate].includes(true, false);
}
