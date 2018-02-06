const { expect } = require('chai');
const versionSuffix = require('./');

describe('version-suffix', () => {
    it('Should add no suffix to latest', async () => {
        expect(await versionSuffix('latest')).to.be.empty;
    });

    it('Should suffix tags with minus sign and a short commit sha', async () => {
        expect(await versionSuffix('feature')).to.match(/-[\w|\d]{7}$/);
    });
});
