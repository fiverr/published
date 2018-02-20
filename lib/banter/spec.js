const { expect } = require('chai');
const banter = require('./');
const {
    CHATTER,
    HECKLER,
} = require('../constants');

describe('banter', () => {
    it('Should respond with an amusing message for good statuses and as default', () => {
        expect(CHATTER).to.include(banter('success'));
        expect(CHATTER).to.include(banter('Success'));
        expect(CHATTER).to.include(banter('anything'));
        expect(HECKLER).not.to.include(banter('anything'));
    });
    it('Should respond with a sarcastic gloat for bad statuses and be case insensitive', () => {
        expect(HECKLER).to.include(banter('fail'));
        expect(HECKLER).to.include(banter('error'));
        expect(HECKLER).to.include(banter('Fail'));
        expect(HECKLER).to.include(banter('ERROR'));
    });
});
