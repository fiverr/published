const {expect} = require('chai');
const isReleaseCandidate = require('.');

describe('isReleaseCandidate', () => {
    it('Should detect release candidate', () =>
        [
            '1.1.1rc',
            '1.1.1-rc',
            '1.1.1.rc.123',
            '1.1.1.rc-3',
            '1.1.1-ReleaseCandidate',
            '1.1.1-RELEASE_CANDIDATE',
            '1.1.1-release-candidate'
        ].forEach((tag) => expect(isReleaseCandidate(tag)).to.be.true)
    );
    it('Should detect missing release candidate', () =>
        [
            '1',
            '1.1.1',
            '1.1.1-alpha',
            '1.1.1-beta',
            '1.1.1.4',
            '1.1.1-release.candidate'
        ].forEach((tag) => expect(isReleaseCandidate(tag)).to.be.false)
    );
});
