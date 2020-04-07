const { expect } = require('chai');

const dummy = {};

describe('bin', () => {
    const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK;
    const argv = process.argv;

    before(() => {
        require('../app');
        require.cache[require.resolve('../app')].exports = (...args) => dummy.index(...args);
    });

    beforeEach(() => {
        process.argv = 'node mocha'.split(' ');
        delete process.env.SLACK_WEBHOOK;
    });

    afterEach(() => {
        dummy.index = () => null;
        delete require.cache[require.resolve('.')];
        delete require.cache[require.resolve('yargs')];
    });

    after(() => {
        delete require.cache[require.resolve('../app')];
        process.env.SLACK_WEBHOOK = SLACK_WEBHOOK;
        process.argv = argv;
    });

    it('Should call on publish with defaults', () => {
        let called = false;
        dummy.index = ({ slack, testing, quiet, shouldGitTag }) => {
            called = true;
            expect(testing).to.be.false;
            expect(quiet).to.be.false;
            expect(shouldGitTag).to.be.false;
            expect(slack).to.deep.equal({});
        };
        require('.');
        expect(called).to.be.true;
    });

    it('Should convert some arguments to true when it\'s the string "true"', () => {
        process.argv = 'node mocha --testing true --quiet true --git-tag true'.split(' ');
        let called = false;
        dummy.index = ({ testing, quiet, shouldGitTag }) => {
            called = true;
            expect(testing).to.be.true;
            expect(quiet).to.be.true;
            expect(shouldGitTag).to.be.true;
        };
        require('.');
        expect(called).to.be.true;
    });

    it('Should allow environment SLACK_WEBHOOK', () => {
        process.env.SLACK_WEBHOOK = 'https://www.webhook.net';
        let called = false;
        dummy.index = ({ slack }) => {
            called = true;
            expect(slack).to.deep.equal({ webhook: 'https://www.webhook.net' });
        };
        require('.');
        expect(called).to.be.true;
    });

    it('Should use "testing" string (legacy feature)', () => {
        process.argv = 'node mocha testing'.split(' ');
        let called = false;
        dummy.index = ({ testing }) => {
            called = true;
            expect(testing).to.be.true;
        };
        require('.');
        expect(called).to.be.true;
    });
});
