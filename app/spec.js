const { expect } = require('chai');
const {
    dummies,
    _before,
    _beforeEach,
    _afterEach,
    _after
} = require('./spec-helpers.js');

describe('index', async() => {
    const log = console.log;
    let index;

    before(() => {
        _before();
        index = require('.');
    });
    beforeEach(_beforeEach);
    afterEach(_afterEach);
    after(_after);

    it('Should pass `testing` and `shouldGitTag` to "publish"', async() => {
        let called = 0;
        dummies.publish = ({ testing, shouldGitTag }) => {
            called++;
            expect(testing).to.be.undefined;
            expect(shouldGitTag).to.be.undefined;
            return { message: 'dummy' };
        };
        await index();

        dummies.publish = ({ testing, shouldGitTag }) => {
            called++;
            expect(testing).to.be.true;
            expect(shouldGitTag).to.be.true;
            return { message: 'dummy' };
        };
        await index({ testing: true, shouldGitTag: true });

        expect(called).to.equal(2);
    });

    it('Should skip console log when quiet', async() => {
        let called = false;
        console.error = console.log = function(...args) {
            called = true;
            log(...args);
        };
        await index({ quiet: true });
        expect(called).to.be.false;
    });

    it('Should write to console log when quiet but testing', async() => {
        let called = false;
        console.error = console.log = function(...args) {
            called = true;
            log(...args);
        };
        await index({ quiet: true, testing: true });
        expect(called).to.be.true;
    });

    it('Should write to log when everything is okay and to error when it isn\'t', async() => {
        let lastCalled;

        console.log = function(...args) {
            lastCalled = 'log';
            log(...args);
        };
        console.error = function(...args) {
            lastCalled = 'error';
            log(...args);
        };
        await index();
        expect(lastCalled).to.equal('log');

        dummies.publish = async() => { throw new Error(); };
        try {
            await index();
        } catch (error) {
            // ignore
        }
        expect(lastCalled).to.equal('error');
    });

    it('Should trigger slackNotification and package reset any way', async() => {
        let resetCalled = 0;
        let slackCalled = 0;

        dummies.reset = () => { resetCalled++; };
        dummies.slack = () => { slackCalled++; };

        await index();
        dummies.publish = async() => { throw new Error(); };
        try {
            await index();
        } catch (error) {
            // ignore
        }
        expect(resetCalled).to.equal(2);
        expect(slackCalled).to.equal(0);
    });

    it('Should pipe the result of publish function', async() => {
        dummies.publish = async() => ({ something: { any: 'thing' } });
        const result = await index();
        expect(result).to.deep.equal({ something: { any: 'thing' } });
    });
});
