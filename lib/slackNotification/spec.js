const {expect} = require('chai');
const dummy = {};

describe('slackNotification', async() => {
    require('../postRequest');
    require.cache[require.resolve('../postRequest')].exports = async(...args) => dummy.stub(...args);
    const slackNotification = require('.');

    it('Should call postRequest with webhook url and body', async() => {
        const body = 'This is the body'
        const webhook = 'https://somewhere.onet';
        const results = [];
        dummy.stub = (...args) => { results.push(...args) };

        await slackNotification({webhook}, body);
        expect(results).to.deep.equal([webhook, body]);
    });

    it('Should not call postRequest if no webhook is supplied', async() => {
        let called = false;
        dummy.stub = () => { called = true };

        await slackNotification({webhook: undefined}, 'Some body');
        expect(called).to.be.false;
    });
});
