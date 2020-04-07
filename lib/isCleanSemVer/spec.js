const { expect } = require('chai');
const isCleanSemVer = require('.');

describe('isCleanSemVer', () => {
    it('clean semver checks out', () => {
        [
            '1.0.0',
            '100.958.546'
        ].forEach((version) => expect(isCleanSemVer(version)).to.be.true);
    });

    it('clean semver has three parts', () => {
        [
            '111',
            '1',
            '1.2',
            '111.222',
            '1.2.3.4',
            '111.222.333.444'
        ].forEach((version) => expect(isCleanSemVer(version)).to.be.false);
    });

    it('no pre release tags or weird characters', () => {
        [
            '1.2.4-rc',
            '1.2.4-beta',
            '1.2.4-rc.12',
            '1.2.4-1',
            '1.2.4-0',
            '1.2.4rc'
        ].forEach((version) => expect(isCleanSemVer(version)).to.be.false);
    });
});
