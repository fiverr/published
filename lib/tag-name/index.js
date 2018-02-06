require('colors');
const {
    RELEASE_CANDIDATES,
} = require('../constants');
const gitData = require('../git-data');

/**
 * Create a tag name: master branch pushes "latest", others push as branch name
 * @param  {string} branch
 * @param  {string} version
 * @return {string}
 */
module.exports = function tagName({version}) {
    const { branch } = gitData;

    // master branch pushes "latest", others push as branch name
    if (branch === 'master') {
        if (!require('../is-semver-clean')(version)) {
            throw new Error(messageNoPreRelease(version));
        }

        return 'latest';
    }

    if (!isReleaseCandidate(version)) {
        throw new Error(messageNoReleaseCondidate(version));
    }

    return branch.replace(/[^\w-_]/g, '-');
}

const messageNoPreRelease = (version) => `Publishing a "latest" version is not allowed using a pre-release suffix.\nRemove the pre-release from ${version.underline}.`.red.bold;


const isReleaseCandidate = (version) => RELEASE_CANDIDATES.some(term => require('../get-pre-release-tag')(version).toLowerCase().includes(term));


const messageNoReleaseCondidate = (version) => `${version.underline} is not declared as a release candidate ("rc" in version's pre release part, e.g. 1.2.0-rc.1). ${'Not publishing'.underline}.`;
