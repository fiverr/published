const {expect} = require('chai');
const {
    NPM_FUNCTIONS,
    GIT_DETAILS,
    PKG_DETAILS,
    _before,
    _beforeEach,
    _afterEach,
    _after,
} = require('./spec-helpers');
const OPTIONS = {testing: false, shouldGitTag: false};

describe('publish', async() => {
    before(_before);
    beforeEach(_beforeEach);
    afterEach(_afterEach);
    after(_after);

    [
        ['master', '1.0.0'],
        ['latest', '1.0.0'],
    ].forEach(([branch, version]) => {
        it(`Should publish a clean version (${version}) on ${branch}`, async() => {
            GIT_DETAILS.branch = branch;
            PKG_DETAILS.version = version;

            let published = false;
            NPM_FUNCTIONS.publish = () => { published = true; };

            const publish = require('.');
            const result = await publish(OPTIONS);

            expect(published).to.be.true;
            expect(result.message.toLowerCase()).to.contain('published');
            expect(result.details).to.be.an('object');
        });
    });

    [
        ['feature-branch', '1.0.0'],
        ['next', '1.0.0'],
    ].forEach(([branch, version]) => {
        it(`Should do nothing with clean version (${version}) on feature branch (${branch})`, async() => {
            GIT_DETAILS.branch = branch;
            PKG_DETAILS.version = version;
            let published = false;
            NPM_FUNCTIONS.publish = () => { published = true; };

            const publish = require('.');
            const result = await publish(OPTIONS);

            expect(published).to.be.false;
            expect(result.message.toLowerCase()).to.contain('does not require publishing');
        });
    });

    it('Should skip publishing or tagging for feature branch with a clean version', async() => {
        GIT_DETAILS.branch = 'master';
        PKG_DETAILS.version = '1.0.0';
        NPM_FUNCTIONS.exists = () => true;
        NPM_FUNCTIONS.getVersion = () => '1.0.0';

        const publish = require('.');
        const result = await publish(OPTIONS);

        expect(result.message.toLowerCase()).to.contain('already published');
    });

    it('Should change tag if version exists on but tag does not point to it', async() => {
        GIT_DETAILS.branch = 'master';
        PKG_DETAILS.version = '1.0.0';
        NPM_FUNCTIONS.exists = () => true;
        NPM_FUNCTIONS.getVersion = () => '0.8.0';
        let published = false;
        NPM_FUNCTIONS.publish = () => { published = true; };
        let retagged = false;
        NPM_FUNCTIONS.setTag = () => { retagged = true; };

        const publish = require('.');
        const result = await publish(OPTIONS);

        expect(published).to.be.false;
        expect(retagged).to.be.true;
        expect(result.message.toLowerCase()).to.contain('set tag');
    });

    it('Should change tag if publishConfig tag does not point to it', async() => {
        GIT_DETAILS.branch = 'master';
        PKG_DETAILS.version = '1.0.0';
        PKG_DETAILS.publishConfig = {tag: 'next'};
        NPM_FUNCTIONS.exists = () => true;
        NPM_FUNCTIONS.getVersion = (_, tag) => tag === 'latest' ? '1.0.0' : '0.9.0';
        let published = false;
        NPM_FUNCTIONS.publish = () => { published = true; };
        let retagged = false;
        NPM_FUNCTIONS.setTag = () => { retagged = true; };

        const publish = require('.');
        const result = await publish(OPTIONS);

        expect(published).to.be.false;
        expect(retagged).to.be.true;
        expect(result.message.toLowerCase()).to.contain('set tag');
    });

    it('Should disallow publishing of release candidate versions in master branch', async() => {
        GIT_DETAILS.branch = 'master';
        PKG_DETAILS.version = '1.0.0-rc';

        const publish = require('.');
        let threw = false;
        try {
            await publish(OPTIONS);
        } catch (error) {
            threw = true;
            expect(error.message.toLowerCase()).to.contain('not allowed');
        }
        expect(threw).to.be.true;
    });

    it('Should disallow publishing of alpha versions in master branch', async() => {
        GIT_DETAILS.branch = 'master';
        PKG_DETAILS.version = '1.0.0-alpha';

        const publish = require('.');
        let threw = false;
        try {
            await publish(OPTIONS);
        } catch (error) {
            threw = true;
            expect(error.message.toLowerCase()).to.contain('not allowed');
        }
        expect(threw).to.be.true;
    });
});
