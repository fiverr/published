const RELEASE_CANDIDATES = [
    'rc',
    'releasecandidate',
    'release-candidate',
    'release_candidate',
];

module.exports = tag => RELEASE_CANDIDATES
    .some(
        term => tag
            .toLowerCase()
            .includes(term)
    );
