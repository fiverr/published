const assert = require('assert');
const { expect } = require('chai');
const getPreReleaseTag = require('./');

describe('is-semver-clean', () => {
    it('no pre release tag', () => {
        [
            '1.0.0',
            '100.958.546',
        ].forEach(version => expect(getPreReleaseTag(version)).to.equal(''));
    });

    it('everything after the clean semver is considered tag', () => {
        expect(getPreReleaseTag('1.2.3.4')).to.equal('4');
        expect(getPreReleaseTag('1.2.3....4')).to.equal('...4');
        expect(getPreReleaseTag('1.2.3-.4')).to.equal('.4');
        expect(getPreReleaseTag('1.2.3.-4')).to.equal('-4');
    });

    it('gets clean pre release tags', () => {
        expect(getPreReleaseTag('1.2.4-rc')).to.equal('rc');
        expect(getPreReleaseTag('1.2.4-rc.4')).to.equal('rc.4');
        expect(getPreReleaseTag('1.2.4-beta')).to.equal('beta');
    });
});
