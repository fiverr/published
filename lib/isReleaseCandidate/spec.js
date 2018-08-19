const {expect} = require('chai');
const isReleaseCandidate = require('.');

describe('isReleaseCandidate', () => {
    it('Should detect release candidate', () =>
        [
            'rc',
            '-rc',
            '.rc.123',
            '.rc-3',
            'ReleaseCandidate',
            'RELEASE_CANDIDATE',
            'release-candidate',
        ].forEach(tag => expect(isReleaseCandidate(tag)).to.be.true)
    );
    it('Should detect missing release candidate', () =>
        [
            'alpha',
            'beta',
            '.4',
            'release.candidate',
        ].forEach(tag => expect(isReleaseCandidate(tag)).to.be.false)
    );
});
