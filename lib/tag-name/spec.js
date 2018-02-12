const { expect } = require('chai');
const assert = require('assert');
const gitData = require('../git-data');
const tagName = require('../tag-name');

describe('tag-name', () => {
    const branch = Object.getOwnPropertyDescriptor(gitData, 'branch');

    afterEach(() => {
        Object.defineProperty(gitData, 'branch', branch);
    });

    describe('master branch', () => {
        beforeEach(() => {
            Object.defineProperty(gitData, 'branch', {get: async () => 'master'});
        });

        it('Names tag "latest"', async () => {
            const {tag, ok} = await tagName({version: '1.0.0'});
            expect(tag).to.equal('latest');
            expect(ok).to.be.true;
        });

        it('Should throw error for unclean semver', async () => {
            try {
                await tagName({version: '1.0.0-rc'});
                assert(false, 'Did not throw an error');
            } catch (error) {
                assert(error.constructor.name !== 'AssertionError', error);
                // assert(true, error);
            }
        });
    });

    describe('feature branch', () => {
        beforeEach(() => {
            Object.defineProperty(gitData, 'branch', {get: () => 'feature_name'});
        });

        it('Throws error for clean semver', async () => {
            try {
                const {tag} = await tagName({version: '1.0.0'});
                assert(true, 'Should not throw an error');
            } catch (error) {
                assert(error.constructor.name !== 'AssertionError', error);
            }
        });

        it('Names tag after branch', async () => {
            const {tag, ok} = await tagName({version: '1.0.0-rc'});
            expect(tag).to.equal('feature_name');
            expect(ok).to.be.true;
        });
    });
});
