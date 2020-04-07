const { expect } = require('chai');
const skipPublish = require('.');

describe('skipPublish', () => {
    it('Should throw error for "dirty" master and latest branches', () =>
        [
            ['1.2.3.rc', true],
            ['1.2.3-alpha', true],
            ['1.2.3.alpha', true]
        ].forEach((pair) => expect(() => skipPublish(...pair)).to.throw())
    );
    it('Should not throw error for "clean" feature branches', () =>
        [
            ['1.2.3', false],
            ['1.2.3', false]
        ].forEach((pair) => expect(() => skipPublish(...pair)).to.not.throw())
    );
    it('Should return true for these pairs', () =>
        [
            ['1.2.3', true],
            ['1.2.3', true],
            ['1.2.3.rc', false],
            ['1.2.3-rc.4', false],
            ['1.2.3.is-rc', false],
            ['1.2.3.IS_RELEASE_CANDIDATE', false],
            ['1.2.3-release-candidate-2', false]
        ].forEach((pair) => expect(skipPublish(...pair)).to.be.false)
    );
    it('Should return false for these pairs', () =>
        [
            ['1.2.3.alpha', false],
            ['1.2.3.beta', false]
        ].forEach((pair) => expect(skipPublish(...pair)).to.include('Version does not require publishing.'))
    );
});
