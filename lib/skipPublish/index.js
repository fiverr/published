const isCleanSemVer = require('../isCleanSemVer');
const isReleaseCandidate = require('../isReleaseCandidate');

/**
 * Throw an error and a tag and a version are not compatible with our logic
 * @param  {String} tag
 * @param  {Boolean} latestBranch
 * @return {Boolean}
 */
module.exports = function skipPublish(version, latestBranch) {
    const cleanVersion = isCleanSemVer(version);
    const releaseCandidate = isReleaseCandidate(version);
    const shouldPublish = [latestBranch, releaseCandidate].includes(true, false);

    if (latestBranch && !cleanVersion) {
        throw new Error(`Publishing a "latest" version is not allowed using a pre-release suffix.\nRemove the pre-release from ${version}.`);
    }

    if (shouldPublish) {
        return false;
    }

    const output = ['Version does not require publishing.'];

    (!latestBranch && cleanVersion) && output.push(`${version} is not declared as a release candidate ("rc" in version's pre release part, e.g. 1.2.0-rc).`);


    return output.join(' ');
};
