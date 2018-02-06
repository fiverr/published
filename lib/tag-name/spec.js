const { expect } = require('chai');
const gitData = require('../git-data');
const tagName = require('../tag-name');

describe('tag-name', () => {
    const branch = Object.getOwnPropertyDescriptor(gitData, 'branch');

    afterEach(() => {
        Object.defineProperty(gitData, 'branch', branch);
    });

    describe('master branch', () => {
        beforeEach(() => {
            Object.defineProperty(gitData, 'branch', {value: 'master'});
        });

        it('Names tag "latest"', () => {
            expect(tagName({version: '1.0.0'})).to.equal('latest');
        });

        it('Should throw error for unclean semver', () => {
           expect(() => tagName({version: '1.0.0-rc'})).to.throw();
        });
    });

    describe('feature branch', () => {
        beforeEach(() => {
            Object.defineProperty(gitData, 'branch', {value: 'feature_name'});
        });

        it('Throws error for clean semver', () => {
            expect(() => tagName({version: '1.0.0'})).to.throw();
        });

        it('Names tag after branch', () => {
            expect(tagName({version: '1.0.0-rc'})).to.equal('feature_name');
        });
    });
});
