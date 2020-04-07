const { expect } = require('chai');
const isLatestBranch = require('.');

describe('isLatestBranch', () => {
    it('Should publish "latest" version', () =>
        [
            ['master'],
            ['master', 'master'],
            ['latest'],
            ['latest', 'master'],
            ['stable', 'stable']
        ].forEach((args) => expect(isLatestBranch(...args)).to.be.true)
    );

    it('Shouldn\'t publish "latest" version', () =>
        [
            ['master', 'stable'],
            ['stable']
        ].forEach((args) => expect(isLatestBranch(...args)).to.be.false)
    );
});
