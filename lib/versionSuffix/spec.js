const {expect} = require('chai');
const versionSuffix = require('.');

describe('versionSuffix', () => {
    it('no pre release tag', () => {
        [
            '1.0.0',
            '100.958.546',
        ].forEach(version => expect(versionSuffix(version)).to.equal(''));
    });

    it('everything after the clean semver is considered tag', () => {
        expect(versionSuffix('1.2.3.4')).to.equal('4');
        expect(versionSuffix('1.2.3....4')).to.equal('...4');
        expect(versionSuffix('1.2.3-.4')).to.equal('.4');
        expect(versionSuffix('1.2.3.-4')).to.equal('-4');
    });

    it('gets clean pre release tags', () => {
        expect(versionSuffix('1.2.4-rc')).to.equal('rc');
        expect(versionSuffix('1.2.4-rc.4')).to.equal('rc.4');
        expect(versionSuffix('1.2.4-beta')).to.equal('beta');
    });
});
