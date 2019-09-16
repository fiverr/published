const versionSuffix = require('../versionSuffix');

const RELEASE_CANDIDATES = [
    'rc',
    'releasecandidate',
    'release-candidate',
    'release_candidate'
];

/**
 * Check if this version includes a "release candidate" suffix
 * @param  {String} version
 * @return {Boolean}
 */
module.exports = (version) => RELEASE_CANDIDATES
    .some(
        (term) => versionSuffix(version)
            .toLowerCase()
            .includes(term)
    );
