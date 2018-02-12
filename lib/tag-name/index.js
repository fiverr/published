require('colors');
const gitData = require('../git-data');
const {
    RELEASE_CANDIDATES,
} = require('../constants');

/**
 * Create a tag name: master branch pushes "latest", others push as branch name
 * @param  {string} branch
 * @param  {string} version
 * @return {string}
 */
module.exports = async function tagName({version}) {
    const branch = await gitData.branch;

    // master branch pushes "latest", others push as branch name
    if (branch === 'master') {
        if (!require('../is-semver-clean')(version)) {
            throw new Error(messageNoPreRelease(version));
        }

        return {tag: 'latest', ok: true};
    }

    if (!isReleaseCandidate(version)) {
        return {tag: messageNoReleaseCondidate(version), ok: false};
    }

    return {tag: branch.replace(/[^\w-_]/g, '-'), ok: true};
}

const messageNoPreRelease = (version) => `Publishing a "latest" version is not allowed using a pre-release suffix.\nRemove the pre-release from ${version.underline}.`.red.bold;


const isReleaseCandidate = (version) => RELEASE_CANDIDATES.some(term => require('../get-pre-release-tag')(version).toLowerCase().includes(term));


const messageNoReleaseCondidate = (version) => `${version.underline} is not declared as a release candidate ("rc" in version's pre release part, e.g. 1.2.0-rc.1). ${'Not publishing'.underline}.`;
