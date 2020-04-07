const { expect } = require('chai');
const getTag = require('.');

describe('getTag', () => {
    it('Should be latest when isLatest is true', () => {
        expect(getTag('master', undefined, true)).to.equal('latest');
    });
    it('Should be branch name when isLatest is flase', () => {
        expect(getTag('master', undefined, false)).to.equal('master');
    });
    it('Should give master the desired tag', () => {
        expect(getTag('master', 'latest', true)).to.equal('latest');
        expect(getTag('master', 'next', true)).to.equal('next');
        expect(getTag('master', 'something-else', true)).to.equal('something-else');
    });
    it('Should give other branches respective tag names', () => {
        expect(getTag('latest', undefined, false)).to.equal('latest');
        expect(getTag('latest', 'latest', false)).to.equal('latest');
        expect(getTag('latest', 'next', false)).to.equal('latest');
        expect(getTag('feature-branch', 'latest', false)).to.equal('feature-branch');
    });
    it('Should convert non characters to minuses', () => {
        expect(getTag('feature_branch')).to.equal('feature_branch');
        expect(getTag('feature_branch', 'latest')).to.equal('feature_branch');
        expect(getTag('feature#branch', 'latest')).to.equal('feature-branch');
        expect(getTag('feature*', 'latest')).to.equal('feature-');
    });
});
