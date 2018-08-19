const {expect} = require('chai');
const skipPublish = require('.');

describe('skipPublish', () => {
    it('Should throw error for "dirty" master and latest branches', () =>
        [
            ['1.2.3.rc', 'master'],
            ['1.2.3-alpha', 'master'],
            ['1.2.3.alpha', 'latest'],
        ].forEach(pair => expect(() => skipPublish(...pair)).to.throw())
    );
    it('Should not throw error for "clean" feature branches', () =>
        [
            ['1.2.3', 'feature'],
            ['1.2.3', 'feature'],
        ].forEach(pair => expect(() => skipPublish(...pair)).to.not.throw())
    );
    it('Should return true for these pairs', () =>
        [
            ['1.2.3', 'master'],
            ['1.2.3', 'latest'],
            ['1.2.3.rc', 'feature'],
            ['1.2.3-rc.4', 'feature'],
            ['1.2.3.is-rc', 'feature'],
            ['1.2.3.IS_RELEASE_CANDIDATE', 'feature'],
            ['1.2.3-release-candidate-2', 'feature'],
        ].forEach(pair => expect(skipPublish(...pair)).to.be.false)
    );
    it('Should return false for these pairs', () =>
        [
            ['1.2.3.alpha', 'feature'],
            ['1.2.3.beta', 'feature'],
        ].forEach(pair => expect(skipPublish(...pair)).to.include('Version does not require publishing.'))
    );
});
