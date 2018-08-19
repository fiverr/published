const {expect} = require('chai');
const getTag = require('.');

describe('getTag', () => {
    it('Should give master the desired tag', () => {
        expect(getTag('master', 'latest')).to.equal('latest');
        expect(getTag('master', 'next')).to.equal('next');
    });
    it('Should give other branches respective tag names', () => {
        expect(getTag('latest', 'latest')).to.equal('latest');
        expect(getTag('latest', 'next')).to.equal('latest');
        expect(getTag('feature-branch', 'latest')).to.equal('feature-branch');
    });
    it('Should convert non characters to minuses', () => {
        expect(getTag('feature_branch', 'latest')).to.equal('feature_branch');
        expect(getTag('feature#branch', 'latest')).to.equal('feature-branch');
        expect(getTag('feature*', 'latest')).to.equal('feature-');
    });
});