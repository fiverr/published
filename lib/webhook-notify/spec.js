const https = require('https');
const { expect } = require('chai');
const assert = require('assert');
const { ENV_SLACK_WEBHOOK } = require('../constants');
const webhookNotifier = require('./');
const mockReq = {
    on: () => {},
    write: () => {},
    end: () => {},
};

describe('webhook-notify', () => {
    const values = JSON.parse(JSON.stringify(ENV_SLACK_WEBHOOK));
    const originalValues = values.reduce((values, key) => Object.assign({[key]: process.env[key]}));
    const request = https.request;

    beforeEach(() => {
        Object.keys(
            originalValues,
            (key) => {
                delete process.env[key];
            }
        );
    });

    afterEach(() => {
        Object.entries(
            originalValues,
            ([key, value]) => {
                process.env[key] = value;
            }
        );

        https.request = request;
    });

    it('does nothing when no URL is defined on the environment', (done) => {
        https.request = () => {
            assert(false, 'request was called');
            done();

            return mockReq;
        }

        webhookNotifier({});
        assert(true, 'request was not called');
        done();
    });

    it('created request when URL is defined on the environment', (done) => {
        process.env.SLACK_WEBHOOK = 'https://www.fiverr.com';

        https.request = () => {
            assert(true, 'request was called');
            done();

            return mockReq;
        }

        webhookNotifier({});
        assert(false, 'request was not called');
        done();
    });

    it('Posts the data as JSON', (done) => {
        process.env.SLACK_WEBHOOK = 'https://www.fiverr.com';

        https.request = (options) => {
            expect(options.headers).to.have.any.keys('Content-Type');
            expect(options.headers['Content-Type']).to.equal('application/json');;

            return {
                on: () => {},
                write: (data) => expect(() => JSON.parse(data)).not.to.throw(),
                end: () => done(),
            };
        }

        webhookNotifier({});
        assert(false, 'request was not called');
        done();
    });
});
