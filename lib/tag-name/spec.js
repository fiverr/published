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
            expect(await tagName({version: '1.0.0'})).to.equal('latest');
        });

        it('Should throw error for unclean semver', async () => {
            try {
                await tagName({version: '1.0.0-rc'});
                assert(false, 'Did not throw an error');
            } catch (error) {
                assert(true, error);
            }
        });
    });

    describe('feature branch', () => {
        beforeEach(() => {
            Object.defineProperty(gitData, 'branch', {get: () => 'feature_name'});
        });

        it('Throws error for clean semver', async () => {
            try {
                await tagName({version: '1.0.0'});
                assert(false, 'Did not throw an error');
            } catch (error) {
                assert(true, error);
            }
        });

        it('Names tag after branch', async () => {
            expect(await tagName({version: '1.0.0-rc'})).to.equal('feature_name');
        });
    });
});
